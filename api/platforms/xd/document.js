import { /* selection, */ } from 'dtpm-core/document';
import { Rectangle } from './lib/nodes';
import { Fill } from './lib/styles';

function selection() {
  const { selection } = require('scenegraph');
  return selection;
};

export {
  selection,
  Rectangle,
  Fill,
};
