const Dash = require('dash');

const StateTransitionUtility = require('./StateTransitionUtility');
const IdentityUtility = require('./IdentityUtility');

/**
 * @class Facade
 *
 * @property {StateTransitionUtility} stParser
 */
class Facade {
  constructor(options) {
    this.dash = new Dash.Client(options);

    this.stateTransitions = new StateTransitionUtility(this.dash);
    this.identities = new IdentityUtility(this.dash);
  }
}

module.exports = Facade;
