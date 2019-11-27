const path = require('path');
const fs = require('fs-extra');
const Jimp = require('jimp');
const { fatal, info, success, warn } = require('../utilities/messages');

class Platform {
  constructor(options) {
    this.id = options.id;
    this.name = options.name;
    this.iconSizes = options.iconSizes;
  }

  success(message) {
    return success(`[${this.name}] ${message}`);
  }

  fatal(message) {
    return fatal(`[${this.name}] ${message}`);
  }

  warn(message) {
    return warn(`[${this.name}] ${message}`);
  }

  info(message) {
    return info(`[${this.name}] ${message}`);
  }

  setPlugin(pluginInstance) {
    this.plugin = pluginInstance;
  }

  setCommand(commandInstance) {
    this.command = commandInstance;
  }

  get pluginsPath() {
    this.fatal('Platform subclass must implement pluginsPath.');
  }

  get templatePath() {
    return path.join(__dirname, '../../', 'templates', this.id);
  }

  get buildPath() {
    if (!this.plugin) {
      this.fatal('Cannot call buildPath before calling setPlugin.');
    }

    return path.join(this.plugin.outputPath, 'build', this.id);
  }

  get buildManifestPath() {
    return `${this.buildPath}/manifest.json`;
  }

  get buildManifestPath() {
    return path.join(this.buildPath, 'manifest.json');
  }

  get buildAssetsPath() {
    return path.join(this.buildPath, 'assets')
  }

  loadBuildManifest() {
    if (!this.plugin) {
      this.fatal('Cannot call loadBuildManifest before calling setPlugin.');
    }

    if (!fs.existsSync(this.buildManifestPath)) {
      this.fatal(`Can't find plugin manifest file.`);
    }

    this.buildManifestData = require(this.buildManifestPath);
  }

  get buildManifest() {
    return this.buildManifestData;
  }

  set buildManifest(value) {
    this.buildManifestData = value;

    fs.writeJsonSync(this.buildManifestPath, this.buildManifestData, {
      spaces: 2
    });
  }

  build() {
    this.copyTemplate();
    this.generateIcons();
    this.linkPlugin();
  }

  copyTemplate(overwrite) {
    fs.copySync(this.templatePath, this.buildPath);
    this.loadBuildManifest();
    this.generateMergedManifest();
  }

  get updatedManifestStructure() {
    this.fatal('Platform subclass must implement manifestStructure.');
  }

  generateMergedManifest() {
    this.info(`Updating build manifest.`);

    this.buildManifest = Object.assign(
      this.buildManifest,
      this.updatedManifestStructure
    );
  }

  async generateIcons() {
    if (!this.buildManifest) {
      this.fatal('Called generateIcons before build manifest was loaded.');
    }

    if (!this.plugin.manifest.icon || !this.iconSizes) { return }

    this.info(`Generating icons.`);

    const sourceIconPath = path.join(this.plugin.outputPath, this.plugin.manifest.icon);

    await Promise.all(this.iconSizes.map((size) => {
      const outputPath = `${this.buildAssetsPath}/icon-${size}.png`;
      return Jimp.read(sourceIconPath)
        .then(icon => icon.resize(size, size).write(outputPath));
    }));
  }

  get symlinkName() {
    if (!this.plugin || !this.plugin.manifest.name) {
      this.fatal('Called symlinkName before plugin instance was loaded, or plugin manifest does not have a name!');
    }

    return this.plugin.manifest.name;
  }

  linkPlugin() {
    this.info(`Symlinking plugin directory.`);

    const symlinkPath = path.join(
      this.pluginsPath,
      this.symlinkName
    )

    if (fs.existsSync(symlinkPath)) {
      return this.warn('Plugin directory already exists; skipping symlink. Delete the plugin first to recreate the symlink.');
    }

    fs.symlinkSync(this.buildPath, symlinkPath);

    //  THIS DOES NOT WORK PROPERLY
    //
    //  this.info(`Symlinking plugin directory.`);
    //
    //  // Create the encompassing directory if it doesn't already exist
    //  if (!fs.existsSync(path.join(this.pluginsPath, this.plugin.manifest.name))) {
    //    fs.ensureDirSync(path.join(this.pluginsPath, this.plugin.manifest.name))
    //  }
    //
    //  const symlinkPath = path.join(
    //    this.pluginsPath,
    //    this.plugin.manifest.name,
    //    this.symlinkName
    //  )
    //
    //  if (fs.existsSync(symlinkPath)) {
    //    return this.warn('Plugin directory already exists; skipping symlink. Delete the plugin first to recreate the symlink.');
    //  }
    //
    //  // Create the symlink within the encompassing directory
    //  fs.symlinkSync(this.buildPath, symlinkPath);
  }
}

module.exports = Platform;
