import * as commands from 'command-loader';

Object.keys(commands).forEach((handler) => {
  this[handler] = commands[handler];
});
