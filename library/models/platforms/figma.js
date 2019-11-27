const Platform = require('../platform');
const { cleanObject, safeAccess } = require('../../utilities/objects');

class Figma extends Platform {
  constructor() {
    super({
      id: 'figma',
      name: 'Figma'
    });
  }

  generateIcons() {
    this.info('Does not support plugin icons.')
  }

  linkPlugin() {
    this.warn('Symlinking not supported. Please manually load this plugin\'s manifest directly into Figma.');
  }

  get updatedManifestStructure() {
    if (!this.plugin || !this.plugin.manifest) {
      this.fatal('Cannot call updatedManifestStructure before calling setPlugin to load build manifest.');
    }

    const manifest = this.plugin.manifest;
    const overrides = safeAccess(manifest, 'manifests', 'figma') || {};
    const commands = (manifest.commands || []).map(command => ({
      name: command.name,
      command: command.handler
    }));

    return cleanObject(Object.assign({
      name: safeAccess(manifest, 'name'),
      id: safeAccess(manifest, 'id'),
      menu: commands
    }, overrides));
  }
}

module.exports = Figma;
