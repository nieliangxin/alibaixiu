  //获取公共的热门推荐数据
  $.ajax({
    type:'get',
    url:'/posts/recommend',
      success: function (res) {
          let hTpl = `
          {{each data}}
          <li>
            <a href="detail.html?id={{@$value._id}}">
              <img src="{{$value.thumbnail}}" alt="">
              <span>{{$value.title}}</span>
            </a>
          </li>
          {{/each}}
        
          `;
      let html=template.render(hTpl,{data:res});
      $('.hots ul').html(html);
    }
  });