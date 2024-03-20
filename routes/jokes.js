const express = require('express')
const router = express.Router()
const Joke = require('../models/joke')
const Author = require('../models/author')

// All Jokes Route
router.get('/', async (req, res) => {
  let query = Joke.find()
  if (req.query.jokeString != null && req.query.jokeString != '') {
    query = query.regex('jokeString', new RegExp(req.query.jokeString, 'i'))
  }
  try {
    const jokes = await query.exec()
    res.render('jokes/index', {
      jokes: jokes,
      searchOptions: req.query
    })
  } catch {
    res.redirect('/')
  }
})

// New Joke Route
router.get('/new', async (req, res) => {
  renderNewPage(res, new Joke())
})

// Create Joke Route
router.post('/', async (req, res) => {
  const joke = new Joke({
    jokeString: req.body.jokeString,
    author: req.body.author,
  })
  try {
    const newJoke = await joke.save()
    res.redirect(`jokes/${newJoke.id}`)
  } catch {
    renderNewPage(res, joke, true)
  }
})

// Show Joke Route
router.get('/:id', async (req, res) => {
  try {
    const joke = await Joke.findById(req.params.id)
                           .populate('author')
                           .exec()
    res.render('jokes/show', { joke: joke })
  } catch {
    res.redirect('/')
  }
})

// Edit Joke Route
router.get('/:id/edit', async (req, res) => {
  try {
    const joke = await Joke.findById(req.params.id)
    renderEditPage(res, joke)
  } catch {
    res.redirect('/')
  }
})

// Update Joke Route
router.put('/:id', async (req, res) => {
  let joke

  try {
    joke = await Joke.findById(req.params.id)
    joke.jokeString = req.body.jokeString
    joke.author = req.body.author
    await joke.save()
    res.redirect(`/joke/${joke.id}`)
  } catch {
    if (joke != null) {
      renderEditPage(res, joke, true)
    } else {
      redirect('/')
    }
  }
})

// Delete Joke Page
router.delete('/:id', async (req, res) => {
  let joke
  try {
    joke = await Joke.findById(req.params.id)
    await joke.remove()
    res.redirect('/jokes')
  } catch {
    if (joke!= null) {
      res.render('jokes/show', {
        joke: joke,
        errorMessage: 'Could not remove joke'
      })
    } else {
      res.redirect('/')
    }
  }
})

async function renderNewPage(res, joke, hasError = false) {
  renderFormPage(res, joke, 'new', hasError)
}

async function renderEditPage(res, joke, hasError = false) {
  renderFormPage(res, joke, 'edit', hasError)
}

async function renderFormPage(res, joke, form, hasError = false) {
  try {
    const authors = await Author.find({})
    const params = {
      authors: authors,
      joke: joke
    }
    if (hasError) {
      if (form === 'edit') {
        params.errorMessage = 'Error Updating Joke'
      } else {
        params.errorMessage = 'Error Creating Joke'
      }
    }
    res.render(`jokes/${form}`, params)
  } catch {
    res.redirect('/jokes')
  }
}

module.exports = router