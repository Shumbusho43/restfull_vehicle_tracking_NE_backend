const express = require('express');
const Router = express.Router();
const {
    registerAdmin,
    login,
} = require('../../controllers/user/user.controller');
Router.post('/register', registerAdmin);
Router.post('/login', login);
module.exports.userRouter = Router;