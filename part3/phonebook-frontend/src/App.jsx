// src/App.jsx
import { useState, useEffect } from 'react'
import personService from './services/persons'

function Notification({ message, type }) {
  if (!message) return null
  return (
    <div style={{ 
      color: type === 'error' ? 'red' : 'green',
      border: `1px solid ${type === 'error' ? 'red' : 'green'}`,
      padding: '10px',
      marginBottom: '15px'
    }}>
      {message}
    </div>
  )
}

function App() {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [notification, setNotification] = useState({ message: null, type: null })

  useEffect(() => {
    personService.getAll().then(initialPersons => setPersons(initialPersons))
  }, [])

  const showNotification = (message, type='success') => {
    setNotification({ message, type })
    setTimeout(() => setNotification({ message: null, type: null }), 3000)
  }

  const addPerson = (event) => {
    event.preventDefault()
    const existingPerson = persons.find(p => p.name === newName)

    if (existingPerson) {
      if (window.confirm(`${newName} is already added. Replace the old number with new one?`)) {
        personService.update(existingPerson._id, { ...existingPerson, number: newNumber })
          .then(updatedPerson => {
            setPersons(persons.map(p => p._id === existingPerson._id ? updatedPerson : p))
            showNotification(`Updated number for ${updatedPerson.name}`)
          })
          .catch(err => {
            showNotification(`Information of ${existingPerson.name} has already been removed`, 'error')
            setPersons(persons.filter(p => p._id !== existingPerson._id))
          })
      }
      return
    }

    personService.create({ name: newName, number: newNumber })
      .then(returnedPerson => {
        setPersons(persons.concat(returnedPerson))
        showNotification(`Added ${returnedPerson.name}`)
        setNewName('')
        setNewNumber('')
      })
      .catch(err => showNotification('Error adding person', 'error'))
  }

  const handleDelete = (id) => {
    const person = persons.find(p => p._id === id)
    if (window.confirm(`Delete ${person.name}?`)) {
      personService.remove(id)
        .then(() => {
          setPersons(persons.filter(p => p._id !== id))
          showNotification(`Deleted ${person.name}`)
        })
        .catch(err => showNotification('Error deleting person', 'error'))
    }
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={notification.message} type={notification.type} />
      
      <form onSubmit={addPerson}>
        <div>
          Name: <input value={newName} onChange={e => setNewName(e.target.value)} />
        </div>
        <div>
          Number: <input value={newNumber} onChange={e => setNewNumber(e.target.value)} />
        </div>
        <button type="submit">Add</button>
      </form>

      <h2>Numbers</h2>
      <ul>
        {persons.map(person =>
          <li key={person._id}>
            {person.name} {person.number}
            <button onClick={() => handleDelete(person._id)}>Delete</button>
          </li>
        )}
      </ul>
    </div>
  )
}

export default App