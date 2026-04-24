import { log } from 'console';
import app from './src/app.js'
import { createServer } from "http";
import { Server } from "socket.io";

const httpServer = createServer(app);
const io = new Server(httpServer, { /* options */ });

io.on("connection", (socket) => {
  console.log("New connection created");

  socket.on("message", (msg) => {
    console.log("user fired message event");
    console.log(msg);
    io.emit("abc")
  }) 
});

// socket.emit()
// socket.broadcast().emit()
// io.emit()


httpServer.listen(3000, () => {
    console.log("Server is running on port 3000");
});