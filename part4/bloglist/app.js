require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const blogsRouter = require('./controllers/blogs')
const usersRouter = require('./controllers/users')
const loginRouter = require('./controllers/login')
const middleware = require('./utils/middleware')

const app = express()

mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.log('Error connecting to MongoDB:', err))

app.use(express.json())

// Middleware
app.use(middleware.tokenExtractor)

// Routes
app.use('/api/blogs', middleware.userExtractor, blogsRouter)
app.use('/api/users', usersRouter)
app.use('/api/login', loginRouter)

app.get('/', (req, res) => {
  res.send('<h1>Bloglist Backend Running</h1><p>Use /api/blogs, /api/users, /api/login</p>')
})

module.exports = app