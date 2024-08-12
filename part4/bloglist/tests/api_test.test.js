const { test, after, beforeEach } = require('node:test')
const mongoose = require('mongoose')
const supertest = require('supertest')
const helper = require('./test_helper')
const app = require('../app')
const assert = require('node:assert/strict')

const api = supertest(app)

const Blog = require('../models/blog')

beforeEach(async () => {
  await Blog.deleteMany({})

  const blogObjects = helper.initialBlogs
    .map(blog => new Blog(blog))
  const promiseArray = blogObjects.map(blog => blog.save())
  await Promise.all(promiseArray)
})

test('a response returns every note in DB', async () => {
  const response = await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)

  assert.strictEqual(response.body.length, helper.initialBlogs.length)
})

test('if id is a response identifier', async () => {
  const response = await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
  response.body.forEach(blog => {
    assert(Object.hasOwn(blog, 'id'))
  })
})

test('if POST functions and adds proper content', async () => {
  const newBlog =   {
    title: 'How to make your landlord happy',
    author: 'Charles',
    url: 'http://hello.com',
    likes: 3
  }
  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const blogsAtEnd = await helper.blogsInDb()
  assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length + 1)

  const titles = blogsAtEnd.map(b => b.title)
  assert(titles.includes('How to make your landlord happy'))
})

test('if missing likes default value is 0', async () => {
  const newBlog =   {
    title: 'How to make your landlord happy',
    author: 'Charles',
    url: 'http://hello.com',
  }
  const response = await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  assert(response.body.likes === 0)

})

test('if missing title and url properites respond 400', async () => {
  const brokenBlogs =     [{
    author: 'Charles',
    url: 'http://hello.com',
    likes: 3
  },
  {
    title: 'How to evict your tenant',
    author: 'Brandi',
    likes: 8
  },
  {
    author: 'Charles',
    likes: 3
  }]

  const promiseArray = brokenBlogs.map((blog) => {
    return api
      .post('/api/blogs')
      .send(blog)
      .expect(400)
  })
  await Promise.all(promiseArray)
})

after(async () => {
  await mongoose.connection.close()
})



