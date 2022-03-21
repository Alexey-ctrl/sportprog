const Knex = require('knex');
const config = require('./config');

const knex = Knex({
    client: 'pg',
    connection: config.dbConnect
});

module.exports = knex;