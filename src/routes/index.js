const express = require("express");
const { usersRouter, patientsRouter } = require("./user.controllers");
const router = express.Router();

router.use("/users", usersRouter);
router.use("/patients", patientsRouter);

module.exports = router;
