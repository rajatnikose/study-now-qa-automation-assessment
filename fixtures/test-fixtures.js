const { test: base, expect } = require('@playwright/test');
const { ConduitApi } = require('../utils/api-client');
const { createUser } = require('../utils/test-data');

const test = base.extend({
  api: async ({ request }, use) => {
    const api = new ConduitApi(request, process.env.API_URL || 'https://conduit-api.bondaracademy.com/api');
    await use(api);
  },

  apiUser: async ({ api }, use) => {
    const credentials = createUser();
    const user = await api.register(credentials);
    await use({ ...credentials, ...user });
  },
});

module.exports = { test, expect };
