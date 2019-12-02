const path = require('path');
const homeDir = require('os').homedir();
const Platform = require('../platform');
const { cleanObject, safeAccess } = require('../../utilities/objects');

class Studio extends Platform {
  get id() {
    return 'studio';
  }

  get name() {
    return 'Studio';
  }

  get iconSizes() {
    return [256];
  }

  get pluginsPath() {
    return path.join(homeDir, '.invision-studio', 'plugins');
  }

  get jsEntryFile() {
    return 'index.js';
  }

  get jsEntryPath() {
    return this.buildPath;
  }

  get mergedManifestStructure() {
    if (!this.plugin) {
      this.fatal('Cannot call `mergedManifestStructure` before assigning Plugin instance.');
    }

    const manifest = this.plugin.loadManifest();
    const overrides = safeAccess(manifest, 'manifests', 'studio') || {};

    return cleanObject(Object.assign({
      name: safeAccess(manifest, 'name'),
      version: safeAccess(manifest, 'version'),
      displayName: safeAccess(manifest, 'name'),
      description: safeAccess(manifest, 'description'),
      homepage: safeAccess(manifest, 'homepage'),
      author: safeAccess(manifest, 'author')
    }, overrides));
  }
}

module.exports = Studio;
