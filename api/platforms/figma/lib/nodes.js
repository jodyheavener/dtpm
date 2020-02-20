import { Rectangle as CoreRectangle } from 'dtpm-core/document';
import { Fill } from './styles';

class Rectangle extends CoreRectangle {
  constructor(args = {}) {
    super(args);
  }

  native() {
    let object = figma.createRectangle();
    object.name = this.name;
    object.resize(this.width, this.height);
    object.fills = this.fills.map((fill) => (new Fill(fill).native()));

    return object;
  }
}

export {
  Rectangle,
};
