import { Server } from "socket.io";

let io;

export function initSocket(httpServer) {
  io = new Server(httpServer, {
    cors: {
      origin: "http://localhost:5173",
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    console.log("A user connected:", socket.id);

    socket.on("join-chat", (chatId) => {
      if (chatId) {
        socket.join(String(chatId));
      }
    });

    socket.on("leave-chat", (chatId) => {
      if (chatId) {
        socket.leave(String(chatId));
      }
    });

    socket.on("disconnect", () => {
      console.log("A user disconnected:", socket.id);
    });
  });
}

export function getIO() {
  if (!io) {
    throw new Error("Socket.io not initialized");
  }

  return io;
}




// import { Server } from 'socket.io'

// let io;

// export function initSocket(httpServer) {
//     io = new Server(httpServer, {
//         cors: {
//             origin: "http://localhost:5173",
//             credentials: true, 
//         },
//     });

//     // console.log("Socket.io server is Running....");

//     io.on("connection", (socket) => {

//         console.log("A user connected: " + socket.id);  

//             socket.on("join-chat", (chatId) => {
//                 if (chatId) {
//                 socket.join(String(chatId));
//             }
//         });

//         socket.on("leave-chat", (chatId) => {
//             if (chatId) {
//                 socket.leave(String(chatId));
//             }
//         });
//         socket.on("disconnect", () => {
//             console.log("A user disconnected:", socket.id);
//         });
//     });
// }

// export function getIO() {
//     if (!io) {
//         throw new Error("Socket.io not initialized")
//     }

//     return io;
// }