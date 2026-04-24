const express = require('express')
const authController = require('../controllers/auth.controller')
const identifyUser = require("../middlewares/auth.middleware")




const authRoutes = express.Router()

// POST  /api/auth/register

authRoutes.post("/register", authController.registerController)

// POST /api/auth/login

authRoutes.post("/login", authController.loginController)

// GET /api/auth/get-me

authRoutes.get("/get-me", identifyUser, authController.getMeController)

module.exports = authRoutes 