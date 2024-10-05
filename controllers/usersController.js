const User = require('../models/usersModel');
const asyncHandler = require('express-async-handlr');

// Get all users
const getUsers = asyncHandler(async (req, res) => {
    const users = await User.find();
    res.status(200).json({ success: true, data: users });
});

// Get single user
const getUser = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const user = await User.findById(id);
    if (!user) {
        return res.status(404).json({ success: false, message: `User with ID ${id} not found` });
    }
    res.status(200).json({ success: true, data: user });
});

// Add user
const addUser = asyncHandler(async (req, res) => {
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

// Update user
const updateUser = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const user = await User.findByIdAndUpdate(id, req.body, { new: true });
    if (!user) {
        return res.status(404).json({ success: false, message: `User with ID ${id} not found` });
    }
    res.status(200).json({ success: true, data: user });
});

// Delete user
const deleteUser = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const user = await User.findByIdAndDelete(id);
    if (!user) {
        return res.status(404).json({ success: false, message: `User with ID ${id} not found` });
    }
    res.status(200).json({ success: true, data: user });
});

module.exports = {
    getUsers,
    getUser,
    addUser,
    updateUser,
    deleteUser,
};
