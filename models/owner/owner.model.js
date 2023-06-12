//model owner is made up of names,national ID, phone number, address
const mongoose = require('mongoose');
const Joi = require('joi');
const ownerSchema = new mongoose.Schema({
    names: {
        type: String,
        required: true,
        trim: true,
        min: 3,
        max: 20
    },
    nationalID: {
        type: String,
        required: true,
        trim: true,
        unique: true,
        min: 16,
        max: 16
    },
    phoneNumber: {
        type: String,
        required: true,
        trim: true,
        unique: true,
        min: 10,
        max: 10
    },
    address: {
        type: String,
        trim: true,
        min: 3,
        max: 100
    }
}, {
    timestamps: true
});

//validate above schema with joi package
const validateOwner = (owner) => {
    const schema = Joi.object({
        names: Joi.string().min(3).max(20).required(),
        nationalID: Joi.string().min(16).max(16).required(),
        phoneNumber: Joi.string().min(10).max(10).required(),
        address: Joi.string().min(3).max(100)
    });
    return schema.validate(owner);
}
module.exports.validateOwner = validateOwner;
module.exports.Owner = mongoose.model('Owner', ownerSchema);