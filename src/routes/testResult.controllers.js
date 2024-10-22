const express = require("express");
const testResultsRouter = express.Router();
const jwt = require("../lib/jwt");
const Role = require("../lib/role");
const testResultServices = require("../services/testResult.services");

// Routes
testResultsRouter.post("/", jwt([Role.Doctor]), createTestResult);
testResultsRouter.get("/", jwt([Role.Doctor, Role.Staff]), getAllTestResults);
testResultsRouter.get(
  "/:id",
  jwt([Role.Doctor, Role.Staff, Role.Patient]),
  getTestResultById
);
testResultsRouter.put("/:id", jwt([Role.Doctor]), updateTestResult);
testResultsRouter.delete("/:id", jwt([Role.Doctor]), deleteTestResult);

module.exports = { testResultsRouter };

// Route functions
function createTestResult(req, res, next) {
  testResultServices
    .createTestResult(req.body)
    .then((data) =>
      res.json({
        data,
        message: `Test result created successfully for patient with ID ${req.body.patientId}`,
      })
    )
    .catch((error) => next(error));
}

function getAllTestResults(req, res, next) {
  const page = parseInt(req.query._page) || 1; // Default to page 1
  const limit = parseInt(req.query._limit) || 10; // Default to 10 results per page
  const skip = (page - 1) * limit;

  testResultServices
    .getAllTestResults(skip, limit)
    .then((testResults) => res.json(testResults))
    .catch((err) => next(err));
}

function getTestResultById(req, res, next) {
  testResultServices
    .getById(req.params.id)
    .then((testResult) => {
      if (!testResult) {
        res.status(404).json({ message: "Test Result Not Found!" });
        next();
      }
      return res.json({ data: testResult });
    })
    .catch((error) => next(error));
}

function updateTestResult(req, res, next) {
  testResultServices
    .updateTestResult(req.params.id, req.body)
    .then((data) =>
      res.json({
        data,
        message: `Test result with id: ${req.params.id} updated successfully.`,
      })
    )
    .catch((error) => next(error));
}

function deleteTestResult(req, res, next) {
  testResultServices
    .deleteTestResult(req.params.id)
    .then(() =>
      res.json({
        message: `Test result with id: ${req.params.id} deleted successfully.`,
      })
    )
    .catch((error) => next(error));
}
