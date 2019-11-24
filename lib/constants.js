const process = require('process');
const path = require('path');
const home = require('os').homedir();

let platform;
switch(process.platform) {
  case 'darwin':
    platform = 'mac';
    break;
  case 'win32':
    platform = 'win';
    break;
}

const xdPaths = {
  mac: path.join(home, 'Library', 'Application Support', 'Adobe', 'Adobe XD', 'develop'),
  win: path.join(home, 'AppData', 'Local', 'Packages', 'Adobe.CC.XD_adky2gkssdxte', 'LocalState', 'develop')
}

module.exports.pluginTemplate = path.join(__dirname, 'templates', 'plugin');
module.exports.studioPlugins = path.join(home, '.invision-studio', 'plugins');
module.exports.sketchPlugins = path.join(home, 'Library', 'Application Support', 'com.bohemiancoding.sketch3', 'Plugins');
module.exports.xdPlugins = xdPaths[platform];
