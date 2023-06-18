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
Router.get('/api/v1/owner', protect, getAllOwners)
// Router.get('/api/v1/owner', protect,role("admin","user"), getAllOwners)
Router.post('/api/v1/owner/register', protect, registerOwner);
///get owner vehicles
Router.get('/api/v1/owner/:id/vehicles', protect, getOwnerVehicles);
module.exports.ownerRoutes = Router;