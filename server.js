const express = require('express')
const expressGraphQL = require('express-graphql')
const app = express()
const cors = require('cors')
const validUrl = require('valid-url')
const Database = require('./database')
const schema = require('./schema')

app.use(cors())
const database = new Database()
database.init()

const BASE_URL = 'https://short-url.now.sh'

const generateShortCode = async callback => {
  const lastShortedCode = await database.getLastShortID()
  const codeNum = parseInt(lastShortedCode, 36)
  const nextCodeNum = codeNum + 1
  const nextcode = nextCodeNum.toString(36)
  return nextcode
}

app.use('/graphql', expressGraphQL({
  schema,
  graphiql: true,
}))


app.get('/new/:url(*)', async (req, res) => {
  const { url } = req.params
  console.log(req.baseUrl)
  if (validUrl.isUri(url)) {
    const shortcode = await generateShortCode()
    database.save(url, shortcode, err => {
      res.json({
        original_url: url,
        short_url: `${req.baseUrl}/${shortcode}`,
      })
    })
  } else {
    res.json({
      error: 'Not a valid url'
    })
  }
})

app.get('/newshort/:url(*)', async (req, res) => {
  const { url } = req.params
  if (validUrl.isUri(url)) {
    const shortcode = await generateShortCode()
    database.save(url, shortcode, err => {
      res.json({
        original_url: url,
        shortcode: `${shortcode}`,
      })
    })
  } else {
    res.json({
      error: 'Not a valid url'
    })
  }
})


app.get('/shortcode/:shortcode', async (req, res) => {
  const { shortcode } = req.params
  try {
    const URL = await database.findURLbyShortCode(shortcode)
    if (URL !== null) {
      res.json({
        original_url: URL.url,
        shortcode: shortcode,
      })
    } else {
      res.json({
        error: 'URL not found'
      })
    }
  } catch(e) {
    res.json({
      error: 'Database Error'
    })
  }
})

app.get('/:shortcode', async (req, res) => {
  const { shortcode } = req.params
  try {
    const URL = await database.findURLbyShortCode(shortcode)
    if (URL === null) {
      res.json({
        error: 'URL not found'
      })
    } else {
      res.redirect(URL.url)
    }
  } catch(e) {
    res.send('Database Error')
  }
})

const port = 4567
app.listen(process.env.port || port, () => console.log(`listening on port ${port}!`))
