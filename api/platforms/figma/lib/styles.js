import { Fill as CoreFill } from 'dtpm-core/document';

const nativeTypes = {
  'solid': 'SOLID'
}

class Fill extends CoreFill {
  constructor(args = {}) {
    super(args);
  }

  native() {
    return {
      blendMode: 'NORMAL',
      type: nativeTypes[this.type],
      visible: this.enabled,
      opacity: this.color.alpha(),
      color: {
        r: parseFloat(this.color.red() / 255),
        g: parseFloat(this.color.green() / 255),
        b: parseFloat(this.color.blue() / 255)
      },
    };
  }
}

export {
  Fill,
};
