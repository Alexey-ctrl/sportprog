const fs = require('fs');
const path = require('path');
const {slugify} = require('transliteration');
const transporter = require('../transporter');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const config = require('../config');
const Contests = require('../models/Contest');
const ContestFiles = require('../models/ContestFile');
const Application = require('../models/Application');
const Member = require('../models/ApplicationMember');
const User = require('../models/User');

module.exports.getContests = function (req, res) {
    Contests.query()
        .withGraphFetched('status')
        .orderBy('id', 'desc')
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            console.log(err);
            res.status(500).send(err);
        });
}

module.exports.getContestsActive = function (req, res) {
    Contests.query()
        .withGraphFetched('status')
        .whereNotIn('status_id', [1, 8])
        .orderBy('id', 'desc')
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            console.log(err);
            res.status(500).send(err);
        });
}

module.exports.getContestsArchive = function (req, res) {
    Contests.query()
        .withGraphFetched('status')
        .where('status_id', 8)
        .orderBy('id', 'desc')
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            console.log(err);
            res.status(500).send(err);
        });
}

module.exports.getContestByArticle = function (req, res) {
    Contests.query()
        .withGraphFetched('[status, files]')
        .where('article', req.params.article)
        .first()
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            console.log(err);
            res.status(500).send(err);
        });
}

module.exports.createContest = function (req, res) {
    const name = req.body.name;
    Contests.query()
        .insert({
            name: name,
            article: slugify(name)
        })
        .then((data) => {
            fs.mkdir(path.join(__dirname, '../', 'public', 'contests', data.article), function (err) {
                res.send({
                    message: 'success',
                    contest: data
                });
            });
        })
        .catch(err => {
            console.log(err);
            res.send({message: 'error'});
        });
}

module.exports.deleteContest = function (req, res) {
    Contests.query()
        .delete()
        .where('id', req.body.id)
        .then(() => res.send('success'))
        .catch(err => {
            console.log(err);
            res.send('error');
        });
}

module.exports.updateInfo = function (req, res) {
    const table = req.body.table;
    let info = {};
    info[table] = req.body.info;
    Contests.query()
        .patch(info)
        .where('id', req.body.id)
        .then(() => res.send('success'))
        .catch(err => {
            console.log(err);
            res.send('error');
        });
}

module.exports.updateStatus = function (req, res) {
    Contests.query()
        .patch({status_id: req.body.status})
        .where('id', req.body.id)
        .then(() => res.send('success'))
        .catch(err => {
            console.log(err);
            res.send('error');
        });
}

module.exports.uploadFile = function (req, res) {
    const contest = Object.keys(req.files)[0];
    const file = req.files[contest];

    const uploadPath = path.join(__dirname, '../', 'public', 'contests', contest, file.name);
    fs.writeFile(uploadPath, file.data, 'binary', function (err) {
        if (err) {
            return res.status(500).send(err);
        }
        ContestFiles.query()
            .insert({
                contest_article: contest,
                file: file.name
            })
            .then(data => {
                res.send({
                    message: 'success',
                    file: data
                });
            })
            .catch(err => {
                console.log(err);
                res.status(500).send(err);
            });
    });
}

module.exports.deleteFile = function (req, res) {
    fs.unlink(path.join(__dirname, '../', 'public', req.body.path),
        function (err) {
            if (err) {
                console.log(err);
                return res.status(500).send(err);
            }
            ContestFiles.query()
                .delete()
                .where('id', req.body.id)
                .then(() => {
                    res.send('success');
                })
                .catch(err => {
                    console.log(err);
                    res.send('error');
                });
        });
}

module.exports.personalForm = async function (req, res) {
    try {
        await sendProcessApplication(req.body.email, 'Ваша заявка подана на рассмотрение.');
        const application = await Application.query().insert({
            contest_article: req.body.article
        });

        await Member.query().insert({
            fio: req.body.fio,
            email: req.body.email,
            phone: req.body.phone,
            organization: req.body.organization,
            application_id: application.id
        });
        return res.send('ok');
    } catch (err) {
        console.log(err);
        return res.send('error');
    }
}

module.exports.teamForm = async function (req, res) {
    try {
        const application = await Application.query().insert({
            contest_article: req.body.article,
            team: req.body.team
        });

        let emails = [];
        req.body.members.forEach(member => {
            emails.push(member.email);
            Member.query().insert({
                ...member,
                application_id: application.id
            }).then();
        });
        emails = emails.join(', ')
        await sendProcessApplication(emails, 'Ваша заявка подана на рассмотрение.');

        return res.send('ok');
    } catch (err) {
        console.log(err);
        return res.send('error');
    }
}

module.exports.getApplications = function (req, res) {
    Application.query()
        .withGraphFetched('members')
        .where('contest_article', req.params.contest)
        .orderBy('id', 'desc')
        .then(data => res.send(data))
        .catch(err => {
            console.log(err);
            res.send({message: 'error'});
        });
}

module.exports.setApplicationStatus = function (req, res) {
    Application.query()
        .where('id', req.body.id)
        .update({status: req.body.status})
        .then(() => {
            Member.query()
                .select('email')
                .where('application_id', req.body.id)
                .then(data => {
                    const emails = data.map(e => e.email).join(', ');
                    let message = 'Ваша заявка принята.';

                    if (req.body.status == 2) {
                        message = req.body.message;
                    }
                    sendProcessApplication(emails, message);
                    res.send('ok');
                });
        });
}

module.exports.login = function (req, res) {
    User.query().where('login', req.body.login).first()
        .then(candidate => {
            if (!candidate) {
                return res.status(200).send('user is not exist');
            }
            const passwordDecrypt = bcrypt.compareSync(req.body.password, candidate.password);
            if (!passwordDecrypt) {
                return res.status(200).send('password error');
            }
            const token = jwt.sign({
                login: candidate.login,
                id: candidate.id
            }, config.jwt, {expiresIn: 60 * 60});
            res.status(200).send({
                token: 'Bearer ' + token
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).send(err);
        })
}

module.exports.register = function (req, res) {
    User.query().where('login', req.body.login).first()
        .then(candidate => {
            if (candidate) {
                return res.status(500).send('user exist');
            }
            const salt = bcrypt.genSaltSync(10);
            const cryptPassword = bcrypt.hashSync(req.body.password, salt);

            User.query().insert({
                login: req.body.login,
                password: cryptPassword
            }).catch(err => {
                console.log(err);
                res.status(500).send(err);
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).send(err);
        });
}

module.exports.authCheck = function (req, res) {
    res.status(200).send('success');
}

module.exports.authenticateToken = function (req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]

    if (token == null) return res.sendStatus(401)

    jwt.verify(token, config.jwt, (err, user) => {
        console.log(err)

        if (err) return res.sendStatus(403)

        req.user = user

        next()
    });
}

function sendProcessApplication(emails, message) {
    transporter.sendMail({
        from: '"Контест" <nodejs@example.com>',
        to: emails,
        subject: 'Заявка',
        text: message,
        html: message,
    });
}
