import storageHelper from './lib/storage';
import { done, /* storage, */ } from 'dtpm-core/plugin';

const storage = {
  get(key) {
    return storageHelper.get(key);
  },

  set(key, value) {
    return storageHelper.set(key, value);
  }
};

export {
  done,
  storage,
};
