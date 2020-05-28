const express = require('express')
var router = express.Router();
const mongoose = require('mongoose');
const Contact = mongoose.model('Contact');

router.get('/', (req, res)=>{
    res.render("contact/addOrEditContact", {
        viewTitle : "Add New Contact"
    });
});

router.post('/', (req, res)=>{
    insertContact(req, res);
});

function insertContact(req, res){
    var contact = new Contact();
    console.log('save running')
    contact.name = req.body.fullname;
    contact.email = req.body.email;
    contact.mobile = req.body.mobile;
    contact.birthday = req.body.birthday;
    contact.save((err, doc)=>{
        if(!err){
            res.redirect('contact/list');
        }else{
            console.log("Error during record insertion :"+ err)
        }
    });
}

router.get('/list', (req, res)=>{
    res.json('from list');
});

module.exports = router;