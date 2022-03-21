const express = require('express');
const router = express.Router();

const apiController = require('../controllers/apiController');

router.get('/get-contests', (req, res) => apiController.getContests(req, res));

router.get('/get-contests-active', (req, res) => apiController.getContestsActive(req, res));

router.get('/get-contests-archive', (req, res) => apiController.getContestsArchive(req, res));

router.get('/get-contests/:article', (req, res) => apiController.getContestByArticle(req, res));

router.post('/create-contest', (req, res) => apiController.createContest(req, res));

router.delete('/delete-contest', (req, res) => apiController.deleteContest(req, res));

router.put('/update-info', (req, res) => apiController.updateInfo(req, res));

router.put('/update-status', (req, res) => apiController.updateStatus(req, res));

router.post('/upload-file', (req, res) => apiController.uploadFile(req, res));

router.delete('/delete-file', (req, res) => apiController.deleteFile(req, res));

router.post('/personal-form', (req, res) => apiController.personalForm(req, res));

router.post('/team-form', (req, res) => apiController.teamForm(req, res));

router.get('/applications/:contest', (req, res) => apiController.getApplications(req, res));

router.put('/application/status', (req, res) => apiController.setApplicationStatus(req, res));

router.post('/auth/login', (req, res) => apiController.login(req, res));

router.post('/auth/register', (req, res) => apiController.register(req, res));

router.post('/auth/check', apiController.authenticateToken, (req, res) => apiController.authCheck(req, res));

module.exports = router;