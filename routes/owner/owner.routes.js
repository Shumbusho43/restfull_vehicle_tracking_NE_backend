const express = require("express");
const Router = express.Router();
const {
    registerOwner,
    getAllOwners
} = require("../../controllers/owner/owner.controller");
const {
    protect,
    role
} = require("../../middleware/protect");
Router.get('/', protect, getAllOwners)
Router.post('/register', protect,registerOwner);
module.exports.ownerRoutes = Router;