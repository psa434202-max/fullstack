const jwt = require('jsonwebtoken')
const User = require('../models/user')

const tokenExtractor = (req, res, next) => {
  const auth = req.get('authorization')
  if (auth && auth.toLowerCase().startsWith('bearer ')) {
    req.token = auth.substring(7)
  } else {
    req.token = null
  }
  next()
}

const userExtractor = async (req, res, next) => {
  if (req.token) {
    try {
      const decodedToken = jwt.verify(req.token, process.env.SECRET)
      req.user = await User.findById(decodedToken.id)
    } catch (error) {
      req.user = null
    }
  } else {
    req.user = null
  }
  next()
}

module.exports = { tokenExtractor, userExtractor }