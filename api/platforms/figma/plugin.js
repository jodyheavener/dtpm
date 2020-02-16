import {
  // done,
  // storage,
} from 'dtpm-core/plugin';

function done() {
  figma.closePlugin();
};

const storage = {
  get(key) {
    return figma.clientStorage.getAsync(key);
  },

  set(key, value) {
    return figma.clientStorage.setAsync(key, value);
  }
};

export {
  done,
  storage,
};
