//实现退出功能
$('#logout').on('click', function () {
    let isConfirm=confirm('您确定要退出吗?');
    if(isConfirm){
      $.ajax({
        type:'post',
        url:'/logout',
        success: function () {
          //跳转页面
          location.href='login.html'
        },
        error:function(){
          alert('退出失败');
        }
      })
    }
  })