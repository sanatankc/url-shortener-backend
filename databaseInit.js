const Database = require('./database')

const database = new Database()
database.init()

module.exports = database