const mongoose = require('mongoose')
const slugify = require('slugify')
// const User = require('./userModel')
// const validator = require('validator')

const tourSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'A tour must have a name'],
    unique: true,
    trim: true, // Auto trim whitespaces in the beginning/end
    maxlength: [40, 'A tour name must have less or equal then 40 characters'],
    minlength: [10, 'A tour name must have more or equal then 10 characters'],
    // validate: [validator.isAlpha, 'Tour name must only contain characters']
  },
  slug: String,
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
    required: [true, 'A tour must have a difficulty'],
    enum: {
      values: ['easy', 'medium', 'difficult'],
      message: 'Difficulty is either: easy, medium or difficult'
    }
  },
  ratingsAverage: {
    type: Number,
    default: 4.5,
    min: [1, 'Rating must be above 1'],
    max: [5, 'Rating must be below 5']
  },
  ratingsQuantity: {
    type: Number,
    default: 0,
  },
  price: {
    type: Number,
    required: [true, 'A tour must have a price'],
  },
  priceDiscount: {
    type: Number,
    validate: {
      validator: function(val) {
        // The this keyword only points to doc
        // on new doc creation
        return val < this.price
      },
      message: 'Discount price ({VALUE}) should be below regular price'
    }
  },
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
  startDates: [Date],
  secretTour: {
    type: Boolean,
    default: false
  },
  startLocation: {
    // GeoJSON
    type: {
      type: String,
      default: 'Point',
      enum: ['Point']
    },
    coordinates: [Number],
    address: String,
    description: String
  },
  locations: [
    {
      type: {
        type: String,
        default: 'Point',
        enum: ['Point']
      },
      coordinates: [Number],
      address: String,
      description: String,
      day: Number
    }
  ],
  guides: [
    {
      type: mongoose.Schema.ObjectId,
      ref: 'User'
    }
  ]
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

// DOCUMENT MIDDLEWARE
// Runs only before .save() and .create()
tourSchema.pre('save', function(next) {
  this.slug = slugify(this.name, { lower: true })
  next()
})

// Embbeding tour guides before save new tour
// tourSchema.pre('save', async function(next) {
//   const guidesPromises = this.guides.map(async id => await User.findById(id))
//   this.guides = await Promise.all(guidesPromises)
//   next()
// })

// QUERY MIDDLEWARE
// Runs before every function with starts with "find"
tourSchema.pre(/^find/, function(next) {
  this.find({ secretTour: { $ne: true } })

  this.start = Date.now()
  next()
})

tourSchema.pre(/^find/, function(next) {
  this.populate({
    path: 'guides',
    select: '-__v -passwordChangedAt'
  })

  next()
})

tourSchema.post(/^find/, function(docs, next) {
  console.log(`Query took ${Date.now() - this.start} milliseconds!`)
  console.log(docs)
  next()
})

// AGGREGATION MIDDLEWARE
tourSchema.pre('aggregate', function(next) {

  // Add an obj in the start of the array with .unshift()
  this.pipeline().unshift({ $match: { secretTour: { $ne: true } } })

  console.log(this.pipeline())
  next()
})

const Tour = mongoose.model('Tour', tourSchema)

module.exports = Tour
