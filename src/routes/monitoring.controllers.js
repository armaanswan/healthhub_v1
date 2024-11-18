const express = require('express');
const router = express.Router();
const monitoringServices = require('../services/monitoring.services');

// Routes
router.post('/', createMonitoring);
router.get('/', getAllMonitoring);
router.get('/:id', getMonitoringById);
router.put('/:id', updateMonitoring);
router.delete('/:id', deleteMonitoring);

// Create new monitoring settings
async function createMonitoring(req, res) {
    const monitoringData = req.body;
    const result = await monitoringServices.createMonitoringSettings(monitoringData);
    res.status(201).json({
        success: true,
        message: 'Monitoring settings created successfully',
        data: result
    });
}

// Get all monitoring settings
async function getAllMonitoring(req, res) {
    const { user, doctor } = req.query;
    const filters = {};
    
    if (user) filters.user = user;
    if (doctor) filters.doctor = doctor;
    
    const result = await monitoringServices.getAllMonitoringSettings(filters);
    res.status(200).json({
        success: true,
        data: result
    });
}

// Get monitoring settings by ID
async function getMonitoringById(req, res) {
    const { id } = req.params;
    const result = await monitoringServices.getMonitoringSettingsById(id);
    res.status(200).json({
        success: true,
        data: result
    });
}

// Update monitoring settings
async function updateMonitoring(req, res) {
    const { id } = req.params;
    const updateData = req.body;
    const result = await monitoringServices.updateMonitoringSettings(id, updateData);
    res.status(200).json({
        success: true,
        message: 'Monitoring settings updated successfully',
        data: result
    });
}

// Delete monitoring settings
async function deleteMonitoring(req, res) {
    const { id } = req.params;
    const result = await monitoringServices.deleteMonitoringSettings(id);
    res.status(200).json({
        success: true,
        message: 'Monitoring settings deleted successfully'
    });
}

module.exports = router;
