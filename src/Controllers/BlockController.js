class BlockController {
  constructor(dashClient) {
    this.dash = dashClient;
  }

  async getByHash(identityId) {
    const block = await this.dash.transport.identities.get(identityId);

    console.dir(block.toObject(), { depth: 100 });
  }
}

module.exports = BlockController;
