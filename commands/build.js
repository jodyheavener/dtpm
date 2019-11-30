const Plugin = require('../library/models/plugin');
const { platforms: availablePlatforms } = require('../library/constants');
const { intro, info, success } = require('../library/utilities/messages');

const command = async (command) => {
  intro(command);

  const { watch } = command;
  const plugin = new Plugin(process.cwd(), true);
  const platforms = availablePlatforms.filter((platform) => {
    const keys = plugin.manifest.platforms || [];
    return keys.includes(platform.id);
  });

  info(`Building design plugins for ${platforms.map(p => p.name).join(', ')}.`);

  const platformBuilds = platforms.map((platform) => {
    platform.setPlugin(plugin);
    platform.setCommand(command);

    return platform.build();
  });

  await Promise.all(platformBuilds);

  if (watch) {
    plugin.initWatch(platforms);
    success('Build succeeded. Watching for changes...');
  } else {
    success('Build succeeded!');
  }
}

module.exports = command;
