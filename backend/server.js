const express = require('express')
const morgan = require('morgan')
const cors = require('cors');
const cookieParser = require("cookie-parser");
require("dotenv").config();

const app = express()
app.use(cors({
  origin: true,
  credentials: true
}))
app.use(express.json())
app.use(morgan('dev'))
app.use(express.json())
app.use(cookieParser())

// Root route
app.get('/', (req, res) => {
  res.json({
    message: 'NorthStaRs API - Gamified Learning Platform',
    version: '1.0.0',
    features: [
      'User authentication and registration',
      'Quiz management system',
      'Badge earning system',
      'Leaderboard rankings',
      'User profiles and stats',
      'XP and level progression'
    ],
    endpoints: {
      auth: {
        login: 'POST /user/login',
        register: 'POST /user/register'
      },
      quiz: {
        getAll: 'GET /quiz',
        getById: 'GET /quiz/:id',
        submitAttempt: 'POST /quiz/:id/attempt'
      },
      profile: {
        getUser: 'GET /profile/:userId',
        updateUser: 'PUT /profile/:userId'
      },
      badges: {
        getAll: 'GET /badge',
        getUserBadges: 'GET /badge/user/:userId'
      },
      leaderboard: 'GET /leaderboard',
      code: {
        execute: 'POST /code/execute',
        submit: 'POST /code/submit/:problemId',
        getProblems: 'GET /code/problems',
        getProblem: 'GET /code/problems/:id',
        getSubmissions: 'GET /code/submissions/:userId',
        getLanguages: 'GET /code/languages'
      }
    },
    example: {
      login: {
        url: 'POST /user/login',
        body: { email: 'bob@example.com', password: 'password123' }
      },
      getQuiz: {
        url: 'GET /quiz'
      },
      getUserProfile: {
        url: 'GET /profile/{userId}'
      }
    }
  })
})

const getleaderboard = require('./routes/leaderboard/leaderboard.routes')
const authentication = require('./routes/user/user.auth.routes')
const quizRoutes = require('./routes/quiz/quiz.routes')
const badgeRoutes = require('./routes/badge/badge.routes')
const userProfileRoutes = require('./routes/user/user.profile.routes')
const codeRoutes = require('./routes/code/code.routes')

app.use('/leaderboard', getleaderboard)
app.use('/user', authentication)
app.use('/quiz', quizRoutes)
app.use('/badge', badgeRoutes)
app.use('/user', userProfileRoutes)
app.use('/code', codeRoutes)
app.listen('3005', () => {
  console.log('server is live on 3005')
})
