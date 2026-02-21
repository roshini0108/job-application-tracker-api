require('dotenv').config();
const pool = require('./db');
const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const app = express();

// Middleware to read JSON data
app.use(express.json());

// Temporary in-memory storage
let applications = [];
let users = [];

const SECRET_KEY = process.env.SECRET_KEY;


function checkLogin(req, res, next) {

    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.send('Token required');
    }

    const token = authHeader.split(' ')[1];

    try {
        jwt.verify(token, SECRET_KEY);
        next();
    } catch (error) {
        res.send('Invalid token');
    }
}
// Home Route
app.get('/', (req, res) => {
    res.send('Server is running');
});

// SIGNUP API
app.post('/signup', async (req, res) => {

    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return res.send('All fields required');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = {
        name,
        email,
        password: hashedPassword
    };

    users.push(newUser);

    res.send('Signup successful');

});
app.get('/users', (req, res) => {
    res.json(users);
});
//Login API
app.post('/login', async (req, res) => {

    const { email, password } = req.body;

    const user = users.find(u => u.email === email);

    if (!user) {
        return res.send('Invalid credentials');
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
        return res.send('Invalid credentials');
    }

    const token = jwt.sign({ email: user.email }, SECRET_KEY);

    res.json({ token });

});

// GET all applications
app.get('/applications', (req, res) => {
    res.json(applications);
});

// POST add new application
app.post('/applications', checkLogin, (req, res) => {

    const { companyName, role, status } = req.body;

    if (!companyName || !role || !status) {
        return res.send('All fields are required');
    }

    const newApplication = {
        companyName,
        role,
        status
    };

    applications.push(newApplication);

    res.send('Application added successfully');
});

// DELETE an application by index
app.delete('/applications/:id', checkLogin, (req, res) => {

    const id = parseInt(req.params.id);

    if (id < 0 || id >= applications.length) {
        return res.send('Invalid application ID');
    }

    applications.splice(id, 1);

    res.send('Application deleted successfully');
});

// PUT update application status
app.put('/applications/:id', checkLogin, (req, res) => {

    const id = parseInt(req.params.id);
    const { status } = req.body;

    if (id < 0 || id >= applications.length) {
        return res.send('Invalid application ID');
    }

    if (!status) {
        return res.send('Status is required');
    }

    applications[id].status = status;

    res.send('Application updated successfully');
});

// Global Error Handler Middleware
app.use((err, req, res, next) => {
    res.status(500).send('Something went wrong');
});
pool.query('SELECT NOW()', (err, res) => {
    if (err) {
        console.log(err);
    } else {
        console.log('PostgreSQL connected');
    }
});
// Start server
app.listen(5000, () => {
    console.log('Server running on port 5000');
});