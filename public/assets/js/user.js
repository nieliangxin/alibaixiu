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
            userArr.unshift(res);
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
            $('#preview').attr('src', '../assets/img/default.png')
        },
        error: function (res) {
            alert('用户添加失败');
        }
    })
});
//实现用户编辑展示功能 因为编辑按钮是后来添加的,所以需要用事件委托
var userId
$('tbody').on('click', '.edit', function () {
    userId = $(this).attr('data-id')
    //将h2标题改成修改用户
    $('h2').html('修改用户信息')
    //获取当前被点击的元素的父级元素tr
    let tr = $(this).parents('tr');
    //获取图片
    $('#preview').attr('src', tr.find('img').attr('src'));
    //获取隐藏域的值
    $('#hiddenAvatar').val(tr.find('img').attr('src'));
    //获取邮箱地址展示在页面上 让邮箱只读不能修改
    $('input[name="email"]').prop('disabled', true).val(tr.children().eq(2).text());
    //获取昵称展示在页面上
    $('input[name="nickName"]').val(tr.children().eq(3).text());
    //获取密码让密码框禁止修改
    $('input[name="password"]').prop('disabled', true);
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
//完成修改用户功能
$('#btnEdit').on('click', function () {
    //获取用户在表单中输入的内容
    let formData = $('form').serialize();
    $.ajax({
        type: 'put',
        url: '/users/' + userId,
        data: formData,
        success: function (res) {
            //获取用户数组的索引 因为我们数据是保存在用户数组里的
            let index = userArr.findIndex(item => res._id == item._id);
            //替换数据 重新赋值
            userArr[index] = res;
            // console.log(userArr);
            //渲染页面
            render();
            //将h2标题改成修改用户
            $('h2').html('添加新用户');
            //将头像设置为默认的
            $('#preview').attr('src', '../assets/img/default.png');
            //清空隐藏域
            $('#hiddenAvatar').val("");
            //将邮箱输入框设置为启用
            $('input[name="email"]').prop('disabled', false).val('');
            //清空昵称输入框
            $('input[name="nickName"]').val('');
            //将密码输入框设置启用
            $('input[name="password"]').prop('disabled', false);
            //将单选框清空
            $('#status1').prop('checked', false);
            $('#status0').prop('checked', false);
            $('#admin').prop('checked', false);
            $('#normal').prop('checked', false);
            //将添加按钮显示 编辑按钮隐藏
            $('#btnAdd').show();
            $('#btnEdit').hide();
        },
        error: function (err) {
            console.log(err);
        }
    })
});
//删除单个用户功能 通过事件委托的方式添加点击事件 因为删除按钮是通过javascript后渲染到页面上的
$('tbody').on('click', '.delete', function () {
    //获取当前用户的id
    let id = $(this).attr('data-id');
    if (confirm('您确定要删除用户吗?')) {
        $.ajax({
            type: 'delete',
            url: '/users/' + id,
            success: function (res) {
                //根据索引从数组中将元素找出来
                let index = userArr.findIndex(item => item._id == res._id);
                //删除元素
                userArr.splice(index, 1);
                //渲染页面
                render();
            }
        })
    }
});
//实现批量删除功能
//给全选按钮添加点击事件
$('#selectAll').on('change', function () {
    //全选按钮选中,批量删除按钮显示,反之隐藏
    //判断全选按钮的状态
    if ($(this).prop('checked')) {
        $('#delectAll').show();
    } else {
        $('#delectAll').hide();
    }
    //点击全选,所有用户被选中
    $(".check").prop('checked', $(this).prop('checked'));
});
//给所有用户的复选框添加点击事件
$('tbody').on('change', '.check', function () {
    //判断所有用户数量和被选中的数量是否一致 如果用户复选框全部选中,那么全选被选中,反之则不被选中
    //获取所有用户的数量
    let length = $('.check').length;
    //获取被点击的用户数量
    let checklength = $('.check:checked').length;
    $('#selectAll').prop('checked', length === checklength);
    //当用户复选框任意一个被选中时,批量删除按钮显示
    if (checklength > 1) {
        //批量删除按钮显示
        $('#delectAll').show();
    } else {
        //批量删除按钮隐藏
        $('#delectAll').hide();
    }
});
//给批量删除按钮添加点击事件
$('#delectAll').on('click', function () {
    //创建一个空数组,来保存所选中的元素id
    let arr = [];
    //获取所有被选中的用户,拿到所选中元素的id 添加到arr中,需遍历选中的元素
    $('.check:checked').each(function (index, item) {
        arr.push($(item).parents('tr').attr('data-id'));
    });
    if (confirm('您确定要删除吗?')) {
        $.ajax({
            type: 'delete',
            url: '/users/' + arr.join('-'),
            success: function (res) {
                //遍历选中的元素 找出id 根据id删除选中的元素
                res.forEach(item => {
                    //item表示数组里每一项就是一个对象
                    let index = userArr.findIndex(ele => ele._id == item._id);
                    //删除元素
                    userArr.splice(index, 1);
                    //渲染页面
                    render();
                })
            }
        })
    }
});
