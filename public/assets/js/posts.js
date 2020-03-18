//展示数据
$.ajax({
    type: 'get',
    url: '/posts',
    data: {
        page:1
    },
    success: function (res) {
        // console.log(res); 
        let html = template('pTpl', { data: res.records });
        $('tbody').html(html);
        let pageHtml = template('pageTpl', res);
        $('.pagination').html(pageHtml);
    }
})
function changePage(index) {
    //点击页码a便签实现无刷新
    $.ajax({
        type: 'get',
        url: '/posts',
        data: {
            page:index
        },
        success: function (res) {
            // console.log(res); 
            let html = template('pTpl', { data: res.records });
            $('tbody').html(html);
            let pageHtml = template('pageTpl', res);
            $('.pagination').html(pageHtml);
        }
    })
}