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

const shortId = callback => {
  database.getLastShortID(lastShortedId => {
    const idNum = parseInt(lastShortedId, 36)
    const nextIdNum = idNum + 1
    const nextID = nextIdNum.toString(36)
    callback(nextID)
  })
}

app.use('/graphql', expressGraphQL({
  schema,
  graphiql: true,
}))


app.get('/new/:url(*)', (req, res) => {
  const { url } = req.params
  if (validUrl.isUri(url)) {
    shortId(shortcode => {
      database.save(url, shortcode, err => {
        res.json({
          original_url: url,
          short_url: `${req.baseUrl}/${shortcode}`,
        })
      })
    })
  } else {
    res.json({
      error: 'Not a valid url'
    })
  }
})

app.get('/newshort/:url(*)', (req, res) => {
  const { url } = req.params
  if (validUrl.isUri(url)) {
    shortId(shortcode => {
      database.save(url, shortcode, err => {
        res.json({
          original_url: url,
          shortcode: `${shortcode}`,
        })
      })
    })
  } else {
    res.json({
      error: 'Not a valid url'
    })
  }
})


app.get('/shortcode/:shortcode', (req, res) => {
  const { shortcode } = req.params
  database.findURLbyShortCode(shortcode, (err, URL) => {
    if (err || URL === null) {
      res.json({
        error: 'URL not found'
      })
    } else {
      res.json({
        original_url: URL.url,
        shortcode: shortcode,
      })
    }
  })
})

app.get('/:shortcode', (req, res) => {
  const { shortcode } = req.params
  database.findURLbyShortCode(shortcode, (err, URL) => {
    if (err || URL === null) {
      res.json({
        error: 'URL not found'
      })
    } else {
      res.redirect(URL.url)
    }
  })
})

const port = 4567
app.listen(process.env.port || port, () => console.log(`listening on port ${port}!`))
