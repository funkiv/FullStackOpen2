const Blog = require('../models/blog')

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

const nonExistingId = async () => {
  const blog = new Blog({ content: 'willremovethissoon' })
  await blog.save()
  await blog.deleteOne()

  return blog._id.toString
}

const blogsInDb = async () => {
  const Blogs = await Blog.find({})
  return Blogs.map(blog => blog.toJSON())
}

module.exports = {
  initialBlogs, nonExistingId, blogsInDb
}