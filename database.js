const mongoose = require('mongoose')
const db = mongoose
require('dotenv').config()
const url = `mongodb://${process.env.DB_USER}:${process.env.DB_PASSWORD}@ds263317.mlab.com:63317/urls`

class Database {
  init() {
    db.connect(url)
    db.connection.on('open', () => {
      console.log('connection to database done!')
    })
    db.connection.on('error', e => {
        console.log(`error ${e}`)
    })
    const urlSchema = mongoose.Schema({
      url: String,
      shortcode: String
    })

    this.URLModel = mongoose.model('URL', urlSchema);
  }

  save(url, shortcode, callback) {
    const URL = new this.URLModel({ url, shortcode })
    URL.save(err => {
      if (err) console.error(err)
      if (callback) {
        callback()
      }
    })
  }

  findURLbyShortCode(shortcode, callback) {
    this.URLModel.findOne({ shortcode }, 'url shortcode', (err, URL) => {
      if (callback) {
        callback(err, URL)
      }
    })
  }
}

module.exports = Database
