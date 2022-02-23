const mongoose = require('mongoose')

const tourSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'A tour must have a name'],
    unique: true,
    trim: true // Auto trim whitespaces in the beginning/end
  },
  duration: {
    type: Number,
    required: [true, 'A tour must have a duration!']
  },
  maxGroupSize: {
    type: Number,
    required: [true, 'A tour must have a group size!']
  },
  difficulty: {
    type: String,
    required: [true, 'A tour must have a difficulty']
  },
  ratingsAverage: {
    type: Number,
    default: 4.5,
  },
  ratingsQuantity: {
    type: Number,
    default: 0,
  },
  price: {
    type: Number,
    required: [true, 'A tour must have a price'],
  },
  priceDiscount: Number,
  summary: {
    type: String,
    trim: true,
    required: [true, 'A tour must have a summary']
  },
  description: {
    type: String,
    trim: true
  },
  imageCover: {
    type: String,
    required: [true, 'A tour must have a cover image']
  },
  images: [String], // Images is an array of strings
  createdAt: {
    type: Date,
    default: Date.now(),
    select: false
  },
  startDates: [Date]
}, {
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
})

// Everytime the DB receives a get,
// the durationWeeks will be created virtually
// We use the regular function because
// we need the "this" keyword, so:
// In short, with arrow functions there are no binding of this.
// In regular functions the this keyword represented the object that called the function (the Schema = document)
tourSchema.virtual('durationWeeks').get(function() {
  return this.duration / 7
})

const Tour = mongoose.model('Tour', tourSchema)

module.exports = Tour
