const { expect } = require('@playwright/test');

class ConduitApi {
  constructor(request, baseURL) {
    this.request = request;
    this.baseURL = baseURL.replace(/\/$/, '');
  }

  async register(user) {
    const response = await this.request.post(`${this.baseURL}/users`, {
      data: { user },
    });
    expect(response.status()).toBe(201);
    const body = await response.json();
    return body.user;
  }

  async login(user) {
    const response = await this.request.post(`${this.baseURL}/users/login`, {
      data: {
        user: {
          email: user.email,
          password: user.password,
        },
      },
    });
    expect(response.status()).toBe(200);
    const body = await response.json();
    return body.user;
  }

  async createArticle(token, article) {
    const response = await this.request.post(`${this.baseURL}/articles`, {
      headers: { Authorization: `Token ${token}` },
      data: { article },
    });
    expect(response.status()).toBe(201);
    const body = await response.json();
    return body.article;
  }

  async getArticle(slug, expectedStatus = 200) {
    const response = await this.request.get(`${this.baseURL}/articles/${slug}`);
    expect(response.status()).toBe(expectedStatus);
    if (expectedStatus === 200) {
      const body = await response.json();
      return body.article;
    }
    return response;
  }

  async updateArticle(token, slug, article, expectedStatus = 200) {
    const response = await this.request.put(`${this.baseURL}/articles/${slug}`, {
      headers: { Authorization: `Token ${token}` },
      data: { article },
    });
    expect(response.status()).toBe(expectedStatus);
    if (expectedStatus === 200) {
      const body = await response.json();
      return body.article;
    }
    return response;
  }

  async deleteArticle(token, slug, expectedStatus = 204) {
    const response = await this.request.delete(`${this.baseURL}/articles/${slug}`, {
      headers: { Authorization: `Token ${token}` },
    });
    expect(response.status()).toBe(expectedStatus);
    return response;
  }
}

module.exports = { ConduitApi };
