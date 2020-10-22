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
      .createFromSerialized(stHex, { skipValidation: true });

    console.dir(parsedSt.toObject(), { depth: 100 });
  }
}

module.exports = StateTransitionController;
