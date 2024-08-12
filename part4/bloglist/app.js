const config = require('./utils/config')
const express = require('express')
const app = express()
// require('express-async-errors')
const cors = require('cors')
const blogRouter = require('./controllers/blog')
const mongoose = require('mongoose')

app.use(cors())
app.use(express.json())

mongoose.connect(config.MONGODB_URI)

app.use('/api/blogs', blogRouter)

module.exports = app