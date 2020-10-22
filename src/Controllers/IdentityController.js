class IdentityController {
  constructor(dashClient) {
    this.dash = dashClient;
  }

  async getById(identityId) {
    const identity = await this.dash.platform.identities.get(identityId);

    console.dir(identity, { depth: 100 });
  }
}

module.exports = IdentityController;
