const MonitoringSettings = require('../models/monitoringSettings');

// Create new monitoring settings
const createMonitoringSettings = async (monitoringData) => {
  try {
    const monitoring = new MonitoringSettings(monitoringData);
    return await monitoring.save();
  } catch (error) {
    throw error;
  }
};

// Get all monitoring settings
const getAllMonitoringSettings = async (filters = {}) => {
  try {
    const query = {};
    
    if (filters.user) query.user = filters.user;
    if (filters.doctor) query.doctor = filters.doctor;
    
    const monitoringSettings = await MonitoringSettings.find(query);
    return monitoringSettings;
  } catch (error) {
    throw new Error('Error fetching monitoring settings: ' + error.message);
  }
};

// Get monitoring settings by ID
const getMonitoringSettingsById = async (id) => {
  try {
    const monitoring = await MonitoringSettings.findById(id);
    if (!monitoring) {
      throw new Error('Monitoring settings not found');
    }
    return monitoring;
  } catch (error) {
    throw error;
  }
};

// Update monitoring settings
const updateMonitoringSettings = async (id, updateData) => {
  try {
    const monitoring = await MonitoringSettings.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );
    if (!monitoring) {
      throw new Error('Monitoring settings not found');
    }
    return monitoring;
  } catch (error) {
    throw error;
  }
};

// Delete monitoring settings
const deleteMonitoringSettings = async (id) => {
  try {
    const monitoring = await MonitoringSettings.findByIdAndDelete(id);
    if (!monitoring) {
      throw new Error('Monitoring settings not found');
    }
    return monitoring;
  } catch (error) {
    throw error;
  }
};

module.exports = {
  createMonitoringSettings,
  getAllMonitoringSettings,
  getMonitoringSettingsById,
  updateMonitoringSettings,
  deleteMonitoringSettings,
};
