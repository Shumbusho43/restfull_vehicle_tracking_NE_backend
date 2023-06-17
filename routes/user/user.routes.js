const express = require('express');
const Router = express.Router();
const {
    registerAdmin,
    login,
} = require('../../controllers/user/user.controller');
Router.post('/api/v1/user/register', registerAdmin);
Router.post('/api/v1/user/login', login);
module.exports.userRouter = Router;