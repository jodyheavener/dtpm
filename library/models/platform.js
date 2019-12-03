const path = require('path');
const fs = require('fs-extra');
const Jimp = require('jimp');
const rollup = require('rollup');
const alias = require('@rollup/plugin-alias');
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

  get jsEntryFile() {
    this.fatal('Platform subclass must implement `jsEntryFile`.');
  }

  get jsEntryPath() {
    this.fatal('Platform subclass must implement `jsEntryPath`.');
  }

  get templatePath() {
    return path.join(__dirname, '../../', 'templates', this.id);
  }

  get bridgeFilePath() {
    return path.join(__dirname, '../../', 'bridge-js', this.id, 'index.js');
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

    this.manifestData = JSON.parse(fs.readFileSync(
      this.manifestPath,
      { encoding: 'utf8' }
    ));
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

      // Symlinking - this may be overwritten in the subclass
      // Some platforms do not support symlinking, so it should
      // instead implement copyPlugin to be called on file change
      this.linkPlugin();
    }

    // Manifest generation
    this.loadManifest();
    this.generateMergedManifest();

    // JS entry generation
    this.generateJsEntryFile();

    // Icon generation
    this.generateIcons();

    // Copy plugin files
    this.copyPlugin();
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

    if (!this.plugin.iconPath || !this.iconSizes) { return }

    this.info(`Generating icons.`);

    await Promise.all(this.iconSizes.map((size) => {
      const outputPath = `${this.assetsPath}/icon-${size}.png`;
      return Jimp.read(this.plugin.iconPath)
        .then(icon => icon.resize(size, size).write(outputPath));
    }));
  }

  async generateJsEntryFile() {
    if (!this.plugin) {
      this.fatal('Cannot call `generateJsEntryFile` before assigning Plugin instance.');
    }

    if (!fs.existsSync(path.join(this.jsEntryPath, this.jsEntryFile))) {
      this.fatal(`Can't find plugin JS entry file.`);
    }

    this.info(`Generating JS entry file.`);

    // JS COMPILATION
    const bundle = await rollup.rollup({
      input: this.bridgeFilePath,
      context: 'this',
      plugins: [
        alias({
          entries: {
            'command-loader': this.plugin.jsEntryPath
          }
        })
      ],
      onwarn(warning, warn) {
        // ignore empty chunk warning
        if (warning.code === 'EMPTY_BUNDLE') return;

        // Use default for everything else
        warn(warning);
      }
    });

    const { output } = await bundle.generate({
      format: 'cjs'
    });

    const outputPath = path.join(this.jsEntryPath, this.jsEntryFile);
    fs.writeFileSync(outputPath, output[0].code);
  }

  linkPlugin() {
    this.info(`Symlinking plugin directory.`);

    const symlinkPath = path.join(
      this.pluginsPath,
      this.buildDirectory
    )

    if (fs.existsSync(symlinkPath)) {
      return this.info('Plugin directory already exists. Skipping symlink.');
    }

    // Create the symlink within the encompassing directory
    fs.symlinkSync(this.buildPath, symlinkPath);
  }

  copyPlugin() {
    // This method should be implemented on each platform
    // that does not support symlinking. It will be called
    // on initial build and on file changes when --watch is
    // passed into the command
  }

  syncManifest() {
    // Called on watch changes
    this.loadManifest();
    this.generateMergedManifest();
    this.copyPlugin();
  }

  syncIcons() {
    // Called on watch changes
    this.generateJsEntryFile();
    this.copyPlugin();
  }

  syncJsEntryFile() {
    // Called on watch changes
    this.generateJsEntryFile();
    this.copyPlugin();
  }
}

module.exports = Platform;
