// mongo.js
require('dotenv').config() // load environment variables from .env
const mongoose = require('mongoose')

// Get password from environment variable
const password = process.env.MONGO_PASSWORD

if (!password) {
  console.log('Error: Set your password in the MONGO_PASSWORD environment variable')
  console.log('Example (PowerShell): $env:MONGO_PASSWORD="yourpassword"')
  console.log('Example (Linux/macOS): export MONGO_PASSWORD=yourpassword')
  process.exit(1)
}

// Check command-line arguments
const args = process.argv
if (args.length !== 2 && args.length !== 4) {
  console.log('Usage:')
  console.log('  node mongo.js                   # list all entries')
  console.log('  node mongo.js "Name" "Number"   # add new entry')
  process.exit(1)
}

// MongoDB connection URI with your cluster
const url = `mongodb+srv://fullstack:${password}@cluster0.4cdbcmz.mongodb.net/phonebookApp?retryWrites=true&w=majority`

mongoose.set('strictQuery', false)

// Define schema and model
const personSchema = new mongoose.Schema({
  name: String,
  number: String,
})
const Person = mongoose.model('Person', personSchema)

// Main async function
const main = async () => {
  try {
    await mongoose.connect(url)

    if (args.length === 2) {
      // List all entries
      const persons = await Person.find({})
      console.log('phonebook:')
      persons.forEach(p => console.log(`${p.name} ${p.number}`))
    } else if (args.length === 4) {
      // Add new entry
      const name = args[2].trim()
      const number = args[3].trim()

      if (!name || !number) {
        console.log('Error: Name and number are required')
        process.exit(1)
      }

      const person = new Person({ name, number })
      await person.save()
      console.log(`added ${name} number ${number} to phonebook`)
    }
  } catch (err) {
    console.error('Error:', err.message)
  } finally {
    await mongoose.connection.close()
  }
}

main()