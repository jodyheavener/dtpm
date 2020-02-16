import Settings from 'sketch/settings';
import { done, /* storage, */ } from 'dtpm-core/plugin';

const storage = {
  get(key) {
    return new Promise(function(resolve) {
      resolve(Settings.settingForKey(key));
    });
  },

  set(key, value) {
    return new Promise(function(resolve) {
      Settings.setSettingForKey(key, value);
      resolve();
    });
  }
};

export {
  done,
  storage,
};
