const express = require('express');
const router = express.Router();

const contestController = require('../controllers/contestController');

/* GET home page. */
router.get('/edit', (req, res) => contestController.editPage(req, res));

router.get('/edit/:article', (req, res) => contestController.editContestPage(req, res));
router.get('/admin', (req, res) => contestController.adminPage(req, res));

router.get('/:contest/:info', (req, res) => contestController.contestInfoPage(req, res));

router.get('/archive', (req, res) => contestController.archivePage(req, res));

module.exports = router;