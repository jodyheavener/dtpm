import { Rectangle as XdRectangle } from 'scenegraph';
import { Rectangle as CoreRectangle } from 'dtpm-core/document';
import { Fill } from './styles';

class Rectangle extends CoreRectangle {
  constructor(args = {}) {
    super(args);

    this.supportsMultipleFills = false;
  }

  native() {
    let object = new XdRectangle();
    object.name = this.name;
    object.width = this.width;
    object.height = this.height;
    object.fill = new Fill(this.fill).native();
    object.fillEnabled = this.fill.enabled;

    return object;
  }
}

export {
  Rectangle,
};
