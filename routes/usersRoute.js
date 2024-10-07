const express = require('express');
const {
    getUsers,
    getUser,
    addUser,
    updateUser,
    deleteUser,
    softDeleteUser,
    uploadUserPhoto
} = require('../controllers/usersController');
const multer = require('multer');

// Multer setup for photo upload
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');  // Save photos to 'uploads/' folder
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({ storage });

const router = express.Router();

// Users routes
router.get('/users', getUsers);                  // Retrieve all users (excluding soft-deleted users)
router.get('/users/:id', getUser);               // Retrieve a single user by ID
router.post('/users', addUser);                  // Add a new user
router.put('/users/:id', updateUser);            // Update an existing user by ID
router.delete('/users/:id', deleteUser);         // Permanently delete a user by ID
router.delete('/users/soft-delete/:id', softDeleteUser); // Soft delete a user
router.post('/users/upload-photo/:id', upload.single('photo'), uploadUserPhoto); // Upload user photo

module.exports = router;
