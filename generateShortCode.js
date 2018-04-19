const database = require('./databaseInit')

const generateShortCode = async callback => {
  const lastShortedCode = await database.getLastShortID()
  const codeNum = parseInt(lastShortedCode, 36)
  const nextCodeNum = codeNum + 1
  const nextcode = nextCodeNum.toString(36)
  return nextcode
}

module.exports = generateShortCode
