import { Style } from 'sketch/dom';
import { Fill as CoreFill } from 'dtpm-core/document';

const nativeTypes = {
  'solid': Style.FillType.Color
}

class Fill extends CoreFill {
  constructor(args = {}) {
    super(args);
  }

  native() {
    return {
      color: this.color.rgbaString(),
      fillType: nativeTypes[this.type],
      enabled: this.enabled,
    };
  }
}

export {
  Fill,
};
