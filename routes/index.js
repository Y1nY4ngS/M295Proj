const express = require('express')
const router = express.Router()
const Joke = require('../models/joke')

router.get('/', async (req, res) => {
  let jokes
  try {
    jokes = await Joke.find().sort({ createdAt: 'desc' }).limit(10).exec()
  } catch {
    jokes = []
  }
  res.render('index', { jokes: jokes })
})

module.exports = router