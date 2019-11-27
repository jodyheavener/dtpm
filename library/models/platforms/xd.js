const path = require('path');
const homeDir = require('os').homedir();
const platform = require('../../utilities/platform');
const Platform = require('../platform');
const { cleanObject, safeAccess } = require('../../utilities/objects');

const xdPaths = {
  mac: path.join(homeDir, 'Library', 'Application Support', 'Adobe', 'Adobe XD', 'develop'),
  win: path.join(homeDir, 'AppData', 'Local', 'Packages', 'Adobe.CC.XD_adky2gkssdxte', 'LocalState', 'develop')
}

class Xd extends Platform {
  constructor() {
    super({
      id: 'xd',
      name: 'Adobe XD',
      iconSizes: [24, 48, 512]
    });
  }

  get pluginsPath() {
    return xdPaths[platform];
  }

  get updatedManifestStructure() {
    if (!this.plugin || !this.plugin.manifest) {
      this.fatal('Cannot call updatedManifestStructure before calling setPlugin to load build manifest.');
    }

    const manifest = this.plugin.manifest;
    const overrides = safeAccess(manifest, 'manifests', 'xd') || {};
    const commands = (manifest.commands || []).map(command => ({
      type: 'menu',
      label: command.name,
      commandId: command.handler
    }));

    return cleanObject(Object.assign({
      name: safeAccess(manifest, 'name'),
      id: safeAccess(manifest, 'id'),
      version: safeAccess(manifest, 'version'),
      uiEntryPoints: commands
    }, overrides));
  }
}

module.exports = Xd;
