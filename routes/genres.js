const express = require('express')
const router = express.Router()
const Joi = require('joi')
const mongoose = require('mongoose')
const config = require('config')

console.log(`config.get('db_Uri') : ${config.get('db_Uri')}`)

mongoose
  .connect(config.get('db_Uri'), {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => {
    console.log('Connected to mongoDB')
    console.log(new Date().toLocaleString('ta-IN'))
  })
  .catch(err => {
    console.error(err)
    process.exit(1)
  })

let genres = [
  {
    id: 1,
    name: 'Node'
  },
  {
    id: 2,
    name: 'Express'
  },
  {
    id: 3,
    name: 'Mongo'
  }
]

// GET all genres
router.get('/', (req, res) => {
  return res.status(200).send(genres)
})

// GET genre by id
router.get('/:id', (req, res) => {
  // Find the genre with given id
  const genre = genres.find(c => c.id === parseInt(req.params.id))

  // if genre not found response 404
  if (!genre) return res.status(404).send('genre not found!')

  // else send the genre with 200
  return res.status(200).send(genre)
})

// POST : Create a genre
router.post('/', (req, res) => {
  // Never Trust Client Input :)
  // Data Validation
  // if(!req.body.name || req.body.name.length < 3){
  const { error } = validateGenre(req.body)
  if (error) return res.status(400).send(error.details[0].message)

  const genre = {
    id: genres.length + 1,
    name: req.body.name
  }

  genres.push(genre)

  return res.status(201).send(genres)
})

// PUT : Update a genre
router.put('/:id', (req, res) => {
  //  Data Validation Using Joi
  const { error } = validateGenre(req.body)
  if (error) return res.status(400).send(error.details[0].message)

  const genre = genres.find(c => c.id === parseInt(req.params.id))
  if (!genre) return res.status(404).send('genre not found!')

  genre.name = req.body.name

  return res.send(genres)
})

// DELETE : Delete a genre
router.delete('/:id', (req, res) => {
  const genre = genres.find(c => c.id === parseInt(req.params.id))
  if (!genre) return res.status(404).send('genre not found!')

  genres.splice(req.params.id - 1, 1)
  return res.send(genres)
})

// Using Joi package to validate genre object
function validateGenre (genre) {
  const schema = Joi.object({
    name: Joi.string().min(3).required()
  })

  return schema.validate({ name: genre.name })
}

module.exports = router
