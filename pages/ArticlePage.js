const { expect } = require('@playwright/test');

class ArticlePage {
  constructor(page) {
    this.page = page;
    this.heading = page.locator('.article-page .banner h1');
    this.editButton = page.getByRole('link', { name: 'Edit Article' }).first();
    this.deleteButton = page.getByRole('button', { name: 'Delete Article' }).first();
  }

  async expectTitle(title) {
    await expect(this.heading).toHaveText(title);
  }

  async expectBody(body) {
    await expect(this.page.locator('.article-content')).toContainText(body);
  }

  async edit() {
    await this.editButton.click();
    await expect(this.page).toHaveURL(/\/editor\/[^/]+$/);
  }

  async delete() {
    await this.deleteButton.click();
    await expect(this.page).toHaveURL(/\/$/);
  }

  async expectModifyControlsHidden() {
    await expect(this.editButton).toHaveCount(0);
    await expect(this.deleteButton).toHaveCount(0);
  }
}

module.exports = { ArticlePage };
