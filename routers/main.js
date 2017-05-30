/**
 * Created by Administrator on 2017/3/1.
 */
var express = require('express');
var router = express.Router();
var categories = require('../models/category');
var Content = require('../models/content');
var User = require('../models/user');
var data;


/*通用数据 */
router.use(function(req,res,next){
    data={
        userInfo: req.userInfo,
        category:[],
        list:[]
    };
    categories.find().then(function (category) {
        data.category=category;
        next();
      }).then(function(){
        User.find().then(function (User) {
            data.User = User;
        })
    })
    Content.find().sort({views:-1}).limit(5).then(function(list){

        data.list=list
    })
});

router.get('/', function (req, res, next) {

    data.cate=req.query.category || '';
        data.count=0;
        data.page = Number(req.query.page|| 1);
        data.limit = 4;
        data.pages  = 0;


  var where={};

    if (data.cate){
        where.category=data.cate;
    }
    Content.where(where).count().then(function(count){

        data.count=count;

        // 计算总页数
        data.pages = Math.ceil( data.count/data.limit );
        //取值不能超过pages
        data.page = Math.min( data.page,data.pages );
        //取值不能小于1
        data.page = Math.max( data.page,1 );

        var skip = (data.page - 1)*data.limit;
      return   Content.where(where).find().sort({addTime:-1}).limit(data.limit).skip(skip).populate(['category','user'])
          .sort({
              addTime:-1
          })

    }).then(function(contents){
        data.contents=contents;
        res.render('main/index', data)
    });
});


router.get('/view',function(req,res){

     var contentId=req.query.contentid || '';
     Content.findOne({
        _id:contentId
     }).then(function(content){
        data.content=content;
         content.views++;
         content.save();
        res.render('main/view',data)
     })

});
// 个人页面
//router.get('/aboutme',function(req,res){
//    res.render('main/aboutme')
//})
module.exports = router;