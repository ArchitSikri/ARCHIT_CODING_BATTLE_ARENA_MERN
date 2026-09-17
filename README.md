# Coding Battle MERN

A full-stack coding challenge app built with the MERN stack. Users can register, log in, and participate in real-time coding battles with a React front end and an Express + MongoDB backend.

## Tech Stack

- Frontend: React, Vite, React Router, Redux Toolkit, Tailwind CSS
- Backend: Node.js, Express.js
- Database: MongoDB with Mongoose
- Real-time communication: Socket.IO
- Authentication: JWT + cookie-based auth

## Features

- User registration and login
- Protected routes for authenticated users
- Real-time battle matchmaking / room logic with Socket.IO
- Code editor experience on the client
- MongoDB-backed battle and user data
- Responsive single-page app frontend

## Project Structure

```bash
CODING_BATTLE_MERN/
├── client/
│   ├── src/
│   ├── public/
│   ├── package.json
│   ├── vite.config.js
│   └── index.html
├── server/
│   ├── src/
│   ├── App.js
│   ├── server.js
│   └── package.json
├── .gitignore
├── README.md
└── package.json (if added later)
```

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

## Common Run Commands

From the root if needed:

```bash
# backend
cd server && npm install && npm run dev

# frontend
cd client && npm install && npm run dev
```

## Useful Links

- Frontend: `http://localhost:5173`
- Backend API: `http://localhost:5000`

## License

This project is currently for educational/demo use.
