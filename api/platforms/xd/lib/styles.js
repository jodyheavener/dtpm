import { Color } from 'scenegraph';
import { Fill as CoreFill } from 'dtpm-core/document';

class Fill extends CoreFill {
  constructor(args = {}) {
    super(args);
  }

  native() {
    switch(this.type) {
      case 'solid':
        return new Color({
          r: this.color.red(),
          g: this.color.green(),
          b: this.color.blue(),
          a: this.color.alpha()
        });

        break;
    }
  }
}

export {
  Fill,
};
