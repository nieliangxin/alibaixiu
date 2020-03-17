//获取所有文章分类数据
$.ajax({
    type: 'get',
    url: '/categories',
    success: function (res) {
        let html = template('cvTpl', { data: res });
        $('#category').html(html);
    }
});
//实现图片上传
$('#feature').on('change', function () {
    //创建formdata对象
    let formData = new FormData();
    //将所选文件追加到formdata对象中
    formData.append('img', this.files[0]);
    //实现图片上传
    $.ajax({
        type: 'post',
        url: '/upload',
        data: formData,
        contentType: false,
        processData: false,
        success: function (res) {
            //将图片地址保存到隐藏域中
            $('#hidden').val(res[0].img);
            //图片预览
            $('.thumbnail').attr('src', res[0].img);
            $('.thumbnail').show();
        }
    })
});
//实现创建文章功能
$('#btnAdd').on('click', function () {
    let data = $('form').serialize();
    //发送请求
    $.ajax({
        type: 'post',
        url: '/posts',
        data: data,
        success: function (res) {
            //文章添加成功后,跳转页面
            location.href='posts.html'
        }
    })
})