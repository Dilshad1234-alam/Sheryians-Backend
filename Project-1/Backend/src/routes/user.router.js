const express = require('express')
const userContoller = require("../controllers/user.controller")
const identifyUser = require('../middlewares/auth.middleware')

const userRouter = express.Router();


/**
 * @route Post /api/users/follow/:userid
 * @description Follow a user
 * @access Private
 */

userRouter.post("/follow/:username", identifyUser, userContoller.followUserController)


/**
 * @route Post /api/users/unfollow/:userid
 * @description Unfollow a user
 * @access Private
 */

userRouter.post("/unfollow/:username", identifyUser, userContoller.unfollowUserController)


module.exports = userRouter;