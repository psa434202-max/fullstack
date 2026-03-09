require('dotenv').config()
const express = require('express')
const cors = require('cors')
const path = require('path')
const Person = require('./models/person')

const app = express()
app.use(cors())
app.use(express.json())

// Serve frontend production build
app.use(express.static(path.join(__dirname, 'build')))

// GET all persons
app.get('/api/persons', (req, res, next) => {
  Person.find({})
    .then(persons => res.json(persons))
    .catch(err => next(err))
})

// GET person by ID
app.get('/api/persons/:id', (req, res, next) => {
  Person.findById(req.params.id)
    .then(person => {
      if (person) res.json(person)
      else res.status(404).end()
    })
    .catch(err => next(err))
})

// INFO route
app.get('/info', async (req, res, next) => {
  try {
    const count = await Person.countDocuments({})
    res.send(`<p>Phonebook has info for ${count} people</p><p>${new Date()}</p>`)
  } catch (err) {
    next(err)
  }
})

// POST (add new or update existing)
app.post('/api/persons', async (req, res, next) => {
  const { name, number } = req.body
  if (!name || !number) return res.status(400).json({ error: 'Name or number missing' })

  try {
    const existingPerson = await Person.findOne({ name })
    if (existingPerson) {
      const updatedPerson = await Person.findByIdAndUpdate(
        existingPerson._id,
        { number },
        { new: true, runValidators: true, context: 'query' }
      )
      return res.json(updatedPerson)
    }

    const person = new Person({ name, number })
    const savedPerson = await person.save()
    res.json(savedPerson)
  } catch (err) {
    next(err)
  }
})

// DELETE person
app.delete('/api/persons/:id', (req, res, next) => {
  Person.findByIdAndRemove(req.params.id)
    .then(() => res.status(204).end())
    .catch(err => next(err))
})

// PUT (update number)
app.put('/api/persons/:id', (req, res, next) => {
  const { number } = req.body
  Person.findByIdAndUpdate(
    req.params.id,
    { number },
    { new: true, runValidators: true, context: 'query' }
  )
    .then(updatedPerson => res.json(updatedPerson))
    .catch(err => next(err))
})

// Serve frontend for any unknown route (for Vite/React routing)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'))
})

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.message)
  if (err.name === 'CastError') return res.status(400).send({ error: 'malformatted id' })
  if (err.name === 'ValidationError') return res.status(400).json({ error: err.message })
  next(err)
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => console.log(`Server running on port ${PORT}`))