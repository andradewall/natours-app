const mongoose = require('mongoose')

process.on('uncaughtException', err => {
  console.log('[server.js] ⚠️  Uncaught Exception! Shutting down...')
  console.error(err.name, err.message)
  process.exit(1)
})

require('dotenv').config({ path: './config.env' })

const app = require('./app')

const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
)
mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then(() => console.log('DB connection successful!'))
  //.catch(err => console.error(err))

const port = process.env.PORT || 3000
const server = app.listen(port, () => {
  console.log(`[server.js] Server running on port ${port}`)
});

process.on('unhandledRejection', err => {
  console.log('[server.js] ⚠️  Unhandled Rejection! Shutting down...')
  console.error(err.name, err.message)

  // Finish all pending requests before kill
  server.close(() => {
    process.exit(1)
  })
})
