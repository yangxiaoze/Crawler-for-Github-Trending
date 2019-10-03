const express = require('express');
const home = require('./lobbycentral');

const getService = require('./getService');
const getUser = require('./getUser');

const router = express.Router();

/* Get Requests */
router.get('', home);
router.get('/services', getService);
router.get('/users', getUser);

module.exports = router;
