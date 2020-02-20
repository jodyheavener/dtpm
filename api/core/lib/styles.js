import { default as Color } from './color';

class Fill {
  constructor(args = {}) {
    this.type = args.type || Fill.TYPES.solid;
    this.enabled = args.enabled || true;

    switch(this.type) {
      case Fill.TYPES.solid:
        if (!args.color) {
          throw(new Error(`Fill of type "solid" requires "color" property`));
        }

        this.color = this.parseColor(args.color);

        break;
    }
  }

  parseColor(value) {
    return new Color(value);
  }

  parsePosition(value) {
    const parsedValue = parseFloat(value);

    if (value.includes('%')) {
      return parsedValue / 100;
    }

    return parsedValue;
  }
}

Fill.TYPES = {
  solid: 'solid',
}

export {
  Fill,
};
