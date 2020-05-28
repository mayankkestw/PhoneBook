const mongoose = require('mongoose');

var contactSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String
    },
    mobile: {
        type: String
    },
    birthday: {
        type: Date
    }
});

mongoose.model('Contact', contactSchema)
