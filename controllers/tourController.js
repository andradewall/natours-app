const fs = require('fs')
const Tour = require('./../models/tourModel')

// Get data from file
// const tours = JSON.parse(
//   fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`)
// );

// exports.checkID = (req, res, next, val) => {
//   if (val * 1 > tours.length) {
//     return res.status(404).json({
//       status: 'fail',
//       message: 'Invalid ID',
//     });
//   }
//   next();
// };

exports.checkBody = (req, res, next) => {
  if (!req.body.price || !req.body.name) {
    return res.status(400).json({
      status: 'fail',
      message: 'Missing name or price'
    });
  }
  next()
}

exports.getAllTours = async (req, res) => {
  try {
    // BUILD QUERY

    // 1a) Filtering
    const queryObj = { ...req.query }
    const excludedFields = ['page', 'sort', 'limit', 'fields']
    excludedFields.forEach(el => delete queryObj[el])

    // 1b) Advanced filtering
    let queryStr = JSON.stringify(queryObj)
    // Replace the matched string with the string with $ in the beginning
    // RegEx:
    // match exactly (\b)
    // gte or gt or lte or lt
    // multiple match (/g)
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`)

    // Tour.find returns a Query obj
    let query = Tour.find(JSON.parse(queryStr))

    // Now query is a Query obj, so we can chain it

    // 2) Sorting
    if (req.query.sort) {
      const sortBy = req.query.sort.split(',').join(' ')
      query = query.sort(sortBy)
    } else {
      query = query.sort('-createdAt')
    }

    // 3) Field limiting
    if (req.query.fields) {
      const fields = req.query.fields.split(',').join(' ')
      query = query.select(fields)
    } else {
      query = query.select('-__v')
    }

    // 4) Pagination
    const page = req.query.page * 1 || 1
    const limit = req.query.limit * 1 || 100
    const skip = (page - 1) * limit

    query = query.skip(skip).limit(limit)

    if (req.query.page) {
      const numTours = await Tour.countDocuments()
      if (skip >= numTours) throw new Error('This page does not exist')
    }

    // EXECUTE QUERY
    const tours = await query;
    // query = Tour.find().sort().select().skip().limit()

    res.status(200).json({
      status: 'success',
      results: tours.length,
      data: {
        tours
      }
    })
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err
    })
  }
}

exports.getTour = async (req, res) => {
  try {
    const tour = await Tour.findById(req.params.id)
    // As reference: Tour.findOne({ __id: req.params.id })

    res.status(200).json({
      status: 'success',
      data: { tour }
    })
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: 'Tour not found'
    })
  }
}

exports.createTour = async (req, res) => {
  try {
    const newTour = await Tour.create(req.body)

    res.status(201).json({
      status: 'success',
      data: {
        tour: newTour
      }
    })
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: 'Invalid data sent!'
    })
  }
}

exports.updateTour = async (req, res) => {
  try {
    const tour = await Tour.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true, // Returns the doc after update was applied
        runValidators: true // Runs fields validators
      }
    )

    res.status(200).json({
      status: 'success',
      data: { tour }
    })
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err
    })
  }
}

exports.deleteTour = async (req, res) => {
  try {
    await Tour.findByIdAndDelete(req.params.id)

    res.status(204).json({
      status: 'success',
      data: null
    })
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err
    })
  }
}
