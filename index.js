const genres = require('./routes/genres')
const morgan = require('morgan')
const express = require('express')
const app = express()
const log = require('./logger')
const auth = require('./auth')
const config = require('config')

app.use(express.json())
console.log('NODE_ENV : ', process.env.NODE_ENV)
console.log('PORT : ', process.env.PORT)
console.log('App. get : ', app.get('env'))

if (app.get('env') == 'development' || 'test') {
  app.use(morgan('dev'))
}
app.use(express.static('public'))
app.use('/api/genres', genres)
app.use([log, auth]) // Multiple Middleware in Array Order 


console.log("config.get('PORT') : ", config.get('PORT'))
const PORT = config.get('PORT') || 3000
app.listen(PORT, () => {
  console.log(`App Listening to PORT ${PORT} `)
})
