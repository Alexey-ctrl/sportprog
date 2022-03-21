const Contest = require('../models/Contest');

module.exports.getNewForm = function (req, res) {
    res.render('applicationNew', {
        title: `Заявка на участие (${req.params.contest})`,
        contest: req.params.contest
    });
}

module.exports.getApplicationsContest = function (req, res) {
    res.render('applicationView', {
        title: `Заявки на участие ${req.params.contest}`,
        contest: req.params.contest,
        checkAuth: true
    });
}

module.exports.getApplications = function (req, res) {
    Contest.query()
        .then(data => {
            res.render('applications', {
                title: 'Заявки на участие',
                contests: data,
                checkAuth: true
            });
        });
}