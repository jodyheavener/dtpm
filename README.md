# Design Tool Plugin Manager

Design Tool Plugin Manager, or DTPM, is a **proof of concept** command line utility and API that attempts to bridge the gap between various design tools' plugin development environments, specifically [Sketch](https://www.sketch.com/), [Adobe XD](https://www.adobe.com/products/xd.html), and [Figma](https://www.figma.com/). It serves to provide a common API that you can use to build your plugins with, where you only have to write your code once to develop for multiple design tool ecosystems.

At this point this project is still just a proof of concept and definitely a work in progress. My guiding principle here is that, much like web browsers, design tools all _generally_ do the same thing, and they each shine in their own areas, so it would benefit developers to be able to support multiple tools in their plugins.

## The `dtpm` CLI

Install `dtpm` via NPM or Yarn.

### `new [name] <options>`

Generates a new DTPM project. `[name]` is the name of the project, and will be used to create a new directory unless a path is specified in the options.

**Options:**

- `-d, --dir` - A directory path for which you'd like to generate the project files. Defaults to `PWD/[name]`.

- `-p, --platforms` - Platforms to support in your project. Supports `sketch`, `xd`, and `figma`. Defaults to `sketch,xd,figma`.

- `-f, --force` - Overwrite existing folder if one is present when creating project files.

When you generate a new project you're given a handful of example files to work with:

- `manifest.json` - This is the core manifest file that will be used to generate platform-specific manifests. See more about manifests below.

- `index.js` - This is the main entry-point for your plugin. Export commands and hook them up in the manifest to use them in your plugin.

- `assets/icons.png` - Your default plugin icon. Replace it with whatever you'd like.

Example: `dtpm new resizer --dir ../projects/resizer --platforms sketch,xd`

### `build <options>`

Compiles the project files into installable plugins for each of the supported platforms.

**Options:**

- `-w, --watch` - Watch for changes to source files and recompile.

This command, for each of the platforms you've chosen to support, does a number of things:

- It generates the file/folder structure necessary for the plugin.

- It generates a platform-specific manifest file. See more about manifests below.

- It creates the various plugin icons required by the specific platform.

- It attempts to install the plugin for each platform, where possible. Note that Figma does not provide a way to auto-install a plugin, requiring you to manually import it. Observe the command's output for detailed information.

### The Manifest

Every platform requires you to supply some kind of manifest in order to make the plugin run. These manifests vary wildly in structure, so DTPM takes care of generating them for you. You just need to supply one set of information for it to be transformed into the various plugins' manifests.

**Manifest options:**

- `id` (string, **required**) - A global identifier for your plugin
- `name` (string, **required**) - The name of your plugin
- `description` (string) - The description of your plugin
- `homepage` (string) - The homepage URL of your plugin
- `version` (string) - The version of your plugin (semver is recommended)
- `icon` (**required**) - The path to your plugin's main icon
- `author` (object) - The `name` and `email` of the plugin author
- `platforms` (array) - The platforms for which you're generating plugins (not used in generated manifests)
- `command` (array of objects) - Each object should contain a `name` and `command`, with the command matching an exported function in `index.js`
- `manifests` (object) - Specify objects for `sketch`, `xd`, or `figma` to include their values in the platform's generated manifest

**Example manifest:**

```json
{
  "id": "dtpm-example",
  "name": "dtpm-example",
  "description": "This is an example plugin generated by the Design Tool Plugin Manager",
  "homepage": "https://www.example.com/",
  "version": "0.1.0",
  "icon": "assets/icon.png",
  "author": {
    "name": "John Doe",
    "email": "john@example.com"
  },
  "platforms": [
    "figma",
    "sketch",
    "xd"
  ],
  "commands": [
    {
      "name": "First command",
      "handler": "firstCommand"
    },
    {
      "name": "Second command",
      "handler": "secondCommand"
    }
  ],
  "manifests": {
    "sketch": {
      "custom-property": "Custom value"
    }
  }
}
```

## The API

When you generate a new project you're provided with a plugin entry-point file, `index.js`. This can be used to develop and export your plugin functions. Note that your exported plugin function must be referenced in your manifest's commands in order to make it into the plugin.

**This API is extremely limited for now.**

Your plugin file can import properties and functions from the available DTPM modules:

### `dtpm/platform`

All about the platform you're working in.

**Available properties and methods:**

#### `id`

String - The platform's simple ID (e.g. `sketch`)

#### `name`

String - The platform's full name (e.g. `Adobe XD`)

### `dtpm/plugin`

All about the plugin instance.

**Available properties and methods:**

#### `done`

Function -> Null - Used to mark that the plugin is done being used and can be released.

#### `storage`

Object - Used to get and set data in the plugin. Both functions return a promise.

#### `storage.set`

Function -> Promise - Set data with the plugin.

Arguments:

- `key` String - The key under which you'd like to store the data.
- `value` String - The value you'd like to store. String support only.

#### `storage.get`

Function -> Promise - Get stored data from the plugin.

Arguments:

- `key` String - The key for the data you'd like to retrieve.

### `dtpm/document`

All about the document you're working with.

**Available properties and methods:**

#### `insert`

Function -> Null - Insert the Node into the current context (artboard / page).

Arguments:

- `object` Node - The Node that you'd like to insert. This will have `.native` called on it, so it must be a DTPM Node.

#### `Node`

Class - The base layer class that all subsequent layers would inherit from. Do not use on its own.

#### `Rectangle`

Class - A rectangle shape layer.

Arguments (object):

- `name` String - The name of the node
- `width` Number - The width of the rectangle
- `height` Number - The height of the rectangle

---

Here's a super simple example of how you can work with the DTPM API:

```javascript
// index.js, assuming your manifest has a command
// with the handler "firstCommand"

import { insert, Rectangle } from 'dtpm/document';
import { storage, done } from 'dtpm/plugin';

export async function firstCommand() {
  // Insert a rectangle in the page
  const rectangle = new Rectangle({
    name: 'Example',
    width: 50,
    height: 50
  });

  insert(rectangle);

  // Set and get a storage value
  const storageKey = 'example';
  await storage.set(storageKey, 'hey');
  const retrievedValue = await storage.get(storageKey);

  console.log(retrievedValue);

  // Signal that the plugin is done running
  done();
}
```
