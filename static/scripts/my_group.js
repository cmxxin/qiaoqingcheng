$(function(){
	var loading = $('.loading');

	function initList(){
		getData('api/my_group.json', { pageSize: 5, page: 1}, function(res){
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
          getData('api/my_group.json', { pageSize: 5, page: page}, function(res){
            loading.data('loading', 'no').addClass('hide');
            if (res == 0) {
							showTips('获取数据失败，请稍后再试')
						}else{
							if(res.list.length){
                html = fillList(res.list);
                loading.before(html);
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
									<p>说好的拼团呢...</p>\
									<a href="javascript:;">立即发起拼团</a>\
								</div>';
      }
		}
    $('.main').removeClass('toload')
    loading.before(html);
  }

  function fillList(data){
  	var html 			= '',
  			status 		= 'ongoing',
  			statusMsg = '';

  	for (var i = 0; i < data.length; i++) {
  		if(data[i].status == 0){
  			status = 'ongoing';
  			statusMsg = '团购进行中';
  		}else if( data[i].status == 1){
  			status = 'success';
  			statusMsg = '拼团成功';
  		}else{
  			status = 'fail';
  			statusMsg = '拼团失败';
  		};

  		html += '<div class="item '+ status +'">\
								<div class="p-info">\
									<div class="img">\
										<img src="'+ data[i].image + '" alt="">\
									</div>\
									<div class="p-detail">\
										<h3>'+ data[i].title +'</h3>\
										<div class="operation">\
											<i></i>\
											<span>成团价：￥'+ data[i].price +'</span>\
											<strong>></strong>\
										</div>\
									</div>\
								</div>\
								<div class="btns">\
									<span>'+ statusMsg +'</span>\
									<a href="javascript:;">查看团详情</a>\
									<a href="javascript:;">查看订单详情</a>\
								</div>\
							</div>'
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