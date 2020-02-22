import { Rectangle as SketchRectangle, Shape, Style } from 'sketch/dom';
import { Rectangle as CoreRectangle } from 'dtpm-core/document';

class Rectangle extends CoreRectangle {
  constructor(args = {}) {
    super(args);
  }

  native() {
    if (!this.nativeObject) {
      let object = new Shape({
        name: this.name,
        frame: new SketchRectangle(0, 0, this.width, this.height),
        style: {
          borders: [],
          fills: [{
            color: '#2345ac',
            fillType: Style.FillType.Color,
            enabled: true,
          }],
        },
      });

      this.nativeObject = object;
    };

    return this.nativeObject;
  }
}

export {
  Rectangle,
};
