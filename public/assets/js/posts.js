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
//分页
function changePage(index) {
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