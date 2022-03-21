const Contest = require('../models/Contest');
const contestStatus = require('../models/ContestStatus');

module.exports.editPage = function (req, res) {
    res.render('contests', {title: 'Управление соревнованиями', checkAuth: true});
}

module.exports.editContestPage = function (req, res) {
    contestStatus.query().then(data => {
        res.render('contestEdit', {
            title: req.params.article,
            statuses: data,
            checkAuth: true
        });
    });
}

module.exports.adminPage = function (req, res) {
    res.render('admin', {
        title: 'Управление',
        checkAuth: true
    });
}

module.exports.contestInfoPage = function (req, res) {
    Contest.query()
        .where('article', req.params.contest).first()
        .then(data => {
            res.render('contestInfo', {
                title: data.name,
                view: data[req.params.info]
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).send(err);
        })
}

module.exports.archivePage = function (req, res) {
    res.render('archive', {title: 'Архив'});
}