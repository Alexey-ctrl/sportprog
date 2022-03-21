const express = require('express');
const router = express.Router();

const userController = require('../controllers/userController');

router.get('/', (req, res) => userController.loginPage(req, res));

module.exports = router;
