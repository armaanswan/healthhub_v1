const db = require("../lib/db");
const TestResult = db.TestResult;

// Adding a new test result to the db
async function createTestResult(testResultParam) {
  const newTestResult = new TestResult(testResultParam);
  await newTestResult.save();
  return newTestResult;
}

// Retrieving all test results
async function getAllTestResults(skip, limit) {
  const testResults = await TestResult.find().skip(skip).limit(limit);
  const totalTestResults = await TestResult.countDocuments(); // Get the total number of test results for pagination metadata
  return {
    data: testResults,
    total: totalTestResults,
  };
}

// Retrieving a test result by id
async function getById(id) {
  return await TestResult.findById(id);
}

// Updating a test result
async function updateTestResult(id, testResultParam) {
  const testResult = await TestResult.findById(id);
  if (!testResult) throw "Test result not found.";
  Object.assign(testResult, testResultParam);
  await testResult.save();
  return testResult;
}

// Deleting a test result
async function deleteTestResult(id) {
  await TestResult.findByIdAndDelete(id);
}

module.exports = {
  createTestResult,
  getAllTestResults,
  getById,
  updateTestResult,
  deleteTestResult,
};
