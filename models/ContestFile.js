const { Model } = require('objection');
const knex = require('../knex');

Model.knex(knex);

class ContestFile extends Model{
    static get tableName() {
        return 'contest_files';
    }
}
module.exports = ContestFile;