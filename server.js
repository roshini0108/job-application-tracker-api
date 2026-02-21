const express = require('express');

const app = express();

// Middleware to read JSON data
app.use(express.json());

// Temporary in-memory storage
let applications = [];

// Home Route
app.get('/', (req, res) => {
    res.send('Server is running');
});

// GET all applications
app.get('/applications', (req, res) => {
    res.json(applications);
});
let isLoggedIn = true;
function checkLogin(req, res, next) {

    if (!isLoggedIn) {
        return res.send('You must login first');
    }

    next();
}

// POST add new application
app.post('/applications', checkLogin, (req, res) => {

    const { companyName, role, status } = req.body;

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

    applications.splice(id, 1);

    res.send('Application deleted successfully');

});
app.put('/applications/:id', checkLogin, (req, res) => {

    const id = parseInt(req.params.id);
    const { status } = req.body;

    if (id < 0 || id >= applications.length) {
        return res.send('Invalid application ID');
    }

    applications[id].status = status;

    res.send('Application updated successfully');

});

// Start server
app.listen(5000, () => {
    console.log('Server running on port 5000');
});