import { /* selection, */ } from 'dtpm-core/document';
import { Rectangle } from './lib/nodes';
import { Fill } from './lib/styles';

function selection() {
  return document.selectedLayers;
};

export {
  selection,
  Rectangle,
  Fill,
};
