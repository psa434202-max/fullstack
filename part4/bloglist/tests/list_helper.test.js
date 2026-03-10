const { test, describe } = require('node:test')
const assert = require('node:assert')
const listHelper = require('../utils/list_helper')

const blogs = [
  {
    _id: "1",
    title: "React patterns",
    author: "Michael Chan",
    url: "https://reactpatterns.com/",
    likes: 7
  },
  {
    _id: "2",
    title: "Go To Statement Considered Harmful",
    author: "Edsger W. Dijkstra",
    url: "http://example.com",
    likes: 5
  },
  {
    _id: "3",
    title: "Canonical string reduction",
    author: "Edsger W. Dijkstra",
    url: "http://example.com",
    likes: 12
  },
  {
    _id: "4",
    title: "Clean Code",
    author: "Robert C. Martin",
    url: "http://example.com",
    likes: 10
  }
]

test('dummy returns one', () => {
  const result = listHelper.dummy([])
  assert.strictEqual(result, 1)
})

describe('total likes', () => {
  test('of all blogs', () => {
    const result = listHelper.totalLikes(blogs)
    assert.strictEqual(result, 34)
  })
})

describe('favorite blog', () => {
  test('blog with most likes', () => {
    const result = listHelper.favoriteBlog(blogs)

    assert.deepStrictEqual(result, {
      _id: "3",
      title: "Canonical string reduction",
      author: "Edsger W. Dijkstra",
      url: "http://example.com",
      likes: 12
    })
  })
})

describe('most blogs', () => {
  test('author with most blogs', () => {
    const result = listHelper.mostBlogs(blogs)

    assert.deepStrictEqual(result, {
      author: "Edsger W. Dijkstra",
      blogs: 2
    })
  })
})

describe('most likes', () => {
  test('author with most likes', () => {
    const result = listHelper.mostLikes(blogs)

    assert.deepStrictEqual(result, {
      author: "Edsger W. Dijkstra",
      likes: 17
    })
  })
})