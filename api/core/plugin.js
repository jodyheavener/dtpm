function done() {
  /* noop */
};

const storage = {
  get() {
    throw 'plugin.storage.get is not implemented';
  },

  set() {
    throw 'plugin.storage.set is not implemented';
  }
};

export {
  done,
  storage,
};
