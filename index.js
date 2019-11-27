const commander = require('commander');
const package = require('./package.json');
const { platformKeys } = require('./library/constants');
const { commaList } = require('./library/utilities/commands');
const program = new commander.Command();

program.version(package.version);

// TODO: Add verbose option

program
  .command('new <name>')
  .option('-d, --dir <value>', 'Directory to create the files in, defaults to sanitized name')
  .option('-p, --platforms <items>', 'Comma-separated list of platform to generate files for', commaList, platformKeys)
  .option('-f, --force', 'Force overwrite of existing directory, if one exists')
  .description('Create a new set of DTPM plugins')
  .action(require('./commands/new'));

program
  .command('build')
  .option('-w, --watch', 'Watch for changes to plugin files and recompile')
  .description('Build plugin files to platform plugins')
  .action(require('./commands/build'));

program.parse(process.argv);

if (!process.argv.slice(2).length) {
  program.outputHelp();
}
