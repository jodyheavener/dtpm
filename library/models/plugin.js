const path = require('path');
const fs = require('fs-extra');
const watch = require('node-watch');
const { fatal, warn } = require('../utilities/messages');

class Plugin {
  constructor(outputPath, autoloadManifest = false) {
    this.outputPath = outputPath;
    this.templatePath = path.join(
      __dirname,
      '../../',
      'templates',
      'plugin'
    );

    if (autoloadManifest) {
      this.loadManifest();
    }
  }

  get iconPath() {
    if (!this.manifest || !this.outputPath) {
      fatal('Can\'t determine plugin path without `manifest` and `outputPath`.');
    }

    if (!this.manifest.icon) { return; }

    return path.join(this.outputPath, this.manifest.icon);
  }

  get jsEntryPath() {
    return path.join(this.outputPath, 'index.js');
  }

  get manifestPath() {
    return path.join(this.outputPath, 'manifest.json');
  }

  loadManifest() {
    if (!fs.existsSync(this.manifestPath)) {
      fatal(`Can't find plugins manifest file.`);
    }

    this.manifestData = JSON.parse(fs.readFileSync(
      this.manifestPath,
      { encoding: 'utf8' }
    ));

    if (!this.manifestData.name) {
      warn('Plugin manifest missing property `name`. Errors may occur.');
    }

    if (!this.manifestData.id) {
      warn('Plugin manifest missing property `id`. Errors may occur.');
    }

    if (!this.manifestData.icon) {
      warn('Plugin manifest missing property `icon`. Errors may occur.');
    }

    return this.manifestData;
  }

  get manifest() {
    return this.manifestData;
  }

  set manifest(value) {
    this.manifestData = value;

    fs.writeJsonSync(this.manifestPath, this.manifestData, {
      spaces: 2
    });
  }

  initWatch(platforms) {
    watch(this.iconPath, () => {
      platforms.forEach(p => p.syncIcons());
    });

    watch(this.jsEntryPath, () => {
      platforms.forEach(p => p.syncJsEntryFile());
    });

    watch(this.manifestPath, () => {
      platforms.forEach(p => p.syncManifest());
    });
  }
}

module.exports = Plugin;
