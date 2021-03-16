const {
  InstantLock, encoding: { BufferReader }, ZmqMessages: { ChainLockSigMessage }, Transaction
} = require('@dashevo/dashcore-lib');
const DashdRPC = require('@dashevo/dashd-rpc/promise');
const ZMQClient = require('./ZMQClient');
const client = new ZMQClient('127.0.0.1', 20301, { });

const testPrivKey = 'cRhCaxzGmkJHDeQwwn71cLfmq1ssM8yNaCy3Dzx6xnu8RLrLCMvy';
const testAddress = 'yTFraC61Q2xrhywxp2ePZt4egtF8xSKm4M';

const rpcOptions = {
  host: '127.0.0.1',
  port: 20302,
  user: 'dashrpc',
  pass: 'rpcpassword',
  protocol: 'http'
};
const coreRpcClient = new DashdRPC(rpcOptions);

(async () => {
  client.on('error', (e) => {
    console.error(e);
  });
  console.log('Connecting to the client');
  await client.start();
  console.log('Connected');
  client.subscribe(ZMQClient.TOPICS.rawtxlocksig);
  client.on(ZMQClient.TOPICS.rawtxlocksig, async (rawTxLockSigMessage) => {
    // console.log('Receive txlock message');
    // console.log(rawTxLockSigMessage);
    // console.log();
  });

  client.subscribe(ZMQClient.TOPICS.rawchainlocksig);
  client.on(ZMQClient.TOPICS.rawchainlocksig, async (rawTxLockSigMessage) => {
    // console.log('Receive chainlock message');
    // const parsedMessage = new ChainLockSigMessage(rawTxLockSigMessage);
    // console.dir(parsedMessage.chainLock.toObject());
    // console.log();
  });

  client.subscribe(ZMQClient.TOPICS.rawtxlocksig);
  client.on(ZMQClient.TOPICS.rawtxlocksig, async (rawTransactionLock) => {
    const tx = new Transaction().fromBuffer(rawTransactionLock);
    const txBuffer = tx.toBuffer();
    const txHash = tx.hash.toString('hex');
    console.log('Receive instant lock message for tx', txHash);
    const txLockBuffer = rawTransactionLock.slice(txBuffer.length, rawTransactionLock.length);
    const transactionLock = new InstantLock(txLockBuffer);

    const { result: isVerified } = await coreRpcClient.verifyIsLock(
      transactionLock.getRequestId().toString('hex'),
      transactionLock.txid,
      transactionLock.signature
    );

    const txLockHex = txLockBuffer.toString('hex');
    const txLockRestoredHex = transactionLock.toBuffer().toString('hex');
    console.log(txHash, 'is equal:', txLockHex === txLockRestoredHex);

    console.log(txHash, 'is verified', isVerified);
  });

  console.log('Importing private key');
  let res = await coreRpcClient.importPrivKey(testPrivKey);
  console.log('Private key imported');

  console.log('Creating a transaction');
  res = await coreRpcClient.sendToAddress(testAddress, 1000);
  console.log('Tx created:', res.result);
})().catch((e) => {
  console.error(e);
  process.exit();
});
