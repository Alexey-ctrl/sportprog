const { Model } = require('objection');
const knex = require('../knex');

Model.knex(knex);

class ApplicationMember extends Model{
    static get tableName() {
        return 'members';
    }
}
module.exports = ApplicationMember;