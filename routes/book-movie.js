var express = require('express');
var router = express.Router();
var db=require('../database');
const nodemailer = require("nodemailer");
const session = require('express-session');
const dotenv = require('dotenv');
const { promiseImpl } = require('ejs');
const { callbackPromise } = require('nodemailer/lib/shared');
const { text } = require('express');

dotenv.config();

router.get('/select-movie/:city/:movie', function(req, res){
    var city = req.params.city;
    var movie_name = req.params.movie;
    var sql = "SELECT * FROM movie WHERE `movie_name`=? AND `city`=?"
    db.query(sql,[movie_name,city] , function (err, data, fields) {
        if(err) throw err
        else{
            res.render('view-movies', { title: 'Movies', userData: data, action: "book"});
        }
    })
});

router.get('/book/:id', function(req,res){
    var sql = "SELECT * FROM movie WHERE `id` =?";
    db.query(sql, req.params.id,function(err,data,fields){
        if(err) throw err;
        else{
            res.render('payment', {userData: data})
        }
    })
})

router.post('/payment/:id', function(req,res){
    let fromMail = 'movietickerbooking123@gmail.com';
    let toMail = req.session.emailAddress;
    let subject = 'Ticket Booked';

    var sql = "UPDATE `movie` SET `seats`=`seats`-1 WHERE `id`=? AND `seats` > 0"
    db.query(sql, req.params.id, function(err,data,fields){
        if(err) throw err;
    })

    var sql = "UPDATE `movie` SET `bookedNum`=`bookedNum`+1 WHERE `id`=? AND `bookedNum` < `seats`"
    db.query(sql, req.params.id, function(err,data,fields){
        if(err) throw err;
    })

    var sql = "SELECT * FROM movie WHERE `id` =?";
    db.query(sql, req.params.id, function(err,data,fields){
        if(err) throw err;
        else{
            let text = "Your movie ticket for "+data[0].movie_name+" at "+data[0].theatre+" has been successfully booked for rupees "+data[0].price;
            const transporter = nodemailer.createTransport({
                service: "gmail",
                auth: {
                    user: fromMail,
                    pass: process.env.PASSWORD
                }
            });

            let mailOptions = {
                from: fromMail,
                to: toMail,
                subject: subject,
                text: text
            };

            transporter.sendMail(mailOptions, (error, response) => {
                if (error) {
                    console.log(error);
                }
                console.log(response)
            });

            var accountSid = process.env.TWILIO_ACCOUNT_SID;
            var authToken = process.env.TWILIO_AUTH_TOKEN;
            var client = require('twilio')(accountSid, authToken);
            client.messages.create({
                    from: process.env.TWILIO_PHONE_NUMBER,
                    to: "+91"+req.session.phone,
                    body: text
                }, function(err, message){
                    if(err){
                        console.log(err.message);
                    }
                });
            res.redirect("/dashboard");
        }   
    })
})

module.exports = router;