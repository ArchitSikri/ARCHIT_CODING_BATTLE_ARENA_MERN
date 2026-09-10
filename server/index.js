const dotenv = require("dotenv");
dotenv.config();

const express = require("express");
const cookieparser = require("cookie-parser");
const cors = require("cors");
const connectToDb = require("./src/config/db.js");
const userRouter = require("./src/routes/user.route.js");

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieparser()); 

const corsOption = {
  origin: process.env.FRONTEND_URL || "http://localhost:5173",
  credentials: true,
};
app.use(cors(corsOption))
app.use("/api/user", userRouter);

const port = process.env.PORT;

app.listen(port, () => {
  connectToDb();
  console.log(`server is running on port ${port}`);
});



