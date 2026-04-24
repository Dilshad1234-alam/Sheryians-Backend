import { io } from "socket.io-client";

let socket;

export const initializeSocketConnection = () => {
  if (socket?.connected) return socket;

  socket = io("http://localhost:3000", {
    withCredentials: true,
  });

  socket.on("connect", () => {
    console.log("Connected to Socket.IO server:", socket.id);
  });

  socket.on("disconnect", () => {
    console.log("Disconnected from Socket.IO server");
  });

  return socket;
};

export const getSocket = () => socket;

export const joinChatRoom = (chatId) => {
  if (socket && chatId) {
    socket.emit("join-chat", chatId);
  }
};

export const leaveChatRoom = (chatId) => {
  if (socket && chatId) {
    socket.emit("leave-chat", chatId);
  }
};