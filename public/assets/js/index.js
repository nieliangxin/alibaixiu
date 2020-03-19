//查询文章数量
$.ajax({
    type: 'get',
    url: '/posts/count',
    success: function (res) {
        // console.log(res);
        $('#post').html('<strong>' + res.postCount + '</strong>篇文章（<strong>' + res.draftCount + '</strong>篇草稿）')
    }
});
//查询文章分类数量
$.ajax({
    type: 'get',
    url: '/categories/count',
    success: function (res) {
        // console.log(res);
        $('#category').html('<strong>' + res.categoryCount + '</strong>个分类')
    }
});
//查询评论数量
$.ajax({
    type: 'get',
    url: '/comments/count',
    success: function (res) {
        // console.log(res);
        $('#comment').html('<strong>'+res.commentCount+'</strong>条评论')
    }
})