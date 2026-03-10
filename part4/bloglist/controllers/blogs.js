const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const jwt = require('jsonwebtoken')

// GET all blogs
blogsRouter.get('/', async (req, res) => {
  const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 })
  res.json(blogs)
})

// POST new blog (requires token)
blogsRouter.post('/', async (req, res) => {
  const body = req.body
  const user = req.user

  if (!user) return res.status(401).json({ error: 'token missing or invalid' })
  if (!body.title || !body.url) return res.status(400).json({ error: 'title or url missing' })

  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes || 0,
    user: user._id
  })

  const savedBlog = await blog.save()
  user.blogs = user.blogs.concat(savedBlog._id)
  await user.save()
  res.status(201).json(await savedBlog.populate('user', { username: 1, name: 1 }))
})

// DELETE blog (only by creator)
blogsRouter.delete('/:id', async (req, res) => {
  const user = req.user
  if (!user) return res.status(401).json({ error: 'token missing or invalid' })

  const blog = await Blog.findById(req.params.id)
  if (!blog) return res.status(404).end()

  if (blog.user.toString() !== user._id.toString()) {
    return res.status(401).json({ error: 'only creator can delete blog' })
  }

  await Blog.findByIdAndRemove(req.params.id)
  res.status(204).end()
})

// UPDATE likes
blogsRouter.put('/:id', async (req, res) => {
  const body = req.body
  const updatedBlog = await Blog.findByIdAndUpdate(
    req.params.id,
    { likes: body.likes },
    { new: true, runValidators: true, context: 'query' }
  ).populate('user', { username: 1, name: 1 })

  if (updatedBlog) res.json(updatedBlog)
  else res.status(404).end()
})

module.exports = blogsRouter