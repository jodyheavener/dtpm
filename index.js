const package = require('./package.json');
const commander = require('commander');
const program = new commander.Command();

program.version(package.version);

program
  .command('create')
  .requiredOption('-n, --name <value>', 'what to name the plugin')
  .option('-d, --dir <value>', 'directory to create the files in, defaults to name')
  .option('-f, --force', 'force directory overwrite - be careful!')
  .description('create a new set of design tool plugins')
  .action(require('./commands/create'));

program
  .command('build')
  .option('-w, --watch', 'watch plugin directory for changes and recompile')
  .description('build existing design tool plugins')
  .action(require('./commands/build'));

program.parse(process.argv);
