const mongoose = require('mongoose')
const Joke = require('./joke')

const authorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  }
})

authorSchema.pre('remove', function(next) {
  Joke.find({ author: this.id }, (err, js) => {
    if (err) {
      next(err)
    } else if (jokes.length > 0) {
      next(new Error('This author has jokes still'))
    } else {
      next()
    }
  })
})

module.exports = mongoose.model('Author', authorSchema)