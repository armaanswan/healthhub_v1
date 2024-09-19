const express = require('express')
const mongoose = require('mongoose')
const Patient = require('./models/patientModel')
const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: false }))
// routes

app.get('/', (req, res) => {
    res.send('Hello Node API')
})

app.get('/blog', (req, res) => {
    res.send('Hello Blog. My Name is Jessie')
})

app.get('/patients', async(req, res) => {
    try {
        const patients = await Patient.find();
        res.status(200).json(patients);
    } catch (error) {
        console.log(error.message)
        res.status(500).json({message: error.message})
    }
})

app.get('/patients/:id', async(req, res) => {
    try {
        const {id} = req.params;
        const patient = await Patient.findById(id);
        res.status(200).json(patient);
    } catch (error) {
        res.status(500).json({message: error.message})
    }
})

app.post('/patients', async(req, res) => {
    try {
        const patient = await Patient.create(req.body)
        res.status(200).json(patient);
    } catch (error) {
        console.log(error.message)
        res.status(500).json({message: error.message})
    }
})

// update a patient
app.put('/patients/:id', async(req, res) => {
    try {
        const {id} = req.params;
        const patient = await Patient.findByIdAndUpdate(id, req.body);
        // no patient found
        if(!patient){
            return res.status(404).json({message: 'Patient with ID ${id} not found'})
        }
        const updatedPatient = await Patient.findById(id);
        res.status(200).json(updatedPatient);

    } catch (error) {
        res.status(500).json({message: error.message})
    }
})

// delete a patient
app.delete('/patients/:id', async(req, res) => {
    try {
        const {id} = req.params;
        const patient = await Patient.findByIdAndDelete(id);
        if(!id){
            return res.status(404).json({message: 'Patient with ID ${id} not found'})
        }
        res.status(200).json(patient);
    } catch (error) {
        res.status(500).json({message: error.message})
    }
})

mongoose.connect('')
  .then(() => {
    console.log('MongoDB Connected...')
    app.listen(3000, () => {
        console.log('Server is running on port 3000')
    });
  })
  .catch((error) => {
    console.log(error);
  });
