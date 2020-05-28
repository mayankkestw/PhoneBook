const express = require('express')
var router = express.Router();

router.get('/', (req, res)=>{
    res.render("contact/addOrEditContact", {
        viewTitle : "Add New Contact"
    });
});

router.post('/', (req, res)=>{
    console.log(req.body);
});

module.exports = router;