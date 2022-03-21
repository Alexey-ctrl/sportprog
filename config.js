const config = {}

config.redisStore = {
    url: process.env.REDIS_STORE_URI,
    secret: process.env.REDIS_STORE_SECRET
}
config.dbConnect = {
    host : '127.0.0.1',
    user : 'sport',
    password : 'root',
    database : 'pgsport'
}
config.jwt = 'secret-key';

module.exports = config