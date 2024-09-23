const express = require('express')
const mongoose = require('mongoose')
const User = require('./models/usersModel')
const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: false }))
// routes

app.get('/', (req, res) => {
    res.send('Hello Node API')
})

// Users routes
app.get('/users', async (req, res) => {
    try {
        const users = await User.find();
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

app.get('/users/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ message: `User with ID ${id} not found` });
        }
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

app.post('/users', async (req, res) => {
    try {
        const user = await User.create(req.body);
        res.status(201).json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

app.put('/users/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findByIdAndUpdate(id, req.body, { new: true });
        if (!user) {
            return res.status(404).json({ message: `User with ID ${id} not found` });
        }
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

app.delete('/users/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findByIdAndDelete(id);
        if (!user) {
            return res.status(404).json({ message: `User with ID ${id} not found` });
        }
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});
mongoose.connect('mongodb+srv://SejiLamina:20Jessie02mg%2E@sejilaminaapi.2c8i9.mongodb.net/?retryWrites=true&w=majority&appName=SejiLaminaAPI')
  .then(() => {
    console.log('MongoDB Connected...')
    app.listen(3000, () => {
        console.log('Server is running on port 3000')
    });
  })
  .catch((error) => {
    console.log(error);
  });
