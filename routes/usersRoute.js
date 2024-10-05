const express = require('express');
const { getUsers, getUser, addUser, updateUser, deleteUser } = require('../controllers/usersController');

const router = express.Router();

// Users routes
router.get('/users', getUsers);             // Retrieve all users
router.get('/users/:id', getUser);          // Retrieve a single user by ID
router.post('/users', addUser);              // Add a new user
router.put('/users/:id', updateUser);        // Update an existing user by ID
router.delete('/users/:id', deleteUser);     // Delete a user by ID

module.exports = router;
