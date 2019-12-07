const fs = require('fs-extra');
const watch = require('node-watch');
const { join } = require('path');
const { fatal, warn } = require('../utilities/messages');

class Plugin {
  constructor(sourcePath, autoloadManifest = false) {
    this.sourcePath = sourcePath;

    if (autoloadManifest) {
      this.loadManifest();
    }
  }

  get templatePath() {
    return join(__dirname, '../', 'templates', 'source-plugin');
  }

  get iconFilePath() {
    if (!this.manifest || !this.sourcePath) {
      fatal('Can\'t determine plugin path without `manifest` and `sourcePath`.');
    }

    if (!this.manifest.icon) { return; }

    return join(this.sourcePath, this.manifest.icon);
  }

  get entryFilePath() {
    return join(this.sourcePath, 'index.js');
  }

  get manifestFilePath() {
    return join(this.sourcePath, 'manifest.json');
  }

  get manifest() {
    return this.manifestData;
  }

  set manifest(value) {
    this.manifestData = value;

    fs.writeJsonSync(this.manifestFilePath, this.manifestData, {
      spaces: 2
    });
  }

  loadManifest() {
    if (!fs.existsSync(this.manifestFilePath)) {
      fatal(`Can't find plugins manifest file.`);
    }

    this.manifestData = JSON.parse(fs.readFileSync(this.manifestFilePath, {
      encoding: 'utf8'
    }));

    if (!this.manifestData.name) {
      warn('Source plugin manifest missing property `name`. Errors may occur.');
    }

    if (!this.manifestData.id) {
      warn('Source plugin manifest missing property `id`. Errors may occur.');
    }

    if (!this.manifestData.icon) {
      warn('Source plugin manifest missing property `icon`. Errors may occur.');
    }

    return this.manifestData;
  }

  initWatch(platforms) {
    watch(this.iconFilePath, () => {
      platforms.forEach(platform => platform.syncIcons());
    });

    watch(this.entryFilePath, () => {
      platforms.forEach(platform => platform.syncEntryFile());
    });

    // Disabling this for now. It's causing issues.
    //
    // watch(this.manifestFilePath, () => {
    //   platforms.forEach(platform => platform.syncManifest());
    // });
  }
}

module.exports = Plugin;
