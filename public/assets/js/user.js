$('#userForm').on('submit', function () {
    let formData = $(this).serialize();
    //发送请求
    $.ajax({
        type: 'post',
        url: '/users',
        data: formData,
        success: function () {
            //刷新页面
            location.reload();
        },
        error: function () {
            alert('用户添加失败');
        }
    })
    //阻止表单默认提交行为
    return false;
});
//展示用户列表
//创建一个存储用户的空数组
let userArr = [];
$.ajax({
    type: 'get',
    url: '/users',
    success: function (res) {
        userArr = res;
        //调用函数
        render();
    }
});
//封装字符串拼接函数
function render() {
      //字符串拼接
      let html = template('userTpl', { data: userArr });
      //显示页面
      $('tbody').html(html);
};
// 实现图片上传功能 
//ajax来实现用户添加功能
$('#modifyBox').on('change', '#avatar', function () {
    //用户选择到的文件
   let formData = new FormData();
   formData.append('avatar', this.files[0]);
   $.ajax({
       type: 'post',
       url: '/upload',
       data: formData,
       //只要是通过jquery中的ajax来实现文件上传功能就需要下面两行代码
       //告诉$.ajax方法不要解析请求参数
       processData: false,
       //告诉$.ajax方法不要设置请求参数的类型
       contentType: false,
       success: function (res) {
           //实现头像预览功能 发送到服务器
           $('#preview').attr('src', res[0].avatar);
           //将图片地址保存到隐藏域中 点击提交按钮后发送请求,然后写到数据库
           $('#hiddenAvatar').val(res[0].avatar);
       }
   })
});
//通过事件委托的方式为编辑按钮添加点击事件
$('tbody').on('click', '.edit', function () {
    let id = $(this).attr('data-id');
    $.ajax({
        type: 'get',
        url: '/users/' + id,
        success: function (res) {
            let html = template('modifyTpl', res);
            $('#modifyBox').html(html);
        }
    })
});
//修改表单添加表单提交时间
$('#modifyBox').on('submit', '#modifyForm', function () {
    //获取用户在表单中输入的内容
    let formData = $(this).serialize();
    //获取被点击的用户id
    let id = $(this).attr('data-id');
    $.ajax({
        type: 'put',
        url: '/users/' + id,
        data: formData,
        success: function (res) {
            //刷新页面
            location.reload();
        }
    })
    //阻止表单默认提交
    return false;
});
//删除用户功能 通过事件委托的方式添加点击事件 因为删除按钮是通过javascript后渲染到页面上的
$('tbody').on('click', '.delete', function () {
    if (confirm('您确定要删除用户吗?')) {
        //获取被点击的用户id
        let id = $(this).attr('data-id');
        $.ajax({
            type: 'delete',
            url: '/users/' + id,
            success: function (res) {
            //刷新页面
            location.reload();
            }
        })
    }
});
//批量删除功能
