const Yargs = require('yargs');
const Controllers = require('./Controllers/Controllers');

(async function main() {
  const options = {};

  if (process.env.DAPI_SEEDS) {
    options.seeds = process.env.DAPI_SEEDS.split(',');
  }

  const controllers = new Controllers(options);

  await Yargs
    .command('transition parse [stHex]', 'parse state transition hex', (yargs) => {
      yargs.positional('stHex', {
        describe: 'serialized state transition'
      });
    },
    async (argv) => {
      await controllers.stateTransitions.parse(argv.stHex);
    })
    .command('identity get [identityId]', 'show parsed identity with this id', (yargs) => {
      yargs.positional('identityId', {
        describe: 'base58 identity id'
      });
    },
    async (argv) => {
      await controllers.identities.getById(argv.identityId);
    })
    .command('block get [blockHash]', 'show block for a specific block hash', (yargs) => {
      yargs.positional('blockHash', {
        describe: 'hex of the block hash'
      });
    },
    async (argv) => {
      await controllers.blocks.getByHash(argv.blockHash);
    })
    .command('wallet send [privateKey] [addressTo] [amount]', 'send funds from a private key to an address', (yargs) => {
      yargs.positional('privateKey', {
        describe: 'private key to take money from'
      });
      yargs.positional('addressTo', {
        describe: 'address to send funds to'
      });
      yargs.positional('amount', {
        describe: 'amount to send',
        type: 'number'
      });
    }, async (argv) => {
      await controllers.wallet.send(argv.privateKey, argv.addressTo, argv.amount);
    })
    .command('documents get [contractId] [documentType] [queryString]', 'search through documents', (yargs) => {
      yargs.positional('contractId', {
        describe: 'contract Id to search documents',
        type: 'string'
      });
      yargs.positional('documentType', {
        describe: 'document type',
        type: 'string'
      });
      yargs.positional('queryString', {
        describe: 'document query string',
        type: 'string'
      });
    }, async (argv) => {
      await controllers.documents.get(argv.contractId, argv.documentType, argv.queryString);
    })
    .option('verbose', {
      alias: 'v',
      type: 'boolean',
      description: 'Run with verbose logging'
    }).argv;
}()).catch(console.error);
