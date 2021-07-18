var express = require('express');
var router = express.Router();
var db=require('../database');
router.get('/login', function(req, res, next) {
  res.render('login-form');
});

router.post('/login', function(req, res){
    var emailAddress = req.body.email_address;
    var password = req.body.password;
    var admin = req.body.admin;
    console.log(admin);

    var sql='SELECT * FROM registration WHERE email_address =? AND password =? AND admin =?';
    db.query(sql, [emailAddress, password, admin], function (err, data, fields) {
        if(err) throw err
        if(data.length>0){
            req.session.loggedinUser= true;
            req.session.emailAddress= emailAddress;
            req.session.phone= data[0].phone_number;
            if(admin == "yes"){
                res.redirect('/admin-dashboard');
            }else{
                res.redirect('/dashboard');
            }
        }else{
            res.render('login-form',{alertMsg:"Invalid Credentials"});
        }
    })
})
module.exports = router;