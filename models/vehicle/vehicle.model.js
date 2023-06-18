//it has these fiels in the database
//  chasis number,manufacture company, manufacture year,price, vehicle plate number and model name eg(AN12334,Toyota,2005,13 million,RCA234M,Toyota RAV4). 

const mongoose = require('mongoose');
const Joi = require('joi');
const vehicleSchema = new mongoose.Schema({
    chasisNumber: {
        type: String,
        trim: true,
        unique: true,
        min: 6,
        max: 100
    },
    manufactureCompany: {
        type: String,
        required: true,
        trim: true,
        min: 3,
        max: 100
    },
    manufactureYear: {
        type: String,
        required: true,
        trim: true,
        min: 4,
        max: 4
    },
    price: {
        type: String,
        required: true,
        trim: true,
        min: 6,
        max: 100
    },
    vehiclePlateNumber: {
        type: String,
        trim: true,
        unique: true,
        min: 6,
        max: 100
    },
    modelName: {
        type: String,
        required: true,
        trim: true,
        min: 3,
        max: 100
    },
    photo: {
        type: String
    },
    cloudinary_id: {
        type: String
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Owner"
    }
}, {
    timestamps: true
});

//validate above schema with joi package
const validateVehicle = (vehicle) => {
    const schema = Joi.object({
        chasisNumber: Joi.string().min(6).max(100),
        manufactureCompany: Joi.string().min(3).max(100).required(),
        manufactureYear: Joi.string().min(4).max(4).required().max(new Date().getFullYear()),
        price: Joi.string().min(6).max(100).required(),
        vehiclePlateNumber: Joi.string().min(6).max(100),
        modelName: Joi.string().min(3).max(100).required(),
        owner: Joi.string().required(),
        photo: Joi.string()
    });
    return schema.validate(vehicle);
}
module.exports.Vehicle = mongoose.model("Vehicle", vehicleSchema);
module.exports.validateVehicle = validateVehicle;