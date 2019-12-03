const process = require('process');

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
  console.warn('Unsupported platform detected.')
}

module.exports = {
  platform
}
