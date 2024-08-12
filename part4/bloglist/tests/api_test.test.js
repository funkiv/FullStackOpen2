const { test, after, beforeEach, describe } = require('node:test')
const mongoose = require('mongoose')
const supertest = require('supertest')
const helper = require('./test_helper')
const app = require('../app')
const assert = require('node:assert/strict')

const api = supertest(app)

const Blog = require('../models/blog')
describe('when a blog is initally saved', () => {

  beforeEach(async () => {
    await Blog.deleteMany({})

    await Blog.insertMany(helper.initialBlogs)
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
  describe('when properties are missing', () => {

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
  })

  describe('when a blog is deleted', () => {
    test('when a single blog post is deleted', async () => {
      const savedBlog = await Blog.findOne()

      await api
        .delete(`/api/blogs/${savedBlog._id}`)
        .expect(204)
    })

    test('when blog id does not exist', async () => {
      const nonExistentId = await helper.nonExistingId()

      await api
        .delete(`/api/blogs/${nonExistentId}`)
        .expect(404)
        .expect('Content-Type', /application\/json/)
    })
  })

  describe('when updating properties of a blog', () => {
    test('if likes PUTS correctly', async () => {
      const savedBlog = await Blog.findOne()
      const newLikes = savedBlog.likes + 1

      const response = await api
        .put(`/api/blogs/${savedBlog._id}`)
        .send({ likes: newLikes })
        .expect(200)
        .expect('Content-Type', /application\/json/)

      assert.strictEqual(newLikes, response.body.likes)
    })
  })

})

after(async () => {
  await mongoose.connection.close()
})



