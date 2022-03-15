const fs = require('fs')
const mongoose = require('mongoose')
require('dotenv').config({ path: './config.env' })
const Tour = require('./../../models/tourModel')

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

// Reading JSON file
const tours = JSON.parse(fs.readFileSync(`${__dirname}/tours.json`, 'utf-8'))

// Importing data into database
const importData = async () => {
  try {
    await Tour.create(tours)
    console.log('Data successfully loaded!')
  } catch (err) {
    console.log('[error in import-dev-data.js]', err)
  }
  process.exit()
}


// Deleting all data from database
const deleteData = async () => {
  try {
    await Tour.deleteMany()
    console.log('Data successfully deleted!')
  } catch (err) {
    console.log('[error in import-dev-data.js]', err)
  }
  process.exit()
}

if (process.argv[2] === '--import') {
  importData()
} else if (process.argv[2] === '--delete') {
  deleteData()
}
