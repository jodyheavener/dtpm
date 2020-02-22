import { root } from 'scenegraph';
import { /* insert, */ } from 'dtpm-core/document';
import { Rectangle } from './lib/nodes';

function insert(object) {
  if (!object.inserted) {
    root.addChild(object.native());
    object.inserted = true;
  }
}

export {
  insert,
  Rectangle,
};
