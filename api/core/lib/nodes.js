class Node {
  get nodeType() { return 'Node' };

  constructor(args = {}) {
    if (!args.name) {
      throw(new Error(`Node of type "${this.nodeType}" requires "name" property`));
    }

    this.name = args.name;
    this.width = args.width || 100;
    this.height = args.height || 100;

    this.supportsFills = false;
    this.supportsMultipleFills = true;

    if (args.fills) {
      if (!this.supportsFills) {
        throw(new Error(`${this.nodeType} does not support multiple fills`));
      }

      this._fills = args.fills
    } else if (args.fill) {
      this._fills = [args.fill];
    } else {
      this._fills = [];
    }
  }

  get fill() {
    return this._fills[0];
  }

  get fills() {
    return this._fills;
  }

  set fill(fillElement) {
    this._fills = [fillElement];
  }

  set fills(fillElements = []) {
    if (!this.supportsFills) {
      throw(new Error(`${this.nodeType} does not support multiple fills`));
    }

    this._fills = fillElements;
  }

  get native() {
    throw(new Error(`Platform-specific Node of type "${this.nodeType}" must implement "native"`));
  }
}

class Rectangle extends Node {
  get nodeType() { return 'Rectangle' };

  constructor(args = {}) {
    super(args);

    this.supportsFills = true;
  }
}

export {
  Node,
  Rectangle,
};
