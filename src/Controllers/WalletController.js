const Dash = require('dash');

class WalletController {
  constructor(options) {
    this.options = options;
  }

  async send(privateKey, to, amount) {
    console.log('Syncing the wallet...');

    const options = Object.assign({}, this.options, { wallet: { privateKey } });
    const client = new Dash.Client(options);
    const account = await client.getWalletAccount();

    console.log('Wallet is synchronized.');
    console.log('Sending transaction');

    const transaction = await account.createTransaction({
      satoshis: amount,
      recipient: to
    });

    await account.broadcastTransaction(transaction);

    console.log('transaction sent:', transaction.id);

    await account.disconnect();
  }
}

module.exports = WalletController;
