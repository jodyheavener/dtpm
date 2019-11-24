const fs = require('fs-extra');
const { intro, error, success } = require('../lib/utils');
const platforms = require('../lib/platforms');

const build = async (command) => {
  const manifestPath = `${process.cwd()}/manifest.json`;

  intro(command);

  if (!fs.existsSync(manifestPath)) {
    return error(`Can't find manifest file. Are you in your plugin directory?`);
  }

  success('Building design plugins.');

  const manifest = require(manifestPath);
  const platformExecutions = manifest.platforms.map((platform) => {
    return platforms[platform].call(this, command, manifest, __dirname, process.cwd());
  });

  await Promise.all(platformExecutions);
  success('All platforms built!');
}

module.exports = build;
