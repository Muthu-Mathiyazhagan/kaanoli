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
  return res.send(courses)
})

// GET course by id
app.get('/api/courses/:id', (req, res) => {
  const course = courses.find(c => c.id === parseInt(req.params.id))
  return res.send(course)
})

// POST : Create a course
app.post('/api/courses', (req, res) => {
  const course = {
    id: courses.length + 1,
    name: req.body.name
  }

  courses.push(course)
  return res.send(courses)
})

// PUT : Update a course
app.put('/api/courses/:id', (req, res) => {
  const course = courses.find(c => c.id === parseInt(req.params.id))
  course.name = req.body.name

  return res.send(courses)
})

// DELETE : Delete a Course
app.delete('/api/courses/:id', (req, res) => {
  courses.splice(req.params.id - 1, 1)
  return res.send(courses)
})

app.listen(3000, () => {
  console.log('App Listening to PORT 3000')
})
