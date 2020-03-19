//展示轮播图列表
//定义一个数组
let slideArr = [];
//发送请求展示数据
$.ajax({
    type: 'get',
    url: '/slides',
    success: function (res) {
      //  console.log(res);
      slideArr = res;
      render();
    }
});
//封装函数
function render() {
    let html = template('sTpl', { data: slideArr });
    $('tbody').html(html);
};
//实现图片上传功能
$('#image').on('change', function () {
    //用户选择到的文件
    let formData = new FormData();
    formData.append('img', this.files[0]);
    $.ajax({
        type: 'post',
        url: '/upload',
        data: formData,
        contentType: false,
        processData: false,
        success: function (res) {
            //实现图片预览
            $('.thumbnail').show().attr('src', res[0].img);
            $('#hidden').val(res[0].img);
        }
    })
});
 // 实现轮播图的添加功能 
$('#btn').on('click', function () {
    let data = $('form').serialize();
    $.ajax({
        type: 'post',
        url: '/slides',
        data: data,
        success: function (res) {
            slideArr.push(res);
            render();
            // 把对应的数据清空
            $('.thumbnail').hide().attr('src', '');
            $('#image').val('')
            $('#hidden').val('');
            $('input[name="title"]').val('');
            $('input[name="link"]').val('');
        }
    })
});
//实现图片删除功能
$('tbody').on('click', '.delete', function () {
    //获取当前被点击的id
    let id = $(this).attr('data-id');
    if (confirm('您确定要删除吗?')) {
        $.ajax({
            type: 'delete',
            url: '/slides/' + id,
            success: function (res) {
                let index = slideArr.findIndex(item => item._id === res._id);
                slideArr.splice(index, 1);
                render();
            }
        })
    }
});