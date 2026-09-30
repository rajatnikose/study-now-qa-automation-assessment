const { expect } = require('@playwright/test');

class EditorPage {
  constructor(page) {
    this.page = page;
    this.title = page.getByRole('textbox', { name: 'Article Title' });
    this.description = page.getByRole('textbox', { name: "What's this article about?" });
    this.body = page.getByRole('textbox', { name: 'Write your article (in markdown)' });
    this.tags = page.getByRole('textbox', { name: 'Enter tags' });
    this.publish = page.getByRole('button', { name: 'Publish Article' });
  }

  async openNew() {
    await this.page.getByRole('link', { name: 'New Article' }).click();
    await expect(this.page).toHaveURL(/\/editor$/);
  }

  async openEdit(slug) {
    await this.page.goto(`/editor/${slug}`);
    await expect(this.title).toBeVisible();
  }

  async fillArticle(article) {
    await this.title.fill(article.title);
    await this.description.fill(article.description);
    await this.body.fill(article.body);

    for (const tag of article.tagList || []) {
      await this.tags.fill(tag);
      await this.tags.press('Enter');
    }
  }

  async submit() {
    await this.publish.click();
    await expect(this.page).toHaveURL(/\/article\/[^/]+$/);
  }

  async create(article) {
    await this.openNew();
    await this.fillArticle(article);
    await this.submit();
  }
}

module.exports = { EditorPage };
