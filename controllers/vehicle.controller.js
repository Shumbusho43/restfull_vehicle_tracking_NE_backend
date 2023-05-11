//registering vehicle by admin

const {
    User
} = require("../models/user.model");
const {
    validateVehicle,
    Vehicle
} = require("../models/vehicle.model");

exports.registerVehicle = async (req, res) => {
    try {
        const {
            vehiclePlateNumber,
            manufactureCompany,
            manufactureYear,
            price,
            chasisNumber,
            modelName,
            owner
        } = req.body;
        //validate req.body
        const {
            error
        } = validateVehicle(req.body);

        if (error) {
            return res.status(400).json({
                success: false,
                status: 400,
                message: error.details[0].message
            });
        }
        //check if owner exists
        const user = await User.findById(owner);
        if (!user) {
            return res.status(404).json({
                success: false,
                status: 404,
                message: "Owner not found"
            });
        }
        //check if vehicle already exists
        let vehicle = await Vehicle.findOne({
            vehiclePlateNumber: req.body.vehiclePlateNumber
        });
        if (vehicle) {
            return res.status(400).json({
                success: false,
                status: 400,
                message: "Vehicle already exists"
            });
        }
        //create new vehicle
        vehicle = new Vehicle({
            vehiclePlateNumber,
            manufactureCompany,
            manufactureYear,
            price,
            chasisNumber,
            modelName,
            owner
        });
        //save vehicle  
        await vehicle.save();
        res.status(201).json({
            success: true,
            status: 201,
            message: "Vehicle registered successfully",
            data: vehicle
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Internal server error"
        });
    }
}
//getting all vehicles by admin 
exports.getVehicles = async (req, res) => {
    try {
        const page = parseInt(req.params.page) || 1;
        const perPage = parseInt(req.params.perPage) || 10;
        const count = await Vehicle.countDocuments();
        if (count === 0) {
            res.status(404).json({
                success: false,
                status: 404,
                message: "No vehicles found"
            });
            return;
        }

        const totalPages = Math.ceil(count / perPage);
        if (page > totalPages) {
            res.status(400).json({
                success: false,
                status: 400,
                message: `Page ${page} does not exist`
            });
            return;
        }

        const vehicles = await Vehicle.find()
            .skip((page - 1) * perPage)
            .limit(perPage)
            .populate("owner", "-password");

        res.status(200).json({
            success: true,
            status: 200,
            message: "Vehicles retrieved successfully",
            data: {
                vehicles,
                currentPage: page,
                totalPages
            }
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Internal server error"
        });
    }
}