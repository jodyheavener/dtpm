const { join } = require('path');
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

  get id() {
    this.fatal('Platform subclass must implement `id`.');
  }

  get name() {
    this.fatal('Platform subclass must implement `name`.');
  }

  get iconSizes() {
    this.fatal('Platform subclass must implement `iconSizes`.');
  }

  get platformPluginsPath() {
    this.fatal('Platform subclass must implement `platformPluginsPath`.');
  }

  get mergedManifestStructure() {
    this.fatal('Platform subclass must implement `mergedManifestStructure`.');
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

    return join(this.plugin.sourcePath, 'build', this.id, this.buildDirectory);
  }

  get entryFileName() {
    return 'index.js';
  }

  get entryPath() {
    return this.buildPath;
  }

  get entryFilePath() {
    return join(this.entryPath, this.entryFileName);
  }

  get templatePath() {
    return join(__dirname, '../../', 'cli', 'templates', this.id);
  }

  get apiCorePath() {
    return join(__dirname, '../../', 'api', 'core');
  }

  get apiPath() {
    return join(__dirname, '../../', 'api', 'platforms', this.id);
  }

  get manifestFilePath() {
    return join(this.buildPath, 'manifest.json');
  }

  get assetsPath() {
    return join(this.buildPath, 'assets');
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

  setPlugin(pluginInstance) {
    this.plugin = pluginInstance;
  }

  setCommand(commandInstance) {
    this.command = commandInstance;
  }

  loadManifest() {
    if (!this.plugin) {
      this.fatal('Cannot call `loadManifest` before assigning Plugin instance.');
    }

    if (!fs.existsSync(this.manifestFilePath)) {
      this.fatal(`Can't find plugin manifest file.`);
    }

    this.manifestData = JSON.parse(fs.readFileSync(
      this.manifestFilePath,
      { encoding: 'utf8' }
    ));
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
    this.generateEntryFile();

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

    if (!this.plugin.iconFilePath || !this.iconSizes) { return }

    this.info(`Generating icons.`);

    await Promise.all(this.iconSizes.map((size) => {
      const outputPath = `${this.assetsPath}/icon-${size}.png`;
      return Jimp.read(this.plugin.iconFilePath)
        .then(icon => icon.resize(size, size).write(outputPath));
    }));
  }

  async generateEntryFile() {
    if (!this.plugin) {
      this.fatal('Cannot call `generateEntryFile` before assigning Plugin instance.');
    }

    if (!fs.existsSync(this.entryFilePath)) {
      this.fatal(`Can't find platform plugin JS entry file.`);
    }

    this.info(`Generating JS entry file.`);

    const bundle = await rollup.rollup({
      input: join(this.apiPath, 'entry.js'),
      context: 'this',
      plugins: [
        alias({
          entries: {
            'command-loader': this.plugin.entryFilePath,
            'dtpm-core': this.apiCorePath,
            'dtpm': this.apiPath
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

    fs.writeFileSync(this.entryFilePath, output[0].code);
  }

  linkPlugin() {
    this.info(`Symlinking plugin directory.`);

    const symlinkPath = join(
      this.platformPluginsPath,
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
    this.generateEntryFile();
    this.copyPlugin();
  }

  syncEntryFile() {
    // Called on watch changes
    this.generateEntryFile();
    this.copyPlugin();
  }
}

module.exports = Platform;
