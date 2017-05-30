/**
 * Created by Administrator on 2017/05/26.
 */
var express = require('express');
var router= express.Router();


router.get('/',function(req,res,next){
    res.render('main/aboutme');
});
module.exports = router;