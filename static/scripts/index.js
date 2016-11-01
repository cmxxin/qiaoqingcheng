$(function(){
  var title = "";

  // 入口
  $('.itemlist').eq(0).removeClass('hide');
  var f = new B("tabs");
  slide("#slider").init({ smallBtn: true, autoPlay: true, playTime: 3000});
  initList();
  initCities();
  getCurrentCity();
  hasCurrentCity();
  $(window).on("scroll", scrollCtrl);

  function setCookie(name, val) {
      var date = new Date;
      date.setTime(date.getTime() + 31536E6);
      document.cookie = name + "=" + escape(val) + ";expires=" + date.toGMTString();
  }
  function getCookie(name) {
      name = document.cookie.match(new RegExp("(^| )" + name + "=([^;]*)(;|$)"));
      return null  != name ? name[2] : "";
  }


  function hasCurrentCity(){
    if(!getCookie('_cityId')){
      var tit = $('header h1');
      $('.main').addClass('hide');
      title = tit.text();
      tit.text('请选择城市');
      $('.choose-city, .close').addClass('hide');
      $('#cityPage').removeClass('ani').css('transform', 'translate(0, 0)');
      window.scrollTo(0, 0);
      $(window).off("scroll", scrollCtrl);
    }
  }

	$(document)
  // 打开城市列表 
  .on('click', '.choose-city', function() {
    var tit = $(this).siblings('h1');
    title = tit.text();
    tit.text('请选择城市');
    $(this).addClass('hide');
    $('.close').removeClass('hide');
    $('#cityPage').css('transform', 'translate(0, 0)');
    window.scrollTo(0, 0);
    getCurrentCity();
    $('#currentCity').html('<span>正在获取您所在的城市……</span>');
    setTimeout(function(){
      $('.letter-nav').removeClass('hide');
    }, 300)
    $(window).off("scroll", scrollCtrl);
  })
  // 关闭城市列表
  .on('click', '.close', function() {
    var tit = $(this).siblings('h1');
    tit.text(title);
    $(this).addClass('hide');
    $('.choose-city').removeClass('hide');
    $('#cityPage').css('transform', 'translate(0, -100%)');
    $('.letter-nav').addClass('hide');
    $(window).on("scroll", scrollCtrl);
  })
  // 选择城市
  .on('click', '#currentCity a', function() {
    changeCity($(this));
  })
  .on('click', '#hotCities a', function() {
    changeCity($(this));
  })
  .on('click', '.cities p', function() {
    changeCity($(this));
  })
  // 回到顶部
  .on('click', '#scrollTop', function() {
    window.scrollTo(0, 0);
    $(this).addClass('hide');
  })
  .on('click', '.letter-nav a', function(){
    var id = $(this).text();
    var curY = document.body.scrollTop
    var posY = $('#'+id).offset().top - 49;
    var i = 0
    var timer = window.setInterval(function(){
      i ++
      toY = Math.round((posY - curY) / 30);
      window.scrollTo(0, curY+toY*i);
      if( i == 30){
        window.scrollTo(0, posY)
        window.clearInterval(timer);
      }
    }, 10);
  })

 
  // 确定选择城市
  function changeCity(obj) {
    var cityId = obj.data('city');
    setCookie('_cityId', cityId);
    document.location.href = "/?loc=" + cityId;
  }

  // 初始化产品列表
  function initList(){
    var tab   = $('#tabs>li'),
        list  = $('.itemlist'),
        cur   = list.eq(0),
        load  = cur.find('.loading').eq(0);

    getData('api/index.json', { pageSize: 5, page: 1, cate: 1}, function(res){
      var datalist = res.list,
          html = "";
      if(res != 0){
        if(datalist.length){
          html = fillList(datalist);
          load.data('page',2);
          if(res.pageCount <=1 ){
            load.data('loaded', 1);
          }
        }else{
          html = '<div class="item no-data">敬请期待！</div>';
          load.data('loaded', 1);
        }
      }else{
        showTips('获取数据失败...')
      }
      
      cur.removeClass('toload').addClass('loaded');
      cur.prepend(html);
    })
    
    // tab页点击事件
    tab.on('click', function(){
      if(!$(this).hasClass('cur')){
        var target = $(this),
            parent = target.parent(),
            curIndex = parent.find('.cur').index(),
            nowIndex = target.index(),
            targetList = list.eq(nowIndex);

        tab.eq(curIndex).removeClass("cur");
        target.addClass("cur");

        if(targetList.hasClass('toload')){
          var load = targetList.find('.loading').eq(0),
              cate = load.data('cate') || 0;

          list.eq(curIndex).attr("class", "itemlist hide loaded");
          targetList.removeClass('hide');

          getData('api/index.json', { pageSize: 5, page: 1, cate: cate}, function(res){
            if(res == 0){
              showTips("数据加载错误！");
              html = '<div class="item no-data">数据加载错误！</div>';
            }else{
              var datalist = res.list,
                  html = "";
              if(datalist.length){
                html = fillList(datalist);
                load.data('page', 2);
                if(res.pageCount <=1 ){
                  load.data('loaded', 1);
                }
              }else{
                html = '<div class="item no-data">敬请期待！</div>';
                load.data('loaded', 1);
              }
            }
            targetList.prepend(html);
            targetList.removeClass('toload');
            nowIndex > curIndex ? targetList.addClass("animated").addClass("fadeInRight") : targetList.addClass("animated").addClass("fadeInLeft");
          })
          
        }else{
          list.eq(curIndex).attr("class", "itemlist hide loaded");
          targetList.removeClass('hide');
          nowIndex > curIndex ? targetList.addClass("animated").addClass("fadeInRight") : targetList.addClass("animated").addClass("fadeInLeft");
        }

      }
    })
  }

  // 初始化城市列表 updateAt 2016-08-23
  function initCities(){
    getData('api/citylist.json', '', function(res) {
      if(res){
        var hotList = res.hot,
            cityList = res.list,
            hotHtml = "",
            listHtml = "",
            letterNav = "";
        for (var i = 0, len = hotList.length; i < len; i++) {
          hotHtml += '<a href="javascript:;" data-city="'+ hotList[i].cityId +'">'+ hotList[i].name +'</a>';
        }
        for (var i = 0, len = cityList.length; i < len; i++) {
          letterNav += '<a href="javascript:;">'+ cityList[i].tab +'</a>'
          listHtml += '<div class="tab" id="'+ cityList[i].tab +'">'+ cityList[i].tab +'</div><div class="sub-list">';
          for (var n = 0, clen = cityList[i].subList.length; n < clen; n++) {
            listHtml += '<p data-city="'+ cityList[i].subList[n].cityId +'">'+ cityList[i].subList[n].name +'</p>';
          }
          listHtml += '</div>';
        }
        !$('.close').hasClass('hide') || $('.main').hasClass('hide') ? $('.letter-nav').removeClass('hide') : $('.letter-nav').addClass('hide');
        $('.letter-nav').html(letterNav);
        $('.letter-nav').height($('.letter-nav a').length * 20 + 'px');
        $('#hotCities').html(hotHtml);
        $('.cities').html(listHtml);
      }else{
        showTips('城市列表拉取失败，请刷新重试');
      }
    })
  }

  // 滚动加载
  function scrollCtrl() {
    var top = document.documentElement.scrollTop || document.body.scrollTop,
        dHeight = $(document).height(),
        wHeight = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight || 0;

    0 < top ? $('#scrollTop').removeClass("hide") : $('#scrollTop').addClass("hide");

    if(top+wHeight >= dHeight-100){
      $('.loading').each(function() {
        var obj = $(this);
        if (!obj.parent().hasClass("hide") && !obj.data("loaded")){
          if( 'yes' != obj.data('loading')){
            var page = obj.data('page')*1,
                cate = obj.data('cate');
            obj.data('loading', 'yes').show();
            getData('api/index.json', { pageSize: 5, page: page, cate: cate}, function(res){
              obj.data('loading', 'no').hide();
              if(res == 0){
                showTips("数据加载错误！");
              }else{
                var datalist = res.list,
                    html = "";
                if(datalist.length){
                  html = fillList(datalist);
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
  }

  // 产品列表填充
  function fillList(data){
    var html      = "";

    for (var i = 0, len=data.length; i < len; i++) {
      var service   = "";
      for (var n = 0, sLen=data[i].service.length; n < sLen; n++) {
        service += data[i].service[n] == 1 ? '<span class="icon-s shop">到店</span>' : '<span class="icon-s home">上门</span>';
      };
      html += '<div class="item">\
                <a href="/product/'+ data[i].id +'">\
                  <div class="p-img">\
                    <img src="'+ data[i].imgUrl +'" alt="'+ data[i].title +'">\
                  </div>\
                  <dl class="p-msg">\
                    <dt>'+ data[i].title +'</dt>\
                    <dd>'+ data[i].subTit +'</dd>\
                    <dd class="time">\
                      <i class="icon icon-time"></i>'+ data[i].time +'分钟'+ service +'\
                    </dd>\
                    <dd class="price">\
                      <em>￥</em>'+ data[i].discountPrice +'<small>'+ data[i].price +'</small>\
                      <strong><i class="icon icon-zan"></i>'+ data[i].favor +'人推荐</strong>\
                    </dd>\
                  </dl>\
                </a>\
              </div>';
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
        console.log(res)
        cb(res)
      },
      error: function() {
        cb(0);
      }
    })
  }

  // 获取当前城市 
  function getCurrentCity() {
    //方法1
    // var myCity = new BMap.LocalCity();
    // myCity.get(function(result){
    // 	console.log(result)
    //   if(result.name){
    //     $('#currentCity').html('<a href="javascript:;">'+ result.name +'</a>');
    //   }else{
    //     $('#currentCity').html('<strong>未知区域</strong><span>请选择以下已开通业务城市</span>');
    //   }
    // })

    // 方法2
    // var geolocation   = new BMap.Geolocation();
    // geolocation.getCurrentPosition(function(r){ 
    // 	console.log(r)
    //   // city-id写入待考虑
    //   if(this.getStatus() == BMAP_STATUS_SUCCESS){
    //     if(r.address.city == ""){
    //       $('#currentCity').html('<strong>未知区域</strong><span>请选择以下已开通业务城市</span>');
    //     }else{
    //       $('#currentCity').html('<a href="javascript:;">'+ r.address.city +'</a>');
    //     }
    //   }else{
    //     $('#currentCity').html('<strong>未知区域</strong><span>请选择以下已开通业务城市</span>');
    //   }
    // },{enableHighAccuracy: true})
    // 
    var geolocation   = new BMap.Geolocation();
    geolocation.getCurrentPosition(function(r){ 
      if(this.getStatus() == BMAP_STATUS_PERMISSION_DENIED){
        if(r.address.city == ""){
          alert(1)
          $('#currentCity').html('<strong>未知区域</strong><span>请选择以下已开通业务城市</span>');
        }else{
          alert(2)
          var cityID = getCookie('_cityId');
          if(cityID){
            getData('/api/getCityID', {}, function(res) {
              if(!res){
                getData('/api/changeCity', { city: r.address.city}, function(cityId) {
                  if(cityId != 0 && cityId != cityID){
                    setCookie('_cityId', cityId);
                    document.location.href = "/";
                  }
                })
              }
            })
          }
          $('#currentCity').html('<a href="javascript:;">'+ r.address.city +'</a>');
        }
      }else{
        alert(3)
        $('#currentCity').html('<strong>未知区域</strong><span>请选择以下已开通业务城市</span>');
      }
    },{enableHighAccuracy: true})
  }

  function showTips(str){
    var load = $('#loading')
    load.html('<span class="fail"></span>'+str).removeClass("hide").addClass("animated").addClass("fadeInUp");
    setTimeout(function() {
      load.attr("class", "hide").html("");
    }, 2000)
  }

})
	
