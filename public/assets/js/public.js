//随机推荐
$.ajax({
    type: 'get',
    url: '/posts/random',
    success: function (res) {
        //我们之前的模板是使用 script标签来放置模板的 现在是因为我们这个随机推荐3个文件里面都有 所以不能将模板放到 script标签里面  
        let tpl = `
        {{each data}}
        <li>
            <a href="javascript:;">
              <p class="title">{{$value.title}}</p>
              <p class="reading">阅读({{$value.meta.views}})</p>
              <div class="pic">
                <img src="{{$value.thumbnail}}" alt="">
              </div>
            </a>
          </li>
        {{/each}}
        `
        let html = template.render(tpl, { data: res });
        $('.random').html(html)
    }
});
//分类数据
$.ajax({
    type: 'get',
    url: '/categories',
    success: function (res) {
        let tpl = `
        {{each data}}
        <li><a href="list.html?id={{$value._id}}"><i class="fa {{$value.className}}"></i>{{$value.title}}</a></li>
        {{/each}}
        `
        let html = template.render(tpl, { data: res });
        $('.nav_data').html(html)
    }
})