import * as commands from 'command-loader';

Object.keys(commands).forEach((handler) => {
  if (figma.command === handler) {
    commands[handler].call(this);
  }
});
