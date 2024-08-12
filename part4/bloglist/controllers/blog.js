const blogRouter = require('express').Router()
const Blog = require('../models/blog')
blogRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({})
  response.json(blogs)
})

blogRouter.get('/:id', (request, response) => {
  Blog.findById(request.params.id).then(blog => {
    response.json(blog)
  })
})

blogRouter.post('', async (request, response) => {
  const newBlog = await Blog(request.body).save()
  response.status(201).json(newBlog)
})

module.exports = blogRouter