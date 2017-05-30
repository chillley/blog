/**
 * Created by Administrator on 2017/3/1.
 */
var express = require('express');
var routers= express.Router();
var User = require('../models/User');
var categories=require('../models/category');
var Content = require('../models/Content');
var markdown = require('markdown').markdown;

routers.use(function(req,res,next){
    if (!req.userInfo.isAdmin){
         res.send('对不起只有管理员才可以进入');
         return;
     }
    next();
});

//首页
routers.get('/',function(req,res,next){

   res.render('admin/index',{
       userInfo:req.userInfo

   });
});
 //用户管理
routers.get('/user',function(req,res,next){

    /*从数据库中读取所以用户数据
    *
    * limit(Number)限制获取的条数
    *
    * skip(Number) 跳过数据的条数
    *
    * 每一页显示2条
    * 1：从1-2  skip 0 --》当前页-1*limit
    * 2： 2-3  skip 2
    *
    * */

    var page = Number(req.query.page ||1);
    //var page = 1;
    var limit = 5; //每一页显示的条数

    var pages=0;

    User.count().then(function(count){
        //count获取数据库中所有用户的总条数
        pages = Math.ceil(count/limit);
        page = Math.min(page,pages);
        //最小page页最大不能超过pages页
        page = Math.max(page,1);
        //如果page小于1则取值1

        var skip = (page-1)*limit;

        User.find().limit(limit).skip(skip).then(function(users){
            res.render('admin/user_index',{
                userInfo:req.userInfo,
                users:users,
                count:count,
                pages:pages,
                limit:limit,
                page:page
            });
        });
    });
});


/*分类首页*/
routers.get('/category',function(req,res){

    var page = Number(req.query.page ||1);
    //var page = 1;
    var limit = 2; //每一页显示的条数

    var pages=0;

    categories.count().then(function(count){
        //count获取数据库中所有用户的总条数
        pages = Math.ceil(count/limit);
        page = Math.min(page,pages);
        //最小page页最大不能超过pages页
        page = Math.max(page,1);
        //如果page小于1则取值1

        var skip = (page-1)*limit;

        categories.find().limit(limit).skip(skip).then(function(category){
            res.render('admin/category_index',{
                userInfo:req.userInfo,
                category:category,
                count:count,
                pages:pages,
                limit:limit,
                page:page
            });
        });
    });
});

/*分类的添加*/
routers.get('/category/add',function(req,res){
    res.render('admin/category_add',{
        userInfo:req.userInfo,
    })
});




/*分类的保存*/
routers.post('/category/add',function(req,res){
    var name = req.body.name || '';
     if (name == ''){
        res.render('admin/error',{
            userInfo:req.userInfo,
            message:'名称不能为空'
        })
         return;
    }
    // 数据库中是否存在同类名称
    categories.findOne({
        name:name
    }).then(function(result) {

        if (result) {

            //数据库中已经存在该分类
            res.render('admin/error',{
                userInfo:req.userInfo,
                message:'分类已经存在'
            });

            //不在走then这个方法了
            return Promise.reject();
        }else{
            //数据库不存在该分类，可以保存
            return  new categories({
                name:name
            }).save();
        }
    }).then(function(newCategory) {
        res.render('admin/success',{
            userInfo:req.userInfo,
            message:'分类保存成功',
            url:'/admin/category'
        })
    });
});

/*分类的修改*/

routers.get('/category/edit',function(req,res){
    //要修改的分类的信息
    var id =  req.query.id || '';

    categories.findOne({
          _id:id
    }).then(function(category) {

        if (!category){
            res.render('admin/error',{
                userInfo:req.userInfo,
                message:'分类信息不存在'
            });
        }else {
            res.render('admin/category_edit',{
                userInfo:req.userInfo,
                category:category
            });
        }
    });

    //res.render('admin/category_add',{
    //    userInfo:req.userInfo,
    //})
});


/*分类的修改保存*/

  routers.post('/category/edit',function(req,res){
      //修改的分类的信息
      var id = req.query.id || '';
      //获取post提交过来的名称
      var name = req.body.name || '';
      //获取要修改的分类信息
      categories.findOne({
          _id:id
      }).then(function(category) {

          if (!category){
              res.render('admin/error',{
                  userInfo:req.userInfo,
                  message:'分类信息不存在'
              });
              return Promise.reject();
          }else {
            //当用户没有任何的修改的时候
              if(name == category.name){
                  res.render('admin/success.html',{
                      userInfo:req.userInfo,
                      message:'修改成功',
                      url:'/admin/category'
                  });
                  return Promise.reject();
              }else {
                  //修改的分类是否存在
                 return categories.findOne({
                      _id:{$ne:id},
                      name:name
                  })
              }
          }
      }).then(function(sameCategory){
          if (sameCategory){
              res.render('admin/error',{
                  userInfo:req.userInfo,
                  message:'数据库中已经存在同名分类'
              });
              return Promise.reject();
          }else{
             return categories.update({
                  _id:id
              },{
                  name:name
              })
          }
      }).then(function(){
          res.render('admin/success.html',{
              userInfo:req.userInfo,
              message:'修改成功',
              url:'/admin/category'
          });
      });



  });

