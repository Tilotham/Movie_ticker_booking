var express = require('express');
var router = express.Router();
router.get('/admin-dashboard', function(req, res, next) {
    if(req.session.loggedinUser){
        res.render('admin-dashboard',{email:req.session.emailAddress})
    }else{
        res.redirect('/login');
    }
});
module.exports = router;