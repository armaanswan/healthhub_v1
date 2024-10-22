const express = require("express");
const { usersRouter, patientsRouter } = require("./user.controllers");
const { testResultsRouter } = require("./testResult.controllers");
const router = express.Router();

router.use("/users", usersRouter);
router.use("/patients", patientsRouter);
router.use("/test-results", testResultsRouter);

module.exports = router;
