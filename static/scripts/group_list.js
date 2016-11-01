$(function(){
	var loading = $('.loading'),
			listWrap = $('.main ul');

	function initList(){
		getData('api/group_list.json', { pageSize: 5, page: 1}, function(res){
			renderList(res)
		})
	}

	function scrollCtrl(){
		var scrollTop = document.documentElement.scrollTop || document.body.scrollTop,
        docHeight = $(document).height(),
        winHeight = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight || 0;

    0 < scrollTop ? $('#scrollTop').removeClass("hide") : $('#scrollTop').addClass("hide");

    if(scrollTop+winHeight >= docHeight-100){
      if (!loading.data("loaded")){
        if( 'yes' != loading.data('loading')){
          var page = loading.data('page')*1;
          loading.data('loading', 'yes').removeClass('hide');
          getData('api/group_list.json', { pageSize: 5, page: page}, function(res){
            loading.data('loading', 'no').addClass('hide');
            if (res == 0) {
							showTips('获取数据失败，请稍后再试')
						}else{
							if(res.list.length){
                html = fillList(res.list);
                listWrap.append(html);
                loading.data('page', page+1);
                if( page+1 > res.pageCount ){
                  loading.data('loaded', 1);
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
    })
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

  function renderList(res){
  	if (res == 0) {
			showTips('获取数据失败，请稍后再试')
		}else{
			var datalist = res.list;
			if(datalist.length){
        html = fillList(datalist);
        loading.data('page',2);
        if(res.pageCount <=1 ){
          loading.data('loaded', 1);
        }
      }else{
        html = '<div class="no-order">\
									<p>说好的订单呢...</p>\
									<a href="javascript:;">立即预约</a>\
								</div>';
      }
      $('.main').removeClass('toload')
      listWrap.append(html);
		}
  }

  function fillList(data){
  	var html = '';
  	for (var i = 0; i < data.length; i++) {
  		html += '<li>\
  							<a href="group_detail.html?id='+ data[i].pid +'">\
									<div class="img">\
										<img src="'+ data[i].image +'" alt="">\
										<div class="notic">\
											<div class="discount">'+ data[i].discount +'折<br>'+ data[i].people +'人团</div>\
											<div class="pricedown">'+ data[i].second_description +'</div>\
										</div>\
										<div class="point">\
											<dl>'
			for (var n = 0; n < data[i].third_description.length; n++) {
        html += '<dd>'+  data[i].third_description[n] +'</dd>'
      }									
			html +=     		'</dl>\
										</div>\
									</div>\
									<div class="desc">\
										<h5>'+ data[i].title +'</h5>\
										<p>'+ data[i].desc +'</p>\
									</div>\
									<div class="operation">\
										<i></i>\
										<span>\
											<b>￥'+ data[i].price +'</b>\
											<em>'+ data[i].people +'人团</em>\
										</span>\
										<strong>去开团></strong>\
									</div>\
								</a>\
							</li>'
  	}
  	return html;
  }

  function showTips(str){
		var load = $('#loading')
		load.html('<span class="fail"></span>'+str).removeClass("hide").addClass("animated").addClass("fadeInUp");
		setTimeout(function() {
			load.attr("class", "hide").html("");
		}, 2000)
	}


	initList();
	$(window).on("scroll", scrollCtrl);
})