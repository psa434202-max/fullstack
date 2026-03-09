const mongoose = require('mongoose')

const url = process.env.MONGO_URL

mongoose.set('strictQuery', false)
mongoose.connect(url)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.log('Error connecting to MongoDB:', err))

const personSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    minlength: [3, 'Name must be at least 3 characters long']
  },
  number: {
    type: String,
    required: [true, 'Number is required'],
    validate: {
      validator: function(v) {
        // Format: XX-XXXXX or XXX-XXXXX, total length ≥ 8
        return /^\d{2,3}-\d{5,}$/.test(v)
      },
      message: props => `${props.value} is not a valid phone number!`
    }
  }
})

module.exports = mongoose.model('Person', personSchema)