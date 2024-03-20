const mongoose = require('mongoose')

const jokeSchema = new mongoose.Schema({
  jokeString: {
    type: String,
    required: true
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Author'
  }
})


module.exports = mongoose.model('joke', jokeSchema)