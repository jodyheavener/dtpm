const { join } = require('path');
const fs = require('fs-extra');

const platformFilesPath = join(__dirname, '../', 'models', 'platforms');

const platforms = fs.readdirSync(platformFilesPath).map((file) => {
  const platform = require(join(platformFilesPath, file));
  return new platform();
});

const platformKeys = platforms.map(p => p.id);

module.exports = {
  platformFilesPath,
  platforms,
  platformKeys
}
