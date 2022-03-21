const { Model } = require('objection');
const knex = require('../knex');

Model.knex(knex);

class ContestStatus extends Model{
    static get tableName() {
        return 'contest_statuses';
    }
}
module.exports = ContestStatus;