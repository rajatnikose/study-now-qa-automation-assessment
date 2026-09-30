const { test, expect } = require('../../fixtures/test-fixtures');
const { createUser, createArticle } = require('../../utils/test-data');

test.describe('Conduit REST API - authorization', () => {
  test('rejects cross-user article update and delete', async ({ api }) => {
    const owner = createUser('api-owner');
    const attacker = createUser('api-attacker');

    const ownerAccount = await api.register(owner);
    const attackerAccount = await api.register(attacker);
    const article = await api.createArticle(ownerAccount.token, createArticle('API Permission'));

    await api.updateArticle(attackerAccount.token, article.slug, { title: 'Should be rejected' }, 403);
    await api.deleteArticle(attackerAccount.token, article.slug, 403);

    const unchanged = await api.getArticle(article.slug);
    expect(unchanged.title).toBe(article.title);

    await api.deleteArticle(ownerAccount.token, article.slug);
  });
});
