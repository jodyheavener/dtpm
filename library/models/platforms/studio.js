const path = require('path');
const homeDir = require('os').homedir();
const Platform = require('../platform');
const { cleanObject, safeAccess } = require('../../utilities/objects');

class Studio extends Platform {
  constructor() {
    super({
      id: 'studio',
      name: 'Studio',
      iconSizes: [256]
    });
  }

  get pluginsPath() {
    return path.join(homeDir, '.invision-studio', 'plugins');
  }

  get updatedManifestStructure() {
    if (!this.plugin || !this.plugin.manifest) {
      this.fatal('Cannot call updatedManifestStructure before calling setPlugin to load build manifest.');
    }

    const manifest = this.plugin.manifest;
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
