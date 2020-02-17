class Node {
  get nodeType() { return 'Node' };

  constructor(args = {}) {
    if (!args.name) {
      throw(new Error(`${this.nodeType} requires a name`));
    }

    this.name = args.name;
    this.width = args.width || 100;
    this.height = args.height || 100;

    this.supportsFills = false;
    this.supportsMultipleFills = true;
    this._fills = args.fills || args.fill || [];
  }

  get fills() {
    return this._fills;
  }

  set fill(fillElement) {
    this.fills = fillElement;
  }

  set fills(fillElements = []) {
    if (!this.supportsFills) {
      throw(new Error(`${this.nodeType} does not support fills`));
    }

    if (!Array.isArray(fillElements)) {
      fillElements = [fillElements];
    }

    this._fills = fillElements;
  }

  get nativeObject() {
    throw(new Error(`Platform-specific ${this.nodeType} subclass must implement nativeObject`));
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
