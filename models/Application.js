const { Model } = require('objection');
const knex = require('../knex');

Model.knex(knex);

class Application extends Model{
    static get tableName() {
        return 'applications';
    }

    static get relationMappings() {
        const Member = require('./ApplicationMember');

        return {
            members: {
                relation: Model.HasManyRelation,
                modelClass: Member,
                join: {
                    from: 'applications.id',
                    to: 'members.application_id'
                }
            }
        }
    }
}
module.exports = Application;