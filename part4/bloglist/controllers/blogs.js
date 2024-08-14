const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({})
    .populate('user', { username: 1, name: 1 })
  response.json(blogs)
})

blogsRouter.get('/:id', (request, response) => {
  Blog.findById(request.params.id).then(blog => {
    response.json(blog)
  })
})

blogsRouter.put('/:id', async (request, response) => {
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

blogsRouter.post('/', async (request, response) => {
  const savedBlog = request.body

  if(!savedBlog.title || !savedBlog.url){
    return response.status(400).json({ error: 'Title or URL missing' })
  }
  if(!savedBlog.likes) savedBlog.likes = 0

  const blogCreator = await User.findOne({})

  savedBlog.user = blogCreator._id


  const newBlog = await Blog(savedBlog).save()

  blogCreator.blogs = blogCreator.blogs.concat(newBlog._id)
  await blogCreator.save()

  response.status(201).json(newBlog)
})

blogsRouter.delete('/:id', async (request, response) => {
  const deletedBlog = await Blog.findByIdAndDelete(request.params.id)
  if (deletedBlog === null) {
    response.status(404).json({ error: 'blog not found' })
  } else {
    response.status(204).end()
  }
})

module.exports = blogsRouter