import { Rectangle as SketchRectangle, Shape } from 'sketch/dom';
import { Rectangle as CoreRectangle } from 'dtpm-core/document';
import { Fill } from './styles';

class Rectangle extends CoreRectangle {
  constructor(args = {}) {
    super(args);
  }

  native() {
    let object = new Shape({
      name: this.name,
      frame: new SketchRectangle(0, 0, this.width, this.height),
      style: {
        fills: this.fills.map((fill) => new Fill(fill).native()),
      },
    });

    return object;
  }
}

export {
  Rectangle,
};
