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
  
  if (newTestResult.isAbnormal && testResultParam.patientId) {
    const monitoring = await MonitoringSettings.find({
      patientId: testResultParam.patientId,
      monitoredFunction: testResultParam.examType,
    });

    if (monitoring.length > 0) {
      monitoring.forEach(monitoring => {
        console.log('ABNORMAL TEST RESULT ALERT (CREATE):', {
          testResult: newTestResult._id,
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

async function getAllTestResults(skip, limit, queryFilters, querySorters) {
  const [sort, order] = querySorters;
  
  const findQuery = Object.entries(queryFilters).reduce((acc, [key, value]) => {
    if (typeof value === 'string') {
      acc[key] = { $regex: value, $options: 'i' };
    } else {
      acc[key] = value;
    }
    return acc;
  }, {});
  
  const sortObj = sort ? { [sort]: order === "desc" ? -1 : 1 } : {};

  const testResults = await TestResult.find(findQuery)
    .populate("patientId")
    .populate("doctorId")
    .sort(sortObj)
    .skip(skip)
    .limit(limit);

  const totalTestResults = await TestResult.countDocuments(findQuery);

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

async function generatePatientReport(patientId, period, value) {
  const currentDate = new Date();
  let startDate, endDate;
  let isPrediction = false;
  
  if (period === 'month') {
    // For monthly report
    const year = new Date().getFullYear();
    if (value < 1 || value > 12) {
      throw new Error('Invalid month value. Must be between 1 and 12');
    }
    
    startDate = new Date(year, value - 1, 1);
    endDate = new Date(year, value, 0); // Last day of the month
    
    if (startDate > currentDate) {
      console.log('Future month requested');
      isPrediction = true;
      // Get historical data for prediction (last 12 months or 3 years depending on period)
      const historicalStartDate = new Date(currentDate.getFullYear() - 1, currentDate.getMonth(), 1);

      const historicalData = await TestResult.find({
        patientId: patientId,
        createdDate: {
          $gte: historicalStartDate,
          $lte: currentDate
        },
        isReady: true 
      }).sort({ createdDate: 1 });

      // Generate simple predictions based on historical trends
      const predictions = generatePredictions(historicalData, period, startDate, endDate);

      return {
        message: 'Predicted data based on historical trends',
        isPrediction: true,
        data: predictions,
        confidence: 'low' // Adding confidence level for transparency
      };
    }
  } else if (period === 'year') {
    // For yearly report
    if (value > currentDate.getFullYear()) {
      console.log('Future year requested');
      isPrediction = true;
      // Get historical data for prediction (last 3 years)
      const historicalStartDate = new Date(currentDate.getFullYear() - 3, 0, 1);

      const historicalData = await TestResult.find({
        patientId: patientId,
        createdDate: {
          $gte: historicalStartDate,
          $lte: currentDate
        },
        isReady: true 
      }).sort({ createdDate: 1 });

      // Generate simple predictions based on historical trends
      const predictions = generatePredictions(historicalData, period, startDate, endDate);

      return {
        message: 'Predicted data based on historical trends',
        isPrediction: true,
        data: predictions,
        confidence: 'low' // Adding confidence level for transparency
      };
    }
    
    startDate = new Date(value, 0, 1);
    endDate = new Date(value, 11, 31);
  } else {
    throw new Error('Invalid period type. Must be "month" or "year"');
  }

  const testResults = await TestResult.find({
    patientId: patientId,
    createdDate: {
      $gte: startDate,
      $lte: endDate
    },
    isReady: true 
  })
  .populate('patientId', 'firstName lastName')
  .sort({ createdDate: 1 });

  return {
    patientId,
    period: {
      type: period,
      value: value
    },
    dateRange: {
      from: startDate,
      to: endDate
    },
    totalTests: testResults.length,
    testResults
  };
}

function generatePredictions(historicalData, period, startDate, endDate) {
  console.log('HISTORICAL DATA:', historicalData);
  if (!historicalData.length) return [];
  
  // Group historical data by exam type
  const groupedData = historicalData.reduce((acc, item) => {
    if (!acc[item.examType]) acc[item.examType] = [];
    acc[item.examType].push({
      result: item.result,
      date: item.createdDate
    });
    return acc;
  }, {});
  console.log('GROUPED DATA:', groupedData);

  // Calculate simple linear trend for each exam type
  const predictions = [];
  Object.entries(groupedData).forEach(([examType, data]) => {
    if (data.length < 2) return; // Need at least 2 points for trend

    // Calculate average change over time
    const avgChange = calculateAverageTrend(data);
    
    // Generate predicted value
    const lastValue = data[data.length - 1].result;
    const timeDiff = startDate - data[data.length - 1].date;
    const monthsDiff = timeDiff / (1000 * 60 * 60 * 24 * 30);
    
    const predictedValue = lastValue + (avgChange * monthsDiff);
    
    predictions.push({
      examType,
      result: Math.round(predictedValue * 100) / 100, // Round to 2 decimal places
      predictedDate: startDate,
      isAbnormal: defineAbnormality(examType, predictedValue)
    });
  });

  return predictions;
}

function calculateAverageTrend(data) {
  const changes = [];
  for (let i = 1; i < data.length; i++) {
    const timeDiff = (data[i].date - data[i-1].date) / (1000 * 60 * 60 * 24 * 30); // Convert to months
    const valueDiff = data[i].result - data[i-1].result;
    changes.push(valueDiff / timeDiff);
  }
  
  return changes.reduce((sum, change) => sum + change, 0) / changes.length;
}

module.exports = {
  createTestResult,
  getAllTestResults,
  getById,
  updateTestResult,
  deleteTestResult,
  generatePatientReport,
};
