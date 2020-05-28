require('./models/db');

const express = require('express');

const contactController = require('./controllers/contactController');

var app = express();

app.listen(3000, () => {
    console.log('Express server started at port : 3000');
});

app.use('/contact', contactController);