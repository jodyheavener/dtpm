import { Rectangle as XdRectangle } from 'scenegraph';
import { Rectangle as CoreRectangle } from 'dtpm-core/document';

class Rectangle extends CoreRectangle {
  constructor(args = {}) {
    super(args);

    this.supportsMultipleFills = false;
  }

  nativeObject() {
    let object = new XdRectangle();
    object.name = this.name;
    object.width = this.width;
    object.height = this.height;

    return object;
  }
}

export {
  Rectangle,
};
