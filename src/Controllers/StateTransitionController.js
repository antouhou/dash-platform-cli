class StateTransitionController {
  constructor(dashClient) {
    this.dashClient = dashClient;
  }

  /**
     *
     * @param {string} stHex
     * @return {Promise<void>}
     */
  async parse(stHex) {
    const { dashClient } = this;
    const { dpp } = dashClient.platform;
    const parsedSt = await dpp.stateTransition
      .createFromBuffer(Buffer.from(stHex, 'hex'));

    console.dir(parsedSt.toObject(), { depth: 100 });

    if (parsedSt.getIdentityId) {
      console.log('Identity id:', parsedSt.getIdentityId().toString());
    }
  }
}

module.exports = StateTransitionController;
