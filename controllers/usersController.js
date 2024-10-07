const User = require('../models/usersModel');
const asyncHandler = require('express-async-handlr');
const multer = require('multer');
const path = require('path');

// Multer setup for file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/'); // Save photos to 'uploads/' folder
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({ storage });

// Get all users (excluding soft-deleted users)
const getUsers = asyncHandler(async (req, res) => {
    const users = await User.find({ deletedAt: null }); // Exclude soft-deleted users
    res.status(200).json({ success: true, data: users });
});

// Get a single user by ID
const getUser = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const user = await User.findById(id);
    if (!user) {
        return res.status(404).json({ success: false, message: `User with ID ${id} not found` });
    }
    res.status(200).json({ success: true, data: user });
});

// Add a new user
const addUser = asyncHandler(async (req, res) => {
    const { userType, specialization, licenseNumber } = req.body;

    // Ensure specialization and licenseNumber are provided for 'doctor' userType
    if (userType === 'doctor' && (!specialization || !licenseNumber)) {
        return res.status(400).json({ success: false, message: 'Specialization and license number are required for doctors' });
    }

    // Check for existing user with the same username or email
    const existingUser = await User.findOne({
        $or: [{ username: req.body.username }, { email: req.body.email }]
    });

    if (existingUser) {
        return res.status(400).json({ success: false, message: 'Username or email already exists' });
    }

    const user = await User.create(req.body);
    res.status(201).json({ success: true, data: user });
});

// Update an existing user by ID
const updateUser = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { userType, specialization, licenseNumber } = req.body;

    // Ensure specialization and licenseNumber are provided for 'doctor' userType
    if (userType === 'doctor' && (!specialization || !licenseNumber)) {
        return res.status(400).json({ success: false, message: 'Specialization and license number are required for doctors' });
    }

    const user = await User.findByIdAndUpdate(id, req.body, { new: true });
    if (!user) {
        return res.status(404).json({ success: false, message: `User with ID ${id} not found` });
    }
    res.status(200).json({ success: true, data: user });
});

// Soft delete user by setting deletedAt
const softDeleteUser = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const user = await User.findByIdAndUpdate(id, { deletedAt: new Date() }, { new: true });
    
    if (!user) {
        return res.status(404).json({ success: false, message: `User with ID ${id} not found` });
    }
    res.status(200).json({ success: true, message: 'User soft deleted successfully', data: user });
});

// Permanently delete a user from the database
const deleteUser = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const user = await User.findByIdAndDelete(id);
    if (!user) {
        return res.status(404).json({ success: false, message: `User with ID ${id} not found` });
    }
    res.status(200).json({ success: true, data: user });
});

// Upload a photo for a user
const uploadUserPhoto = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const user = await User.findById(id);

    if (!user) {
        return res.status(404).json({ success: false, message: `User with ID ${id} not found` });
    }

    // Add the uploaded photo URL to the user's photos array
    const photoUrl = `/uploads/${req.file.filename}`;
    user.photos.push({ url: photoUrl });

    await user.save();
    res.status(200).json({ success: true, message: 'Photo uploaded successfully', data: user });
});

module.exports = {
    getUsers,
    getUser,
    addUser,
    updateUser,
    softDeleteUser,
    deleteUser,
    uploadUserPhoto,
};
