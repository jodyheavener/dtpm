import { Rectangle as CoreRectangle } from 'dtpm-core/document';

class Rectangle extends CoreRectangle {
  constructor(args = {}) {
    super(args);
  }

  native() {
    if (!this.nativeObject) {
      let object = figma.createRectangle();
      object.name = this.name;
      object.resize(this.width, this.height);
      object.fills = [{
        blendMode: 'NORMAL',
        type: 'SOLID',
        visible: true,
        opacity: 1,
        color: {
          b: 0.6745098233222961,
          g: 0.2705882489681244,
          r: 0.13725490868091583,
        },
      }];

      this.inserted = true;
      this.nativeObject = object;
    };

    return this.nativeObject;
  }
}

export {
  Rectangle,
};
