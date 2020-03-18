//获取分类和状态
var cid = $('#category').val();
var state = $('#state').val();
//封装一个函数用于发送ajax请求
// 函数形参的默认值 一定要放置于函数形参列表的最后面 
function render(cid, state, page = 1) {
    $.ajax({
        type: 'get',
        url: '/posts',
        data: {
            page: page,
            category: cid,
            state:state
        },
        success: function (res) {
            // console.log(res); 
            let html = template('pTpl', { data: res.records });
            $('tbody').html(html);
            let pageHtml = template('pageTpl', res);
            $('.pagination').html(pageHtml);
        }
    })
};
//页面展示文章数据
render(cid, state);
//声明一个变量 页码为1
var currentPage = 1;
//分页
function changePage(index) {
    currentPage=index
    //点击页码a便签实现无刷新
    render(cid, state, index);
};
//获取所有文章的分类
$.ajax({
    type: 'get',
    url: '/categories',
    success: function (res) {
        let html = template('cTpl', { data: res });
        $('#category').append(html);
    }
});
//给筛选按钮添加点击事件
$('#search').on('click', function () {
    // 获取分类和状态  
    cid = $('#category').val();
    state = $('#state').val();
    //向服务器发送请求
    render(cid, state);
});
//实现删除文章的功能
//给删除按钮添加点击事件通过事件委托的方法
$('tbody').on('click', '.del', function () {
    //获取当前需要删除的文章id
    let id = $(this).attr('data-id');
    //弹出删除确认框
    if (confirm('您确定要删除吗?')) {
        //发送ajax请求
        $.ajax({
            type: 'delete',
            url: '/posts/' + id,
            success: function (res) {
                //如果tbody便签下的tr只有一个,就跳转到上一页
                if ($('tbody tr').length == 1) {
                    //如果当前页是第一页,就不让跳转
                    if (currentPage == 1) {
                        render(cid, state, currentPage); 
                    } else {
                        render(cid, state, --currentPage);
                    }
                } else {
                    render(cid, state, currentPage);
                }
            }
        })
    }
})