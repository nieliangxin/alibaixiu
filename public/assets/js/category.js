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
})