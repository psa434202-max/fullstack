const { test, describe, beforeEach, after } = require('node:test')
const assert = require('node:assert')
const supertest = require('supertest')
const mongoose = require('mongoose')

const app = require('../app')
const Blog = require('../models/blog')

const api = supertest(app)

const initialBlogs = [
  { title: "First blog", author: "John", url: "http://example.com", likes: 5 },
  { title: "Second blog", author: "Jane", url: "http://example.com", likes: 10 }
]

beforeEach(async () => {
  await Blog.deleteMany({})
  for (const blog of initialBlogs) await new Blog(blog).save()
})

describe('GET /api/blogs', () => {
  test('blogs returned as json', async () => {
    await api.get('/api/blogs').expect(200).expect('Content-Type', /application\/json/)
  })

  test('correct number of blogs', async () => {
    const response = await api.get('/api/blogs')
    assert.strictEqual(response.body.length, initialBlogs.length)
  })

  test('identifier property is id', async () => {
    const response = await api.get('/api/blogs')
    assert(response.body[0].id !== undefined)
  })
})

describe('POST /api/blogs', () => {
  test('valid blog is added', async () => {
    const newBlog = { title: "New Blog", author: "Tester", url: "http://test.com", likes: 3 }
    await api.post('/api/blogs').send(newBlog).expect(201)
    const response = await api.get('/api/blogs')
    assert.strictEqual(response.body.length, initialBlogs.length + 1)
  })

  test('likes default to 0 if missing', async () => {
    const newBlog = { title: "No Likes", author: "Tester", url: "http://test.com" }
    const response = await api.post('/api/blogs').send(newBlog).expect(201)
    assert.strictEqual(response.body.likes, 0)
  })

  test('missing title returns 400', async () => {
    const newBlog = { author: "Tester", url: "http://test.com" }
    await api.post('/api/blogs').send(newBlog).expect(400)
  })

  test('missing url returns 400', async () => {
    const newBlog = { title: "No URL", author: "Tester" }
    await api.post('/api/blogs').send(newBlog).expect(400)
  })
})

describe('DELETE /api/blogs/:id', () => {
  test('deletes a blog', async () => {
    const blogsAtStart = await api.get('/api/blogs')
    const blogToDelete = blogsAtStart.body[0]
    await api.delete(`/api/blogs/${blogToDelete.id}`).expect(204)
    const blogsAtEnd = await api.get('/api/blogs')
    assert.strictEqual(blogsAtEnd.body.length, blogsAtStart.body.length - 1)
    assert(!blogsAtEnd.body.map(b => b.id).includes(blogToDelete.id))
  })
})

describe('PUT /api/blogs/:id', () => {
  test('updates likes of a blog', async () => {
    const blogsAtStart = await api.get('/api/blogs')
    const blogToUpdate = blogsAtStart.body[0]
    const updatedData = { likes: blogToUpdate.likes + 1 }
    const response = await api.put(`/api/blogs/${blogToUpdate.id}`).send(updatedData).expect(200)
    assert.strictEqual(response.body.likes, blogToUpdate.likes + 1)
  })
})

after(async () => {
  await mongoose.connection.close()
})