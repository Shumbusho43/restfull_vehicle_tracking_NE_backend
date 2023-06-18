const path = require("path");
const cloudinary = require("../../utils/cloudinary");
//registering vehicle by admin

const {
    Owner
} = require("../../models/owner/owner.model");
const {
    User
} = require("../../models/vehicle/vehicle.model");
const {
    validateVehicle,
    Vehicle
} = require("../../models/vehicle/vehicle.model");

exports.registerVehicle = async (req, res) => {
    // #swagger.tags = ['Vehicle']
    // #swagger.description = 'Endpoint to register a vehicle'
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
        const user = await Owner.findById(owner);
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
        //upload image to cloudinary
        if (!req.files)
            return res.status(400).json({
                success: false,
                message: "Please upload a photo",
            });
        const file = req.files.photo;
        //make sure that uploaded file is an image
        if (!file.mimetype.startsWith("image"))
            return res.status(400).json({
                success: false,
                message: "please upload an image file",
            });
        //checking photo size
        if (file.size > process.env.MAX_FILE_SIZE)
            return res.status(400).json({
                success: false,
                message: `please upload an image less than ${process.env.MAX_FILE_SIZE}`,
            });
        //customizing image name to avoid overwriting
        file.name = `photo}${
                  path.parse(file.name).ext
                }`;
        //checking if project has cloudinar id
        cloudinary.uploader
            .upload(file.tempFilePath)
            .then(async (result) => {
                const body = {
                    profile: result.secure_url,
                    cloudinary_id: result.public_id,
                };
                //updating project
                //create new vehicle
                vehicle = new Vehicle({
                    vehiclePlateNumber,
                    manufactureCompany,
                    manufactureYear,
                    price,
                    chasisNumber,
                    modelName,
                    owner,
                    photo: result.secure_url,
                    cloudinary_id: result.public_id,
                });
                //save vehicle  
                await vehicle.save();
                res.status(201).json({
                    success: true,
                    status: 201,
                    message: "Vehicle registered successfully",
                    data: vehicle
                });
            })
            .catch((error) => {
                console.log(error);
                res.status(500).json({
                    success: false,
                    message: "Internal server error",
                });
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
    // #swagger.tags = ['Vehicle']
    // #swagger.description = 'Endpoint to get all vehicles'
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

        return res.status(200).json({
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
//getting all vehicles without pagination for mobile
exports.getVehiclesWithoutPag = async (req, res) => {
    // #swagger.tags = ['Vehicle']
    // #swagger.description = 'Endpoint to get all vehicles without pagination'
    try {
        const vehicles = await Vehicle.find()
            .populate("owner", "-password");

        return res.status(200).json({
            success: true,
            status: 200,
            message: "Vehicles retrieved successfully",
            data: {
                vehicles
            }
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Internal server error"
        });
    }
}
//delete vehicle by admin
exports.deleteVehicle = async (req, res) => {
    // #swagger.tags = ['Vehicle']
    // #swagger.description = 'Endpoint to delete a vehicle'
    try {
        const vehicle = await Vehicle.findById(req.params.id);
        if (!vehicle) {
            return res.status(404).json({
                success: false,
                status: 404,
                message: "Vehicle not found"
            });
        }
        //delete vehicle from cloudinary
        await cloudinary.uploader.destroy(vehicle.cloudinary_id);
        //delete vehicle from db
        await vehicle.remove();
        res.status(200).json({
            success: true,
            status: 200,
            message: "Vehicle deleted successfully"
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Internal server error"
        });
    }
}
//update vehicle by admin
exports.updateVehicle = async (req, res) => {
    // #swagger.tags = ['Vehicle']
    // #swagger.description = 'Endpoint to update a vehicle'
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
        //check if vehicle exists
        let vehicle = await Vehicle.findById(req.params.id);
        if (!vehicle) {
            return res.status(404).json({
                success: false,
                status: 404,
                message: "Vehicle not found"
            });
        }
        //check if owner exists
        const user = await Owner.findById(owner);
        if (!user) {
            return res.status(404).json({
                success: false,
                status: 404,
                message: "Owner not found"
            });
        }
        //check if vehicle already exists
        let vehiclePlate = await Vehicle.findOne({
            vehiclePlateNumber: req.body.vehiclePlateNumber
        });
        if (vehiclePlate) {
            return res.status(400).json({
                success: false,
                status: 400,
                message: "Vehicle already exists"
            });
        }
        //upload image to cloudinary
        if (!req.files)
            return res.status(400).json({
                success: false,
                message: "Please upload a photo",
            });
        const file = req.files.photo;
        //make sure that uploaded file is an image
        if (!file.mimetype.startsWith("image"))
            return res.status(400).json({
                success: false,
                message: "please upload an image file",
            });
        //checking photo size
        if (file.size > process.env.MAX_FILE_SIZE)
            return res.status(400).json({
                success: false,
                message: `please upload an image less than ${process.env.MAX_FILE_SIZE}`,
            });
        //customizing image name to avoid overwriting
        file.name = `photo}${
          path.parse(file.name).ext
        }`;
        //checking if project has cloudinar id
        cloudinary.uploader
            .upload(file.tempFilePath)
            .then(async (result) => {
                //updating vehicle
                vehicle = await Vehicle.findByIdAndUpdate(req.params.id, {
                    vehiclePlateNumber,
                    manufactureCompany,
                    manufactureYear,
                    price,
                    chasisNumber,
                    modelName,
                    owner,
                    photo: result.secure_url,
                    cloudinary_id: result.public_id,
                }, {
                    new: true,
                });
                res.status(200).json({
                    success: true,
                    status: 200,
                    message: "Vehicle updated successfully",
                    data: {
                        vehicle
                    }
                });
            })
            .catch((err) => {
                console.log(err);
                res.status(500).json({
                    success: false,
                    message: "Internal server error",
                });
            });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Internal server error"
        });
    }
}