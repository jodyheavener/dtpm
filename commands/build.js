const Plugin = require('../library/models/plugin');
const { platforms: availablePlatforms } = require('../library/constants');
const { intro, info, success } = require('../library/utilities/messages');

const command = async (command) => {
  const { watch } = command;
  const plugin = new Plugin(process.cwd(), true);
  const platforms = availablePlatforms.filter((platform) => {
    const keys = plugin.manifest.platforms || [];
    return keys.includes(platform.id);
  });

  intro(command);
  info(`Building design plugins for ${platforms.map(p => p.name).join(', ')}`);

  const platformBuilds = platforms.map((platform) => {
    platform.setPlugin(plugin);
    platform.setCommand(command);

    return platform.build();
  });

  await Promise.all(platformBuilds);
  success('Build succeeded!');
}

module.exports = command;
