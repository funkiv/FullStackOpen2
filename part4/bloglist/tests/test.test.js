const { test, describe } = require('node:test')
const assert = require('node:assert')
const listHelper = require('../utils/list_helper')
const helper = require('./test_helper')

describe('total likes', () => {

  //Test cases for totalLikes
  test('when list has only one blog, equals the likes of that', () => {
    const result = listHelper.totalLikes(helper.listWithOneBlog)
    assert.strictEqual(result, 5)
  })

  test('of empty list is zero', () => {
    const result = listHelper.totalLikes(helper.listWithNoBlog)
    assert.strictEqual(result, 0)
  })

  test('when list has only one blog equals the likes of that', () => {
    const result = listHelper.totalLikes(helper.listWithOneBlog)
    assert.strictEqual(result, 5)
  })

  test('of a bigger list is calculated right', () => {
    const result = listHelper.totalLikes(helper.listWithManyBlogs)
    assert.strictEqual(result, 36)
  })
})

describe('favorite blog', () => {

  test('of one blog',() => {
    const result = listHelper.favoriteBlog(helper.listWithOneBlog)
    assert.deepStrictEqual(result,
      {
        title: 'Go To Statement Considered Harmful',
        author: 'Edsger W. Dijkstra',
        likes: 5
      })
  })

  test('of no blog',() => {
    const result = listHelper.favoriteBlog(helper.listWithNoBlog)
    assert.deepStrictEqual(result, null)
  })

  test('of many blogs',() => {
    const result = listHelper.favoriteBlog(helper.listWithManyBlogs)
    assert.deepStrictEqual(result,
      {
        title: 'Canonical string reduction',
        author: 'Edsger W. Dijkstra',
        likes: 12,
      })
  })
})

describe('Author with most blogs', () => {
  test('of Author with the most blogs', () => {
    const result = listHelper.mostBlogs(helper.listWithManyBlogs)
    assert.deepStrictEqual(result,
      {
        author: 'Robert C. Martin',
        blogs: 3
      }
    )
  })

  test('of no blogs', () => {
    const result = listHelper.mostBlogs(helper.listWithNoBlog)
    assert.deepStrictEqual(result, { error: 'no blogs found' }
    )
  })
})

describe('Author with most likes on all blogs', () => {
  test('of Author with most likes on all blogs', () => {
    const result = listHelper.mostLikes(helper.listWithManyBlogs)
    assert.deepStrictEqual(result, { author: 'Edsger W. Dijkstra', likes: 17 })
  })

  test('of no blogs', () => {
    const result = listHelper.mostLikes(helper.listWithNoBlog)
    assert.deepStrictEqual(result, { error: 'no blogs found' }
    )
  })
})
