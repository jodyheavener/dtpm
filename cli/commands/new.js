const path = require('path');
const fs = require('fs-extra');
const Plugin = require('../models/plugin');
const { parameterize } = require('../utilities/strings');
const { intro, success, fatal } = require('../utilities/messages');

async function newCommand(name, command) {
  intro(command);

  const { dir, platforms, force } = command;
  const directoryName = dir ? dir : parameterize(name);
  const plugin = new Plugin(path.join(process.cwd(), directoryName));

  if (fs.existsSync(plugin.sourcePath)) {
    if (force) {
      fs.removeSync(plugin.sourcePath);
    } else {
      fatal(`Directory '${directoryName}' already exists. Re-run with --force to overwrite.`);
    }
  }

  fs.mkdirSync(plugin.sourcePath);
  fs.copySync(plugin.templatePath, plugin.sourcePath);

  plugin.loadManifest();
  plugin.manifest = Object.assign(plugin.manifest, {
    name: name,
    id: parameterize(name),
    platforms: platforms
  });

  success(`DTPM template for plugin "${name}" has been created.`);
}

module.exports = newCommand;
