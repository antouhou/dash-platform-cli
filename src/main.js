const Yargs = require('yargs');
const Facade = require('./Facade');

(async function main() {
  const options = {};

  if (process.env.DAPI_SEEDS) {
    options.seeds = process.env.DAPI_SEEDS.split(',');
  }

  const facade = new Facade(options);

  await Yargs
    .command('transition parse [stHex]', 'parse state transition hex', (yargs) => {
      yargs.positional('stHex', {
        describe: 'serialized state transition'
      });
    },
    async (argv) => {
      await facade.stateTransitions.parse(argv.stHex);
    })
    .command('identity get [identityId]', 'show parsed identity with this id', (yargs) => {
      yargs.positional('identityId', {
        describe: 'base58 identity id'
      });
    },
    async (argv) => {
      await facade.identities.getById(argv.identityId);
    })
    .option('verbose', {
      alias: 'v',
      type: 'boolean',
      description: 'Run with verbose logging'
    }).argv;
}()).catch(console.error);
