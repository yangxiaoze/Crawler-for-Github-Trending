const express = require('express');
const lobbycentral = require('./lobbycentral');
const root = require('./root');

const router = express.Router();

// Parse URL-encoded bodies (as sent by HTML forms)
router.use(express.urlencoded({ extended: true }));

// Parse JSON bodies (as sent by API clients)
router.use(express.json());

router.use('/lobbycentral', lobbycentral);
router.get('/', root);

module.exports = router;
