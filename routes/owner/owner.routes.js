const express = require("express");
const Router = express.Router();
const {
    registerOwner,
    getAllOwners,
    getOwnerVehicles
} = require("../../controllers/owner/owner.controller");
const {
    protect,
    role
} = require("../../middleware/protect");
Router.get('/', protect, getAllOwners)
Router.post('/register', protect, registerOwner);
///get owner vehicles
Router.get('/:id/vehicles', protect, getOwnerVehicles);
module.exports.ownerRoutes = Router;