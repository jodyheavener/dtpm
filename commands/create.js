const fs = require('fs-extra');
const cmd = require('node-cmd');
const { intro, warn, error, success } = require('../lib/utils');
const { pluginTemplate } = require('../lib/constants');

const create = (command) => {
  const { name, dir, force } = command;
  const dirName = dir ? dir : name.toLowerCase().replace(/ /g, '-');
  const fullPath = `${process.cwd()}/${dirName}`;

  intro(command);

  if (force) {
    warn(`Using --force option. Hope you know what you're doing!`);
  }

  if (fs.existsSync(fullPath)) {
    if (force) {
      success(`First, removing the existing '${dirName}' directory.`);
      fs.removeSync(fullPath);
    } else {
      return error(`Directory '${dirName}' already exists. Re-run with --force to overwrite.`);
    }
  }

  success(`Creating '${dirName}' directory.`);
  fs.mkdirSync(fullPath);

  success(`Copying plugin template files.`);
  fs.copySync(pluginTemplate, fullPath);

  const manifestFile = `${fullPath}/manifest.json`;
  const updatedManifest = Object.assign(require(manifestFile), {
    name: name,
    id: name.toLowerCase().replace(/ /g, '-')
  });

  fs.writeJsonSync(manifestFile, updatedManifest, { spaces: 2 });

  process.chdir(fullPath);
  cmd.run(`git init`);

  success(`Good to go!`);
}

module.exports = create;
