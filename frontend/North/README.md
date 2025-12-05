# NorthStaRs Frontend

The frontend for the NorthStaRs platform, built with Next.js 16, React 19, and Tailwind CSS.

## Table of Contents
- [Setup & Installation](#setup--installation)
- [Project Structure](#project-structure)
- [Key Components](#key-components)
- [State Management](#state-management)

## Setup & Installation

1.  **Navigate to the frontend directory:**
    ```bash
    cd frontend/North
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Run the development server:**
    ```bash
    npm run dev
    ```
    The application will start on `http://localhost:3000`.

## Project Structure

The project follows the Next.js App Router structure:

-   `src/app`: Contains the application routes and pages.
    -   `page.js`: The main dashboard/home page.
    -   `auth/`: Login and Signup pages.
    -   `code-editor/`: The coding environment page.
    -   `quiz/`: Quiz interface.
    -   `leaderboard/`: Global rankings page.
-   `src/components`: Reusable UI components.
    -   `Hero.jsx`: Main banner component.
    -   `Stats.jsx`: Statistics display cards.
    -   `ModuleCard.jsx`: Cards for different learning modules.
    -   `IntroPage.jsx`: Landing page for unauthenticated users.
-   `src/utils`: Utility functions and API helpers.
-   `src/statics`: Static components like `Navbar` and `Footer`.

## Key Components

### Code Editor (`src/app/code-editor`)
A full-featured code editor using CodeMirror 6. It supports multiple languages (C++, Java, Python, JavaScript), custom themes, and real-time code execution via the backend API.

### Quiz System (`src/app/quiz`)
An interactive quiz interface that presents questions, handles user selection, and submits attempts to the backend.

### Dashboard (`src/app/page.js`)
The central hub for users, displaying their stats, active modules, daily challenges, and achievements.

## State Management

State is primarily managed using React's built-in hooks (`useState`, `useEffect`) for local component state. Data fetching is handled via asynchronous functions in `src/app/utils/api.js`, which communicate with the backend API.
