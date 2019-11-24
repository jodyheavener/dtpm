const chalk = require('chalk');

module.exports.intro = function(command) {
  console.log(chalk.bold.black.bgWhite(` === DTPM v${command.parent._version} === \r\r`));
}

module.exports.error = function(message) {
  console.log(chalk.red(message));
}

module.exports.warn = function(message) {
  console.log(chalk.yellow(message));
}

module.exports.success = function(message) {
  console.log(chalk.green(message));
}

module.exports.getPaths = function(platform, cmdDir, pluginDir) {
  return {
    templatePath: `${cmdDir}/../lib/templates/${platform}`,
    pluginPath: `${pluginDir}/build/${platform}`
  }
}
