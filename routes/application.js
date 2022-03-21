const express = require('express');
const router = express.Router();

const applicationController = require('../controllers/applicationController');

router.get('/new/:contest', (req, res) => applicationController.getNewForm(req, res));

router.get('/view/:contest', (req, res) => applicationController.getApplicationsContest(req, res));

router.get('/', (req, res) => applicationController.getApplications(req, res));

module.exports = router;