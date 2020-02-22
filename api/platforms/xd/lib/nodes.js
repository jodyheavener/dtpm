import { Rectangle as XdRectangle, Color } from 'scenegraph';
import { Rectangle as CoreRectangle } from 'dtpm-core/document';

class Rectangle extends CoreRectangle {
  constructor(args = {}) {
    super(args);
  }

  native() {
    if (!this.nativeObject) {
      let object = new XdRectangle();
      object.name = this.name;
      object.width = this.width;
      object.height = this.height;
      object.fill = new Color('#2345ac');
      object.fillEnabled = true;

      this.nativeObject = object;
    };

    return this.nativeObject;
  }
}

export {
  Rectangle,
};
