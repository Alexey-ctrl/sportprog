const Contest = require('../models/Contest');

module.exports.homePage = function (req, res) {
    Contest.query().then(data => {
        res.render('index', {title: 'Главная', contests: data});
    });
}