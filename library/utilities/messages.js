const chalk = require('chalk');

const intro = function(command) {
  console.log(chalk.bold.black.bgWhite(` === DTPM v${command.parent._version} === \r\r`));

  if (command.force) {
    warn(`Using --force option. Hope you know what you're doing!\r\r`);
  }
}

const fatal = function(message) {
  console.log(chalk.red(message));
  process.exit();
}

const warn = function(message) {
  console.log(chalk.yellow(message));
}

const info = function(message) {
  console.log(chalk.white(message));
}

const success = function(message) {
  console.log(chalk.green(message));
}

module.exports = {
  intro,
  fatal,
  warn,
  info,
  success
}
