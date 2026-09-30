const { test, expect } = require('../../fixtures/test-fixtures');
const { AuthPage } = require('../../pages/AuthPage');
const { EditorPage } = require('../../pages/EditorPage');
const { ArticlePage } = require('../../pages/ArticlePage');
const { createArticle } = require('../../utils/test-data');

test.describe('Article lifecycle', () => {
  test('user can create, edit, verify and delete an article', async ({ page, api, apiUser }) => {
    const auth = new AuthPage(page);
    const editor = new EditorPage(page);
    const articlePage = new ArticlePage(page);
    const article = createArticle();
    let currentSlug;

    try {
      await page.goto('/');
      await auth.login(apiUser);

      await editor.create(article);
    await articlePage.expectTitle(article.title);
    await articlePage.expectBody(article.body);

    currentSlug = page.url().split('/article/')[1];
    expect(currentSlug).toBeTruthy();

    const updatedArticle = {
      title: `${article.title} - Updated`,
      description: `${article.description} - Updated`,
      body: `${article.body} Updated successfully.`,
      tagList: ['playwright', 'qa', 'updated'],
    };

    await articlePage.edit();
    await editor.title.fill(updatedArticle.title);
    await editor.description.fill(updatedArticle.description);
    await editor.body.fill(updatedArticle.body);
    await editor.tags.fill('updated');
    await editor.tags.press('Enter');
    await editor.submit();

    await articlePage.expectTitle(updatedArticle.title);
    await articlePage.expectBody(updatedArticle.body);

    currentSlug = page.url().split('/article/')[1];
    const verifiedArticle = await api.getArticle(currentSlug);
    expect(verifiedArticle.title).toBe(updatedArticle.title);
    expect(verifiedArticle.description).toBe(updatedArticle.description);
    expect(verifiedArticle.body).toBe(updatedArticle.body);

    await articlePage.delete();

    const deletedResponse = await api.getArticle(currentSlug, 404);
    expect(deletedResponse.status()).toBe(404);
    currentSlug = undefined;
    } finally {
      if (currentSlug) {
        await api.deleteArticle(apiUser.token, currentSlug, 204).catch(() => {});
      }
    }
  });
});
