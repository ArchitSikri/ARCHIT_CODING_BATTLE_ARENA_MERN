# Coding Battle MERN

Coding Battle is a full-stack MERN application for head-to-head coding matches. Players can create or join a room, prepare for a battle, solve a challenge, and view the result. Socket.IO handles real-time room and battle communication.

## Features

- User registration and cookie-based authentication
- Create, join, leave, and delete battle rooms
- Real-time rooms powered by Socket.IO
- Coding challenge editor powered by Monaco Editor
- Battle preparation, result, and profile screens
- MongoDB-backed users, questions, and battles
- Responsive UI with reusable glass panels and shared page layouts

## Tech Stack

- Frontend: React 19, Vite, React Router, Tailwind CSS
- UI: Lucide React, Remix Icon, GSAP, React Hot Toast
- Editor: Monaco Editor
- Backend: Node.js, Express 5
- Database: MongoDB with Mongoose
- Real-time communication: Socket.IO
- Authentication: JWT stored in an HTTP-only cookie

## Project Structure

```text
CODING_BATTLE_MERN/
├── client/                 # React/Vite frontend
│   ├── src/components/     # Shared layout and UI components
│   ├── src/context/        # User and Socket.IO context
│   ├── src/pages/          # Login, lobby, room, battle, result, profile
│   └── src/App.jsx         # Client routes
├── server/                 # Express/Socket.IO backend
│   ├── src/config/         # Database connection
│   ├── src/controllers/    # Request handlers
│   ├── src/middlewares/    # Authentication middleware
│   ├── src/models/         # Mongoose models
│   ├── src/routes/         # API routes
│   ├── src/services/       # Battle and question services
│   └── src/socket/         # Real-time event handling
├── .gitignore
└── README.md
```

## Prerequisites

- Node.js 18 or newer
- npm
- A local or hosted MongoDB database

## Quick Start

The client and server run as separate processes. Open two terminals from the repository root.

### 1. Start the backend

```bash
cd server
npm install
```

Create `server/.env`:

```env
PORT=9000
MONGO_URL=mongodb://127.0.0.1:27017/coding-battle
JWT_SECRET=replace_with_a_long_random_secret
```

Start the API and Socket.IO server:

```bash
npm run dev
```

The backend runs at `http://localhost:9000` by default. Verify it with `GET /`.

### 2. Start the frontend

In a second terminal:

```bash
cd client
npm install
```

Create `client/.env` if you want to override the default backend URL:

```env
VITE_BASE_URL=http://localhost:9000
```

Start Vite:

```bash
npm run dev
```

Open `http://localhost:5173` in your browser.

## Environment Variables

### Backend (`server/.env`)

| Variable | Purpose |
| --- | --- |
| `PORT` | Port used by Express and Socket.IO. Defaults to `9000`. |
| `MONGO_URL` | MongoDB connection string. |
| `JWT_SECRET` | Secret used to sign authentication cookies. |

### Frontend (`client/.env`)

| Variable | Purpose |
| --- | --- |
| `VITE_BASE_URL` | Backend URL used by Axios and Socket.IO. Defaults to `http://localhost:9000`. |

Never commit either `.env` file. Restart Vite after changing frontend environment variables.

## Frontend Routes

| Route | Screen |
| --- | --- |
| `/` | Login |
| `/register` | Registration |
| `/home` | Battle lobby |
| `/create-room` | Create a room |
| `/join-room` | Join a room with a code |
| `/room/:roomId` | Room lobby |
| `/start-battle/room/:roomId` | Battle preparation and coding screen |
| `/battle-winner/room/:roomId` | Battle result |
| `/profile` | Player profile |

## API Overview

Routes are available under both `/users` and `/api/user`, and battle routes are available under both `/battle` and `/api/battle`. Protected routes require the authentication cookie.

| Method | Path | Purpose |
| --- | --- | --- |
| `POST` | `/users/register` | Register a user |
| `POST` | `/users/login` | Log in and set the auth cookie |
| `GET` | `/users/profile` | Get the authenticated user's profile |
| `GET` | `/users/opponent/:socketId` | Get an opponent by socket ID |
| `GET` | `/users/logout` | Log out |
| `POST` | `/battle/create` | Create a battle room |
| `GET` | `/battle/all` | List battle rooms |
| `GET` | `/battle/room/:roomCode` | Get a room |
| `POST` | `/battle/join/:roomCode` | Join a room |
| `DELETE` | `/battle/delete/:id` | Delete a room |
| `POST` | `/battle/leave/:id` | Leave a room |
| `POST` | `/battle/start/:id` | Start a battle |
| `POST` | `/battle/complete/:id` | Complete a battle |

## Useful Commands

Run commands from the relevant package directory. There is no root `package.json`.

```bash
# frontend development
cd client
npm run dev

# frontend validation
npm run lint
npm run build

# backend development
cd ../server
npm run dev
```

## Current Limitations

- The backend does not currently include automated tests.
- Production deployments must configure CORS, MongoDB, cookies, and `VITE_BASE_URL` for the deployed domains.

## License

This project is currently for educational and demo use.
