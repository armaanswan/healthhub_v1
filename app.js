require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const usersRoute = require('./routes/usersRoute')

const errorMiddleware = require('./middleware/errorMiddleware')
var cors = require('cors')

const app = express()

const PORT = process.env.PORT || 3000
const MONGO_URL = process.env.MONGO_URL
const FRONTEND = process.env.FRONTEND

var corsOptions = {
  origin: FRONTEND,
  optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}

app.use(cors(corsOptions))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

// routes

app.use('/api', usersRoute)

app.get('/', (req, res) => {
    res.send('Hello Node API')
})

app.use(errorMiddleware);


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
