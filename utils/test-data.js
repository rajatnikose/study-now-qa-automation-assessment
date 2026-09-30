function uniqueId(prefix = 'qa') {
  const safePrefix = prefix.toLowerCase().replace(/[^a-z0-9]/g, '').slice(0, 7) || 'qa';
  const timestamp = Date.now().toString(36).slice(-7);
  const random = Math.random().toString(36).slice(2, 6);
  return `${safePrefix}${timestamp}${random}`;
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
