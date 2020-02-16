/* eslint-disable no-console */

const chalk = require('chalk');

function intro(command) {
  console.log(chalk.bold.black.bgWhite(` === DTPM v${command.parent._version} === \r\r`));

  if (command.force) {
    warn(`Using --force option. Hope you know what you're doing!\r\r`);
  }
}

function fatal(message, exit = true) {
  console.log(chalk.red(message));

  if (exit) {
    process.exit();
  }
}

function warn(message) {
  console.log(chalk.yellow(message));
}

function info(message) {
  console.log(chalk.white(message));
}

function success(message) {
  console.log(chalk.green(message));
}

module.exports = {
  intro,
  fatal,
  warn,
  info,
  success
}
