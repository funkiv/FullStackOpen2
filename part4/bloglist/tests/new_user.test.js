const { test, after, beforeEach, describe } = require('node:test')
const mongoose = require('mongoose')
const supertest = require('supertest')
const helper = require('./test_helper')
const app = require('../app')
const assert = require('node:assert/strict')

const api = supertest(app)

const User = require('../models/user')

describe('when a user is initally saved', () => {

  beforeEach(async () => {
    await User.deleteMany({})

    await User.insertMany(helper.initialUsers)
  })

  test('a response returns every User in DB', async () => {
    const response = await api
      .get('/api/users')
      .expect(200)
      .expect('Content-Type', /application\/json/)

    assert.strictEqual(response.body.length, helper.initialUsers.length)
  })
  describe('different instances of invalid users', () => {
    test('a username with 2 characters', async () => {

      const invalidUsername =   {
        username: 'cl',
        name: 'Chaz',
        password: 'rockgarden'
      }

      const response = await api
        .post('/api/users')
        .send(invalidUsername)
        .expect(400)
        .expect('Content-Type', /application\/json/)

      console.log(response.body)
    })

    test('a password with 2 characters', async () => {

      const invalidUsername =   {
        username: 'jonathan57',
        name: 'John',
        password: 'ro'
      }

      const response = await api
        .post('/api/users')
        .send(invalidUsername)
        .expect(400)
        .expect('Content-Type', /application\/json/)

      console.log(response.body)
    })
    test('an existing username', async () => {

      const invalidUsername =   {
        username: 'club2727',
        name: 'John',
        password: 'rockgarden'
      }

      const response = await api
        .post('/api/users')
        .send(invalidUsername)
        .expect(400)
        .expect('Content-Type', /application\/json/)

      console.log(response.body)
    })
  })


  after(async () => {
    await mongoose.connection.close()
  })
})