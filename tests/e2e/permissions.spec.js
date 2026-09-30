const { test, expect } = require('../../fixtures/test-fixtures');
const { AuthPage } = require('../../pages/AuthPage');
const { ArticlePage } = require('../../pages/ArticlePage');
const { createArticle, createUser } = require('../../utils/test-data');

test.describe('Article authorization', () => {
  test('user B cannot edit or delete user A article', async ({ page, api }) => {
    const owner = createUser('owner');
    const otherUser = createUser('other');

    const ownerAccount = await api.register(owner);
    const otherAccount = await api.register(otherUser);
    const article = await api.createArticle(ownerAccount.token, createArticle('Permission Test'));

    const auth = new AuthPage(page);
    const articlePage = new ArticlePage(page);

    await page.goto('/');
    await auth.login(otherUser);
    await page.goto(`/article/${article.slug}`);

    await articlePage.expectTitle(article.title);
    await articlePage.expectModifyControlsHidden();

    const attemptedUpdate = await api.updateArticle(
      otherAccount.token,
      article.slug,
      { title: 'Unauthorized update' },
      403,
    );
    expect(attemptedUpdate.status()).toBe(403);

    const attemptedDelete = await api.deleteArticle(otherAccount.token, article.slug, 403);
    expect(attemptedDelete.status()).toBe(403);

    const unchanged = await api.getArticle(article.slug);
    expect(unchanged.title).toBe(article.title);

    await api.deleteArticle(ownerAccount.token, article.slug);
  });
});
