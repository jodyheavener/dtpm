import { /* selection, */ } from 'dtpm-core/document';
import { Rectangle } from './lib/nodes';

function selection() {
  return document.selectedLayers;
};

export {
  selection,
  Rectangle,
};
