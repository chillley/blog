/**
 * Created by Administrator on 2017/3/1.
 */
var express = require('express');
var routers= express.Router();




/*
        用户名注册

           注册逻辑
           1.用户名不能为空
           2密码不能为空
           3两次输入的密码必须一致

           数据库
           用户名是否被注册

           */
    //  统一返回格式
//引入数据库
  var User = require('../models/user');
  var Content=require('../models/Content');



var responseData;



//获取指定文章评论
routers.get('/comment',function(req,res) {

    var contentId = req.query.contentid || '';

    Content.findOne({
        _id:contentId
    }).then(function(content) {
        responseData.data = content.comments;
        res.json(responseData);
    })
});



  routers.use(function(req,res,next){
       responseData={
         code:0,
         message:''
       };
       next()
  });

routers.post('/user/register',function(req,res,next){

   var username = req.body.username;
   var password = req.body.password;
   var repassword = req.body.repassword;


   // 用户名是否为空

   if (username==''){
       responseData.code=1;
      responseData.message='用户名不能为空';
      res.json(responseData);
      return;
   }
   // 密码是否为空
   if (password==''){
      responseData.code=2;
      responseData.message='密码不能为空';
      res.json(responseData);
      return;
   }
   // 两次输入的密码不一致
   if(password!=repassword){
      responseData.code=3;
      responseData.message='亲，两次输入的密码不一致';
      res.json(responseData);
      return;
   }

   //  在数据库中判断用户名是否被注册了
    User.findOne({
      username:username
      }).then(function(userInfo){
       if(userInfo){
          //表示数据库中有该用户名
          responseData.code=4;
          responseData.message = '用户名已经被注册了';
          res.json(responseData);
           return
       }
       //保存用户信息到数据中
        var userMassage = new User({
           username:username,
            password:password
        });
        return userMassage.save();
    }).then(function(newUserInfo){

       responseData.message = '注册成功';
       res.json(responseData);
    });
});
  // 验证是否是管理员


     //登录
routers.post('/user/login',function(req,res,next) {

   var username = req.body.username;
   var password = req.body.password;

    if (  username == '' || password==''){
         responseData.code = 1;
         responseData.message = '用户名密码不能为空';
         res.json(responseData);
         return false;
    }
    else  {
      // 查询数据库中相同用户名和密码的记录是否存在 如果存在则登录成功
      //   User.reviews.createIndex( { username: "text" })
         User.findOne({
         username:username,
         password:password
       }).then(function(userInfo){
           if (!userInfo){
            responseData.code = 2;
            responseData.message = '用户名或密码错误';
            res.json(responseData);
            return false;
         }else {
            //用户名和密码是正确的
             responseData.message = '登录成功';
             responseData.userInfo={
                 id:userInfo.id,
                 username:userInfo.username
             };
             req.cookies.set('userInfo',JSON.stringify({
                 id:userInfo.id,
                 username:userInfo.username
             }));
             res.json(responseData);
            return false;
         }
      });
   }
});


   //退出
routers.get('/user/logout',function(req,res) {

    req.cookies.set('userInfo',null);

    res.json(responseData);

});

//评论提交
routers.post('/comment/post',function(req,res){
   //内容id
    var contentId=req.body.contentid ||'';
    var postData={
        username:req.userInfo.username,
        postTime: new Date(),
        content:req.body.content
    }
 //查询这篇内容的信息
    Content.findOne({
        _id:contentId
    }).then(function(content) {
        content.comments.push(postData);
        return content.save();
    }).then(function(newContent) {
        responseData.message = '评论成功';
        responseData.data = newContent.comments;
        res.json(responseData);
    })

})




   module.exports = routers;