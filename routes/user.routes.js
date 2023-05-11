const express = require('express');
const Router = express.Router();
const {
    registerAdmin,
    login,
    registerUser
} = require('../controllers/user.controller');
const {
    protect,
    role
} = require('../middleware/protect')
// const {auth}=require('../middlewares/auth');
Router.post('/register/admin', registerAdmin);
Router.post('/register/user', protect, role("admin"), registerUser);
Router.post('/login', login);
module.exports.userRouter = Router;