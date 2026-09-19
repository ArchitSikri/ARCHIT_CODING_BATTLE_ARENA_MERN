# Coding Battle MERN

Coding Battle is a full-stack MERN application for head-to-head coding matches. Users can register, create or join a room, prepare for a battle, solve a coding challenge, and view the result. Socket.IO provides the real-time room and battle communication.

## Tech Stack

- Frontend: React 19, Vite, React Router
- UI: Tailwind CSS, Lucide React, Remix Icon, GSAP
- Code editor: Monaco Editor
- Backend: Node.js, Express.js
- Database: MongoDB with Mongoose
- Real-time communication: Socket.IO
- Authentication: JWT + cookie-based auth

## Features

- User registration and login
- Create and join battle rooms
- Battle preparation and arena screens
- Coding challenge editor experience
- Battle winner and profile screens
- Real-time battle rooms with Socket.IO
- MongoDB-backed users, questions, and battles
- Responsive page layouts with a shared background and transparent panels

## Project Structure

```bash
CODING_BATTLE_MERN/
├── client/
│   ├── src/
│   │   ├── components/
│   │   │   ├── layout/       # Page frame, background, header, GSAP entrance
│   │   │   └── ui/           # Glass panels, buttons, inputs, headings
│   │   ├── constants/        # Shared frontend constants
│   │   ├── pages/            # Login, lobby, room, arena, result, profile
│   │   ├── App.jsx           # Client routes
│   │   └── main.jsx          # React entry point
│   ├── public/
│   ├── package.json
│   ├── vite.config.js
│   └── index.html
├── server/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middlewares/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── services/
│   │   └── socket/
│   ├── App.js
│   ├── server.js
│   └── package.json
├── .gitignore
└── README.md
```

## Frontend Routes

| Route | Screen |
| --- | --- |
| `/` | Login |
| `/register` | Registration |
| `/home` | Battle lobby |
| `/create-room` | Create a private room |
| `/join-room` | Join a room with a code |
| `/room/:roomId` | Room lobby |
| `/start-battle/room/:roomId` | Battle preparation |
| `/battle-arena/room/:roomId` | Coding arena |
| `/battle-winner/room/:roomId` | Battle result |
| `/profile` | Player profile |

The frontend keeps reusable presentation pieces in `client/src/components/`. `PageFrame` owns the shared background, overlay, header, and GSAP entrance animation, while the smaller UI components handle panels, buttons, headings, and inputs.

## Prerequisites

Before running the app, make sure you have installed:

- Node.js 18 or newer
- npm
- A MongoDB database, local or hosted

## Quick Start

The frontend and backend run as separate processes. Open two terminals from the repository root.

### 1. Configure and start the backend

```bash
cd server
npm install
```

Create `server/.env`:

```env
PORT=5000
MONGO_URL=mongodb://127.0.0.1:27017/coding-battle
JWT_SECRET=replace_with_a_long_random_secret
```

Then start the API and Socket.IO server:

```bash
npm run dev
```

The backend is available at `http://localhost:5000`. Its health check is `GET /`.

### 2. Configure and start the frontend

In the second terminal:

```bash
cd client
npm install
```

Create `client/.env`:

```env
VITE_BASE_URL=http://localhost:5000
```

Start Vite:

```bash
npm run dev
```

Open `http://localhost:5173` in a browser.

## Environment Variables

### Backend (`server/.env`)

- `PORT`: port used by the Express and Socket.IO server.
- `MONGO_URL`: MongoDB connection string.
- `JWT_SECRET`: secret used to sign authentication cookies. Set this in every environment; the code fallback is intended only for local development.

### Frontend (`client/.env`)

- `VITE_BASE_URL`: base URL of the backend, without a trailing slash.

Restart Vite after changing frontend environment variables. Never commit either `.env` file.

## API Overview

The backend accepts JSON requests and uses an HTTP-only authentication cookie. User and battle routes are available under the prefixes below:

| Method | Path | Purpose |
| --- | --- | --- |
| `POST` | `/users/register` | Register a user |
| `POST` | `/users/login` | Log in and set the auth cookie |
| `GET` | `/users/profile` | Get the authenticated user's profile |
| `GET` | `/users/logout` | Log out |
| `POST` | `/battle/create` | Create a battle room |
| `GET` | `/battle/all` | List battle rooms |
| `GET` | `/battle/room/:roomCode` | Get a room |
| `POST` | `/battle/join/:roomCode` | Join a room |
| `POST` | `/battle/start/:id` | Start a battle |
| `POST` | `/battle/complete/:id` | Complete a battle |

The user routes are also mounted under `/api/user`, and the battle routes under `/api/battle`. Authenticated requests must include credentials.

## Common Commands

Run commands from the relevant package directory. There is no root `package.json`.

```bash
# backend
cd server
npm install
npm run dev

# frontend
cd client
npm install
npm run dev

# frontend validation
cd client
npm run lint
npm run build

```bash
## Project Structure

```text
CODING_BATTLE_MERN/
├── client/                 # React/Vite frontend
│   ├── src/components/     # Shared layout and UI components
│   ├── src/context/        # User and Socket.IO context
│   ├── src/pages/          # Application screens
│   └── src/App.jsx         # Client routes
├── server/                 # Express/Socket.IO backend
│   ├── src/controllers/    # Request handlers
│   ├── src/models/         # Mongoose models
│   ├── src/routes/         # API routes
│   ├── src/services/       # Battle and question services
│   └── src/socket/         # Real-time event handling
└── README.md
```

## Current Limitations

- The backend package does not currently include automated tests.
- The client has lint and production build scripts; run both before submitting frontend changes.
- Production deployments must configure CORS, MongoDB, cookies, and the frontend `VITE_BASE_URL` for the deployed domains.

## License

This project is currently for educational and demo use.
