# OnCall Roster — Frontend

A React-based web application for managing on-call schedules, team members, and weekly rosters. Built with React 19, TypeScript, Vite, Tailwind CSS, and shadcn/ui.

---

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [Pages Overview](#pages-overview)
- [State Management](#state-management)
- [API Integration](#api-integration)
- [Theming](#theming)
- [Scripts](#scripts)

---

## Features

- **JWT Authentication** — Login, register, and password reset with persistent sessions via localStorage.
- **Role-Based Access** — Admin and user roles with protected routes.
- **Team Management** — Create teams and assign/remove members.
- **Roster Creation** — Build weekly on-call rosters with primary and secondary assignments.
- **Availability Tracking** — Toggle member availability for upcoming weeks.
- **Member Management** — Admin interface to add, edit, and delete users.
- **Customizable Themes** — Light/dark mode and color theme selection (orange/blue).
- **Responsive Layout** — Mobile-friendly sidebar and grid-based design.

---

## Tech Stack

| Category       | Technology                                |
| -------------- | ----------------------------------------- |
| Framework      | React 19                                  |
| Language       | TypeScript                                |
| Build Tool     | Vite 7                                    |
| Styling        | Tailwind CSS 4                            |
| UI Components  | shadcn/ui (Radix UI + Lucide icons)       |
| Routing        | React Router DOM v7                       |
| HTTP Client    | Axios                                     |
| Linting        | ESLint with React Hooks & Refresh plugins |

---

## Prerequisites

- **Node.js** >= 18
- **npm** or **yarn**
- Backend API running at `http://localhost:8000` (see [oncall-roaster-be](../oncall-roaster-be/README.md))

---

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/abhishekg625/oncall-roaster-fe.git
cd oncall-roaster-fe
```

### 2. Install dependencies

```bash
npm install
```

### 3. Start the development server

```bash
npm run dev
```

The app will be available at **http://localhost:5173**.

### 4. Build for production

```bash
npm run build
```

The output will be in the `dist/` directory.

### 5. Preview the production build

```bash
npm run preview
```

---

## Project Structure

```
src/
├── main.tsx                 # App entry point
├── App.tsx                  # Root component with routing
├── index.css                # Global styles & Tailwind imports
├── App.css                  # App-level styles
│
├── pages/                   # Route pages
│   ├── Login.tsx            # User login form
│   ├── Register.tsx         # User registration form
│   ├── ResetPassword.tsx    # Password reset form
│   ├── Dashboard.tsx        # Current week roster & history
│   ├── CreateRoster.tsx     # Create weekly on-call rosters
│   ├── Availability.tsx     # Toggle member availability
│   ├── Members.tsx          # Manage users (admin)
│   └── Teams.tsx            # Manage teams
│
├── components/              # Reusable components
│   ├── Header.tsx           # Top bar with current date
│   ├── Sidebar.tsx          # Navigation menu & user info
│   ├── Layout.tsx           # Page wrapper (sidebar + content)
│   ├── ProtectedRoute.tsx   # Auth guard for routes
│   ├── RosterTable.tsx      # Roster display table
│   ├── SettingsDialog.tsx   # Theme customization dialog
│   └── ui/                  # shadcn/ui primitives
│
├── context/                 # React context providers
│   ├── AuthContext.tsx       # Auth state & actions
│   ├── RoasterContext.tsx    # Roster data & operations
│   ├── TeamContext.tsx       # Teams data & operations
│   ├── UserContext.tsx       # Users data & operations
│   └── ThemeContext.tsx      # Theme preferences
│
├── services/
│   └── api.tsx              # Axios instance & interceptors
│
├── types/
│   └── roaster.tsx          # TypeScript type definitions
│
└── lib/
    └── utils.ts             # Utility functions (cn, etc.)
```

---

## Pages Overview

| Route              | Page            | Auth Required | Description                                          |
| ------------------ | --------------- | ------------- | ---------------------------------------------------- |
| `/login`           | Login           | No            | Sign in with userId & password                       |
| `/register`        | Register        | No            | Create account with name, email, role                |
| `/reset-password`  | ResetPassword   | No            | Reset password with email verification               |
| `/dashboard`       | Dashboard       | Yes           | View current week's rosters & history                |
| `/create-roster`   | CreateRoster    | Yes           | Create weekly schedules with team & assignee pickers |
| `/availability`    | Availability    | Yes           | Toggle team member availability for next week        |
| `/members`         | Members         | Yes           | Add, edit, delete team members (admin)               |
| `/teams`           | Teams           | Yes           | Create teams & manage memberships                    |

---

## State Management

The app uses React Context API for global state:

| Context           | Purpose                                                  |
| ----------------- | -------------------------------------------------------- |
| `AuthContext`     | Login, register, logout, token management                |
| `RosterContext`   | Fetch current/history rosters, create new rosters        |
| `TeamContext`     | CRUD operations on teams, fetch teams on mount           |
| `UserContext`     | User listing, availability toggle, user update/delete    |
| `ThemeContext`    | Dark/light mode, color theme selection, persistence      |

---

## API Integration

The frontend communicates with the backend via an Axios instance configured in `src/services/api.tsx`:

- **Base URL**: `http://localhost:8000/api`
- **Auth**: Bearer token automatically injected from localStorage on every request.

### Endpoints Used

| Method | Endpoint                         | Description                    |
| ------ | -------------------------------- | ------------------------------ |
| POST   | `/auth/login`                    | User login                     |
| POST   | `/auth/register`                 | User registration              |
| PATCH  | `/auth/reset-password`           | Password reset                 |
| GET    | `/auth/users`                    | Fetch all users                |
| POST   | `/roster`                        | Create a roster                |
| GET    | `/roster/current?team=`          | Get current week rosters       |
| GET    | `/roster/history?team=`          | Get roster history             |
| POST   | `/teams`                         | Create a team                  |
| GET    | `/teams`                         | Get all teams                  |
| PATCH  | `/teams/:id/members`             | Update team members            |
| PATCH  | `/users/:userId/availability`    | Toggle availability            |
| PUT    | `/users/:userId`                 | Update user details            |
| DELETE | `/users/:userId`                 | Delete a user                  |

---

## Theming

- **Dark/Light mode** toggle via `ThemeContext`
- **Color themes**: Orange and Blue accent colors
- Preferences are persisted in localStorage
- Built on Tailwind CSS with CSS variables for dynamic theming

---

## Scripts

| Command           | Description                        |
| ----------------- | ---------------------------------- |
| `npm run dev`     | Start Vite dev server (port 5173)  |
| `npm run build`   | TypeScript check + Vite build      |
| `npm run preview` | Preview production build locally   |
| `npm run lint`    | Run ESLint                         |
