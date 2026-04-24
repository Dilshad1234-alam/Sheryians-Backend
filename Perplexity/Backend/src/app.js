import express from "express";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import authRouter from "./routes/auth.routes.js";
import chatRouter from './routes/chat.routes.js'
import morgan from 'morgan'
import cors from 'cors'



// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(morgan("dev"))

app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,
  methods: [ "GET", "POST", "PUT", "DELETE" ],
}))


// Routes
console.log("Auth routes loaded");

app.use('/api/auth', authRouter);
app.use('/api/chats', chatRouter);


// Test route 
app.get("/", (req, res) => {
  res.json({ message: "Server is running" });
});


// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Internal Server Error" });
});

export default app;
