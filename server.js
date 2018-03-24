const express = require('express')
const app = express()
const cors = require('cors')
const validUrl = require('valid-url')
const shortid = require('shortid')
const Database = require('./database')

app.use(cors())
const database = new Database()
database.init()

const BASE_URL = 'https://short-url.now.sh'
app.get('/new/:url(*)', (req, res) => {
  const { url } = req.params
  if (validUrl.isUri(url)) {
    const shortcode = shortid.generate()
    database.save(url, shortcode, err => {
      res.json({
        original_url: url,
        short_url: `${BASE_URL}/${shortcode}`,
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
    const shortcode = shortid.generate()
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
