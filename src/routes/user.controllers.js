const express = require("express");
const usersRouter = express.Router();
const patientsRouter = express.Router();
const userServices = require("../services/user.services");
const Role = require("../lib/role");
const jwt = require("../lib/jwt");

// Routes
usersRouter.post("/login", login);
usersRouter.post("/register", register);
usersRouter.post("/logout", logout);
usersRouter.post("/", jwt([Role.Admin]), createUser);
usersRouter.get("/", jwt([Role.Admin]), getAllUsers);
patientsRouter.get("/", jwt([Role.Doctor, Role.Staff]), getAllUsers);
usersRouter.get("/current", jwt(), getCurrentUser);
usersRouter.get("/:id", jwt(), getUserById);
patientsRouter.get("/:id", jwt(), getUserById);
usersRouter.put("/:id", jwt(), updateUser);
patientsRouter.put("/:id", jwt(), updateUser);
usersRouter.delete("/:id", jwt(), deleteUser);

module.exports = { usersRouter, patientsRouter };

// Route functions
function login(req, res, next) {
  userServices
    .login(req.body)
    .then((user) => {
      // console.log(user);
      if (!user)
        return res
          .status(400)
          .json({ message: "Username or password is incorrect." });
      if (!user.isActive && user.role === Role.Patient) {
        return res.status(400).json({
          message: "Your account is not active. Please contact stuff.",
        });
      }

      res.cookie("jwt", user.token, {
        httpOnly: true,
        secure: false,
        maxAge: 3600000,
      });
      res.json({ user: user, message: "User logged in successfully" });
    })
    .catch((error) => next(error));
}

function createUser(req, res, next) {
  userServices
    .createUser(req.body)
    .then((data) =>
      res.json({
        data,
        message: `User Registered successfully with email ${req.body.email}`,
      })
    )
    .catch((error) => next(error));
}

function register(req, res, next) {
  if (!req.body.role) req.body.role = Role.Patient;
  else if (req.body.role !== Role.Patient) {
    return req.json({
      message: "You can't register someone that is not patient!",
    });
  }
  userServices
    .createUser(req.body)
    .then((user) =>
      res.json({
        user: user,
        message: `User Registered successfully with email ${req.body.email}`,
      })
    )
    .catch((error) => next(error));
}

function logout(_, res) {
  res.clearCookie("jwt");
  res.json({ message: "User logged out successfully" });
}

function getAllUsers(req, res, next) {
  const currentUser = req.auth;
  let roleFilter;

  if (currentUser.role === Role.Patient) {
    return res.status(401).json({ message: "Not Authorized!" });
  }
  if (currentUser.role === Role.Doctor || currentUser.role === Role.Staff) {
    roleFilter = [Role.Patient];
  }

  const page = parseInt(req.query._page) || 1; // Default to page 1
  const limit = parseInt(req.query._limit) || 10; // Default to 10 users per page
  const skip = (page - 1) * limit;

  userServices
    .getAllUsers(skip, limit, roleFilter)
    .then((users) => res.json(users))
    .catch((err) => next(err));
}

function getCurrentUser(req, res, next) {
  console.log(req);
  userServices
    .getById(req.auth.sub)
    .then((user) => (user ? res.json(user) : res.status(404)))
    .catch((error) => next(error));
}

function getUserById(req, res, next) {
  userServices
    .getById(req.params.id)
    .then((user) => {
      if (!user) {
        res.status(404).json({ message: "User Not Found!" });
        next();
      }
      return res.json({
        data: user,
      });
    })
    .catch((error) => next(error));
}

function updateUser(req, res, next) {
  userServices
    .updateUser(req.params.id, req.body)
    .then((data) =>
      res.json({
        data,
        message: `User with id: ${req.params.id} updated successfully.`,
      })
    )
    .catch((error) => next(error));
}

function deleteUser(req, res, next) {
  if (req.auth.sub === req.params.id) {
    return res.status(400).json({ message: "You can't delete yourself!" });
  }
  userServices
    .deleteUser(req.params.id)
    .then(() =>
      res.json({
        message: `User with id: ${req.params.id} deleted successfully.`,
      })
    )
    .catch((error) => next(error));
}
