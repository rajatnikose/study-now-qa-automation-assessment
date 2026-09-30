const { test, expect } = require('../../fixtures/test-fixtures');
const { createUser, createArticle } = require('../../utils/test-data');

test.describe('Conduit REST API - article CRUD', () => {
  test('registers a user and completes the article CRUD lifecycle', async ({ request }) => {
    const baseURL = process.env.API_URL || 'https://conduit-api.bondaracademy.com/api';
    const user = createUser('api-crud');

    const registerResponse = await request.post(`${baseURL}/users`, {
      data: { user },
    });
    expect(registerResponse.status()).toBe(201);

    const registered = (await registerResponse.json()).user;
    expect(registered.username).toBe(user.username);
    expect(registered.email).toBe(user.email);
    expect(registered.token).toBeTruthy();

    const token = registered.token;
    const article = createArticle('API CRUD');

    const createResponse = await request.post(`${baseURL}/articles`, {
      headers: { Authorization: `Token ${token}` },
      data: { article },
    });
    expect(createResponse.status()).toBe(201);

    const created = (await createResponse.json()).article;
    expect(created.title).toBe(article.title);
    expect(created.description).toBe(article.description);
    expect(created.body).toBe(article.body);
    expect(created.author.username).toBe(user.username);
    expect(created.slug).toBeTruthy();

    const getResponse = await request.get(`${baseURL}/articles/${created.slug}`);
    expect(getResponse.status()).toBe(200);
    const fetched = (await getResponse.json()).article;
    expect(fetched.slug).toBe(created.slug);
    expect(fetched.title).toBe(article.title);

    const updatedTitle = `${article.title} - Updated`;
    const updateResponse = await request.put(`${baseURL}/articles/${created.slug}`, {
      headers: { Authorization: `Token ${token}` },
      data: {
        article: {
          title: updatedTitle,
          description: 'Updated description',
          body: 'Updated body',
        },
      },
    });
    expect(updateResponse.status()).toBe(200);

    const updated = (await updateResponse.json()).article;
    expect(updated.title).toBe(updatedTitle);
    expect(updated.description).toBe('Updated description');
    expect(updated.body).toBe('Updated body');

    const deleteResponse = await request.delete(`${baseURL}/articles/${updated.slug}`, {
      headers: { Authorization: `Token ${token}` },
    });
    expect(deleteResponse.status()).toBe(204);

    const getDeletedResponse = await request.get(`${baseURL}/articles/${updated.slug}`);
    expect(getDeletedResponse.status()).toBe(404);
  });
});