/*分类的删除*/
  routers.get('/category/delegate',function(req,res){
      //获取要删除的ID
      var id = req.query.id || '';
      categories.remove({
          _id:id
      }).then(function(){
          res.render('admin/success.html',{
              userInfo:req.userInfo,
              message:'删除成功',
              url:'/admin/category'
          });
      })

  });


/*内容首页*/

routers.get('/content',function(req,res){

    //res.render('admin/content_index.html',{
    //    userInfo:req.userInfo
    //});

    //28.内容首页
    var page = Number(req.query.page || 1);
    var limit = 10;
    var pages = 0;

    //统计数据的总条数
    Content.count().then(function(count) {

        //限制
        // 计算总页数
        pages = Math.ceil( count/limit );
        //取值不能超过pages
        page = Math.min( page,pages );
        //取值不能小于1
        page = Math.max( page,1 );

        var skip = (page - 1)*limit;

        /*
         *	查询的数据的排序
         *	sort()
         *	传一个的对象,
         *	1:升序
         *	-1:降序
         */

        /*	29.populate('category')
         *	是多个表的查询
         *	这个参数是contens的category字段
         **/
        Content.find().sort({addTime:-1}).limit(limit).skip(skip)
            .populate(['category','user']).then(function( contents ) {
            //传递数据上

            res.render('admin/content_index',{
                userInfo:req.userInfo,
                contents:contents,

                count:count,
                pages:pages,
                page:page,
                limit:limit

            });
        });
    });


});

/*内容添加页面*/
routers.get('/content/add',function(req,res){

    categories.find().sort({_id:-1}).then(function(categorise) {

        res.render('admin/content_add',{
            userInfo:req.userInfo,
            categorise:categorise
        });
    });

});
/*
 * 内容保存*/
routers.post('/content/add',function(req,res) {

    if (req.body.category == '') {
        res.render('admin/error',{
            userInfo:req.userInfo,
            message:'分类内容不能为空'
        });
        return false;
    }

    if (req.body.title == '') {
        res.render('admin/error',{
            userInfo:req.userInfo,
            message:'内容标题不能为空'
        });
        return false;
    }


    //27添加内容
    new Content({
        category:req.body.category,
        title:req.body.title,
        user:req.userInfo.id.toString(),
        description:req.body.description,
        content:markdown.toHTML(req.body.content)
    }).save().then(function() {
        res.render('admin/success',{
            userInfo:req.userInfo,
            message:'内容保存成功',
            url:'/admin/content'
        });
    });
});



/*修改内容*/
//30	修改内容
routers.get('/content/edit',function(req,res) {

    var id = req.query.id || '';

    //33
    var categorise = [];

    //32
    categories.find().sort({_id:-1}).then(function(result) {
        // 34
        categorise = result;

        //31,,这里做了修改,复制粘贴，然后又调整了一下
        return Content.findOne({
            _id:id
        }).populate('category');
        //这里关联第二个表

    }).then(function(content) {
        if (!content) {
            res.render('admin/error',{
                userInfo:req.userInfo,
                message:'内容不存在'
            });

            return Promise.reject();
        }else{
            res.render('admin/content_edit',{
                userInfo:req.userInfo,
                categorise:categorise,
                content:content
            });
        }
    });
});

//35.保存修改内容
routers.post('/content/edit',function(req,res) {
    var id = req.query.id || '';
    if (req.body.category == '') {
        res.render('admin/error',{
            userInfo:req.userInfo,
            message:'分类内容不能为空'
        });
        return false;
    };

    if (req.body.title == '') {
        res.render('admin/error',{
            userInfo:req.userInfo,
            message:'内容标题不能为空'
        });
        return false;
    };

    /* ************这里的逻辑和那个很多的逻辑差不多，现在不做修改,直接保存*************** */
    Content.update({
        _id:id
    },{
        category:req.body.category,
        title:req.body.title,
        description:req.body.description,
        content:req.body.content
    }).then(function() {
        res.render('admin/success',{
            userInfo:req.userInfo,
            message:'内容保存成功',
            url:'/admin/content/edit?id=' + id
        });
    });

});

/*数据的删除*/
routers.get('/content/delete',function(req,res) {
    var id = req.query.id || '';

    Content.remove({
        _id:id
    }).then(function() {
        res.render('admin/success',{
            userInfo:req.userInfo,
            message:'删除成功',
            url:'/admin/content'
        });
    });
});


module.exports = routers;