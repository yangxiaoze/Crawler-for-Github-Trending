const express = require('express');

const home = require('./menu');
const login = require('./login');
const getService = require('./getService');
const getUser = require('./getUser');
const getLocation = require('./getLocation');
const getQueue = require('./getQueue');
const getLobby = require('./getLobby');

const router = express.Router();

/* Get Requests */
router.get('', home);
router.get('/login', login);
router.get('/services', getService);
router.get('/users', getUser);
router.get('/locations', getLocation);
router.get('/queues', getQueue);
router.get('/lobby', getLobby);

module.exports = router;
