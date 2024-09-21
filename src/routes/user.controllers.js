const express = require("express");
const router = express.Router();
const userServices = require("../services/user.services");
const Role = require("../lib/role");
const jwt = require("../lib/jwt");

// Routes
router.post("/login", login);
router.post("/register", register);
router.get("/", jwt(Role.Admin), getAllUsers);
router.get("/current", jwt(), getCurrentUser);
router.get("/:id", getUserById);
router.put("/:id", updateUser);
router.delete("/:id", deleteUser);

module.exports = router;

// Route functions
function login(req, res, next) {
  userServices
    .login(req.body)
    .then((user) => {
      console.log(user);
      user
        ? res.json({ user: user, message: "User logged in successfully" })
        : res
            .status(400)
            .json({ message: "Username or password is incorrect." });
    })
    .catch((error) => next(error));
}

function register(req, res, next) {
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

function getAllUsers(req, res, next) {
  const currentUser = req.user;

  if (currentUser.role !== Role.Admin) {
    return res.status(401).json({ message: "Not Authorized!" });
  }
  userServices
    .getAllUsers()
    .then((users) => res.json(users))
    .catch((err) => next(err));
}

function getCurrentUser(req, res, next) {
  console.log(req);
  userServices
    .getUserById(req.user.sub)
    .then((user) => (user ? res.json(user) : res.status(404)))
    .catch((error) => next(error));
}

function getUserById(req, res, next) {
  userServices
    .getUserById(req.params.id)
    .then((user) => {
      if (!user) {
        res.status(404).json({ message: "User Not Found!" });
        next();
      }
      return res.json(user);
    })
    .catch((error) => next(error));
}

function updateUser(req, res, next) {
  userServices
    .updateUser(req.params.id, req.body)
    .then(() =>
      res.json({
        message: `User with id: ${req.params.id} updated successfully.`,
      })
    )
    .catch((error) => next(error));
}

function deleteUser(req, res, next) {
  userServices
    .deleteUser(req.params.id)
    .then(() =>
      res.json({
        message: `User with id: ${req.params.id} deleted successfully.`,
      })
    )
    .catch((error) => next(error));
}
