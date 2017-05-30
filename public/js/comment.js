/**
 * Created by Administrator on 2017/05/24.
 */
//提交评论
var page=1;
var  pages=0;
var limt=5;
var comments=[];
$('#messagebtn').on('click',function(){
    $.ajax({
        type:'post',
        url:'/api/comment/post',
        data:{
            contentid:$('#contentId').val(),
            content:$('#messagecontent').val()
        },
        success:function(responseData){
            $('#messagecontent').val('');
            comments=responseData.data.reverse();
            renderComment()
        }
    })
});
$.ajax({
    url:'/api/comment',
    data:{
        contentid:$('#contentId').val()
    },
    success:function(responseData){
        comments=responseData.data.reverse();
        renderComment();
    }
});

$('#paging').delegate('a','click',function(){
    if ($(this).parent().hasClass('up')){
        page--;
        if (page<=1){
            page=1
        }
    }else {
        page++;
        if (page>=pages){
            page=pages
        }

    }
    renderComment();
});
function renderComment(){
    $('#messageLength').html(comments.length);
    pages=Math.max(Math.ceil(comments.length/limt),1);
    var start=Math.max(0,(page-1)*limt);
    var end=Math.min(start+limt,comments.length);
    $('#Displaydigit').html(page+'/'+pages);

    if (page<=1){
        page=1;
        $('#up').addClass('disabled')
    }else {
        $('#up').removeClass('disabled')
    }
    if(page>=pages){
        page=pages;
        $('#down').addClass('disabled')
    }else{
        $('#down').removeClass('disabled')
    }
    if(comments.length==0){
        $('#messageList').html('<div style="margin: 10px auto">暂时没有评论(┬＿┬)</div>')
    }else {
        var html='';
        for (var i=start;i<end;i++){
            html+=' <p> <span><i class="fa fa-user-circle"></i>&nbsp;'+comments[i].username+':</span> <span class="pull-right"><i class="fa fa-calendar-check-o"></i>'+formData(comments[i].postTime)+'</span> </p> <p>'+comments[i].content+'</p>';
        }
        $('#messageList').html(html)
    }


}
renderComment();
function formData(d){
    var date1=new Date(d);
    return date1.getFullYear()+'年'+(date1.getMonth()+1)+'月'+date1.getDate()+'日'+date1.getHours()+':'+date1.getMinutes()+':'+date1.getSeconds()
}