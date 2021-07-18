var express = require('express');
var router = express.Router();
var db=require('../database');
router.get('/add-movie', function(req, res, next) {
    res.render('add-movie');
});

router.post('/add-movie', function(req, res){

    var movie_name = req.body.movie_name;
    var city = req.body.city;
    var theatre = req.body.theatre;
    var seats = req.body.seats;
    var price = req.body.price;
    var tickerNum = '0';

    var sql='SELECT * FROM movie WHERE movie_name =? AND city =? AND theatre =?';
    db.query(sql, [movie_name,city,theatre] ,function (err, data, fields) {
        if(err) throw err
        if(data.length>1){
            var msg = movie_name+ " was already exist on "+theatre+" "+city;
        }else{
            var sql = 'INSERT INTO `movie`(`movie_name`, `city`, `theatre`, `seats`, `price`, `bookedNum`) VALUES (?,?,?,?,?,?)';
            db.query(sql, [movie_name,city,theatre,seats,price,tickerNum], function (err, data) {
                if (err) throw err;
            });
            var msg ="Movie Added Successfully";
        }
        res.render('add-movie', {alertMsg:msg});
    })
  
})

router.get('/view-movies', function(req, res){

    var sql='SELECT * FROM movie';
    db.query(sql, function (err, data, fields) {
        if(err) throw err
        else{
            res.render('view-movies', { title: 'Movies', userData: data, action: "delete-movie"});
        }
    })
  
})

router.get('/delete-movie/:id', function(req,res){
    var sql = "DELETE FROM `movie` WHERE id = ?;"
    db.query(sql, req.params.id, function (err, data, fields) {
        if(err) throw err
        else{
            res.redirect('/view-movies');
        }
    })
})

module.exports = router;