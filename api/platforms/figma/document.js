import { /* insert, */ } from 'dtpm-core/document';
import { Rectangle } from './lib/nodes';

function insert(object) {
  object.native(); // Figma inserts the layer on creation
}

export {
  insert,
  Rectangle,
};
