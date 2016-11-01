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
	initDateTime();

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

	$('#storePage')
	.on('click', '.mrs-unfold', function(){
		var obj = $(this);
		if($(this).hasClass('mrs-fold')){
			var mrsItem = obj.parent().find('.mrs-item');
			obj.removeClass('mrs-fold');
			setTimeout(function() {
				for (var i = 2, len = mrsItem.length; i < len; i++) {
					mrsItem.eq(i).addClass("hide");
				}
			}, 500)
		}else{
			var mrsItem = obj.parent().find('.hide');
			obj.addClass('mrs-fold')
			setTimeout(function() {
				mrsItem.each(function() {
					$(this).removeClass("hide");
				})
			}, 500)

		}
	})

	// 美容师选择事件  
	.on('click', '.mrs-item', function(){
		var obj = $(this),
				storeId = obj.data('store'),
				mrsId = obj.data('id');
		$('#store_id').val(storeId);
		$('#mrs_id').val(mrsId);
		getData('api/book.json',{"storeId":storeId, "mrsId":mrsId}, false ,function(res){
			if(res == 0){
				showTips('加载失败！请稍候再试~')
			}else{
				bookTime = res.data
				$('#mb').removeClass('hide');
				dateList && dateList.gotoPage(0);
        timeList && timeList.gotoPage(0);
				$('#selectTime').css("-webkit-transform", "translate3d(0, -" + $('#selectTime').height() + "px, 0)");
			}
		})
	})

	function initDateTime(){
		var times = new Object(),
				dates = new Object(),
				sureBtn = $('.t-sure'),
				cancelBtn = $('.t-cancel'),
				dateBox = document.querySelector('.date-box'),
				timeBox = document.querySelector('.time-box');

		dates.callback = function(obj, index, duration){
			var list = $(".time-box").find("li"),
					target = $(".date-box").find("li").eq(index);

			target.parent().children().removeClass("active");
			target.addClass("active");
			$('#date').val(target.data('value'))
			if (bookTime) {
				for (var i = 0 , len = list.length; i < len; i++) {
					var data = bookTime[index].detail;
					list.eq(i).removeClass("booked");
					if (data[i + 18] == "1") {
						list.eq(i).addClass("booked")
					}
				}
			}


			if (!target.hasClass("booked")) {
				$('.t-sure').removeClass("not")
			} else {
				$('.t-sure').addClass("not")
			}
		}

		times.callback = function(obj, index, duration){
			var target = $(".time-box").find("li").eq(index);
			target.parent().children().removeClass("active");
			target.addClass("active");
			if (!target.hasClass("booked")) {
				$('.t-sure').removeClass("not");
				$('#time').val(target.data('value'))
			} else {
				$('.t-sure').addClass("not")
			}

		}

		dateList = new Swiper(dateBox, dates)
		timeList = new Swiper(timeBox, times)

		$('#mb').on("click", function() {
			var obj = $(this);
			$('#selectTime').css("-webkit-transform", "translate3d(0, 0, 0)");
			setTimeout(function() {
				obj.addClass("hide")
			}, 300)
		});
		cancelBtn.on("click", function() {
			$('#selectTime').css("-webkit-transform", "translate3d(0, 0, 0)");
			setTimeout(function() {
				$('#mb').addClass("hide")
			}, 300)
		});
		sureBtn.on("click", function() {
			if (!$(this).hasClass("not")) {
				 $("#storeBookForm").submit();
			}
		})
	}

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
		getData('api/store_backup.json',params, true, function(rs){
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
										<dl>\
											<dt>\
												<img src="'+ data[i].storeImg +'" alt="">\
											</dt>\
											<dd>\
												<h4>'+ data[i].storeName +'</h4>\
												<p>距离'+ data[i].storeDis +'</p>\
											</dd>\
										</dl>\
										<div class="location">\
											<a href="/map.html?lat='+ data[i].lat +'&lng='+ data[i].lng +'">\
												<i class="icon icon-location1"></i>'+ data[i].storeAdr +'\
											</a>\
											<a href="tel:'+ data[i].storeTel +'" class="tel">\
												<i class="icon icon-phone"></i>\
											</a>\
										</div>\
									</div>\
									<div class="mrsList">'

			for (var n = 0, mlen = data[i].mrsList.length ; n < mlen; n++) {
				var hide = n >= 2 ? "hide" : "";
				html += '<a href="javascript:;" class="mrs-item '+hide+'" data-store="'+ data[i].storeId+'" data-id="'+ data[i].mrsList[n].mrsId +'">\
									<dl>\
										<dt>\
											<img src="'+ data[i].mrsList[n].mrsImg +'" alt="">\
										</dt>\
										<dd>\
											<h5>'+ data[i].mrsList[n].mrsName +'</h5>\
											<p>'+ data[i].mrsList[n].mrsDesc +'</p>\
											<p>\
												<span>\
													<i class="icon icon-order1"></i>订单数（'+ data[i].mrsList[n].mrsOrderNum+'）\
													<i class="icon icon-fav"></i>好评数（'+ data[i].mrsList[n].mrsFavorNum +'）\
												</span>\
											</p>\
										</dd>\
									</dl>\
								</a>';
			};

			if( data[i].mrsList.length > 2){
				html += '<a href="javascript:;" class="mrs-unfold"></a>';
			}
			html += '</div></div>'
  	};		
  	return html;						
  }
})