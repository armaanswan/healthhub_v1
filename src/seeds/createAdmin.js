// src/seeds/createAdmin.js

require('dotenv').config(); // Load environment variables from .env file

const mongoose = require('mongoose');
const userService = require("../services/user.services");
const role = require("../lib/role");

// Ensure the Mongo URI is correctly set in the environment
const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/';

// Connect to MongoDB
mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => {
    console.log("Connected to MongoDB");

    // Call the function to create the admin user
    createAdmin();
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB", err);
  });

// Function to create the admin user
const createAdmin = async () => {
  try {
    const user = await userService.createUser({
      email: "admin@email.com",
      firstName: "Admin",
      lastName: "User",
      phoneNumber: "1234567890",
      dateOfBirth: new Date(),
      password: "admin", // In a real app, you should hash the password before saving
      isActive: true,
      role: role.Admin,  // Assuming 'role.Admin' exists in your role file
    });

    console.log("Created admin user", user.email);
  } catch (err) {
    console.error("Error creating admin user:", err);
  } finally {
    mongoose.connection.close();
  }
};
