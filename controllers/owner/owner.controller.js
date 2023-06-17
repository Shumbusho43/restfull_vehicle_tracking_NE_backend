const {
    validateOwner,
    Owner
} = require('../../models/owner/owner.model');
const {
    Vehicle
} = require('../../models/vehicle/vehicle.model');
//signup user including address
exports.registerOwner = async (req, res) => {
    // #swagger.tags = ['Owner']
    // #swagger.description = 'Endpoint to register an owner'
    try {
        const {
            names,
            phoneNumber,
            nationalID,
            address
        } = req.body;
        //validation
        const {
            error
        } = validateOwner(req.body);
        if (error) return res.status(400).json({
            success: false,
            status: 400,
            message: error.details[0].message
        });
        //check if user exists by checking email or nationalID or phoneNumber
        const user = await Owner.findOne({
            $or: [{
                    nationalID
                },
                {
                    phoneNumber
                }
            ]
        });
        if (user) return res.status(400).json({
            success: false,
            status: 400,
            message: 'owner exist'
        })
        //create new user
        const newUser = new Owner({
            names,
            phoneNumber,
            nationalID,
            address
        });
        //save user
        await newUser.save();
        //send token to client
        return res.status(201).json({
            success: true,
            status: 201,
            message: "owner created successfully",
            data: newUser
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Internal server error"
        });
    }
}

//getting list of users

exports.getAllOwners = async (req, res) => {
    // #swagger.tags = ['Owner']
    // #swagger.description = 'Endpoint to get all owners'
    try {
        const owners = await Owner.find();
        if (owners) return res.status(200).json({
            success: true,
            status: 200,
            message: "owners retrieved successfully",
            data: owners
        })
        return res.status(404).json({
            success: false,
            status: 404,
            message: "No owners found"
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Internal server error"
        });
    }
}

//get owner vehicles
exports.getOwnerVehicles = async (req, res) => {
    // #swagger.tags = ['Owner']
    // #swagger.description = 'Endpoint to get owner vehicles'
    try {
        const vehicle = await Vehicle.find({
            owner: req.params.id
        })
        if (!vehicle) return res.status(404).json({
            success: false,
            status: 404,
            message: "owner has no vehicles"
        })
        return res.status(200).json({
            success: true,
            status: 200,
            message: "owner vehicles retrieved successfully",
            data: vehicle
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Internal server error"
        });
    }
}