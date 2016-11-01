//事件绑定函数
function bindEvent(obj, ev, fn){
	//通过document 判断是否是IE
	//是IE
	if(!document.addEventListener){
		obj.attachEvent(ev,fn);   //鼠标点击时触发此事件
	}
	//非IE浏览器，火狐
	else{
		obj.addEventListener(ev,fn,false);
	}
};

//事件解绑函数
function delEvent(obj, ev, fn){
	//通过document 判断是否是IE
	//是IE
	if(!document.removeEventListener){
		obj.detachEvent(ev,fn);   //鼠标点击时触发此事件
	}
	//非IE浏览器，火狐
	else{
		obj.removeEventListener(ev,fn,false);
	}
};

/*swipe组件*/
var Swiper = function (ele, config){ 
	this.wrap = ele;
    this.currentNum = config.startIndex || 0; 
    this.speed = config.speed || 200;  
    this.callback = config.callback || null;
    this.innerWrap = this.wrap.children[0];
	this.items = this.innerWrap.children;
    this.len = this.items.length;

    if(this.len == 0){ 
    	return;
    }else if(this.len == 1){ 
        this.wrap.style['height'] = this.items[0].offsetHeight;
        this.wrap.style['width'] = this.items[0].offsetWidth;
        return;
    }
    this._width = 0; 
    this._height = 0;
    this.X = 0;
    this.curX = 0;
    this.Y = 0;
    this.curY = 0;
    this.direction = 0;
    this.firstInit = false;
	this.isScrolling = false;
	this.isValidSlide = false;
    this.init();
}

Swiper.prototype = { 
	init : function(){ 
		var _this = this;
        _this._height = _this.items[_this.currentNum].getBoundingClientRect().height || _this.items[_this.currentNum].offsetHeight;
		_this.innerWrap.style['height'] = _this._height * _this.len + 'px';
		_this.firstInit = true;
		_this.gotoPage(_this.currentNum);
		_this.addEvent();
	},
	touchX : function(e){
		if(e.touches){
			return e.touches[0].pageX;
		}else{
			return e.pageX; 
		}
	},
	touchY : function(e){
		if(e.touches){
			return e.touches[0].pageY;
		}else{
			return e.pageY; 
		}
	},
	setAnimation : function(){ 
        var wrap = this.wrap,
            len = this.len,
            speed = this.speed,
            h = this._height, 
            n = this.currentNum;

        if(this.firstInit){ 
            this.translate(wrap, - n * h, 0);
            this.firstInit = false;
        }else{ 
        	this.translate(wrap, - n * h, speed);
        }
	},
	translate : function(slide, dist, speed){ 
		var ua = navigator.userAgent.toLowerCase(),
		    style = slide && slide.style;

		// 指定对象过渡持续的时间(默认值是0，意味着不会有效果)
        style.webkitTransitionDuration = 
        style.MozTransitionDuration = 
        style.msTransitionDuration = 
        style.OTransitionDuration = 
        style.transitionDuration = speed + 'ms';

        style.webkitTransitionTimingFunction = 
        style.MozTransitionTimingFunction = 
        style.msTransitionTimingFunction = 
        style.OTransitionTimingFunction = 
        style.transitionTimingFunction = 'ease-in-out';

        // 定义3D转换，沿着X轴移动元素
        if (ua.indexOf('gt-') != -1) {
            style.webkitTransform = 'translateY(' + dist + 'px)';
        } else {
            style.webkitTransform = 'translate3d(0, ' + dist + 'px, 0)';
        }
        style.msTransform = 
        style.MozTransform = 
        // 定义2D转换，沿着X轴移动元素
        style.OTransform = 'translateY(' + dist + 'px)';
	},
	slide : function(x){ 
		var wrap = this.wrap,
            speed = Math.ceil(this.speed / 4),
            alter = - this.currentNum * this._height + x,
            total = this.innerWrap.offsetHeight,
            sum = alter > 0 ? Math.min(alter, 5) : Math.max(alter, 145 - total);
    	this.translate(wrap, sum, 0);
	},
	round : function(alt){ 		 
		if(this.currentNum + alt < 0){
		    return 0;
		}else if(this.currentNum + alt > this.len - 1){ 
			return this.len - 1;
		}else{
			return this.currentNum + alt;
		}
	},
	addEvent : function(){ 
        var slide = this.innerWrap,
            _this = this;

        bindEvent(slide, "touchstart", function(e){_this._touchstart(e);});
        bindEvent(slide, "touchmove", function(e){_this._touchmove(e);});
        bindEvent(slide, "touchend", function(e){_this._touchend(e);});
	},
	_touchstart : function(e){
	    e.preventDefault(); 
        this.X = this.touchX(e);
        this.Y = this.touchY(e);
        this.isScrolling = undefined;
	},
	_touchmove : function(e){
		var _this = this,
		    deltaX,
		    deltaY;
        
        e.preventDefault();
    	_this.curX = _this.touchX(e);
    	_this.curY = _this.touchY(e);
        deltaX = _this.curX - _this.X;
        deltaY = _this.curY - _this.Y;
        if (typeof _this.isScrolling == 'undefined') {
            _this.isScrolling = !!(_this.isScrolling || Math.abs(deltaY) < Math.abs(deltaX));
        }
    	if(!_this.isScrolling){ 
    		_this.slide(deltaY);
    	}
	},
	_touchend : function(e){ 
		var _this = this,
		    slide = _this.innerWrap,
		    deltaX = 0,
		    deltaY = 0;
        
        if(_this.curX == 0){ 
        	_this.curX = _this.X;
        }
        if(_this.curY == 0){ 
        	_this.curY = _this.Y;
        }
        deltaX = _this.curX - _this.X;
        deltaY = _this.curY - _this.Y;
        _this.X = 0;
    	_this.Y = 0;
    	_this.curX = 0;
    	_this.curY = 0;
    	if(Math.abs(deltaY) > Math.abs(deltaX)){
    		if(Math.abs(deltaY) > 10){ 
    			_this.isValidSlide = true;
                _this.direction = deltaY > 0 ? 1 : 0;
	    	}else{ 
	    		_this.isValidSlide = false;
	    	}
	        if(_this.isValidSlide){
	        	var delta = Math.round(Math.abs(deltaY) / _this._height);
	        	var index = _this.direction == 1 ? _this.round(-delta) : _this.round(delta);
	        	_this.gotoPage(index);
	        }else{ 
	        	_this.setAnimation();
	        }
    	}
	},
	gotoPage : function(index){ 
		if(index != -1){ 
			this.currentNum = index;
	    	this.setAnimation();
	    	this.callback(this.items[index], index, this.direction);
		}
	}
};

if (window.jQuery || window.Zepto) {
    (function($){
        $.fn.Swiper = function(params){
            return this.each(function(){
                $(this).data('Swiper', new Swiper($(this)[0], params));
            });
        }
    })(window.jQuery || window.Zepto)
}