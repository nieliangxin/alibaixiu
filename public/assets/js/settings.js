//LOGO上传
$('#logo').on('change', function () {
    let formData = new FormData();
    formData.append('img', this.files[0]);
    $.ajax({
        type: 'post',
        url: '/upload',
        data: formData,
        processData: false,
        contentType: false,
        success: function (res) {
            $('img').attr('src', res[0].img);
            $('#hidden').val(res[0].img);
        }
    })
});
//实现配置设置功能
$('#btn').on('click', function () {
    // 将是否开启评论功能与是否开始人工批准功能的内容写入到我们定义的两个隐藏域 
    $('#comment').val($('#comment_status').prop('checked'));
    $('#review').val($('#review_status').prop('checked'));
    // serialize它会收集表单的数据 一定要表单的控件标签有name属性才会收集
    let data = $('form').serialize();
    $.ajax({
        type: 'post',
        url: '/settings',
        data: data,
        success: function () {
            location.reload();
        }
    })
});
