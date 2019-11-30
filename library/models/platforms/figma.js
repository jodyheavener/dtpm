const path = require('path');
const Platform = require('../platform');
const { cleanObject, safeAccess } = require('../../utilities/objects');

class Figma extends Platform {
  get id() {
    return 'figma';
  }

  get name() {
    return 'Figma';
  }

  get jsEntryPath() {
    return path.join(this.buildPath, 'index.js');
  }

  generateIcons() {
    this.info('Does not support plugin icons. Skipping...');
  }

  get mergedManifestStructure() {
    if (!this.plugin) {
      this.fatal('Cannot call `mergedManifestStructure` before assigning Plugin instance.');
    }

    const manifest = this.plugin.loadManifest();
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

  linkPlugin() {
    this.warn('Symlinking not supported. Manually load this plugin\'s manifest directly into Figma.');
  }
}

module.exports = Figma;
