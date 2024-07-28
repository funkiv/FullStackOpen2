const blogRouter = require('express').Router()
const Blog = require('../models/blog')
blogRouter.get('/', (request, response) => {
  Blog
    .find({})
    .then(blogs => {
      response.json(blogs)
    })
})

blogRouter.get('/:id', (request, response) => {
  Blog.findById(request.params.id).then(blog => {
    response.json(blog)
  })
})

blogRouter.post('', (request, response) => {
  const blog = new Blog(request.body)

  blog
    .save()
    .then(result => {
      response.status(201).json(result)
    })
})

module.exports = blogRouter