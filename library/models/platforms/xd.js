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
  get id() {
    return 'xd';
  }

  get name() {
    return 'Adobe XD';
  }

  get iconSizes() {
    return [24, 48, 512];
  }

  get pluginsPath() {
    // TODO: This only supports develop folder. Should
    // optionally support proper plugin folder.
    return xdPaths[platform];
  }

  get mergedManifestStructure() {
    if (!this.plugin) {
      this.fatal('Cannot call `mergedManifestStructure` before assigning Plugin instance.');
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

  linkPlugin() {
    // TODO replace this with file copy, and make note that this is happening
    this.info('Symlinking not supported.');
  }
}

module.exports = Xd;
