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
Router.post("/", protect, registerVehicle);
Router.get("/:page/:perPage", protect, getVehicles);
Router.get("/all", protect, getVehiclesWithoutPag);
module.exports.vehicleRouter = Router;