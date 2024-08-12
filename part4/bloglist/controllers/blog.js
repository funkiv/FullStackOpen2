const blogRouter = require('express').Router()
const Blog = require('../models/blog')
const { nonExistingId } = require('../tests/test_helper')

blogRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({})
  response.json(blogs)
})

blogRouter.get('/:id', (request, response) => {
  Blog.findById(request.params.id).then(blog => {
    response.json(blog)
  })
})

blogRouter.put('/:id', async (request, response) => {
  const body = request.body

  const blog = {
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes
  }

  const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, blog, { new: true })
  response.json(updatedBlog)
})

blogRouter.post('', async (request, response) => {
  if(!request.body.title || !request.body.url){
    return response.status(400).json({ error: 'Title or URL missing' })
  }

  if(!request.body.likes) request.body.likes = 0

  const newBlog = await Blog(request.body).save()
  response.status(201).json(newBlog)
})

blogRouter.delete('/:id', async (request, response) => {
  const deletedBlog = await Blog.findByIdAndDelete(request.params.id)
  if (deletedBlog === null) {
    response.status(404).json({ error: 'blog not found' })
  } else {
    response.status(204).end()
  }
})

module.exports = blogRouter