const express = require('express')
const router = express.Router()
const Joi = require('joi')
const mongoose = require('mongoose')
const config = require('config')

console.log(`config.get('db_Uri') : ${config.get('db_Uri')}`)

const genreSchema = new mongoose.Schema({
  name: String
})

const Genre = mongoose.model('Genre', genreSchema)

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

// let genres = [
//   {
//     id: 1,
//     name: 'Node'
//   },
//   {
//     id: 2,
//     name: 'Express'
//   },
//   {
//     id: 3,
//     name: 'Mongo'
//   }
// ]

// GET all genres
router.get('/', async (req, res) => {
  const genres = await Genre.find().sort('name')
  return res.status(200).send(genres)
})

// GET genre by id
router.get('/:id', async (req, res) => {
  // Find the genre with given id
  // const genres = genres.find(c => c.id === parseInt(req.params.id))
  const genre = await Genre.findById(req.params.id)

  // if genre not found response 404
  if (!genre) return res.status(404).send('genre not found!')

  // else send the genre with 200
  console.log('genre : ', genre)
  console.log('POST type of :', typeof genre)
  console.log('Strin type of :', genre.toString())
  console.log('Joson type of :', JSON.stringify(genre))

  return res.status(200).send(genre)
})

// POST : Create a genre
router.post('/', async (req, res) => {
  // Never Trust Client Input :)
  // Data Validation
  // if(!req.body.name || req.body.name.length < 3){

  const { error } = validateGenre(req.body)
  if (error) return res.status(400).send(error.details[0].message)

  const genre = await new Genre({
    name: req.body.name
  }).save()

  // genres.push(genre)
  await genre.save()

  console.log('genre POST :', genre)
  console.log('POST type of :', typeof genre)

  return res.status(201).send(genre)
})

// PUT : Update a genre
router.put('/:id', async (req, res) => {
  //  Data Validation Using Joi
  const { error } = validateGenre(req.body)
  if (error) return res.status(400).send(error.details[0].message)

  // genre.name = req.body.name
  const genre = await Genre.findByIdAndUpdate(
    req.params.id,
    {
      name: req.body.name
    },
    { new: true }
  )

  if (!genre) return res.status(404).send('genre not found!')

  return res.status(202).send(genre)
})

// DELETE : Delete a genre
router.delete('/:id', async (req, res) => {
  const genre = await Genre.findByIdAndRemove(req.params.id)
  if (!genre) return res.status(404).send('genre not found!')

  return res.status(200).send(genre)
})

// Using Joi package to validate genre object
function validateGenre (genre) {
  const schema = Joi.object({
    name: Joi.string().min(3).required()
  })

  return schema.validate({ name: genre.name })
}

module.exports = router
