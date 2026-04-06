# OnCall Roster

A full-stack on-call scheduling platform that helps teams manage weekly rosters, track member availability, and organize on-call rotations with ease.

---

## Overview

OnCall Roster lets you create teams, assign primary and secondary on-call engineers per week, and give members control over their availability — all behind a clean, role-based dashboard.

**Key highlights:**

- JWT authentication with admin/user roles
- Weekly roster creation with primary & secondary on-call assignments
- Team and member management
- Availability toggling for upcoming weeks
- Dark/light mode with customizable color themes

---

## Tech Stack

| Layer    | Stack                                              |
| -------- | -------------------------------------------------- |
| Frontend | React 19, TypeScript, Vite, Tailwind CSS, shadcn/ui |
| Backend  | Express 5, TypeScript, MongoDB, Mongoose, JWT       |

---

## Project Structure

```
.
├── oncall-roaster/       # Frontend (React + Vite)
└── oncall-roaster-be/    # Backend  (Express + MongoDB)
```

---

## Quick Start

### 1. Clone the repo

```bash
git clone https://github.com/abhishekg625/oncall-roaster-fe.git
cd oncall-roaster-fe
```

### 2. Start the backend

```bash
cd oncall-roaster-be
npm install
```

Create a `.env` file:

```env
PORT=8000
MONGO_URI=mongodb://localhost:27017/oncall-roaster
JWT_SECRET=your_jwt_secret_here
```

```bash
npm run dev
```

### 3. Start the frontend

```bash
cd oncall-roaster
npm install
npm run dev
```

Open **http://localhost:5173** in your browser.

---

## Detailed Docs

- [Frontend README](oncall-roaster/README.md) — pages, routing, state management, theming
- [Backend README](oncall-roaster-be/README.md) — API endpoints, models, auth flow, env setup
