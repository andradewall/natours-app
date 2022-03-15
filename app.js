const express = require('express')
const morgan = require('morgan')
const rateLimit = require('express-rate-limit')
const helmet = require('helmet')

const AppError = require('./utils/appError')
const globalErrorHandler = require('./controllers/errorController')
const tourRouter = require('./routes/tourRoutes')
const userRouter = require('./routes/userRoutes')

const app = express()

// ---------------------
// 1) COMMON MIDDLEWARES
// ---------------------

// Set security HTTP headers
app.use(helmet())

// Development logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'))
}

// Limit requests from same API
const oneHour = 60 * 60 * 1000
const limiter = rateLimit({
  max: 100,
  windowMs: oneHour,
  message: 'Too many requests from this IP, please try again in an hour'
})
app.use('/api', limiter)

// Body parser, reading data from body into req.body
app.use(express.json())

// Serving static files
app.use(express.static(`${__dirname}/public`))

// Test middleware
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString()
  next()
})

// ---------------------
// 2) ROUTES MIDDLEWARES
// ---------------------
app.use('/api/v1/tours', tourRouter)
app.use('/api/v1/users', userRouter)

// Handling all unhandled routes
app.all('*', (req, res, next) => {
  // Pass variable to the next middleware
  // If the var is an Error obj, all others middleware
  // will be skipped until reach global error middleware
  next(new AppError(`Can't find ${req.originalUrl} on this server :( `, 404))
})

// Global error middleware
app.use(globalErrorHandler)

// ---------
// 3) SERVER
// ---------
module.exports = app;
