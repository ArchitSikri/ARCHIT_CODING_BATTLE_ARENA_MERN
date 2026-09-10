const dns = require("dns");
const mongoose = require("mongoose");
dns.setServers(["8.8.8.8", "1.1.1.1"]);

async function connectToDb() {
    const mongoUri = process.env.MONGO_URL;

    if (!mongoUri) {
        throw new Error("MONGO_URL is not configured in the backend environment");
    }

    try {
        await mongoose.connect(mongoUri, {
            serverSelectionTimeoutMS: 10000,
        });
        console.log("Connected to db");
    } catch (err) {
        console.error("Failed to connect to MongoDB");
        console.error("Name:", err.name);
        console.error("Message:", err.message);

        if (err.cause?.message) {
            console.error("Cause:", err.cause.message);
        }

        if (err.reason) {
            console.error("Reason:", err.reason);
        }

        throw err;
    }
}

module.exports = connectToDb;