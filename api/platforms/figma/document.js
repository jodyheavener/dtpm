import { /* selection, */ } from 'dtpm-core/document';
import { Rectangle } from './lib/nodes';

function selection() {
  return figma.currentPage.selection;
};

export {
  selection,
  Rectangle,
};
