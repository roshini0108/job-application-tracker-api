const express = require('express');

const app = express();

app.get('/', (req, res) => {
    res.send('Server is running');
});

app.get('/applications', (req, res) => {
    res.send('Applications route working');
});

app.listen(5000, () => {
    console.log('Server running on port 5000');
});