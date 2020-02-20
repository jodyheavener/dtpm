import { Node, Rectangle } from './lib/nodes';
import { Fill } from './lib/styles';
import { default as Color } from './lib/color';

function selection() {
  throw 'document.selection is not implemented';
};

export {
  selection,
  Node,
  Rectangle,
  Fill,
  Color,
};
