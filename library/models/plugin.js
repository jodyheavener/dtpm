const path = require('path');
const fs = require('fs-extra');
const { fatal } = require('../utilities/messages');

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

  loadManifest() {
    this.manifestPath = `${this.outputPath}/manifest.json`;

    if (!fs.existsSync(this.manifestPath)) {
      fatal(`Can't find plugins manifest file.`);
    }

    this.manifestData = require(this.manifestPath);

    // TODO: Add manifest validation, warning if any critical
    // fields are missing, such as name, ID, icon path, etc.
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
}

module.exports = Plugin;
