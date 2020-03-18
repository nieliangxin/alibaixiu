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
            location.href = 'posts.html'
        }
    })
});
//封装一个函数 根据参数来返回对应的值 如果有就返回,如果没有就返回-1
function getParams(key) {
    //先获取浏览器上的地址栏,从?后面开始截取 用&分隔为数组
    let params = location.search.substr(1).split('&');
    //遍历数组
    for (var i = 0; i < params.length; i++) {
        //返回的是key=value的形式的字符串 将其转换为数组
        let temp = params[i].split('=');
        if (temp[0] === key) {
            return temp[1]
        }
    }
    return -1
}
//调用函数 传id实参过去
let id = getParams('id');
if (id != -1) {
    //根据id获取相关的内容显示在页面上
    $.ajax({
        type: 'put',
        url: '/posts/' + id,
        success: function (res) {
            console.log(res);
            $('h1').text('编辑文章');
            $('#title').val(res.title);
            $('#content').val(res.content);
            $('.thumbnail').show().attr('src', res.thumbnail);
            $('#hidden').val(res.thumbnail);
            $('#created').val(res.createAt.substr(0, 16));
            //先获取所有id=category的option
            $('#category option').each(function (index, item) {
                //console.log($(item).attr('value'));
                if ($(item).attr('value') == res.category._id) {
                    $(item).prop('selected', true);
                }
            });
            //获取id=status所有的option
            $('#status option').each(function (index, item) {
                //console.log($(item).attr('value'));
                if ($(item).attr('value') == res.state) {
                    $(item).prop('selected', true);
                }
            });
            $('#btnAdd').hide();
            $('#btnEdit').show();
        }
    })
};
//实现编辑功能
$('#btnEdit').on('click', function () {
    //获取表单的数据
    let data = $('form').serialize();
    $.ajax({
        type: 'put',
        url: '/posts/' + id,
        data: data,
        success: function (res) {
            location.href='posts.html'
        }
    })
})