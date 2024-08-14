const config = require('./utils/config')
const express = require('express')
const app = express()
require('express-async-errors')
const cors = require('cors')
const blogRouter = require('./controllers/blog')
const usersRouter = require('./controllers/users')
const mongoose = require('mongoose')

app.use(cors())
app.use(express.json())

mongoose.connect(config.MONGODB_URI)

app.use('/api/blogs', blogRouter)
app.use('/api/users', usersRouter)

module.exports = app