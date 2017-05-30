/**
 * Created by Administrator on 2017/04/21.
 */


$(function(){
    (function(){
        //登录页和注册页面互换
        $('#login').on('click',function(){
            $('#logined').show();
            $('#loaded').hide()
        });
        $('#back-load').on('click',function(){
            $('#logined').hide();
            $('#loaded').show()
        });

        // 点击注册功能
        var $logined=$('#logined');
         $logined.find('button').on('click',function(){
             //通过ajax提交请求
             var username=$logined.find('[name="username"]').val();
             var  user = /[\u4e00-\u9fa5]/;
             if (user.test(username)){
                 $('#reg').html('暂时不支持中文用户')
             }else {
                 $.ajax({
                     url:'/api/user/register',
                     type:'post',
                     data:{
                         username:$logined.find('[name="username"]').val(),
                         password:$logined.find('[name="password"]').val(),
                         repassword:$logined.find('[name="repassword"]').val()
                     },
                     dataType:'json',
                     async:'false',
                     success:function(result){
                         $logined.find('.colwarning').html(result.message);
                         if (result.message=='注册成功'){
                             setTimeout(function(){
                                 $('#logined').hide();
                                 $('#loaded').show()
                             },1000)
                         }
                     }
                 })
             }
         });

        //登录
        var $loaded=$('#loaded');
        var   $message=$('#message');
        $loaded.find('button').on('click', load );
        //退出登录
        var $loadout= $('#loadout');
         $loadout.on('click',function(){
             $.ajax({
                 url:'/api/user/logout',
                 success:function(result){
                     if (result.code==0){
                         window.location.reload();
                     }
                 }
             })
         });


        //登录函数
        function load(){
            var   $message=$('#message');
            console.log($loaded.find('[name="username"]').val())

            //通过ajax提交请求
            $.ajax({
                url:'/api/user/login',
                type:'post',
                data:{
                    username:$loaded.find('[name="username"]').val(),
                    password:$loaded.find('[name="password"]').val()
                },
                dataType:'json',
                async:'true',
                success:function(result){

                    $loaded.find('.colwarning').html(result.message);
                    if(result.message=='登录成功'){
                        //$message.show();
                        //$('#logined').hide();
                        //$('#loaded').hide();
                        window.location.reload();
                        $message.find('p').html(result.userInfo.username)
                    }
                }
            })
        }

        //按回车键来进入登录系统
        $(document).keydown(function(event){
            //alert(event.keyCode);//弹出按键的对应值
            if(event.keyCode==13){
                load();
            }
        });


    })();
    (function(){
        $('#fade span').eq(0).addClass('animated fadeInLeft');
        setTimeout(function(){
            $('#fade span').eq(1).css({display:'block'}).addClass('animated fadeInLeft')
        },1000)
    })();
    (function(){
       var content= $('#markcontent').text();
        $('#markcontent').html(content)

    })();
    (function(){
        $(window).scroll(function(){
            if ($(window).scrollTop()>200){
                $('.back-top').fadeIn();
            }else {
                $('.back-top').fadeOut(0);
            }
        });
        $('.back-top').click(function(){
            $('html,body').animate({scrollTop:0} ,600);
        })
    })()
});