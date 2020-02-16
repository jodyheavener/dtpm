import { Rectangle as CoreRectangle } from 'dtpm-core/document';

class Rectangle extends CoreRectangle {
  constructor(args = {}) {
    super(args);
  }

  nativeObject() {
    let object = figma.createRectangle();
    object.name = this.name;
    object.width = this.width;
    object.height = this.height;

    return object;
  }
}

export {
  Rectangle,
};
