const fs = require('fs-extra');
const Jimp = require('jimp');
const { getPaths, warn, success } = require('../lib/utils');
const { studioPlugins, sketchPlugins, xdPlugins } = require('../lib/constants');

module.exports.studio = function(command, manifest, cmdDir, pluginDir) {
  const { templatePath, pluginPath } = getPaths('studio', cmdDir, pluginDir);
  const platformManifestFile = `${pluginPath}/manifest.json`;

  return new Promise(async function(resolve, reject) {
    // Template files
    success(`[studio] Copying platform template files.`);
    fs.copySync(templatePath, pluginPath);

    // Manifest
    const platformManifest = require(platformManifestFile);
    let updatedPlatformManifest = Object.assign(platformManifest, {
      name: manifest.name,
      version: manifest.version,
      displayName: manifest.name,
      description: manifest.description,
      homepage: manifest.homepage,
      author: manifest.author
    });
    updatedPlatformManifest = Object.assign(updatedPlatformManifest, manifest.manifests.studio);
    success(`[studio] Updating manifest.`);
    fs.writeJsonSync(platformManifestFile, updatedPlatformManifest, { spaces: 2 });

    // Icon
    success(`[studio] Creating icons.`);
    const originalIconPath = `${pluginDir}/${manifest.icon}`;
    await Jimp.read(originalIconPath).then(icon => icon.resize(256, 256).write(`${pluginPath}/assets/icon.png`));

    // Plugin link
    success(`[studio] Symlinking plugin directory.`);
    fs.symlink(pluginPath, `${studioPlugins}/${manifest.name}`);

    resolve();
  })
};

module.exports.sketch = function(command, manifest, cmdDir, pluginDir) {
  const { templatePath, pluginPath } = getPaths('sketch', cmdDir, pluginDir);
  const platformManifestFile = `${pluginPath}/Contents/Sketch/manifest.json`;

  return new Promise(async function(resolve, reject) {
    // Template files
    success(`[sketch] Copying platform template files.`);
    fs.copySync(templatePath, pluginPath);

    // Manifest
    const platformManifest = require(platformManifestFile);
    let updatedPlatformManifest = Object.assign(platformManifest, {
      name: manifest.name,
      version: manifest.version,
      description: manifest.description,
      identifier: manifest.id,
      author: manifest.author.name,
      authorEmail: manifest.author.email
    });
    updatedPlatformManifest = Object.assign(updatedPlatformManifest, manifest.manifests.sketch);
    updatedPlatformManifest.commands = manifest.commands.map((command) => {
      return {
        name: command.name,
        identifier: command.handler,
        shortcut: command.shortcut,
        handler: command.handler,
        script: "index.js"
      }
    });
    updatedPlatformManifest.menu = {
      items: updatedPlatformManifest.commands.map(c => c.identifier)
    };
    success(`[sketch] Updating manifest.`);
    fs.writeJsonSync(platformManifestFile, updatedPlatformManifest, { spaces: 2 });

    // Icon
    success(`[sketch] Creating icons.`);
    const originalIconPath = `${pluginDir}/${manifest.icon}`;
    await Jimp.read(originalIconPath).then(icon => icon.resize(128, 128).write(`${pluginPath}/Contents/Resources/icon.png`));

    // Plugin link
    success(`[sketch] Symlinking plugin directory.`);
    fs.symlink(pluginPath, `${sketchPlugins}/${manifest.id}.sketchplugin`);

    resolve();
  })
};

module.exports.figma = function(command, manifest, cmdDir, pluginDir) {
  const { templatePath, pluginPath } = getPaths('figma', cmdDir, pluginDir);
  const platformManifestFile = `${pluginPath}/manifest.json`;

  return new Promise(async function(resolve, reject) {
    // Template files
    success(`[figma] Copying platform template files.`);
    fs.copySync(templatePath, pluginPath);

    // Manifest
    const platformManifest = require(platformManifestFile);
    let updatedPlatformManifest = Object.assign(platformManifest, {
      name: manifest.name,
      id: manifest.author.id,
    });
    updatedPlatformManifest = Object.assign(updatedPlatformManifest, manifest.manifests.figma);
    updatedPlatformManifest.menu = manifest.commands.map((command) => {
      return {
        name: command.name,
        command: command.handler
      }
    });
    success(`[figma] Updating manifest.`);
    fs.writeJsonSync(platformManifestFile, updatedPlatformManifest, { spaces: 2 });

    resolve();
  })
};

module.exports.xd = function(command, manifest, cmdDir, pluginDir) {
  const { templatePath, pluginPath } = getPaths('xd', cmdDir, pluginDir);
  const platformManifestFile = `${pluginPath}/manifest.json`;

  return new Promise(async function(resolve, reject) {
    // Template files
    success(`[xd] Copying platform template files.`);
    fs.copySync(templatePath, pluginPath);

    // Manifest
    const platformManifest = require(platformManifestFile);
    let updatedPlatformManifest = Object.assign(platformManifest, {
      id: manifest.id,
      name: manifest.name,
      version: manifest.version,
    });
    updatedPlatformManifest = Object.assign(updatedPlatformManifest, manifest.manifests.xd);
    updatedPlatformManifest.uiEntryPoints = manifest.commands.map((command) => {
      return {
        type: "menu",
        label: command.name,
        commandId: command.handler
      }
    });
    success(`[xd] Updating manifest.`);
    fs.writeJsonSync(platformManifestFile, updatedPlatformManifest, { spaces: 2 });

    // Icons
    success(`[xd] Creating icons.`);
    const originalIconPath = `${pluginDir}/${manifest.icon}`;
    await Jimp.read(originalIconPath).then(icon => icon.resize(24, 24).write(`${pluginPath}/assets/icon-24.png`));
    await Jimp.read(originalIconPath).then(icon => icon.resize(48, 48).write(`${pluginPath}/assets/icon-48.png`));
    await Jimp.read(originalIconPath).then(icon => icon.resize(512, 512).write(`${pluginPath}/assets/icon-512.png`));

    // Plugin link
    success(`[xd] Symlinking plugin directory.`);
    fs.symlink(pluginPath, `${xdPlugins}/${manifest.id}`);

    resolve();
  })
};
