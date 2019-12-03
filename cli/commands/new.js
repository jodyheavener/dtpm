const path = require('path');
const fs = require('fs-extra');
const Plugin = require('../models/plugin');
const { parameterize } = require('../utilities/strings');
const { intro, success, info, fatal } = require('../utilities/messages');

async function newCommand(name, command) {
  intro(command);

  const { dir, platforms, force } = command;
  const directoryName = dir ? dir : parameterize(name);
  const plugin = new Plugin(path.join(process.cwd(), directoryName));

  if (fs.existsSync(plugin.outputPath)) {
    if (force) {
      info(`First, removing the existing '${directoryName}' directory.`);
      fs.removeSync(plugin.outputPath);
    } else {
      fatal(`Directory '${directoryName}' already exists. Re-run with --force to overwrite.`);
    }
  }

  info(`Creating '${directoryName}' directory.`);
  fs.mkdirSync(plugin.outputPath);

  info(`Copying plugin template files.`);
  fs.copySync(plugin.templatePath, plugin.outputPath);

  plugin.loadManifest();
  plugin.manifest = Object.assign(plugin.manifest, {
    name: name,
    id: parameterize(name),
    platforms: platforms
  });

  success(`DTPM template for plugin "${name}" has been created.`);
}

module.exports = newCommand;
