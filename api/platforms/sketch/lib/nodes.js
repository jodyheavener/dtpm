import { Rectangle as SketchRectangle } from 'sketch/dom';
import { Rectangle as CoreRectangle } from 'dtpm-core/document';

class Rectangle extends CoreRectangle {
  constructor(args = {}) {
    super(args);
  }

  nativeObject() {
    let object = new SketchRectangle();

    return object;
  }
}

export {
  Rectangle,
};
