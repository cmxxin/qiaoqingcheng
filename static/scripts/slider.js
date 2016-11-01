/* slider Date:2015-12-21 author:cmax*/
var slide = (function() {
  var run = function(obj) {
    return new slider(obj);
  };

  function slider(obj) {
    this.elem = obj;
    this.oBox = document.querySelector(obj);
    this.aLi = document.querySelectorAll(obj + ">ul>li");
    this.oUl = document.querySelector(obj + ">ul");
    this.now = 0;
    this.on0ff = false;

  }

  slider.prototype = {
    init: function(options) {
      var options = options || {},
        	li 			= this.aLi;

      this.defaults = {
        startIndex: 0,
        loop			: false,
        autoPlay 	: false,
        smallBtn	: false,
        playTime	: 6000,
        itemHeight: 0
      };
      slider.extend(this.defaults, options);

      this.now = this.defaults.startIndex;

      if (this.defaults.smallBtn) {
      	var spans = "<div class='s-btn'>";
				for (var i = 0; i < this.aLi.length; i++) {
					if(i == 0){
						spans += "<span class='active'></span>";
						continue;
					}
          spans += "<span></span>";
        };
        spans+= '</div>';
        this.oBox.innerHTML += spans;
        this.btns = document.querySelectorAll(this.elem + ">.s-btn>span");
        this.aLi = document.querySelectorAll(this.elem + ">ul>li");
        this.oUl = document.querySelector(this.elem + ">ul");
      };
      if (this.aLi.length <= 2) {
      	this.lack = true;
				this.oUl.innerHTML += this.oUl.innerHTML;
				this.aLi = document.querySelectorAll(this.elem + ">ul>li");
      }
      if (this.defaults.autoPlay) {
          this.pause();
          this.play();
      }
      this.liInit();
      this.bind();
    },
    bind: function(){
    	var evt = "onorientationchange" in window;
      var type = evt ? "orientationchange" : "resize";
      this.oBox.addEventListener('touchstart', this);
      window.addEventListener(type, this);
      window.addEventListener("touchcancel", this);
    },
    liInit: function(){

    	var li 		= this.aLi,
    			w_box = this.oBox.offsetWidth,
    			now 	= this.now,
    			len 	= li.length,
    			_this = this;
    	_this.oUl.style.width = w_box * len + 'px';

			for (var i = 0; i < len; i++) {
				slider.setStyle(li[i], {
					transition: "all 0ms ease",
					height: "auto"
				});
			};

    	if(w_box >= 640){
    		w_box = 640;
    	}else if( w_box <= 320){
    		w_box = 320;
    	};

    	for( i = 0; i < len; i ++){
    		li[i].style.width = w_box + 'px';
    	};

    	var img = li[0].getElementsByTagName("img")[0];
      if(_this.defaults.itemHeight){
        _this.oBox.style.height = _this.defaults.itemHeight+'px';
      }else	if(img){
    		var newimg = new Image();
        newimg.onload = function() {
          _this.oBox.style.height = li[0].offsetHeight + "px";
          for (var i = 0; i < li.length; i++) {
						li[i].style.height = li[0].offsetHeight + "px";
          };
        };
        newimg.src = img.src;
    	}else {
        _this.oBox.style.height = li[0].offsetHeight + "px";
      };
      // if(this.defaults.loop){
    	for (var i = len - 1; i >= 0; i--) {
    		if( i == slider.getNow(now, len)){
    			slider.setStyle(li[i], {
    				transform: "translateX(" + 0 + "px)",
            zIndex: 10
    			});
    		}else if( i == slider.getPre(now, len)){
    			slider.setStyle(li[i],{
    				transform: "translateX(" + -w_box + "px)",
            zIndex: 10
    			});
    		}else if( i == slider.getNext(now, len)){
    			slider.setStyle(li[i],{
    				transform: "translateX(" + w_box + "px)",
            zIndex: 10
    			});
    		}else{
    			slider.setStyle(li[i],{
    				transform: "translateX(" + 0 + "px)",
            zIndex: 9
    			});
    		}
    	};
    },
    handleEvent: function(e) {
    	var type = e.type;
    	if(type == 'resize' || type == 'orientationchange'){
    		this.reInit();
    	}else if( type == "touchstart"){
    		if(this.defaults.autoPlay){
    			this.pause();
    		}
				this.startHandler(e);
    	}else if( type == "touchmove"){
    		if(this.defaults.autoPlay){
    			this.pause();
    		}
    		this.moveHandler(e);
    	}else if( type == "touchend"){
    		if(this.defaults.autoPlay){
    			this.pause();
    			this.play();
    		}
    		this.endHandler(e);
    	}else if( type == "touchcancel"){
    		if(this.defaults.autoPlay){
    			this.pause();
    			this.play();
    		}
    		this.endHandler(e);
    	};
    },
    reInit: function() {
      var _this = this;
      setTimeout(function() {
        _this.liInit();
      }, 300);
    },
    startHandler: function(e){
    	this.on0ff = true;
    	this.startTime = Date.now();
    	this.startX = e.targetTouches[0].pageX;
      this.startY = e.targetTouches[0].pageY;
    	this.oBox.addEventListener("touchmove", this);
      this.oBox.addEventListener("touchend", this);
    },
    moveHandler: function(e){
    	if (this.on0ff) {
    		var li 		= this.aLi,
    				now   = this.now,
    				len 	= li.length,
    				endX 	= e.targetTouches[0].pageX,
        		endY 	= e.targetTouches[0].pageY,
        		dis		= 0;

        nowDis = endX - this.startX;
        preDis = parseInt(li[0].style.width) - nowDis;
        nextDis = parseInt(li[0].style.width) + nowDis;

        for (var i = 0; i < len; i++) {
					slider.setStyle(li[i], {
						transition: "all 0ms ease"
					});
				};

				if (Math.abs(endX - this.startX) < Math.abs(endY - this.endY) || Math.abs(endX - this.startX) > 10) {
					slider.stopDefault(e);
				};
        
        this.move(li[slider.getPre(now, len)], -preDis, 10);
        this.move(li[slider.getNow(now, len)], nowDis, 10);
        this.move(li[slider.getNext(now, len)], nextDis, 10);
    	}else{
    		this.oBox.removeEventListener("touchmove", this);
      	this.oBox.removeEventListener("touchend", this);
    	};
    },
    endHandler: function(e){
    	this.on0ff 	= false;
    	var li 			= this.aLi,
    			li_w 		= this.oBox.offsetWidth,
    			endX 		= e.changedTouches[0].pageX,
        	endY 		= e.changedTouches[0].pageY,
    	    endTime = Date.now();

    	if(endX < this.startX){
    		if(this.startX - endX > li_w / 4 || (endTime - this.startTime < 200 && this.startX - endX >10)){
    			this.now++;
    			this.tab('left');
    		}else{
    			this.tab('lStay');
    		};
    	}else{
    		if(endX - this.startX > li_w / 4 || (endTime - this.startTime < 200 && endX - this.startX >10)){
    			this.now--;
    			this.tab('right');
    		}else{
    			this.tab('rStay');
    		};
    	};
    	this.oBox.removeEventListener("touchmove", this);
      this.oBox.removeEventListener("touchend", this);
    },
    tab: function(type){
    	var li = this.aLi,
    			len = li.length,
    			li_w = this.oBox.offsetWidth,
    			now = this.now,
    			speed = "";
    	if (now < 0) {
        now = len - 1;
        this.now = len - 1;
      };

    	for (var i = len-1; i >= 0; i--) {
    		if(i == slider.getPre(now, len)){
    			speed = (type == "left" || type == "rStay") ? 300 : 0;
    			slider.setStyle(li[slider.getPre(now, len)], {
	    			transform: "translateX(" + -li_w + "px)",
						zIndex: 10,
						transition: "all "+ speed +"ms ease"
	    		});
    		}else if(i == slider.getNow(now, len)){
    			slider.setStyle(li[slider.getNow(now, len)], {
	    			transform: "translateX(0px)",
						zIndex: 10,
						transition: "all 300ms ease"
	    		});
    		}else if( i == slider.getNext(now, len)){
    			speed = (type == "left" || type == "rStay") ? 0 : 300;
    			slider.setStyle(li[slider.getNext(now, len)], {
	    			transform: "translateX(" + li_w + "px)",
						zIndex: 10,
						transition: "all "+ speed +"ms ease"
	    		});
    		}else{
    			slider.setStyle(li[i], {
	    			transform: "translateX(0px)",
						zIndex: 9,
						transition: "all 0ms ease"
	    		});
    		};
    	};
    	if( this.defaults.smallBtn ){
				for (var i = 0; i < this.btns.length; i++) {
					this.btns[i].className = "";
				};

				if (this.lack) {
					this.btns[slider.getNow(now, len / 2)].className = "active";
				} else {
					this.btns[slider.getNow(now, len)].className = "active";
				};
    	};
    },
    move: function(obj, dis, zIndex){
			var newZIndex = zIndex || null;
			if (newZIndex) {
				obj.style.zIndex = newZIndex;
			};
			slider.setStyle(obj, {
				transform: "translateX(" + dis + "px)"
			})
    },
    play: function() {
			var _this = this;
			_this.timer = setInterval(function() {
				_this.now++;
				_this.tab("left")
			}, this.defaults.playTime);
		},
    pause: function(){
			var _this = this;
			clearInterval(_this.timer);
    }

  }
  slider.extend = function(defaults, options) {
    for (name in options) {
      if (options[name] !== undefined) {
        defaults[name] = options[name];
      };
    };
  };
  slider.extend(slider, {
		setStyle: function(obj, style) {
	    for (name in style) {
        obj.style[name] = style[name];
	    };
		},
		getNow: function(now, len) {
      return now % len;
    },
    getPre: function(now, len) {
      if (now % len - 1 < 0) {
        var index = len - 1;
      } else {
        var index = now % len - 1;
      };
      return index;
    },
    getNext: function(now, len) {
      if (now % len + 1 > len - 1) {
        var index = 0;
      } else {
        var index = now % len + 1;
      };
      return index;
    },
    stopDefault: function(e) {
			if (e && e.preventDefault) {
				e.preventDefault();
			} else {
				window.event.returnValue = false;
			};
			return false;
		}
	})
  return run;
})();


