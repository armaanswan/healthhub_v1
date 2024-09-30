const User = require('../models/usersModel')
const asyncHandler = require('express-async-handlr')

// Get all users
const getUsers =  asyncHandler(async (req, res) => {
    try {
        const users = await User.find();
        res.status(200).json(users);
    } catch (error) {
        res.status(500);
        throw new Error(error.message);
    }
})

// Get single user
const getUser = asyncHandler(async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ message: `User with ID ${id} not found` });
        }
        res.status(200).json(user);
    } catch (error) {
        res.status(500);
        throw new Error(error.message);
    }
})

// Add user
const addUser = asyncHandler(async (req, res) => {
    try {
        const user = await User.create(req.body);
        res.status(201).json(user);
    } catch (error) {
        res.status(500);
        throw new Error(error.message);
    }
})

// Update user
const updateUser = asyncHandler(async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findByIdAndUpdate(id, req.body, { new: true });
        if (!user) {
            res.status(404);
            throw new Error(`User with ID ${id} not found`);
        }
        res.status(200).json(user);
    } catch (error) {
        res.status(500);
        throw new Error(error.message);
    }
})

// Delete user
const deleteUser = asyncHandler(async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findByIdAndDelete(id);
        if (!user) {
            res.status(404);
            throw new Error(`User with ID ${id} not found`);
        }
        res.status(200).json(user);
    } catch (error) {
        res.status(500);
        throw new Error(error.message);
    }
})

module.exports = {
    getUsers,
    getUser,
    addUser,
    updateUser,
    deleteUser,
};