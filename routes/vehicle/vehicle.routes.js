const express = require('express');
const {
    protect,
} = require('../../middleware/protect');
const {
    registerVehicle,
    getVehicles,
    getVehiclesWithoutPag
} = require('../../controllers/vehicle/vehicle.controller');
const Router = express.Router();
Router.post("/api/v1/vehicle", protect, registerVehicle);
Router.get("/api/v1/vehicle/:page/:perPage", protect, getVehicles);
Router.get("/api/v1/vehicle/all", protect, getVehiclesWithoutPag);
module.exports.vehicleRouter = Router;