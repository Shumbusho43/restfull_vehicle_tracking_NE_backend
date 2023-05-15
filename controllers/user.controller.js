//saving an admin but for this no address which is included, other fields from model user are required

const {
    validateUser,
    User
} = require("../models/user.model");

exports.registerAdmin = async (req, res) => {
    try {
        const {
            names,
            email,
            phoneNumber,
            password,
            nationalID
        } = req.body;
        //validation
        const {
            error
        } = validateUser(req.body);
        if (error) return res.status(400).json({
            success: false,
            status: 400,
            message: error.details[0].message
        });
        //check if user exists by checking email or nationalID or phoneNumber
        const user = await User.findOne({
            $or: [{
                    email
                },
                {
                    nationalID
                },
                {
                    phoneNumber
                }
            ]
        });
        if (user) return res.status(400).json({
            success: false,
            status: 400,
            message: 'user exist'
        })
        //create new user
        const newUser = new User({
            names,
            email,
            phoneNumber,
            password,
            nationalID,
            role: "admin"
        });
        //save user
        await newUser.save();
        //generate token
        const token = newUser.generateAuthToken();
        //send token to client
        return res.status(201).json({
            success: true,
            status: 201,
            message: "user created successfully",
            data: newUser,
            token: " " + token
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Internal server error"
        });
    }
}

//login 
exports.login = async (req, res) => {
    const {
        email,
        password
    } = req.body
    try {
        //check if user exists
        const user = await User.findOne({
            email
        });
        if (!user) return res.status(400).json({
            success: false,
            status: 400,
            message: "Invalid email or password"
        });
        //compare password
        const isMatch = await user.comparePassword(password);
        if (!isMatch) return res.status(400).json({
            success: false,
            status: 400,
            message: "Invalid email or password"
        });
        //generate token
        const token = await user.generateAuthToken();
        res.cookie("token","Bearer "+token, {
            httpOnly: true,
            maxAge: 24 * 60 * 60 * 1000
        })
        //send token to client
        res.status(200).json({
            success: true,
            status: 200,
            message: "login successful",
            data: user,
            token: token
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Internal server error"
        });
    }
}

//signup user including address
exports.registerUser = async (req, res) => {
    try {
        const {
            names,
            email,
            phoneNumber,
            password,
            nationalID,
            address
        } = req.body;
        //validation
        const {
            error
        } = validateUser(req.body);
        if (error) return res.status(400).json({
            success: false,
            status: 400,
            message: error.details[0].message
        });
        //check if user exists by checking email or nationalID or phoneNumber
        const user = await User.findOne({
            $or: [{
                    email
                },
                {
                    nationalID
                },
                {
                    phoneNumber
                }
            ]
        });
        if (user) return res.status(400).json({
            success: false,
            status: 400,
            message: 'user exist'
        })
        //create new user
        const newUser = new User({
            names,
            email,
            phoneNumber,
            password,
            nationalID,
            address,
            role: "user"
        });
        //save user
        await newUser.save();
        //generate token
        const token = newUser.generateAuthToken();
        //send token to client
        res.header("x-auth-token",token).json({
            success: true,
            status: 200,
            message: "user created successfully",
            data: newUser
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Internal server error"
        });
    }
}

//getting list of users

exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find().select('-password');
        if (users) return res.status(200).json({
            success: true,
            status: 200,
            message: "users retrieved successfully",
            data: users
        })
        return res.status(404).json({
            success: false,
            status: 404,
            message: "No users found"
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Internal server error"
        });
    }
}