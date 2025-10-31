# NorthStaRs Backend

Gamified learning platform API providing authentication, quizzes, badges, leaderboard, and user profiles.

## Features
- User authentication and registration
- Quiz management (list quizzes, get quiz by ID, submit attempts)
- Badge earning and retrieval (all badges, badges for a user)
- Leaderboard rankings
- User profiles and stats (get and update)
- CORS, JSON body parsing, request logging

## Base URL
- Local development: `http://localhost:3000`

## Endpoints

### Auth (`/user`)
- POST `/user/register` — Register a new user
- POST `/user/login` — Log in and receive credentials/token

### Quiz (`/quiz`)
- GET `/quiz` — Get all quizzes
- GET `/quiz/:id` — Get quiz by ID
- POST `/quiz/:id/attempt` — Submit a quiz attempt

### Profile (`/profile`)
- GET `/profile/:userId` — Get a user profile and stats
- PUT `/profile/:userId` — Update a user profile

### Badges (`/badge`)
- GET `/badge` — Get all available badges
- GET `/badge/user/:userId` — Get badges earned by a user

### Leaderboard (`/leaderboard`)
- GET `/leaderboard` — Get global leaderboard

## Quick Start

1) Install dependencies
```bash
cd backend
npm install
```

2) Environment
- Create a `.env` in `backend/` if needed and configure database/Prisma settings.

3) Run the server
```bash
npm start
# Server runs on http://localhost:3000
```



## Notes
- See `backend/server.js` for a summary and live index JSON at `GET /`.
- Input validation and error handling middleware exists in `backend/middleware/validation.js` and controllers.
