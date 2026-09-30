function uniqueId(prefix = 'qa') {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function createUser(prefix = 'qa-user') {
  const id = uniqueId(prefix);
  return {
    username: id,
    email: `${id}@example.test`,
    password: `Pw!${Math.random().toString(36).slice(2, 10)}A9`,
  };
}

function createArticle(prefix = 'Study Now Assessment') {
  const id = uniqueId('article');
  return {
    title: `${prefix} ${id}`,
    description: `Automation assessment article ${id}`,
    body: `This article was created by an automated test. Reference: ${id}.`,
    tagList: ['playwright', 'qa'],
  };
}

module.exports = { createUser, createArticle, uniqueId };
