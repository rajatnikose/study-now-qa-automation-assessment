const { test, expect } = require('../../fixtures/test-fixtures');
const { AuthPage } = require('../../pages/AuthPage');
const { createUser } = require('../../utils/test-data');

test.describe('Authentication', () => {
  test('user can sign up through the UI', async ({ page }) => {
    const user = createUser('ui-signup');
    const auth = new AuthPage(page);

    await page.goto('/');
    await auth.register(user);

    await expect(page.getByRole('link', { name: user.username })).toBeVisible();
    await expect(page.getByRole('link', { name: 'New Article' })).toBeVisible();
  });

  test('registered user can sign in through the UI', async ({ page, api }) => {
    const user = createUser('ui-login');
    await api.register(user);

    const auth = new AuthPage(page);
    await page.goto('/');
    await auth.login(user);

    await expect(page.getByRole('link', { name: user.username })).toBeVisible();
  });
});
