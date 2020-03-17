//定义一个分类数组,保存分类的数据
let cArr = [];
//实现分类的添加功能
$('#btnAdd').on('click', function () {
    let title = $('[name="title"]').val().trim();
    let className = $('[name="className"]').val().trim();
    if (title.length == 0) return alert('请输入分类名称');
    if (className.length == 0) return alert('请输入分类图标');
    //发送ajax请求
    $.ajax({
        type: "post",
        url: "/categories",
        data: {
            title: title,
            className: className
        },
        success: function (res) {
            // 把这个对象 添加到push数组中 
            cArr.push(res);
            render();
            //清空数据
            $('[name="title"]').val('');
            $('[name="className"]').val('');
        }
    })
});
//封装渲染页面函数
function render() {
    //拼接模板字符串
    let html = template('cgTpl', { data: cArr });
    //将数据显示到页面上
    $('tbody').html(html);
};
//获取所有的分类
$.ajax({
    type: 'get',
    url: '/categories',
    success: function (res) {
        cArr = res;
        render();
    }
});
//实现分类的数据显示
//定义变量id
var id;
$('tbody').on('click', '.edit', function () {
    id = $(this).parent().attr('data-id')
    $('h2').html('编辑分类');
    //获取当前被点击元素的父级元素tr
    let tr = $(this).parents('tr');
    //获取分类名称和图标显示在页面上
    $('[name="title"]').val(tr.children().eq(1).text());
    $('[name="className"]').val(tr.children().eq(2).text());
    $('#btnAdd').hide();
    $('#btnEdit').show();
});
//实现编辑功能
$('#btnEdit').on('click', function () {
    let formData = $('form').serialize();
    //发送请求
    $.ajax({
        type: 'put',
        url: '/categories/' + id,
        data: formData,
        success: function (res) {
            let index = cArr.findIndex(item => item._id == res._id);
            //替换数据 重新赋值
            cArr[index] = res;
            //渲染页面
            render();
            $('h2').html('添加分类');
            $('[name="title"]').val('');
            $('[name="className"]').val('');
            $('#btnAdd').show();
            $('#btnEdit').hide();
        }
    })
});
//实现单个删除功能
$('tbody').on('click', '.delete', function () {
    let id = $(this).parent().attr('data-id');
    $.ajax({
        type: 'delete',
        url: '/categories/' + id,
        success: function (res) {
            let index = cArr.findIndex(item => item._id == res._id);
            cArr.splice(index, 1);
            render();
        }
    })
});
//实现批量删除功能
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
    //定义一个数组保存被点击的id
    let arr = [];
    //遍历被选中的元素 获取id 然后添加到数组里
    $('.check:checked').each(function(index,item){
        arr.push($(this).parents('tr').children().eq(3).attr('data-id'))
    });
    if (confirm('您确定要删除吗?')) {
        $.ajax({
            type: 'delete',
            url: '/categories/' + arr.join('-'),
            success: function (res) {
                res.forEach(item => {
                    let index = cArr.findIndex(ele => ele._id == item._id);
                    cArr.splice(index, 1);
                    render();
                })
            }
        })
    }
})