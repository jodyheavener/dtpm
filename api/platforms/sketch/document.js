import { /* insert, */ } from 'dtpm-core/document';
import { Rectangle } from './lib/nodes';
import { getSelectedDocument } from 'sketch/dom';

function insert(object) {
  if (!object.inserted) {
    getSelectedDocument().selectedPage.layers.push(object.native())
    object.inserted = true;
  }
}

export {
  insert,
  Rectangle,
};
