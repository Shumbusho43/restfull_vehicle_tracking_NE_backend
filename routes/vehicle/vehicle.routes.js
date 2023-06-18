const express = require('express');
const {
    protect,
} = require('../../middleware/protect');
const {
    registerVehicle,
    getVehicles,
    getVehiclesWithoutPag,
    deleteVehicle,
    updateVehicle
} = require('../../controllers/vehicle/vehicle.controller');
const Router = express.Router();
Router.post("/api/v1/vehicle", protect, registerVehicle);
Router.get("/api/v1/vehicle/:page/:perPage", protect, getVehicles);
Router.get("/api/v1/vehicle/all", protect, getVehiclesWithoutPag);
//delete vehicle
Router.delete("/api/v1/vehicle/:id", protect, deleteVehicle);
//update vehicle
Router.put("/api/v1/vehicle/:id", protect, updateVehicle);
module.exports.vehicleRouter = Router;