const express = require('express');
const {
    protect,
    role
} = require('../middleware/protect');
const {
    registerVehicle,
    getVehicles
} = require('../controllers/vehicle.controller');
const Router = express.Router();
Router.post("/", protect, role("admin"), registerVehicle);
Router.get("/:page/:perPage", protect, role("admin"), getVehicles);
module.exports.vehicleRouter = Router;