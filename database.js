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

  async save(url, shortcode, callback) {
    const URL = new this.URLModel({ url, shortcode })
    await URL.save()
      .catch(err => {
        console.error(err)
      })
  }

  async findURLbyShortCode(shortcode) {
    console.log(this.URLModel)
    const URL = await this.URLModel.findOne({ shortcode }, 'url shortcode').exec()
    return URL
  }

  async getLastShortID(callback) {
    const lastShortedURL = await this.URLModel
      .findOne({}, 'shortcode')
      .sort({ $natural: -1 })
      .limit(1)
      .exec()

    if (lastShortedURL) {
      return lastShortedURL.shortcode
    } else {
      return -1
    }
  }
}

module.exports = Database
