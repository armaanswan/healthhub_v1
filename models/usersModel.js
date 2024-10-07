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
            unique: true,
            trim: true
        },
        passwordHash: {
            type: String,
            required: [true, 'Password is required']
        },
        email: {
            type: String,
            required: [true, 'Email is required'],
            unique: true,
            match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email address'],
            lowercase: true
        },
        firstName: {
            type: String,
            required: [true, 'First Name is required'],
            trim: true
        },
        lastName: {
            type: String,
            required: [true, 'Last Name is required'],
            trim: true
        },
        dateOfBirth: {
            type: Date,
            // Optional: Add custom validation for age if necessary
        },
        contactNumber: {
            type: String,
            match: [/^\d{10,15}$/, 'Please provide a valid contact number']
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
            required: function () { return this.userType === 'doctor'; }
        },
        licenseNumber: {
            type: String,
            required: function () { return this.userType === 'doctor'; }
        },
        photos: [
            {
                url: {
                    type: String,
                    required: [true, 'Photo URL is required'],
                    match: [/^https?:\/\/.+\.(jpg|jpeg|png|gif)$/, 'Please provide a valid image URL']
                },
                uploadedAt: {
                    type: Date,
                    default: Date.now
                },
                description: {
                    type: String,
                    trim: true
                },
                size: {
                    type: Number // Size in bytes
                },
                format: {
                    type: String,
                    enum: ['jpg', 'jpeg', 'png', 'gif']
                }
            }
        ],
        deletedAt: {
            type: Date,
            default: null
        }
    },
    {
        timestamps: true,
        toJSON: { virtuals: true },
        toObject: { virtuals: true }
    }
);

// Virtual field for full name
userSchema.virtual('fullName').get(function () {
    return `${this.firstName} ${this.lastName}`;
});

// Indexes for faster lookups
userSchema.index({ email: 1 });
userSchema.index({ username: 1 });

// Soft delete query middleware
userSchema.pre(/^find/, function (next) {
    this.where({ deletedAt: null });
    next();
});

const User = mongoose.model('User', userSchema);

module.exports = User;
