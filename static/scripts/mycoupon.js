$(function(){
	var load = $('.loading');

	$(window).on("scroll", scrollCtrl);
	initData();

	$('.card-list').on('click', '.show-detail', function(){
		$(this).toggleClass('unfold');
		$(this).parent().next().toggle();
	})

	function initData(){
		load.removeClass('hide');
		getData('api/coupon.json', { pageSize: 10, page: 1}, function(res){
			var datalist = res.list
			if(res != 0){
        if(datalist.length){
          html = fillList(datalist);
          load.data('page',2);
          if(res.pageCount <=1 ){
            load.data('loaded', 1);
          }
        }else{
          html = '<div class="item no-data">没找到任何优惠券~</div>';
        }
	      $('.card-list').prepend(html);
      }else{
        showTips('获取数据失败...')
      }
	    load.addClass('hide')
		})
	}

	function scrollCtrl(){
		var scrollTop = document.documentElement.scrollTop || document.body.scrollTop,
        docHeight = $(document).height(),
        winHeight = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight || 0;

    0 < scrollTop ? $('#scrollTop').removeClass("hide") : $('#scrollTop').addClass("hide");

    if(scrollTop+winHeight >= docHeight-50){
      var obj = load;
      if (!obj.parent().hasClass("hide") && !obj.data("loaded")){
        if( 'yes' != obj.data('loading')){
          var page = obj.data('page')*1,
              cate = obj.data('cate');
          obj.data('loading', 'yes').removeClass('hide');
          getData('api/coupon.json', { pageSize: 10, page: page}, function(res){
            obj.data('loading', 'no').addClass('hide');
            if (res == 0) {
							showTips('获取数据失败...')
						}else{
							if(res.list.length){
                html = fillList(res.list);
                obj.before(html);
                obj.data('page', page+1);
                if( page+1 > res.pageCount ){
                  obj.data('loaded', 1);
                }
              }
						}
          })
        }
      }
     
    }

    $('#scrollTop').on('click', function(){
	    window.scrollTo(0, 0);
	    $(this).addClass('hide');
    });
	}

	function fillList(data){
    var html = "";
    for (var i = 0, len=data.length; i < len; i++) {
      html += '<dl>\
								<dt>'+ data[i].saleSum +'<em>元</em></dt>\
								<dd>\
									<h4>'+ data[i].title +'</h4>\
									<p>'+ data[i].appScope +'</p>\
									<p>有效时间：'+ data[i].startDate +'-'+ data[i].endDate +'</p>\
									<a href="javascript:;" class="show-detail"></a>\
									<span>'+ data[i].serviceTypeDesc +'</span>\
								</dd>\
								<dd class="c-detail">'+ data[i].couponDesc +'</dd>\
							</dl>'
    };
    return html;
  }

  // 获取数据
  // param1: String, 请求路径
  // param2: Object, 参数
  // param3: Function, 回调
  function getData(url, params, cb) {
    $.ajax({
      type: "GET",
      url: url,
      data: params,
      dataType: "json",
      success: function(res) {
        cb(res)
      },
      error: function() {
        cb(0);
      }
    })
  }
 	function showTips(str){
		var load = $('#loading')
		load.html('<span class="fail"></span>'+str).removeClass("hide").addClass("animated").addClass("fadeInUp");
		setTimeout(function() {
			load.attr("class", "hide").html("");
		}, 2000)
	}
})