const Joi = require('joi')
const express = require('express')
const app = express()

app.use(express.json())

let courses = [
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

// GET all courses
app.get('/api/courses', (req, res) => {
  return res.status(200).send(courses)
})

// GET course by id
app.get('/api/courses/:id', (req, res) => {
  // Find the course with given id
  const course = courses.find(c => c.id === parseInt(req.params.id))

  // if course not found response 404
  if (!course) return res.status(404).send('Course not found!')

  // else send the course with 200
  return res.status(200).send(course)
})

// POST : Create a course
app.post('/api/courses', (req, res) => {
  // Never Trust Client Input :)
  // Data Validation
  // if(!req.body.name || req.body.name.length < 3){
  const { error } = validateCourse(req.body)
  if (error) return res.status(400).send(error.details[0].message)

  const course = {
    id: courses.length + 1,
    name: req.body.name
  }

  courses.push(course)

  return res.status(201).send(courses)
})

// PUT : Update a course
app.put('/api/courses/:id', (req, res) => {
  //  Data Validation Using Joi
  const { error } = validateCourse(req.body)
  if (error) return res.status(400).send(error.details[0].message)

  const course = courses.find(c => c.id === parseInt(req.params.id))
  if (!course) return res.status(404).send('Course not found!')

  course.name = req.body.name

  return res.send(courses)
})

// DELETE : Delete a Coursepost
app.delete('/api/courses/:id', (req, res) => {
  const course = courses.find(c => c.id === parseInt(req.params.id))
  if (!course) return res.status(404).send('Course not found!')

  courses.splice(req.params.id - 1, 1)
  return res.send(courses)
})

const PORT = process.env.PORT || 3000
console.log("PORT : ",PORT);
app.listen(PORT, () => {
  console.log(`App Listening to PORT ${PORT} `)
})

// Using Joi package to validate course object
function validateCourse (course) {
  const schema = Joi.object({
    name: Joi.string().min(3).required()
  })

  return schema.validate({ name: course.name })
}
