const dotenv = require("dotenv").config();
const express = require("express");
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const cookieParser = require("cookie-parser");
app.use(cookieParser());

const cors = require("cors");
const allowedOrigins = [
    "http://localhost:5173",
    "http://localhost:3000",
    "https://code-battle-frontend.onrender.com"
];

app.use(cors({
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error("Not allowed by CORS"));
        }
    },
    credentials: true
}));

const userRoutes = require("./src/routes/user.route");
app.use('/users', userRoutes);
app.use('/api/user', userRoutes);

const battleRoutes = require("./src/routes/battle.route");
app.use('/battle', battleRoutes);
app.use('/api/battle', battleRoutes);

const connectToDb = require("./src/config/db");
connectToDb();

app.get("/", (req, res) => {   
    res.send("Hello World!");
}); 

module.exports = app;