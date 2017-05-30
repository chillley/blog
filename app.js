/**
 * Created by Administrator on 2017/3/1.
 */

var express = require('express');
//应用程序入口文件
// 第一步加载express模块


var swig= require('swig');
// 加载模版出来模块

var mongoose= require('mongoose');
//加载数据库模块


//创建APP应用
var app = express();
var User = require('./models/User');

// 加载bodyparser
var bodyParser = require('body-parser');

//加载cookies让登陆过的用户在刷新页面之后能够继续保存下来

var Cookies = require('cookies');



app.use(  bodyParser.urlencoded({extended:true}));

// 设置cookie
  app.use(function(req,res,next){
       req.cookies = new  Cookies(req,res);
      //解析用户的cookie的信息
      req.userInfo={};
        if (req.cookies.get('userInfo')){
            try {
                req.userInfo = JSON.parse(req.cookies.get('userInfo'));
       //获取当前登录用户的类型
                User.findById(req.userInfo.id).then(function(userInfo) {
                    req.userInfo.isAdmin = Boolean(userInfo.isAdmin);
                    // 25.防止报错
                    next();
                });
            }catch (e){
                next()
            }
        }else {
            next();
        }

  });


//设置静态文件托管
// 当用户访问的url/public返回对对应的public下的文件，就是说public下的文件就是静态的，如果其他的就是动态的用路由的方式处理
app.use('/public',express.static( __dirname+'/public'));

//  1  定义当前应用使用的模版引擎
app.engine('html',swig.renderFile);

// 2  设置模版文件存放的目录，第一个参数必须是views，第二个是参数目录的路径
app.set('views','./views');

// 3  注册所使用的模版引擎，第一个参数必须是view engine第二个参数必须和engine中的html一致
app.set('view engine','html');

//   在我们开发过程中需要清除缓存cache默认对是true取消缓存，开发完成后可以删除
swig.setDefaults({cache:false});

///*  req request对象
//   res response对象
//   next 方法函数*/
//    这个get方法就是路由
//app.get('/',function(req,res,next){
//   //res.send('<h1>傻逼</h1>')
//   // 读取views目录下的指定文件解析并返回给客户端还可以传递第二个参数，是传递给模版使用的数据
//    res.render('index.html');
//
//});
//
//根据不同的功能划分模块
app.use('/admin',require('./routers/admin'));
//     处理后台管理的url路由
app.use('/api',require('./routers/api'));
//        //处理api的路由
app.use('/',require('./routers/main'));
// 关于我
app.use('/aboutme',require('./routers/aboutme'));




////监听http请求
mongoose.connect('mongodb://localhost:27018/blog',function(err){
    if (err){
        console.log('数据库连接失败');
    }else{
        console.log('数据库连接成功');

    }
    //监听数据库
    app.listen(8081);
});
