// 请搜索getdata  修改接口

$(function() {
	var city = $('.citySwitch span').text(),
			localSearch = new BMap.LocalSearch(city),
			searchType = "",
			timer, bookTime,
			dateList,timeList,
			searchList = $('.search-list ul'),
			loading = $('.loading'),
			keyword = $('#keyword'),
			pageCount = 0;



	getCurPos();

	localSearch.setSearchCompleteCallback(function (searchResult){
		pageCount = searchResult.YS;
		keyword.data('loading','no');
		loading.data('loading','no').addClass('hide');
		if(pageCount == 0){
			html = '<li class="noresult">请输入具体地址（街道、小区、店名）试试！</li>'
			searchList.html(html)
			loading.data('loaded',1)
		}else{
			var html = fillSearchList(searchResult.wr);
			if(searchType == 'keyword'){
				searchList.html(html);
				loading.data('page',1);
			}else{
				searchList.append(html);
				loading.data('page', searchResult.gT + 1)
			}
			if(loading.data('page') == pageCount){
				loading.data('loaded', 1)
			}else{
				loading.data('loaded','')
			}
		}
	})

	$(document)

	.on('click', '#curPos', function(){
		if('yes' != $(this).data('loading')){
			$('#storePage').addClass('hide');
			$('#adrPage').removeClass('hide').addClass('animated').addClass('fadeInRight');
			$(window).on("scroll", scrollCtrl);
		}else{
			showTips('请稍等，系统正在获取您当前位置...')
		}
	})

	.on('click', '.backToStore', function(){
		$('#adrPage').addClass('hide');
		$('#storePage').removeClass('hide').addClass('animated').addClass('fadeInLeft');
		$(window).off("scroll", scrollCtrl);
	})

	.on('change', '#city', function() {
		var obj = $(this),
				val = obj.find("option").not(function() { return !this.selected }).val(),
				txt = obj.find("option").not(function() { return !this.selected }).text();
		obj.prev().html(txt);
		$('.citySwitch').find('span').data('id', val).html(txt);
		localSearch.setLocation(txt)
	})

	.on('input', '#keyword', function(){
		var obj = $(this),
				val = obj.val(),
				clear = $('.clear')
		if( "yes" == obj.data('loading') || val == ""){
			searchList.empty();
			clear.addClass('hide');
			return 
		}

		clear.removeClass('hide');
		searchList.empty();
		clearTimeout(timer);
		timer = setTimeout(function(){
			obj.data('loading','yes');
			localSearch.search(val);
			searchType = 'keyword'
		},500)
	})

	.on('click', '#clear', function(){
		$(this).prev().val('').focus();
		searchList.empty();
	})

	.on('click', '#scrollTop', function() {
    window.scrollTo(0, 0);
    $(this).addClass('hide');
  })

	$('#adrPage').on('click', 'li', function(){
		var lat = $(this).data('lat'),
				lng = $(this).data('lng'),
				adr = $(this).children('p').text();
		initStore(adr, lat, lng);
		window.scrollTo(0, 0);
		$('#adrPage').addClass('hide');
		$('#storePage').removeClass('hide').addClass('animated').addClass('fadeInLeft');
		$(window).off("scroll", scrollCtrl);
	}) 

	$('#storePage').on('click', '.select-store', function() {
		var storeId = $(this).data('id');
		$('#store_id').val(storeId);
	})

	function getCurPos() {
		var geolocation   = new BMap.Geolocation(),
				myGeo = new BMap.Geocoder(),
				curPos = $('#curPos');

		$('#curPos span').html('正在获取当前位置……');
		curPos.data('loading','yes')
		geolocation.getCurrentPosition(function(r){ 
			if(this.getStatus() == BMAP_STATUS_SUCCESS){
				myGeo.getLocation(new BMap.Point(r.longitude, r.latitude), function(result){ 
					if (result && result.address !="" && result.address != undefined){ 
						initStore(result.address, result.point.lat, result.point.lng)
					} else{
						$('#curPos span').html('当前位置未知，点击进行设置');
						showTips('请您换个地址再试试吧~');
						curPos.data('loading','no');
					}
				});
			}else{
				$('#curPos span').html('当前位置未知，点击进行设置');
				showTips('请您换个地址再试试吧~');
				curPos.data('loading','no');
			}
		},{enableHighAccuracy: true})
	}

	function initStore(address, lat, lng) {
		var params = {"lat":lat,"lng":lng},
				mrsWrap = $('.mrs-wrap'),
				mrsLoad = $('#mrs-loading');

		mrsLoad.removeClass('hide');
		mrsWrap.empty();
		$('#curPos span').html(address)
		getData('api/store.json',params, true, function(rs){
			$('#curPos').data('loading','no');
			if(rs != 0){
				if(rs.storeList.length){
					var html = fillStore(rs.storeList);
					mrsLoad.addClass('hide')
					mrsWrap.html(html)
				}else{
					showTips('请您换个地址再试试吧~');
					mrsLoad.addClass('hide')
				}
			}else{
				showTips('请您换个地址再试试吧~');
				mrsLoad.addClass('hide')
			}
		})
	}

	function scrollCtrl () {
  	var scrollTop = document.documentElement.scrollTop || document.body.scrollTop,
        docHeight = $(document).height(),
        winHeight = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight || 0;

    0 < scrollTop ? $('#scrollTop').removeClass("hide") : $('#scrollTop').addClass("hide");

  	if(!loading.data('loaded') && "yes" != loading.data('loading') && scrollTop+winHeight >= docHeight-100){
  		searchType = "scroll";
  		var page = loading.data('page')*1;
  		loading.data('loading', 'yes').removeClass('hide');
  		localSearch.gotoPage(page)
  	}
  }

	function showTips(str){
		var load = $('#loading')
		load.html('<span class="fail"></span>'+str).removeClass("hide").addClass("animated").addClass("fadeInUp");
		setTimeout(function() {
			load.attr("class", "hide").html("");
		}, 2000)
	}

	function getData(url, params, async, cb ) {
    $.ajax({
      type: "GET",
      url: url,
      async: async,
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

  function fillSearchList (data) {
  	var html = "";
  	for (var i = 0, len = data.length; i < len; i++) {
  		html += '<li data-lat="'+ data[i].point.lat +'" data-lng="'+ data[i].point.lng +'">\
								<p>'+ data[i].title +'</p>\
								<span>'+ data[i].address +'</span>\
							</li>'
  	};
  	return html
  }

  function fillStore (data) {
  	var html="";
  	for (var i = 0, len = data.length; i < len; i++) {
  		html += '<div class="store-box">\
									<div class="store">\
										<a href="javascript:;" class="select-store" data-id="'+ data[i].storeId +'">\
											<dl>\
												<dt>\
													<img src="'+ data[i].storeImg +'" alt="">\
												</dt>\
												<dd>\
													<h4>'+ data[i].storeName +'</h4>\
													<p>距离'+ data[i].storeDis +'</p>\
												</dd>\
											</dl>\
										</a>\
										<div class="location">\
											<a href="/map.html?lat='+ data[i].lat +'&lng='+ data[i].lng +'">\
												<i class="icon icon-location1"></i>'+ data[i].storeAdr +'\
											</a>\
											<a href="tel:'+ data[i].storeTel +'" class="tel">\
												<i class="icon icon-phone"></i>\
											</a>\
										</div>\
									</div>\
								</div>';
  	};		
  	return html;						
  }
})