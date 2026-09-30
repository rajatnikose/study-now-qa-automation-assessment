const { expect } = require('@playwright/test');

class AuthPage {
  constructor(page) {
    this.page = page;
    this.email = page.getByRole('textbox', { name: 'Email' });
    this.password = page.getByLabel('Password');
    this.username = page.getByRole('textbox', { name: 'Username' });
    this.submit = page.getByRole('button', { name: /Sign (in|up)/ });
  }

  async openLogin() {
    await this.page.getByRole('link', { name: 'Sign in' }).click();
    await expect(this.page).toHaveURL(/\/login$/);
  }

  async openRegister() {
    await this.page.getByRole('link', { name: 'Sign up' }).click();
    await expect(this.page).toHaveURL(/\/register$/);
  }

  async register(user) {
    await this.openRegister();
    await this.username.fill(user.username);
    await this.email.fill(user.email);
    await this.password.fill(user.password);
    await this.page.getByRole('button', { name: 'Sign up' }).click();
    await expect(this.page.getByRole('link', { name: 'New Article' })).toBeVisible();
  }

  async login(user) {
    await this.openLogin();
    await this.email.fill(user.email);
    await this.password.fill(user.password);
    await this.page.getByRole('button', { name: 'Sign in' }).click();
    await expect(this.page.getByRole('link', { name: 'New Article' })).toBeVisible();
  }
}

module.exports = { AuthPage };
