const express = require('express')
var router = express.Router();
const mongoose = require('mongoose');
const Contact = mongoose.model('Contact');

router.get('/', (req, res, next) => {
    res.render("contact/addOrEditContact", {
        viewTitle: "Add New Contact"
    });
});

router.post('/', (req, res) => {
    if (req.body._id==''){
        insertContact(req, res);
    }else{
        updateContact(req, res);
        }
});

router.get('/list/:page', (req, res, next) => {
    let perPage = 4;
    let page = req.params.page || 1;

    Contact
        .find({}).lean().sort({name:"asc"})
        .skip((perPage*page)-perPage)
        .limit(perPage)
        .exec((err, contacts)=>{
            Contact.countDocuments((err, count)=>{
            if(err) return next(err);
            res.render('contact/list', {
                list:contacts,
                current: page,
                pages: Math.ceil(count/perPage)
            });
        });
    });
    
});


function insertContact(req, res) {
    var contact = new Contact();
    console.log('save running')
    contact.name = req.body.fullname;
    contact.email = req.body.email;
    contact.mobile = req.body.mobile;
    contact.birthday = req.body.birthday;
    contact.save((err, doc) => {
        if (!err) {
            res.redirect('/list/1');
        } else {
            if (err.name === 'MongoError' && err.code === 11000) {
                return res.status(422).send({ success: false, message: 'User already exist!' });
            }
            console.log("Error during record insertion :" + err)
        }
    });
}

function updateContact(req, res) {
    Contact.findOneAndUpdate({ _id: req.body._id }, req.body, { new: true }, (err, doc) => {
        if (!err) { res.redirect('/list/1'); }
        else {
            if (err.name == 'ValidationError') {
                handleValidationError(err, req.body);
                res.render("contact/addOrEditContact", {
                    viewTitle: 'Update Contact',
                    contact: req.body
                });
            }
            else
                console.log('Error during record update : ' + err);
        }
    });
}

router.get('/:id', (req, res) => {
    Contact.findById(req.params.id, (err, docs) => {
        if (!err) {
            res.render("contact/addOrEditContact", {
                viewTitle: "Update Contact",
                contact: JSON.parse(JSON.stringify(docs))
            });
        }
    });
});


router.get('/delete/:id',(req, res)=>{
    Contact.findByIdAndRemove(req.params.id, (err, doc) => {
        if (!err) {
            res.redirect('/list/1');
        }
        else { console.log('Error in deletion :' + err); }
    });
});

router.get('/autocomplete/', function(req, res, next){
    var regex = new RegExp(req.query["term"],'i');
    console.log(regex);
    var contactFilter = Contact.find({name:regex}, {'name':1}).sort({"updated_at":-1}).sort({"created_at":-1}).limit(10);
    contactFilter.exec(function(err, data){
        console.log(data);
        var result = [];
        if(!arr){
            if(data && data.length && data.length>0){
                data.forEach(user=>{
                    let obj={
                        id:user._id,
                        label:user.name
                    };
                    result.push(obj);
                });
            }
            res.jsonp(result);
        }
    });
});

module.exports = router;