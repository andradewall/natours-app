const mongoose = require('mongoose')
const validator = require('validator')

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'A user must have a name'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'A user must have an email'],
    unique: true,
    lowercase: true,
    trim: true,
    validate: [validator.isEmail, 'Please provide a valid email']
  },
  photo: {
    type: String,
    trim: true
  },
  password: {
    type: String,
    required: [true, 'A user must have a password'],
    minlength: 8,
    trim: true
  },
  passwordConfirm: {
    type: String,
    required: [true, 'A user must have a password confirm'],
    trim: true,
    validate: {
      validator: function(val) {
        return val === this.password
      },
      message: 'Password confirm must be equal to password'
    }
  }
})

const User = mongoose.model('User', userSchema)

module.exports = User