function x(b, a, f) {
  document.addEventListener ? b.addEventListener(a, f, !1) : b.attachEvent(a, f)
}
function A(b, a, f) {
  document.removeEventListener ? b.removeEventListener(a, f, !1) : b.detachEvent(a, f)
}

B = function(b) {
    this.wrap = document.getElementById(b);
    this.parentW = 0;
    this.scrollItem = this.wrap.children;
    this.len = this.scrollItem.length;
    this._width = this.scrollItem[0].getBoundingClientRect().width || this.scrollItem[0].offsetWidth;
    this._height = this.scrollItem[0].getBoundingClientRect().height || this.scrollItem[0].offsetHeight;
    this.actualW = this._width * this.len;
    this.curY = this.Y = this.curX = this.X = this.currentPos = 0;
    this.isScrolling = !1;
    this.init()
}
;
B.prototype = {
    init: function() {
        this.parentW = this.wrap.offsetWidth;
        this.wrap.style.width = this.actualW + "px";
        this.wrap.style.height = this._height + "px";
        for (var b = 0; b < this.len; b++)
            this.scrollItem[b].style.width = this._width + "px";
        this.actualW > this.parentW ? this.addEvent() : this.currentPos = 0;
        this.setAnimation()
    },
    touchX: function(b) {
        return b.touches ? b.touches[0].pageX : b.pageX
    },
    touchY: function(b) {
        return b.touches ? b.touches[0].pageY : b.pageY
    },
    setAnimation: function() {
        var b = this.wrap;
        b.style["-webkit-transition"] = "-webkit-transform 0.3s ease-in-out";
        b.style["-webkit-transform"] = 
        "translate3d(" + this.currentPos + "px, 0, 0)"
    },
    slide: function(b) {
        var a = this.wrap;
        a.style["-webkit-transition-duration"] = "0s";
        a.style["-webkit-transform"] = "translate3d(" + (this.currentPos + b) + "px, 0, 0)"
    },
    addEvent: function() {
        var b = this.wrap
          , a = this;
        x(b, "touchstart", function(b) {
            a._touchstart(b)
        });
        x(b, "touchmove", function(b) {
            a._touchmove(b)
        });
        x(b, "touchend", function(b) {
            a._touchend(b)
        })
    },
    _touchstart: function(b) {
        this.X = this.touchX(b);
        this.Y = this.touchY(b);
        this.isScrolling = void 0
    },
    _touchmove: function(b) {
        var a, 
        f;
        this.curX = this.touchX(b);
        this.curY = this.touchY(b);
        a = this.curX - this.X;
        f = this.curY - this.Y;
        "undefined" == typeof this.isScrolling && (this.isScrolling = !!(this.isScrolling || Math.abs(a) < Math.abs(f)));
        this.isScrolling || (b.preventDefault(),
        30 < this.currentPos + a ? this.slide(30 - this.currentPos) : this.currentPos + a < this.parentW - this.actualW - 30 ? this.slide(this.parentW - this.actualW - 30 - this.currentPos) : this.slide(a))
    },
    _touchend: function(b) {
        var a = this;
        b = a.wrap;
        var f = 0
          , h = 0;
        0 == a.curX && (a.curX = a.X);
        0 == a.curY && (a.curY = a.Y);
        f = a.curX - a.X;
        h = a.curY - a.Y;
        a.curX = 0;
        a.curY = 0;
        Math.abs(f) > Math.abs(h) && (a.currentPos = 0 < a.currentPos + f ? 0 : Math.max(a.currentPos + f, a.parentW - a.actualW),
        a.setAnimation());
        A(b, "touchstart", function(b) {
            a._touchstart(b)
        });
        A(b, "touchmove", function(b) {
            a._touchmove(b)
        })
    }
};
