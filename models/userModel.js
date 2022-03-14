const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')

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
    trim: true,
    select: false
  },
  passwordConfirm: {
    type: String,
    required: [true, 'A user must have a password confirm'],
    trim: true,
    validate: {
      validator: function(val) {
        return val === this.password
      },
      message: 'Passwords are not the same'
    }
  },
  passwordChangedAt: Date
})

userSchema.pre('save', async function(next) {
  // Only run this function if password was actually modified
  if (!this.isModified('password')) return next()

  // Hash the password with cost of 12
  this.password = await bcrypt.hash(this.password, 12)

  // Delete the passwordConfirm field
  this.passwordConfirm = undefined

  next()
})

// Create a new method available on the doc
userSchema.methods.isCorrectPassword = async function(candidatePassword, userPassword) {
  return await bcrypt.compare(candidatePassword, userPassword)
}

userSchema.methods.changedPasswordAfterToken = async function(jwtTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    )

    return jwtTimestamp < changedTimestamp
  }

  // False means password NOT changed
  return false;
}

const User = mongoose.model('User', userSchema)

module.exports = User
