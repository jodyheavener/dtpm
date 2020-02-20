import { /* selection, */ } from 'dtpm-core/document';
import { Rectangle } from './lib/nodes';
import { Fill } from './lib/styles';

function selection() {
  return figma.currentPage.selection;
};

export {
  selection,
  Rectangle,
  Fill,
};
