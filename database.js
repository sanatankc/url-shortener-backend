const mongoose = require('mongoose')
const db = mongoose
require('dotenv').config()
const url = process.env.DB_URL

class Database {
  constructor() {
    this.getLastShortID = this.getLastShortID.bind(this)
  }

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

  async findURLbyShortCode(shortcode) {
    const URL = await this.URLModel.findOne({ shortcode }, 'url shortcode').exec()
    return URL
  }

  getLastShortID(callback) {
    this.URLModel
      .findOne({}, 'shortcode')
      .sort({ $natural: -1 })
      .limit(1)
      .exec((err, last) => {
        if (last) {
          callback(last.shortcode)
        } else {
          callback(-1)
        }
    })
  }
}

module.exports = Database
