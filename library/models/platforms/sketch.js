const fs = require('fs-extra');
const path = require('path');
const homeDir = require('os').homedir();
const Platform = require('../platform');
const { cleanObject, safeAccess } = require('../../utilities/objects');

class Sketch extends Platform {
  get id() {
    return 'sketch';
  }

  get name() {
    return 'Sketch';
  }

  get iconSizes() {
    return [128];
  }

  get buildDirectory() {
    if (!this.plugin) {
      this.fatal('Cannot call buildDirectory before assigning Plugin instance.');
    }

    return `${this.plugin.manifest.name}.sketchplugin`;
  }

  get pluginsPath() {
    return path.join(homeDir, 'Library', 'Application Support', 'com.bohemiancoding.sketch3', 'Plugins');
  }

  get manifestPath() {
    return path.join(this.buildPath, 'Contents', 'Sketch', 'manifest.json');
  }

  get assetsPath() {
    return path.join(this.buildPath, 'Contents', 'Resources')
  }

  get mergedManifestStructure() {
    if (!this.plugin) {
      this.fatal('Cannot call `mergedManifestStructure` before assigning Plugin instance.');
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
