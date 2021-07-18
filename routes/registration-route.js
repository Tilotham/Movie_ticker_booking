var express = require('express');
var router = express.Router();
var db=require('../database');

router.get('/register', function(req, res, next) {
  res.render('registration-form');
});

router.post('/register', function(req, res, next) {
    
    var name = req.body.name;
    var email_address = req.body.email_address;
    var phoneNumber = req.body.phone_number;
    var password = req.body.password;
    var admin = "no";

var sql='SELECT * FROM registration WHERE email_address =?';
db.query(sql, [email_address] ,function (err, data, fields) {
    if(err) throw err
    if(data.length>1){
        var msg = email_address+ " was already exist";
    }else{
        var sql = 'INSERT INTO `registration`(`name`, `email_address`, `phone_number`, `password`, `admin`) VALUES (?,?,?,?,?)';
        db.query(sql, [name,email_address,phoneNumber,password,admin], function (err, data) {
            if (err) throw err;
        });
        var msg ="Your are successfully registered";
    }
    res.render('registration-form',{alertMsg:msg});
})
});

router.get('/userRegisterAdmin', function(req, res, next) {
  res.render('user-register-admin');
});

router.post("/userRegisterAdmin", function(req, res, next) {
    
    var name = req.body.name;
    var email_address = req.body.email_address;
    var phoneNumber = req.body.phone_number;
    var password = req.body.password;
    var admin = "yes";

var sql='SELECT * FROM registration WHERE email_address =?';
db.query(sql, [email_address] ,function (err, data, fields) {
    if(err) throw err
    if(data.length>1){
        var msg = email_address+ " was already exist";
    }else{
        var sql = 'INSERT INTO `registration`(`name`, `email_address`, `phone_number`, `password`, `admin`) VALUES (?,?,?,?,?)';
        db.query(sql, [name,email_address,phoneNumber,password,admin], function (err, data) {
            if (err) throw err;
        });
        var msg ="User Added Successfully";
    }
    res.render('registration-form',{alertMsg:msg});
})
});

module.exports = router;