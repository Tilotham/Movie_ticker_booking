var express = require('express');
var router = express.Router();
var db=require('../database');
router.get('/dashboard', function(req, res, next) {
    if(req.session.loggedinUser){
        res.render('dashboard',{email:req.session.emailAddress})
    }else{
        res.redirect('/login');
    }
});

router.post('/select-city', function(req, res){
    var city = req.body.city;
    var sql = "SELECT DISTINCT `movie_name` FROM movie WHERE city = ?"
    db.query(sql, city ,function (err, data, fields) {
        if(err) throw err   
        else{
            res.render('select-movie', {title: "Movies", userData: data, city: city});
        }
    })
})

module.exports = router;