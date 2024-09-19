const mongoose = require('mongoose')

const patientSchema = mongoose.Schema(
    {
        lastName: {
            type: String,
            required: [true, 'Last Name is required'],
        },
        firstName: {
            type: String,
            required: [true, 'First Name is required'],
        }
    },
    {
        timestamps: true,
    }
)

const Patient = mongoose.model('Patient', patientSchema);

module.exports = Patient;