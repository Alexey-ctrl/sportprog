const express = require('express');
const router = express.Router();

const homePageController = require('../controllers/homePageController');

router.get('/', (req, res) => homePageController.homePage(req, res));

module.exports = router;
