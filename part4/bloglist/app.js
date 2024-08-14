const config = require('./utils/config')
const express = require('express')
const app = express()
require('express-async-errors')
const cors = require('cors')
const blogsRouter = require('./controllers/blogs')
const usersRouter = require('./controllers/users')
const mongoose = require('mongoose')

app.use(cors())
app.use(express.json())

mongoose.connect(config.MONGODB_URI)

app.use('/api/blogs', blogsRouter)
app.use('/api/users', usersRouter)

module.exports = app