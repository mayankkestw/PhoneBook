const express = require('express')
var router = express.Router();
const mongoose = require('mongoose');
const Contact = mongoose.model('Contact');

router.get('/', (req, res, next) => {
    res.render("contact/addOrEditContact", {
        viewTitle: "Add New Contact"
    });
});

router.post('/', (req, res, next) => {
    insertContact(req, res, next);
});

router.get('/list/:page', (req, res, next) => {
    let perPage = 4;
    let page = req.params.page || 1;

    Contact
        .find({}).lean()
        .skip((perPage*page)-perPage)
        .limit(perPage)
        .exec((err, contacts)=>{
            console.log(contacts);
            Contact.count((err, count)=>{
            if(err) return next(err);
            res.render('contact/list', {
                list:contacts,
                current: page,
                pages: Math.ceil(count/perPage)
            });
        });
    });
    
});


function insertContact(req, res, next) {
    var contact = new Contact();
    console.log('save running')
    contact.name = req.body.fullname;
    contact.email = req.body.email;
    contact.mobile = req.body.mobile;
    contact.birthday = req.body.birthday;
    contact.save((err, doc) => {
        if (!err) {
            res.redirect('contact/list/1');
        } else {
            if (err.name === 'MongoError' && err.code === 11000) {
                return res.status(422).send({ success: false, message: 'User already exist!' });
            }
            console.log("Error during record insertion :" + err)
        }
    });
}



module.exports = router;