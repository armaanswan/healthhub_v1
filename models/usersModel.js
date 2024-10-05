const mongoose = require('mongoose');

const userSchema = mongoose.Schema(
    {
        userType: {
            type: String,
            required: [true, 'User Type is required'],
            enum: ['patient', 'doctor', 'staff', 'admin']
        },
        username: {
            type: String,
            required: [true, 'Username is required'],
            unique: true
        },
        passwordHash: {
            type: String,
            required: [true, 'Password is required']
        },
        email: {
            type: String,
            required: [true, 'Email is required'],
            unique: true
        },
        firstName: {
            type: String,
            required: [true, 'First Name is required']
        },
        lastName: {
            type: String,
            required: [true, 'Last Name is required']
        },
        dateOfBirth: {
            type: Date,
            // Optional: Add custom validation for age if necessary
        },
        contactNumber: {
            type: String,
            // Optional: Add regex match for specific formats
        },
        address: {
            street: String,
            city: String,
            state: String,
            zipCode: String,
            country: String
        },
        isApproved: {
            type: Boolean,
            default: false
        },
        specialization: {
            type: String,
            // Optional: required only for certain user types
        },
        licenseNumber: {
            type: String,
            // Optional: required only for certain user types
        }
    },
    {
        timestamps: true,
    }
);

const User = mongoose.model('User', userSchema);

module.exports = User;
