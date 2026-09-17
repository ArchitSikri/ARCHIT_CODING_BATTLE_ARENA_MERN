const { Server: SocketIOServer } = require('socket.io');
const userModel = require('../models/user.model');
const battleModel = require('../models/battle.model');

let io;

function initializesocket(server) {
    io = new SocketIOServer(server, {
        cors: {
            origin: "*",
            methods: ["GET", "POST"]
        }
    });

     io.on("connection", (socket) => {

        console.log(`Client connected: ${socket.id}`);

        socket.on("join", async (userId) => {
            try {
                socket.userId = userId;
                await userModel.findByIdAndUpdate(userId, { socketId: socket.id });
                console.log(`User ${userId} connected with socket ID: ${socket.id}`);
            } catch (error) {
                console.error("Error updating user socket ID:", error);
            }
        });

         socket.on("battleRoom", async (roomId) => {
            try {
                const battle = await battleModel.findOne({ roomCode: roomId });
                if (battle) {
                    socket.join(roomId);
                    console.log(`Socket ${socket.id} joined room ${roomId}`);

                    if (!battle.user1SocketId) {
                        battle.user1SocketId = socket.id;
                        await battle.save();
                        console.log(`Assigned user1SocketId for room ${roomId}: ${socket.id}`);
                    } else if (!battle.user2SocketId) {
                        battle.user2SocketId = socket.id;
                        battle.challenger = socket.userId;
                        await battle.save();
                        console.log(`Assigned user2SocketId for room ${roomId}: ${socket.id}`);
                        const opponentUser = await userModel.findById(socket.userId);
                        io.to(battle.user1SocketId).emit("opponentJoined", { opponent: opponentUser });
                    } else {
                        console.log(`Both user socket IDs already assigned for room ${roomId}`);
                    }
                } else {
                    console.log(`Battle not found for room ID: ${roomId}`);
                }
            } catch (error) {
                console.error("Error updating battle socket IDs:", error);
            }
        });

        socket.on("newQuestion", (data) => {
            console.log(`newQuestion event received:`, data);
            io.to(data.roomCode).emit("newQuestion", data);
        });

        socket.on("scoreUpdate", (data) => {
            console.log(`scoreUpdate event:`, data);
            io.to(data.roomCode).emit("scoreUpdate", data);
        });

        socket.on("pointAwarded", (data) => {
            console.log(`Point awarded in room ${data.roomCode}: winner is ${data.winner}`);
            io.in(data.roomCode).emit("pointAwarded", data);
        });

        socket.on("startBattle", (data) => {
            const { roomCode, opponentSocketId } = data;
            console.log(`Battle ${roomCode} starting: instructing opponent ${opponentSocketId}`);
            if (io) {
                io.to(opponentSocketId).emit("redirectToBattle", { roomCode });
            }
        });

        socket.on("battleCompleted", (data) => {
            io.in(data.roomCode).emit("battleCompleted", data);
        });

        socket.on("disconnect", () => {
            console.log(`Client disconnected: ${socket.id}`);
        });
     })
}

const sendMessageToSocketId = (socketId, messageObject) => {
    console.log(`Sending message to socket ${socketId}:`, messageObject);
    if (io) {
        io.to(socketId).emit(messageObject.event, messageObject.data);
    } else {
        console.log("Socket.io not initialized.");
    }
};

module.exports = { initializesocket, sendMessageToSocketId };