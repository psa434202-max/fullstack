import { useState, useEffect } from "react"
import personsService from "./services/persons"
import Filter from "./components/Filter"
import PersonForm from "./components/PersonForm"
import Persons from "./components/Persons"
import Notification from "./components/Notification"

function App() {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState("")
  const [newNumber, setNewNumber] = useState("")
  const [search, setSearch] = useState("")
  const [message, setMessage] = useState(null)
  const [messageType, setMessageType] = useState("success")

  useEffect(() => {
    personsService.getAll().then(data => {
      setPersons(data)
    })
  }, [])

  const showMessage = (text, type = "success") => {
    setMessage(text)
    setMessageType(type)
    setTimeout(() => {
      setMessage(null)
    }, 5000)
  }

  const addPerson = (event) => {
    event.preventDefault()

    const existing = persons.find(p => p.name === newName)

    if (existing) {
      const confirmUpdate = window.confirm(
        `${newName} is already added. Replace number?`
      )

      if (confirmUpdate) {
        const updatedPerson = { ...existing, number: newNumber }

        personsService
          .update(existing.id, updatedPerson)
          .then(returnedPerson => {
            setPersons(
              persons.map(p =>
                p.id !== existing.id ? p : returnedPerson
              )
            )
            showMessage(`Updated ${newName}`)
            setNewName("")
            setNewNumber("")
          })
          .catch(error => {
            showMessage(
              `${newName} was already removed from server`,
              "error"
            )
            setPersons(
              persons.filter(p => p.id !== existing.id)
            )
          })
      }

      return
    }

    const newPerson = { name: newName, number: newNumber }

    personsService
      .create(newPerson)
      .then(returnedPerson => {
        setPersons(persons.concat(returnedPerson))
        showMessage(`Added ${newName}`)
        setNewName("")
        setNewNumber("")
      })
      .catch(error => {
        showMessage("Failed to add person", "error")
      })
  }

  const handleDelete = (id) => {
    const person = persons.find(p => p.id === id)

    if (window.confirm(`Delete ${person.name}?`)) {
      personsService
        .remove(id)
        .then(() => {
          setPersons(persons.filter(p => p.id !== id))
          showMessage(`Deleted ${person.name}`)
        })
        .catch(error => {
          showMessage("Person already removed", "error")
        })
    }
  }

  const filteredPersons = persons.filter(person =>
    person.name.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div>
      <h2>Phonebook</h2>

      <Notification message={message} type={messageType} />

      <Filter
        search={search}
        handleSearch={(e) => setSearch(e.target.value)}
      />

      <h3>Add a new</h3>

      <PersonForm
        addPerson={addPerson}
        newName={newName}
        handleNameChange={(e) => setNewName(e.target.value)}
        newNumber={newNumber}
        handleNumberChange={(e) => setNewNumber(e.target.value)}
      />

      <h3>Numbers</h3>

      <Persons
        persons={filteredPersons}
        handleDelete={handleDelete}
      />
    </div>
  )
}

export default App