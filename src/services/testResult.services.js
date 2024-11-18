const db = require("../lib/db");
const TestResult = db.TestResult;
const MonitoringSettings = db.MonitoringSettings;

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

async function createTestResult(testResultParam) {
  const newTestResult = new TestResult({
    ...testResultParam,
    isAbnormal: testResultParam?.result
      ? defineAbnormality(testResultParam.examType, testResultParam.result)
      : undefined,
    isReady: Boolean(testResultParam?.result),
  });
  
  if (testResult.isAbnormal && testResultParam.patientId) {
    const monitoring = await MonitoringSettings.find({
      patientId: testResultParam.patientId,
      monitoredFunction: testResultParam.examType,
    });

    if (monitoring.length > 0) {
      monitoring.forEach(monitoring => {
        console.log('ABNORMAL TEST RESULT ALERT (UPDATE):', {
          testResult: testResult._id,
          patient: testResultParam.patientId,
          doctor: monitoring.doctorId,
          monitoredFunction: testResultParam.examType,
          result: testResultParam.result,
          timestamp: new Date().toISOString()
        });
      });
    }
  }
  
  await newTestResult.save();
  return newTestResult;
}

async function getAllTestResults(skip, limit, queryFilters) {
  const testResults = await TestResult.find(queryFilters)
    .populate("patientId")
    .populate("doctorId")
    .skip(skip)
    .limit(limit);
  const totalTestResults = await TestResult.countDocuments();
  return {
    data: testResults,
    total: totalTestResults,
  };
}

async function getById(id) {
  return await TestResult.findById(id);
}

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

  console.log('TEST RESULT:', testResult.isAbnormal, testResultParam.patientId, testResultParam.examType);

  if (testResult.isAbnormal && testResultParam.patientId) {
    const monitoring = await MonitoringSettings.find({
      patientId: testResultParam.patientId,
      monitoredFunction: testResultParam.examType,
    }).populate('doctorId');

    if (monitoring.length > 0) {
      monitoring.forEach(monitoring => {
        console.log('ABNORMAL TEST RESULT ALERT (UPDATE):', {
          testResult: testResult._id,
          patient: testResultParam.patientId,
          doctor: monitoring.doctorId,
          monitoredFunction: testResultParam.examType,
          result: testResultParam.result,
          timestamp: new Date().toISOString()
        });
      });
    }
  }

  await testResult.save();
  return testResult;
}

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
