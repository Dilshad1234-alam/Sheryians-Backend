const userModel = require('../models/user.model')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')


async function registerController(req, res) {
    const { username, email, password, bio, profileImage  } = req.body

    // const isUserExistByEmail = await userModel.findOne({ email })

    // if(isUserExistByEmail) {
    //     return res.status(400).json({
    //         messahe: "user already exists with this email"
    //     })
    // }

    // const isUserExistByUsername = await userModel.findOne({ username })

    // if(isUserExistByUsername) {
    //     return res.status(400).json({
    //         messahe: "user already exists with this username"
    //     })
    // }

    const isUserAlreadyExist = await userModel.findOne({ 
        $or: [
            { username },
            { email }
        ]
    })

    if (isUserAlreadyExist) {
        return res.status(409).json({
            message: "User already exists " + (isUserAlreadyExist.email === email ? 'Email already exists' : 'Username already exists')
        })
    }

    // const hash = crypto.createHash("sha256").update(password).digest("hex")  /* crypto */

    const hash = await bcrypt.hash(password, 10)  /* bcrypt */

    const user = await userModel.create({
        username,
        email,
        bio,
        profileImage,
        password: hash
    })

    const token = jwt.sign({
        id: user._id,
        username: user.username
    }, process.env.JWT_SECRET, { expiresIn: "1d" })

    res.cookie("token", token )
    
    res.status(201).json({
        message: "User registered successfully",
        // token,
        user: {
            id: user._id,
            username: user.username,
            email: user.email,
            bio: user.bio,
            profileImage: user.profileImage
        }
    })

}


async function loginController(req, res) {
    const { username, email, password } = req.body

    // username or password in login 
    // email or password in login

    const user = await userModel.findOne({
        $or: [
            {
                username: username
            },
            {
                email: email
            }
        ]
    }).select("+password")

    if (!user) {
        return res.status(404).json({
            message: "user not found"
        })
    }

    // const hash = crypto.createHash("sha256").update(password).digest("hex")   /*crypto */

    const isPasswordValid = await bcrypt.compare(password, user.password)  /* bcrypt */

    if (!isPasswordValid) {
        return res.status(401).json({
            message: "Invalid password"
        })
    }

    const token = jwt.sign(
        {
            id: user._id, 
            username: user.username
        }, 
        process.env.JWT_SECRET, { expiresIn: "1d" })

    res.cookie("token", token )
    
    res.status(200).json({
        message: "Login successfully",
        // token,
        user: {
            id: user._id,
            username: user.username,
            email: user.email,
            bio: user.bio,
            profileImage: user.profileImage
        }
    })

}


async function getMeController(req, res) {
    const userId = req.user.id 

    const user = await userModel.findById(userId)

    res.status(200).json({
        user: {
            username: user.username,
            email: user.email,
            bio: user.bio,
            profileImage: user.profileImage
        }
    })
}

module.exports = {
    registerController,
    loginController,
    getMeController
}