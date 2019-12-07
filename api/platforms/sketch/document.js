import document from 'dtpm-core/document';
import {
  // selection
} from 'dtpm-core/document';

function selection() {
  return document.selectedLayers;
}

export default document;
export { selection };
