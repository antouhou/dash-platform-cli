const Dash = require('dash');

const StateTransitionController = require('./StateTransitionController');
const IdentityController = require('./IdentityController');
const BlockController = require('./BlockController');
const WalletController = require('./WalletController');
const DocumentController = require('./DocumentController');

/**
 * @class Controllers
 *
 * @property {StateTransitionController} stParser
 */
class Controllers {
  constructor(options) {
    this.dash = new Dash.Client(options);

    this.stateTransitions = new StateTransitionController(this.dash);
    this.identities = new IdentityController(this.dash);
    this.blocks = new BlockController(this.dash);
    this.wallet = new WalletController(options);
    this.documents = new DocumentController(this.dash);
  }
}

module.exports = Controllers;
