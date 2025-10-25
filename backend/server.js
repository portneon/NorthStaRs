const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
require("dotenv").config();

const app = express()
app.use(cors())
app.use(express.json())
app.use(morgan('dev'))
app.use(express.json())

const getleaderboard = require('./routes/leaderboard/leaderboard.routes')
const authentication = require('./routes/user/user.auth.routes')
app.use('/leaderboard',getleaderboard)
app.use('/user',authentication)
app.listen('3000', () => {
    console.log('server is live on 3000')
})
