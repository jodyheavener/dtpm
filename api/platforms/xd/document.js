import { /* selection, */ } from 'dtpm-core/document';
import { Rectangle } from './lib/nodes';

function selection() {
  const { selection } = require('scenegraph');
  return selection;
};

export {
  selection,
  Rectangle,
};
