$(function(){

  $(document)
  // 回到顶部
  .on('click', '#scrollTop', function() {
    window.scrollTo(0, 0);
    $(this).addClass('hide');
  })

  // 选项卡
  .on('click', '.tabs a', function() {
    var obj = $(this),
        tab = $('.tabs a'),
        index = obj.index(),
        box = $('.p-info').children().eq(index),
        load = $('#loading');

    if( 1 == index && 0 == box.find('.msg').length && "yes" != load.data("loading")){
      var html = "",
          loading = box.find('.loading');
      load.html('<span></span>努力加载中...请稍候~').removeClass('hide');
      getData('api/message.json', { pageSize: 10, page: 1}, function(res){
        if(res == 0){
          load.html('<span class="fail"></span>数据加载错误...').removeClass('hide')
          setTimeout(function(){
            load.addClass('hide')
          },2000)
        }else{
          obj.addClass('cur').siblings('a').removeClass('cur');
          if ( 0 == res.msgList.length) {
            html = '<div class="msg no-data">敬请期待！</div>'
          }else{
            html = fillMsg(res.msgList);
            loading.data('page', 2);
            if(res.pageCount <=1 ){
              loading.data('loaded', 1)
            }
          }
          load.html('').addClass('hide');
          box.prepend(html);
          $('.detail-box').addClass('hide');
          $('.message').removeClass('hide');
        }
      })
    }else{
      obj.addClass('cur').siblings('a').removeClass('cur');
      box.removeClass('hide').siblings().addClass('hide')
    }
  })

  function scrollCtrl() {
    var face = $('.face');
    var scrollTop = document.documentElement.scrollTop || document.body.scrollTop,
        docHeight = $(document).height(),
        winHeight = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight || 0,
        msgBox = $('.message'),
        load = $('#loading')
        loading = msgBox.find('.loading');
    
    0 < scrollTop ? $('#scrollTop').removeClass("hide") : $('#scrollTop').addClass("hide");

    face.each(function() {
      var obj = $(this),
          objTop = obj.offset().top,
          objSpan = obj.find('span');
      if("none" != obj.css('display') && scrollTop + 0.5 * winHeight > objTop){
        for (var i = 0, len = objSpan.length; i < len; i++) {
          objSpan.eq(i).removeClass('hide').addClass('animated').addClass('zoomIn')
        }
      }
    }); 

    if( !msgBox.hasClass('hide') && !loading.data('loaded') && scrollTop+winHeight >= docHeight-100){
      if( 'yes' != loading.data('loading')){
        var page = loading.data('page')*1;
        loading.data('loading', 'yes').show();
        getData('api/message.json', { pageSize: 10, page: page}, function(res){
          loading.data('loading', 'no').hide();
          if(res == 0){
            load.html('<span class="fail"></span>数据加载错误...').removeClass('hide')
            loading.data('loaded',1)
            setTimeout(function(){
              load.addClass('hide')
            },2000)
          }else{
            if ( 0 == res.msgList.length) {
              html = '<div class="msg no-data">敬请期待！</div>'
            }else{
              html = fillMsg(res.msgList);
              loading.data('page', page+1);
              if(page+1 > res.pageCount ){
                loading.data('loaded', 1)
              }
            }
            loading.before(html);
          }
        })
      }
    }

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

  function fillMsg(data) {
    var html = "";
    for (var i = 0, len = data.length; i < len; i++) {
      html += '<div class="msg">\
                <h3>\
                  <img src="'+ data[i].userImg +'" alt="">\
                  <b>'+ data[i].userName +'</b>\
                </h3>\
                <p>'+ data[i].msg +'</p>\
                <div class="extra">'+ data[i].time +'\
                  <span>'+ data[i].mrsName +'<img src="'+ data[i].msrImg +'" alt=""></span>\
                </div>\
              </div>';
    };
    return html;
  }

	function r(a, b, c) {
        document.addEventListener ? a.addEventListener(b, c, !1) : a.attachEvent(b, c)
    }
    function t(a, b, c) {
        document.removeEventListener ? a.removeEventListener(b, c, !1) : a.detachEvent(b, 
        c)
    }
	var u = function(a) {
        this.wrap = document.getElementById(a);
        this.parentW = 0;
        this.scrollItem = this.wrap.children;
        this.len = this.scrollItem.length;
        this._width = this.scrollItem[0].getBoundingClientRect().width || this.scrollItem[0].offsetWidth;
        this._height = this.scrollItem[0].getBoundingClientRect().height || this.scrollItem[0].offsetHeight;
        this.actualW = this._width * this.len;
        this.curY = this.Y = this.curX = this.X = this.currentPos = 0;
        this.isScrolling = !1;
        this.init()
    };
	u.prototype = {
        init: function() {
            this.parentW = this.wrap.offsetWidth;
            this.wrap.style.width = this.actualW + "px";
            this.wrap.style.height = this._height + "px";
            for (var a = 0; a < this.len; a++)
                this.scrollItem[a].style.width = this._width + "px";
            this.actualW > this.parentW ? this.addEvent() : this.currentPos = 0;
            this.setAnimation()
        },
        touchX: function(a) {
            return a.touches ? a.touches[0].pageX : 
            a.pageX
        },
        touchY: function(a) {
            return a.touches ? a.touches[0].pageY : a.pageY
        },
        setAnimation: function() {
            var a = this.wrap;
            a.style["-webkit-transition"] = "-webkit-transform 0.3s ease-in-out";
            a.style["-webkit-transform"] = "translate3d(" + this.currentPos + "px, 0, 0)"
        },
        slide: function(a) {
            var b = this.wrap;
            b.style["-webkit-transition-duration"] = "0s";
            b.style["-webkit-transform"] = "translate3d(" + (this.currentPos + a) + "px, 0, 0)"
        },
        addEvent: function() {
            var a = this.wrap
              , b = this;
            r(a, "touchstart", function(a) {
                b._touchstart(a)
            });
            r(a, 
            "touchmove", function(a) {
                b._touchmove(a)
            });
            r(a, "touchend", function(a) {
                b._touchend(a)
            })
        },
        _touchstart: function(a) {
            this.X = this.touchX(a);
            this.Y = this.touchY(a);
            this.isScrolling = void 0
        },
        _touchmove: function(a) {
            var b, c;
            this.curX = this.touchX(a);
            this.curY = this.touchY(a);
            b = this.curX - this.X;
            c = this.curY - this.Y;
            "undefined" == typeof this.isScrolling && (this.isScrolling = !!(this.isScrolling || Math.abs(b) < Math.abs(c)));
            this.isScrolling || (a.preventDefault(),
            30 < this.currentPos + b ? this.slide(30 - this.currentPos) : this.currentPos + 
            b < this.parentW - this.actualW - 30 ? this.slide(this.parentW - this.actualW - 30 - this.currentPos) : this.slide(b))
        },
        _touchend: function(a) {
            var b = this;
            a = b.wrap;
            var c = 0
              , f = 0;
            0 == b.curX && (b.curX = b.X);
            0 == b.curY && (b.curY = b.Y);
            c = b.curX - b.X;
            f = b.curY - b.Y;
            b.curX = 0;
            b.curY = 0;
            Math.abs(c) > Math.abs(f) && (b.currentPos = 0 < b.currentPos + c ? 0 : Math.max(b.currentPos + c, b.parentW - b.actualW),
            b.setAnimation());
            t(a, "touchstart", function(a) {
                b._touchstart(a)
            });
            t(a, "touchmove", function(a) {
                b._touchmove(a)
            })
        }
    };


    setTimeout(function() {
      $(window).on("scroll", scrollCtrl);
    	new u("step");
    },300)
})