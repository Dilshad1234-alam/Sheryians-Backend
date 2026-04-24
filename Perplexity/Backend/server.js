import app from "./src/app.js";
import http from 'http'
import connectDB from "./src/config/database.js";
import { initSocket } from "./src/socket.io/server.socket.js";


const PORT = process.env.PORT || 3000;



const httpServer = http.createServer(app);

await connectDB();
initSocket(httpServer);


// connectDB()
//     .catch((err) => {
//         console.error("MongoDB connection failed:", err);
//         process.exit(1);
//     });

httpServer.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});