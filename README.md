# Coding Battle MERN

A full-stack coding battle application built with the MERN stack. Players can create or join rooms, prepare for a head-to-head challenge, solve coding problems, and view battle results through a responsive glassmorphism UI.

## Tech Stack

- Frontend: React, Vite, React Router, Tailwind CSS
- UI: Lucide React, Remix Icon, GSAP animations
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
- Real-time battle room foundation with Socket.IO
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
| `/start-battle` | Battle preparation |
| `/battle-arena` | Coding arena |
| `/battle-winner` | Battle result |
| `/profile` | Player profile |

The frontend keeps reusable presentation pieces in `client/src/components/`. `PageFrame` owns the shared background, overlay, header, and GSAP entrance animation, while the smaller UI components handle panels, buttons, headings, and inputs.

## Prerequisites

Before running the app, make sure you have installed:

- Node.js (v18+ recommended)
- npm
- MongoDB connection string

## Backend Setup

1. Go to the server folder:

```bash
cd server
```

2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file in the `server` folder:

```env
PORT=5000
MONGO_URL=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/coding-battle
JWT_SECRET=your_super_secret_key
```

4. Start the backend server:

```bash
npm run dev
```

The backend should run on:

```bash
http://localhost:5000
```

## Frontend Setup

1. Go to the client folder:

```bash
cd client
```

2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file in the `client` folder:

```env
VITE_BASE_URL=http://localhost:5000
```

4. Start the frontend:

```bash
npm run dev
```

The app should open on:

```bash
http://localhost:5173
```

## Environment Notes

- `VITE_BASE_URL` must point to the backend server URL used by the client.
- `MONGO_URL` is required for the backend to connect to MongoDB.
- `JWT_SECRET` is used for user authentication tokens.

## Common Commands

Run each application from its own package directory. There is currently no root `package.json`.

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
```

## Useful Links

- Frontend: `http://localhost:5173`
- Backend API: `http://localhost:5000`

## License

This project is currently for educational/demo use.
