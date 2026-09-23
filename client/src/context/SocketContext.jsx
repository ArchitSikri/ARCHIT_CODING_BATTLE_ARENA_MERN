import React, { createContext, useEffect } from "react";
import { io } from "socket.io-client";

export const SocketContext = createContext();

const baseUrl = import.meta.env.VITE_BASE_URL || "http://localhost:9000";
const socket = io(baseUrl);

const SocketProvider = ({ children }) => {
  useEffect(() => {
    socket.on("connect", () => {
      console.log(`Connected to the server with id: ${socket.id}`);
    });

    socket.on("disconnect", () => {
      console.log("Disconnected from the server");
    });
  }, []);

  const sendMessage = (eventName, message) => {
    socket.emit(eventName, message);
  };

  const recieveMessage = (eventName, callback) => {
    socket.on(eventName, callback);
  };

  return (
    <SocketContext.Provider value={{ socket, sendMessage, recieveMessage }}>
      {children}
    </SocketContext.Provider>
  );
};

export default SocketProvider;