import document from 'dtpm-core/document';
import {
  // selection
} from 'dtpm-core/document';

function selection() {
  return figma.currentPage.selection;
}

export default document;
export { selection };
