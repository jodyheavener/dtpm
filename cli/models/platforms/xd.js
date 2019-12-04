const path = require('path');
const fs = require('fs-extra');
const Platform = require('../platform');
const { platform, homeDir } = require('../../utilities/system');
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

  get platformPluginsPath() {
    // TODO: This only supports develop folder. Should
    // optionally support proper plugin folder.
    return xdPaths[platform];
  }

  get entryFileName() {
    return 'main.js';
  }

  get mergedManifestStructure() {
    if (!this.plugin) {
      this.fatal('Cannot call `mergedManifestStructure` before assigning Plugin instance.');
    }

    const manifest = this.plugin.loadManifest();
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

  copyPlugin() {
    this.info(`Copying files to XD plugin directory.`);

    fs.copySync(this.buildPath, path.join(
      this.platformPluginsPath,
      this.buildDirectory
    ));
  }

  linkPlugin() {
    this.warn('Symlinking not supported. Instead, we\'ll copy the files to XD\'s plugins directory.');
    this.warn('Run build command with --watch to copy files to plugin directory when they change.');
  }
}

module.exports = Xd;
