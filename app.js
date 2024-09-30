require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const usersRoute = require('./routes/usersRoute')
const app = express()

const PORT = process.env.PORT || 3000
const MONGO_URL = process.env.MONGO_URL

app.use(express.json())
app.use(express.urlencoded({ extended: false }))

// routes

app.use('/api', usersRoute)

app.get('/', (req, res) => {
    res.send('Hello Node API')
})


mongoose.connect(MONGO_URL)
  .then(() => {
    console.log('MongoDB Connected...')
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`)
    });
  })
  .catch((error) => {
    console.log(error);
  });
