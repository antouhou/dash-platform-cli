const Dash = require('dash');

const readmeMnemonic = 'stumble coin smooth wink defy glare panel suggest area during turkey solution';
const readmeIdentity = '5uvhMEpiCDLYA2oqTq3WHcxMb1QJQKMeYFSfFisuPFdE';

const clientOpts = {
  network: 'testnet',
  wallet: {
    mnemonic: readmeMnemonic
  }
};

const client = new Dash.Client(clientOpts);
console.log('new Dash.Client');

const submitNoteDocument = async function () {
  client.getApps().set('tokenContract', { contractId: 'DY6KmhAsLqrkTxJWA7KAJA3vR4wHhExHqSYXLWitdxuu' });

  const platform = client.platform;

  try {
    const identity = await platform.identities.get(readmeIdentity);

    const docProperties = {
      version: 1,
      name: 'myToken',
      symbol: 'TOK',
      decimals: 8,
      sender: '5uvhMEpiCDLYA2oqTq3WHcxMb1QJQKMeYFSfFisuPFdE',
      recipient: '5uvhMEpiCDLYA2oqTq3WHcxMb1QJQKMeYFSfFisuPFdE',
      amount: '100000000',
      data: '',
      owner: '5uvhMEpiCDLYA2oqTq3WHcxMb1QJQKMeYFSfFisuPFdE',
      balance: '89100000000',
      lastValIndTransfer: 22,
      lastValIndTransferFrom: 17
    };

    // Create the note document
    const noteDocument = await platform.documents.create(
      'tokenContract.token',
      identity,
      docProperties
    );

    const documentBatch = {
      create: [noteDocument],
      replace: [],
      delete: []
    };

    // Sign and submit the document
    await platform.documents.broadcast(documentBatch, identity);
  } catch (e) {
    // console.error('Something went wrong:', e);
    console.dir(e, { depth: 100 });
  } finally {
    client.disconnect();
  }
};
submitNoteDocument();
