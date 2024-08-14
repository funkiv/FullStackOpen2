const Blog = require('../models/blog')
const User = require('../models/user')

const initialBlogs = [
  {
    title: 'How to make your landlord happy',
    author: 'Charles',
    url: 'http://hello.com',
    likes: 3
  },
  {
    title: 'How to evict your tenant',
    author: 'Brandi',
    url: 'http://bye.com',
    likes: 8
  }
]

const initialUsers = [
  {
    username: 'club2727',
    name: 'Chuck',
    password: 'snowdojo'
  },
  {
    username: 'freddy54',
    name: 'Jack',
    password: 'watercircus'
  }
]

const nonExistingId = async () => {
  const blog = new Blog({ content: 'willremovethissoon' })
  await blog.save()
  await blog.deleteOne()

  return blog._id.toString()
}

const blogsInDb = async () => {
  const Blogs = await Blog.find({})
  return Blogs.map(blog => blog.toJSON())
}

const usersInDb = async () => {
  const Users = await User.find({})
  return Users.map(user => user.toJSON())
}

module.exports = {
  initialBlogs, nonExistingId, blogsInDb, initialUsers, usersInDb
}