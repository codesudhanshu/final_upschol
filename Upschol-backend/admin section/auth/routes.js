const express = require('express');
const { login, createUser } = require('./controller');
const verifyToken = require('./helper');

module.exports = function(app) {
  const router = express.Router();

  router.post('/login', login);
  router.post('/create-user', verifyToken, createUser);

  app.use('/api/auth', router);
};
