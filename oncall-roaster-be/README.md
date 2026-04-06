# OnCall Roster — Backend

A RESTful API for managing on-call schedules, teams, and users. Built with Express 5, TypeScript, MongoDB (Mongoose), and JWT authentication.

---

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Project Structure](#project-structure)
- [API Endpoints](#api-endpoints)
- [Data Models](#data-models)
- [Authentication](#authentication)
- [Scripts](#scripts)

---

## Features

- **JWT Authentication** — Secure login/register with 7-day token expiry and bcrypt password hashing.
- **Role-Based Authorization** — Admin-only endpoints for roster creation, team management, and user operations.
- **Team Management** — Create teams, assign members, and view team composition.
- **Roster Scheduling** — Weekly on-call rosters with primary and secondary assignments, unique per team per week.
- **Availability Tracking** — Users can toggle their availability for upcoming weeks.
- **Data Validation** — Prevents duplicate rosters, validates user existence, enforces unique constraints.

---

## Tech Stack

| Category       | Technology           |
| -------------- | -------------------- |
| Runtime        | Node.js              |
| Framework      | Express 5            |
| Language       | TypeScript           |
| Database       | MongoDB (Mongoose 9) |
| Auth           | JWT + bcrypt         |
| HTTP Client    | Axios                |
| Dev Server     | ts-node-dev          |

---

## Prerequisites

- **Node.js** >= 18
- **npm** or **yarn**
- **MongoDB** instance (local or cloud, e.g., MongoDB Atlas)

---

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/abhishekg625/oncall-roaster-fe.git
cd oncall-roaster-fe/oncall-roaster-be
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

Create a `.env` file in the root of `oncall-roaster-be/`:

```env
PORT=8000
MONGO_URI=mongodb://localhost:27017/oncall-roaster
JWT_SECRET=your_jwt_secret_here
```

### 4. Start the development server

```bash
npm run dev
```

The API will be running at **http://localhost:8000**.

### 5. Build for production

```bash
npm run build
```

### 6. Run the production build

```bash
npm start
```

---

## Environment Variables

| Variable      | Required | Default | Description                            |
| ------------- | -------- | ------- | -------------------------------------- |
| `PORT`        | No       | `5000`  | Port the server listens on             |
| `MONGO_URI`   | Yes      | —       | MongoDB connection string              |
| `JWT_SECRET`  | Yes      | —       | Secret key for signing JWT tokens      |

---

## Project Structure

```
src/
├── server.ts                # Entry point — connects DB & starts server
├── app.ts                   # Express app setup, middleware, routes
│
├── config/
│   └── db.ts                # MongoDB connection via Mongoose
│
├── controllers/
│   ├── auth.controller.ts   # Register, login, reset-password, get users
│   ├── roster.controller.ts # Create, get current/history rosters
│   └── team.controller.ts   # Create, get, update teams
│
├── middleware/
│   └── auth.middleware.ts   # JWT verification & user injection
│
├── models/
│   ├── User.ts              # User schema & model
│   ├── Team.ts              # Team schema & model
│   └── Roster.ts            # Roster schema & model
│
└── routes/
    ├── auth.routes.ts       # /api/auth/*
    ├── roster.routes.ts     # /api/roster/*
    ├── team.routes.ts       # /api/teams/*
    └── user.routes.ts       # /api/users/*
```

---

## API Endpoints

### Auth — `/api/auth`

| Method | Endpoint          | Auth | Description                                 |
| ------ | ----------------- | ---- | ------------------------------------------- |
| POST   | `/register`       | No   | Register a new user                         |
| POST   | `/login`          | No   | Login and receive JWT token                 |
| GET    | `/me`             | Yes  | Get current authenticated user              |
| PATCH  | `/reset-password` | No   | Reset password (email + current password)   |
| GET    | `/users`          | Yes  | Get all users (without passwords)           |

#### POST `/register` — Request Body

```json
{
  "userId": "john123",
  "name": "John Doe",
  "email": "john@example.com",
  "password": "secret123",
  "role": "user"
}
```

#### POST `/login` — Request Body

```json
{
  "userId": "john123",
  "password": "secret123"
}
```

#### PATCH `/reset-password` — Request Body

```json
{
  "email": "john@example.com",
  "currentPassword": "oldpass",
  "newPassword": "newpass123"
}
```

---

### Roster — `/api/roster`

| Method | Endpoint   | Auth  | Description                                |
| ------ | ---------- | ----- | ------------------------------------------ |
| POST   | `/`        | Admin | Create a weekly on-call roster             |
| GET    | `/current` | Yes   | Get current week's rosters (`?team=` filter) |
| GET    | `/history` | Yes   | Get all rosters sorted by date desc (`?team=` filter) |

#### POST `/` — Request Body

```json
{
  "weekStart": "2026-04-06",
  "weekEnd": "2026-04-12",
  "primary": "<user_object_id>",
  "secondary": "<user_object_id>",
  "team": "<team_object_id>"
}
```

> Primary and secondary must be different users.

---

### Teams — `/api/teams`

| Method | Endpoint       | Auth  | Description              |
| ------ | -------------- | ----- | ------------------------ |
| POST   | `/`            | Admin | Create a new team        |
| GET    | `/`            | Yes   | Get all teams            |
| GET    | `/:id`         | Yes   | Get a team by ID         |
| PATCH  | `/:id/members` | Admin | Update team members      |

#### POST `/` — Request Body

```json
{
  "name": "Platform Team",
  "members": ["<user_object_id_1>", "<user_object_id_2>"]
}
```

#### PATCH `/:id/members` — Request Body

```json
{
  "members": ["<user_object_id_1>", "<user_object_id_2>"]
}
```

---

### Users — `/api/users`

| Method | Endpoint                | Auth  | Description                  |
| ------ | ----------------------- | ----- | ---------------------------- |
| PATCH  | `/:userId/availability` | Yes   | Toggle availability flag     |
| PUT    | `/:userId`              | Admin | Update user (name, email, role) |
| DELETE | `/:userId`              | Admin | Delete a user                |

#### PATCH `/:userId/availability` — Request Body

```json
{
  "isAvailableNextWeek": false
}
```

---

## Data Models

### User

| Field                | Type    | Constraints                     |
| -------------------- | ------- | ------------------------------- |
| `userId`             | String  | Required, unique                |
| `name`               | String  | Required                        |
| `email`              | String  | Required, unique, lowercase     |
| `password`           | String  | Required, min 6 chars, hashed   |
| `role`               | String  | `"admin"` or `"user"` (default) |
| `isAvailableNextWeek`| Boolean | Default: `true`                 |
| `createdAt`          | Date    | Auto-generated                  |
| `updatedAt`          | Date    | Auto-generated                  |

### Team

| Field       | Type       | Constraints                |
| ----------- | ---------- | -------------------------- |
| `name`      | String     | Required, unique           |
| `members`   | ObjectId[] | References `User`          |
| `createdBy` | ObjectId   | References `User`          |
| `createdAt` | Date       | Auto-generated             |
| `updatedAt` | Date       | Auto-generated             |

### Roster

| Field       | Type     | Constraints                              |
| ----------- | -------- | ---------------------------------------- |
| `weekStart` | String   | Required (YYYY-MM-DD)                    |
| `weekEnd`   | String   | Required (YYYY-MM-DD)                    |
| `primary`   | ObjectId | References `User`                        |
| `secondary` | ObjectId | References `User`                        |
| `team`      | ObjectId | References `Team`                        |
| `createdBy` | ObjectId | References `User`                        |
| `createdAt` | Date     | Auto-generated                           |
| `updatedAt` | Date     | Auto-generated                           |

> **Unique index**: `{ weekStart, team }` — one roster per team per week.

---

## Authentication

- **Mechanism**: JWT (JSON Web Tokens)
- **Token Expiry**: 7 days
- **Password Hashing**: bcrypt with 10 salt rounds
- **How it works**:
  1. Client sends credentials to `/api/auth/login`.
  2. Server validates and returns a JWT token.
  3. Client includes `Authorization: Bearer <token>` in subsequent requests.
  4. The `protect` middleware verifies the token and attaches the user to the request.
- **Admin routes** check `req.user.role === "admin"` inside controllers and return `403 Forbidden` if not authorized.

---

## Scripts

| Command         | Description                                        |
| --------------- | -------------------------------------------------- |
| `npm run dev`   | Start dev server with hot reload (ts-node-dev)     |
| `npm run build` | Compile TypeScript to JavaScript (`dist/`)         |
| `npm start`     | Run the compiled production build (`dist/server.js`) |
