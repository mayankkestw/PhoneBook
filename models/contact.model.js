const mongoose = require('mongoose');

var contactSchema = new mongoose.Schema({
    name: {
        type: String,
        required: 'this is a required field.'
    },
    email: {
        type: String
    },
    mobile: {
        type: String,
        required: true,
        unique: true
    },
    birthday: {
        type: String
    }
});


mongoose.model('Contact', contactSchema)
