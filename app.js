const express = require('express')
const morgan = require('morgan')

const tourRouter = require('./routes/tourRoutes')
const userRouter = require('./routes/userRoutes')

const app = express()

// ---------------------
// 1) COMMON MIDDLEWARES
// ---------------------
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'))
}

app.use(express.json())
app.use(express.static(`${__dirname}/public`))

// ---------------------
// 2) ROUTES MIDDLEWARES
// ---------------------
app.use('/api/v1/tours', tourRouter)
app.use('/api/v1/users', userRouter)

// Handling all unhandled routes
app.all('*', (req, res, next) => {
  // res.status(404).json({
  //   status: 'fail',
  //   message: `Can't find ${req.originalUrl} on this server :( `
  // })

  const err = new Error(`Can't find ${req.originalUrl} on this server :( `)
  err.status = 'fail'
  err.statusCode = 404

  // Pass variable to the next middleware
  // If the var is an Error obj, all others middleware
  // will be skipped until reach global error middleware
  next(err)
})

// Global error middleware
app.use((err, req, res, next) => {
  err.statusCode = err.statusCode || 500
  err.status = err.status || 'error'

  res.status(err.statusCode).json({
    status: err.status,
    message: err.message
  })
})

// ---------
// 3) SERVER
// ---------
module.exports = app;
