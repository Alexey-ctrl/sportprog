const { Model } = require('objection');
const knex = require('../knex');

Model.knex(knex);

class Contest extends Model
{
    static get tableName() {
        return 'contests';
    }

    static get relationMappings() {
        const ContestStatus = require('./ContestStatus');
        const ContestFiles = require('./ContestFile');

        return {
            status: {
                relation: Model.BelongsToOneRelation,
                modelClass: ContestStatus,
                join: {
                    from: 'contests.status_id',
                    to: 'contest_statuses.id'
                }
            },
            files: {
                relation: Model.HasManyRelation,
                modelClass: ContestFiles,
                join: {
                    from: 'contest_files.contest_article',
                    to: 'contests.article'
                }
            }
        }
    }
}
module.exports = Contest;