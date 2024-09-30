const express = require('express');
const User = require('../models/usersModel')
const { getUsers, getUser, addUser, updateUser, deleteUser} = require('../controllers/usersController');

const router = express.Router();

// Users routes
router.get('/users', getUsers);

router.get('/users/:id', getUser);

router.post('/users', addUser);

router.put('/users/:id', updateUser);

router.delete('/users/:id', deleteUser);

module.exports = router;