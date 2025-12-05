# NorthStaRs Backend

The backend for the NorthStaRs platform, built with Node.js, Express, and Prisma.

## Table of Contents
- [Setup & Installation](#setup--installation)
- [Environment Variables](#environment-variables)
- [Database Schema](#database-schema)
- [API Documentation](#api-documentation)

## Setup & Installation

1.  **Navigate to the backend directory:**
    ```bash
    cd backend
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Set up the database:**
    Ensure you have a MySQL database running. Update the `.env` file with your database credentials (see below).
    Then run the Prisma migrations:
    ```bash
    npx prisma migrate dev
    ```

4.  **Seed the database (Optional):**
    To populate the database with initial data:
    ```bash
    npm run seed
    ```

5.  **Start the server:**
    ```bash
    npm start
    ```
    The server will start on `http://localhost:3005` (or the port specified in your `.env`).

## Environment Variables

Create a `.env` file in the `backend` directory with the following variables:

```env
DATABASE_URL="mysql://USER:PASSWORD@HOST:PORT/DATABASE"
JWT_SECRET="your_jwt_secret_key"
PORT=3005
```

## Database Schema

The database is managed using Prisma. Key models include:

-   **User**: Stores user account information, XP, level, and stats.
-   **Quiz**: Represents a quiz with a title, difficulty, and questions.
-   **Question**: A question belonging to a quiz.
-   **Option**: An answer option for a question.
-   **Attempt**: specific user's attempt at a quiz.
-   **Achievement**: Badges/achievements that users can earn.
-   **UserAchievement**: Links users to earned achievements.
-   **Leaderboard**: Tracks user rankings based on XP.
-   **CodeProblem**: Coding challenges for users to solve.
-   **CodeSubmission**: User submissions for coding problems.

For the full schema, refer to `prisma/schema.prisma`.

## API Documentation

### Base URL
`http://localhost:3005`

### Authentication (`/user`)
-   `POST /user/register`: Register a new user.
-   `POST /user/login`: Authenticate an existing user.

### User Profile (`/user`)
-   `GET /user/:userId`: Get user profile details.
-   `PUT /user/:userId`: Update user profile.
-   `GET /user/:userId/modules`: Get modules active for the user.
-   `GET /user/stats/:userId`: Get user statistics.

### Quizzes (`/quiz`)
-   `GET /quiz`: List all quizzes.
-   `GET /quiz/:id`: Get details of a specific quiz.
-   `POST /quiz/:id/attempt`: Submit a quiz attempt.

### Code (`/code`)
-   `POST /code/execute`: Run code against test cases.
-   `POST /code/submit/:problemId`: Submit a solution for a problem.
-   `GET /code/problems`: List all coding problems.
-   `GET /code/problems/:id`: Get a specific coding problem.
-   `GET /code/submissions/:userId`: Get a user's past submissions.

### Leaderboard (`/leaderboard`)
-   `GET /leaderboard`: Get the current leaderboard rankings.

### Badges (`/badge`)
-   `GET /badge`: List all available badges.
-   `GET /badge/user/:userId`: Get badges earned by a user.
