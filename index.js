const commander = require('commander');
const { platformKeys } = require('./cli/utilities/constants');
const { commaList } = require('./cli/utilities/commands');
const newCommand = require('./cli/commands/new');
const buildCommand = require('./cli/commands/build');
const package = require('./package.json');
const program = new commander.Command();

program.version(package.version);

program
  .command('new <name>')
  .option('-d, --dir <value>', 'Directory to create the files in, defaults to sanitized name')
  .option('-p, --platforms <items>', 'Comma-separated list of platform to generate files for', commaList, platformKeys)
  .option('-f, --force', 'Force overwrite of existing directory, if one exists')
  .description('Set up a new boilerplate for building dtpm plugins')
  .action(newCommand);

program
  .command('build')
  .option('-w, --watch', 'Watch for changes to source plugin files and recompile')
  .description('Build source plugin files to platform plugins')
  .action(buildCommand);

program.parse(process.argv);

if (!process.argv.slice(2).length) {
  program.outputHelp();
}
