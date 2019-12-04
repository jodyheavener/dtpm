### Code terminology

- **platform** - one of the supported design tools (e.g. sketch, figma)
- **platform plugin** - the plugin that is loaded by a given platform
  - Any file system reference off of a Platform instance can be assumed is from platform files
- **source plugin** - the user's project that is used to generate platform plugins
  - Anything prefixed with `source` (e.g. `sourceIconFilePath`) refers to the user's project code
  - Any file system reference off of a Plugin instance can be assumed is from source files
- **entryJS** - The name of the primary platform JS file that a platform interacts with to execute a plugin, as well as the primary source JS file that the plugin code is written in
- A reference to a path must be suffixed with `Path`
- A reference to a specific directory must be suffixed with `Directory`
- A reference to a specific file path must be suffixed with `FilePath`
- A reference to a file name (name and extension) must be suffixed with `FileName`
