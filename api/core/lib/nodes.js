class Node {
  get nodeType() { return 'Node' };

  constructor(args = {}) {
    if (!args.name) {
      throw(new Error(`Node of type "${this.nodeType}" requires "name" property`));
    }

    this.name = args.name;
    this.width = args.width || 100;
    this.height = args.height || 100;

    this.inserted = false;
    this.nativeObject = undefined;
  }

  get native() {
    throw(new Error(`Platform-specific Node of type "${this.nodeType}" must implement "native"`));
  }
}

class Rectangle extends Node {
  get nodeType() { return 'Rectangle' };

  constructor(args = {}) {
    super(args);
  }
}

export {
  Node,
  Rectangle,
};
