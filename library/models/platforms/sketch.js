const fs = require('fs-extra');
const path = require('path');
const homeDir = require('os').homedir();
const Platform = require('../platform');
const { cleanObject, safeAccess } = require('../../utilities/objects');

class Sketch extends Platform {
  constructor() {
    super({
      id: 'sketch',
      name: 'Sketch',
      iconSizes: [128]
    });
  }

  get pluginsPath() {
    return path.join(homeDir, 'Library', 'Application Support', 'com.bohemiancoding.sketch3', 'Plugins');
  }

  get buildManifestPath() {
    return path.join(this.buildPath, 'Contents', 'Sketch', 'manifest.json');
  }

  get buildAssetsPath() {
    return path.join(this.buildPath, 'Contents', 'Resources')
  }

  get symlinkName() {
    if (!this.plugin || !this.plugin.manifest.name) {
      this.fatal('Called symlinkName before plugin instance was loaded, or plugin manifest does not have a name!');
    }

    return `${this.plugin.manifest.name}.sketchplugin`;
  }

  get updatedManifestStructure() {
    if (!this.plugin || !this.plugin.manifest) {
      this.fatal('Cannot call updatedManifestStructure before calling setPlugin to load build manifest.');
    }

    const manifest = this.plugin.manifest;
    const overrides = safeAccess(manifest, 'manifests', 'sketch') || {};
    const commands = (manifest.commands || []).map(command => ({
      name: command.name,
      identifier: command.handler,
      shortcut: command.shortcut,
      handler: command.handler,
      script: 'index.js'
    }));

    return cleanObject(Object.assign({
      name: safeAccess(manifest, 'name'),
      version: safeAccess(manifest, 'version'),
      description: safeAccess(manifest, 'description'),
      identifier: safeAccess(manifest, 'id'),
      author: safeAccess(manifest, 'author', 'name'),
      authorEmail: safeAccess(manifest, 'author', 'email'),
      commands: commands,
      menu: {
        items: commands.map(c => c.identifier)
      }
    }, overrides));
  }
}

module.exports = Sketch;
