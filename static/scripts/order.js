$(function(){
	initList();
	$(window).on("scroll", scrollCtrl);
	
	function initList() {
		var tab = $('nav a'),
				list = $('.list'),
				cur   = list.eq(0),
        load  = cur.find('.loading').eq(0);
		
		// 参考  type : 0进行中 1完成 2取消  
		getData('api/order.json', { pageSize: 5, page: 1, type: load.data('type')}, function(res){
			renderlist(res, cur, load)
		})

		tab.on('click', function(){
			var target = $(this),
					curIndex = target.parent().find('.cur').index(),
          nowIndex = target.index(),
          targetList = list.eq(nowIndex);
      console.log(nowIndex)
			if(!target.hasClass('cur')){
				$(this).addClass('cur').siblings().removeClass('cur')
				if(targetList.hasClass('toload')){
					var load = targetList.find('.loading'),
							type = load.data('type');

					list.eq(curIndex).attr("class", "list hide loaded");
          targetList.removeClass('hide');

					getData('api/order.json', { pageSize: 5, page: 1, type: type}, function(res){
						renderlist(res, targetList, load);
						nowIndex > curIndex ? targetList.addClass("animated").addClass("fadeInRight") : targetList.addClass("animated").addClass("fadeInLeft");
					})
				}else{
          list.eq(curIndex).attr("class", "list hide loaded");
          targetList.removeClass('hide');
          nowIndex > curIndex ? targetList.addClass("animated").addClass("fadeInRight") : targetList.addClass("animated").addClass("fadeInLeft");
        }
			}
		})
	}

	// 滚动加载
  function scrollCtrl() {
    var scrollTop = document.documentElement.scrollTop || document.body.scrollTop,
        docHeight = $(document).height(),
        winHeight = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight || 0;

    0 < scrollTop ? $('#scrollTop').removeClass("hide") : $('#scrollTop').addClass("hide");

    if(scrollTop+winHeight >= docHeight-100){
      $('.loading').each(function() {
        var obj = $(this);
        if (!obj.parent().hasClass("hide") && !obj.data("loaded")){
          if( 'yes' != obj.data('loading')){
            var page = obj.data('page')*1,
                cate = obj.data('cate');
            obj.data('loading', 'yes').removeClass('hide');
            getData('api/order.json', { pageSize: 5, page: page, cate: cate}, function(res){
              obj.data('loading', 'no').addClass('hide');
              if (res == 0) {
								showTips('获取订单数据失败，请稍后再试')
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
      });
    }

    $('#scrollTop').on('click', function(){
	    window.scrollTo(0, 0);
	    $(this).addClass('hide');
    })
  }

	function renderlist(res, cur, load){
		if (res == 0) {
			showTips('获取订单数据失败，请稍后再试')
		}else{
			var datalist = res.list;
			if(datalist.length){
        html = fillList(datalist);
        load.data('page',2);
        if(res.pageCount <=1 ){
          load.data('loaded', 1);
        }
      }else{
        html = '<div class="no-order">\
									<p>说好的订单呢...</p>\
									<a href="javascript:;">立即预约</a>\
								</div>';
      }
      cur.removeClass('toload').addClass('loaded');
      cur.prepend(html);
		}

	}

	function fillList(data){
		var html = "";
		for (var i = 0, len = data.length; i < len; i++) {
			html += '<div class="item">\
								<h3>订单编号：'+ data[i].orderId +' <span>'+ data[i].date +'</span></h3>\
								<dl>\
									<dt>\
										<img src="'+ data[i].storeImg +'" alt="">\
									</dt>\
									<dd>\
										<h4>'+ data[i].storeName +'</h4>\
										<p>'+ data[i].storeAdr +'</p>\
										<p>'+ data[i].storeDis +'</p>\
									</dd>\
								</dl>\
								<div class="total">\
									<strong>总计：￥'+ data[i].price +'</strong>\
									<div class="ctrl">';
			if(data[i].status == "0"){
				html += '<span>待付款</span>\
								 <a href="javascript:;" class="cancel-order">取消</a>\
								 <a href="javascript:;" class="pay-btn">去付款</a>';
			}else if(data[i].status == "1"){
				html += '<span>已完成</span>';
			}else{
				html += '<span>已取消</span>'
			}
			html += '</div></div></div>';
		}
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