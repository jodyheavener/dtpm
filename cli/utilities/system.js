const process = require('process');
const os = require('os');
const { warn } = require('./messages');

const homeDir = os.homedir();

let platform;
switch(process.platform) {
  case 'darwin':
    platform = 'mac';
    break;
  case 'win32':
    platform = 'win';
    break;
}

if (!platform) {
  warn('Unsupported platform detected. Errors may occur.')
}

module.exports = {
  platform,
  homeDir
}
