//model user is made up of names,national ID, phone number, address
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Joi = require('joi');
const jwt = require("jsonwebtoken")
const userSchema = new mongoose.Schema({
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
    email: {
        type: String,
        required: true,
        trim: true,
        unique: true,
        min: 6,
        max: 100
    },
    phoneNumber: {
        type: String,
        required: true,
        trim: true,
        unique: true,
        min: 10,
        max: 10
    },
    password: {
        type: String,
        required: true,
        min: 6,
        max: 100
    },
}, {
    timestamps: true
});

//validate above schema with joi package
const validateUser = (user) => {
    const schema = Joi.object({
        names: Joi.string().min(3).max(20).required(),
        nationalID: Joi.string().min(16).max(16).required(),
        phoneNumber: Joi.string().min(10).max(10).required(),
        password: Joi.string().min(6).max(100).required(),
        reEnterPassword: Joi.string()
            .valid(Joi.ref('password'))
            .required()
            .messages({
                'any.only': 'Passwords do not match'
            }),
        email: Joi.string().email().required().min(6).max(100)
    });
    return schema.validate(user);
}

//hash password before saving
userSchema.pre('save', async function (next) {
    try {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(this.password, salt);
        this.password = hashedPassword;
        next();
    } catch (error) {
        next(error);
    }
});
//generate jwt function
userSchema.methods.generateAuthToken = async function () {
    try {
        const token = jwt.sign({
            _id: this._id,
            role: this.role
        }, process.env.SECRET_KEY, {
            expiresIn: '1d'
        });
        return token;
    } catch (error) {
        console.log(error);
    }
}
//compare password
userSchema.methods.comparePassword = async function (password) {
    try {
        const isMatch = await bcrypt.compare(password, this.password);
        return isMatch;
    } catch (error) {
        console.log(error);
    }
}

module.exports.validateUser = validateUser;
module.exports.User = mongoose.model('User', userSchema);