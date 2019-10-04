const express = require('express');
const home = require('./lobby');

const getService = require('./getService');
const getUser = require('./getUser');
const login = require('./login');

const router = express.Router();

/* Get Requests */
router.get('', home);
router.get('/services', getService);
router.get('/users', getUser);
router.get('/login', login);

module.exports = router;
