# 🌟 NorthStaRs

> **Master Coding through Gamified Learning**

Welcome to **NorthStaRs**, a cutting-edge educational platform designed to transform the way users learn programming. By blending rigorous technical content with engaging gamification mechanics, NorthStaRs makes the journey from novice to architect both fun and rewarding.

---

## 📖 Table of Contents
- [Project Overview](#-project-overview)
- [Architecture](#-architecture)
- [Key Features](#-key-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [API Documentation](#-api-documentation)
- [Contributing](#-contributing)

---

## 🔭 Project Overview

NorthStaRs is more than just a quiz app; it's a comprehensive learning ecosystem. Users can:
-   **Learn**: Dive into structured modules covering various computer science topics.
-   **Practice**: Solve real coding problems in an integrated IDE.
-   **Compete**: Climb the global leaderboards and earn achievements.
-   **Track**: Monitor progress with detailed statistics and visual analytics.

The platform is built to be scalable, secure, and highly interactive, providing a seamless experience across devices.

---

## 🏗 Architecture

NorthStaRs follows a modern **Client-Server** architecture:

1.  **Frontend (The "North")**: A responsive Single Page Application (SPA) built with **Next.js**. It handles all user interactions, rendering, and state management.
2.  **Backend (The Core)**: A robust RESTful API built with **Express.js**. It manages business logic, authentication, and data processing.
3.  **Database**: A relational **MySQL** database managed via **Prisma ORM**, storing everything from user profiles to complex coding problems.

```mermaid
graph TD
    User[User Device] <-->|HTTPS| Frontend[Next.js Frontend]
    Frontend <-->|REST API| Backend[Express.js Backend]
    Backend <-->|Prisma| DB[(MySQL Database)]
    Backend <-->|Execution| Piston[Code Execution Engine]
```

---

## ✨ Key Features

### 🔐 Secure Authentication
-   **JWT-Based**: Stateless authentication using JSON Web Tokens.
-   **Secure Storage**: Passwords are hashed using `bcrypt` before storage.
-   **Role-Based Access**: Granular permissions for users and admins.

### 🎮 Gamification Engine
-   **XP System**: Earn Experience Points (XP) for every quiz passed and problem solved.
-   **Leveling**: Progress from "Novice" to "Architect" as you gain XP.
-   **Streaks**: Daily login rewards to encourage consistency.
-   **Badges**: Unlockable achievements for specific milestones (e.g., "Bug Hunter", "Speedster").

### 💻 Integrated Code Editor
-   **Multi-Language Support**: Write and run code in Python, JavaScript, C++, and Java.
-   **Real-Time Execution**: Code is sent to a secure sandbox for execution, with output returned instantly.
-   **Syntax Highlighting**: Powered by **CodeMirror 6** for a premium developer experience.
-   **Test Cases**: Automated validation against hidden test cases to ensure correctness.

### 📚 Interactive Learning Modules
-   **Quizzes**: Timed multiple-choice questions with instant feedback.
-   **Daily Challenges**: A new problem every day to keep skills sharp.
-   **Progress Tracking**: Visual graphs showing activity and improvement over time.

---

## 🛠 Tech Stack

### Frontend
-   **Framework**: [Next.js 16](https://nextjs.org/) (React 19)
-   **Styling**: [Tailwind CSS](https://tailwindcss.com/)
-   **Icons**: [Lucide React](https://lucide.dev/)
-   **Editor**: [CodeMirror](https://codemirror.net/)
-   **HTTP Client**: Axios

### Backend
-   **Runtime**: [Node.js](https://nodejs.org/)
-   **Framework**: [Express.js](https://expressjs.com/)
-   **ORM**: [Prisma](https://www.prisma.io/)
-   **Database**: MySQL
-   **Auth**: JSON Web Tokens (JWT), Bcrypt
-   **Logging**: Morgan, Winston

---

## 📂 Project Structure

Here's a high-level look at the codebase organization:

```
NorthStaRs/
├── backend/                # Server-side code
│   ├── controllers/        # Request handlers (logic)
│   ├── routes/             # API route definitions
│   ├── prisma/             # Database schema and migrations
│   ├── middleware/         # Auth and error handling middleware
│   └── server.js           # Entry point
│
├── frontend/North/         # Client-side code
│   ├── src/
│   │   ├── app/            # Next.js App Router pages
│   │   │   ├── auth/       # Login/Signup pages
│   │   │   ├── code-editor/# IDE page
│   │   │   └── quiz/       # Quiz interface
│   │   ├── components/     # Reusable UI components
│   │   └── utils/          # API helpers and constants
│   └── public/             # Static assets
│
└── README.md               # You are here!
```

---

## 🚀 Getting Started

Ready to run NorthStaRs locally? Follow these steps:

### Prerequisites
-   **Node.js** (v18 or higher)
-   **MySQL** (Running locally or via Docker)
-   **Git**

### Step 1: Clone the Repository
```bash
git clone https://github.com/portneon/NorthStaRs.git
cd NorthStaRs
```

### Step 2: Setup Backend
1.  Navigate to the backend folder:
    ```bash
    cd backend
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Create a `.env` file and configure your database URL:
    ```env
    DATABASE_URL="mysql://user:password@localhost:3306/northstars"
    JWT_SECRET="supersecretkey"
    PORT=3005
    ```
4.  Run database migrations:
    ```bash
    npx prisma migrate dev
    ```
5.  Start the server:
    ```bash
    npm start
    ```

### Step 3: Setup Frontend
1.  Open a new terminal and navigate to the frontend folder:
    ```bash
    cd frontend/North
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Start the development server:
    ```bash
    npm run dev
    ```

### Step 4: Launch 🚀
Open your browser and visit `http://localhost:3000`. You're ready to start learning!

---

## 📡 API Documentation

The backend exposes a rich set of RESTful endpoints. Here are a few key ones:

-   **POST** `/user/register`: Create a new account.
-   **POST** `/user/login`: Log in and receive a JWT.
-   **GET** `/quiz`: Fetch all available quizzes.
-   **POST** `/code/execute`: Run code in the sandbox.
-   **GET** `/leaderboard`: See the top players.

For a full list, check the [Backend README](./backend/README.md).

---

## 🤝 Contributing

We welcome contributions! Whether it's fixing a bug 🐛, adding a feature ✨, or improving documentation 📝.

1.  **Fork** the repo on GitHub.
2.  **Clone** your fork locally.
3.  Create a **new branch** (`git checkout -b feature/cool-feature`).
4.  **Commit** your changes.
5.  **Push** to your fork.
6.  Submit a **Pull Request**.

---

*Built with ❤️ by the NorthStaRs Team*
