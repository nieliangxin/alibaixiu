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
//封装字符串拼接函数 渲染页面
function render() {
      //字符串拼接
      let html = template('userTpl', { data: userArr });
      //显示页面
      $('tbody').html(html);
};
// 实现图片上传功能 
$('#avatar').on('change', function () {
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
//完成用户添加功能
$('#btnAdd').on('click', function () {
    //获取用户输入的内容 并将内容格式化为字符串
    let formData = $('form').serialize();
    //发送请求
    $.ajax({
        type: 'post',
        url: '/users',
        data: formData,
        success: function (res) {
            //将数据添加到用户数组里
            userArr.push(res);
            //渲染页面
            render();
            //将表单数据清空
            $('input[type="email"]').val('');
            $('input[name="nickName"]').val('');
            $('input[name="password"]').val('');
            $('#status0').prop('checked', false);
            $('#status1').prop('checked', false);
            $('#admin').prop('checked', false);
            $('#normal').prop('checked', false);
            $('#hiddenAvatar').val('');
            $('#preview').attr('src','../assets/img/default.png')
        },
        error: function (res) {
            alert('用户添加失败');
        }
    })
});
//实现用户编辑展示功能 因为编辑按钮是后来添加的,所以需要用事件委托
$('tbody').on('click', '.edit', function () {
    //将h2标题改成修改用户
    $('h2').html('修改用户信息')
   //获取当前被点击的元素的父级元素tr
    let tr = $(this).parents('tr');
    //获取图片
    $('#preview').attr('src', tr.find('img').attr('src'));
    //获取隐藏域的值
    $('#hiddenAvatar').val("tr.find('img').attr('src')");
    //获取邮箱地址展示在页面上
    $('input[name="email"]').val(tr.children().eq(2).text());
    //获取昵称展示在页面上
    $('input[name="nickName"]').val(tr.children().eq(3).text());
    //获取用户状态
    if (tr.children().eq(4).text() == '激活') {
        $('#status1').prop('checked', true);
    } else {
        $('#status0').prop('checked', true);
    }
    //获取用户角色
    if (tr.children().eq(5).text() == '超级管理员') {
        $('#admin').prop('checked', true);
    } else {
        $('#normal').prop('checked', true);
    }
    //将添加按钮隐藏 同时修改按钮显示
    $('#btnAdd').hide();
    $('#btnEdit').show();
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
