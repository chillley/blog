/**
 * Created by Administrator on 2017/05/26.
 */
$(function(){
    (function(){
        $('#box').fullpage({
            'verticalCentered': false,
            'css3': true,
            'sectionsColor': ['#254875', '#4b85a0', '#109085'],
            anchors: ['page1', 'page2', 'page3'],
            'navigation': true,
            'navigationPosition': 'right',
            'navigationTooltips': ['aboutme', '掌握技能', '联系我'],
            afterLoad: function(anchorLink, index){
                var loadedSection = $(this);
                //using index
                if(anchorLink == 'page1'){
                    setTimeout(function(){
                        $('#main-intro').find('.intro-box').css('display','block').addClass('animated fadeIn');
                        setTimeout(function(){
                            $('#intro-one').css('display','block').addClass('animated fadeInUp')
                            setTimeout(function(){
                                $('#intro-two').css('display','block').addClass('animated fadeInUp')
                            },1000)
                        },1000)
                    },1000)
                }
                //using anchorLink
                if(anchorLink == 'page2'){
                      $('.skill-intro .col-md-3').hover(function(){
                           var i=  $(this).index()-1;
                          //alert(i)
                          $('.Skill').eq(i).find('p').fadeOut(100).parent().find('span').fadeIn(0).addClass('animated fadeInUp')
                      },function(){
                          var i=  $(this).index()-1;
                          $('.Skill').eq(i).find('span').fadeOut(100).parent().find('p').fadeIn(0).addClass('animated fadeIn')
                      })
                }
            }
        })
    })();
})