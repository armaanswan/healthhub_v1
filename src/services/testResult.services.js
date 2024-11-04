const db = require("../lib/db");
const TestResult = db.TestResult;

function defineAbnormality(type, result) {
  switch (type) {
    case "BGL": {
      return result > 100;
    }
    case "BP": {
      return result > 130;
    }
    case "HR": {
      return result > 100 || result < 60;
    }
    case "BT": {
      return result > 37.2;
    }
    case "CL": {
      return result > 200;
    }
    case "BMI": {
      return result > 25;
    }
  }
  return false;
}

// Adding a new test result to the db
async function createTestResult(testResultParam) {
  console.log(testResultParam);
  const newTestResult = new TestResult({
    ...testResultParam,
    isAbnormal: testResultParam?.result
      ? defineAbnormality(testResultParam.examType, testResultParam.result)
      : undefined,
    isReady: Boolean(testResultParam?.result),
  });
  await newTestResult.save();
  return newTestResult;
}

// Retrieving all test results
async function getAllTestResults(skip, limit, queryFilters) {
  const testResults = await TestResult.find(queryFilters)
    .populate("patientId")
    .populate("doctorId")
    .skip(skip)
    .limit(limit);
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
  Object.assign(testResult, {
    ...testResultParam,
    isAbnormal: testResultParam.result
      ? defineAbnormality(testResultParam.examType, testResultParam.result)
      : undefined,
    isReady: Boolean(testResultParam?.result),
  });
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
