const path = require('path');
const fs = require('fs-extra');
const Jimp = require('jimp');
const { fatal, info, success, warn } = require('../utilities/messages');

class Platform {
  success(message) { return success(`[${this.name}] ${message}`); }
  fatal(message) { return fatal(`[${this.name}] ${message}`); }
  warn(message) { return warn(`[${this.name}] ${message}`); }
  info(message) { return info(`[${this.name}] ${message}`); }

  setPlugin(pluginInstance) {
    this.plugin = pluginInstance;
  }

  setCommand(commandInstance) {
    this.command = commandInstance;
  }

  get id() {
    this.fatal('Platform subclass must implement `id`.');
  }

  get name() {
    this.fatal('Platform subclass must implement `name`.');
  }

  get iconSizes() {
    this.fatal('Platform subclass must implement `iconSizes`.');
  }

  get pluginsPath() {
    this.fatal('Platform subclass must implement `pluginsPath`.');
  }

  get templatePath() {
    return path.join(__dirname, '../../', 'templates', this.id);
  }

  get buildDirectory() {
    if (!this.plugin) {
      this.fatal('Cannot call `buildDirectory` before assigning Plugin instance.');
    }

    return this.plugin.manifest.name;
  }

  get buildPath() {
    if (!this.plugin) {
      this.fatal('Cannot call `buildPath` before assigning Plugin instance.');
    }

    return path.join(this.plugin.outputPath, 'build', this.id, this.buildDirectory);
  }

  get manifestPath() {
    return path.join(this.buildPath, 'manifest.json');
  }

  get assetsPath() {
    return path.join(this.buildPath, 'assets');
  }

  loadManifest() {
    if (!this.plugin) {
      this.fatal('Cannot call `loadManifest` before assigning Plugin instance.');
    }

    if (!fs.existsSync(this.manifestPath)) {
      this.fatal(`Can't find plugin manifest file.`);
    }

    this.manifestData = require(this.manifestPath);
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

  build() {
    // If brand new setup, copy template files over
    if (!fs.existsSync(this.buildPath)) {
      this.copyTemplate();
    }

    // Manifest generation
    this.loadManifest();
    this.generateMergedManifest();

    // Icon generation
    this.generateIcons();

    // Symlinking - this may be overwritten in the subclass
    this.linkPlugin();

    // TODO - standard plugin file generation and watch
  }

  copyTemplate() {
    if (fs.existsSync(this.buildPath)) {
      this.warn('Attempted to copy plugin templates files to directory that already exists.');
      return;
    }

    this.info('Creating new build with template files.')
    fs.ensureDirSync(this.buildPath);
    fs.copySync(this.templatePath, this.buildPath);
  }

  get mergedManifestStructure() {
    this.fatal('Platform subclass must implement `mergedManifestStructure`.');
  }

  generateMergedManifest() {
    this.info(`Updating build manifest.`);

    this.manifest = Object.assign(
      this.manifest,
      this.mergedManifestStructure
    );
  }

  async generateIcons() {
    if (!this.manifest) {
      this.fatal('Called `generateIcons` before build manifest was loaded.');
    }

    if (!this.plugin.manifest.icon || !this.iconSizes) { return }

    this.info(`Generating icons.`);

    const sourceIconPath = path.join(this.plugin.outputPath, this.plugin.manifest.icon);

    await Promise.all(this.iconSizes.map((size) => {
      const outputPath = `${this.assetsPath}/icon-${size}.png`;
      return Jimp.read(sourceIconPath)
        .then(icon => icon.resize(size, size).write(outputPath));
    }));
  }

  linkPlugin() {
     this.info(`Symlinking plugin directory.`);

     const symlinkPath = path.join(
       this.pluginsPath,
       this.buildDirectory
     )

     if (fs.existsSync(symlinkPath)) {
       return this.warn('Plugin directory already exists. Skipping symlink...');
     }

     // Create the symlink within the encompassing directory
     fs.symlinkSync(this.buildPath, symlinkPath);
  }
}

module.exports = Platform;
