$(function(){
	var load = $('#loading'),
			btnBook = $('#book'),
			itemsNum = 3,
			curId = $('.selected').find('span').data('id');

	$('#order-list, #mb').on('click', function() { 
		var obj,
				mb = $('#mb'),
				list = $('.choose-list');
		if($(this).parent().hasClass('statement')){
			obj = $(this);
		}else{
			obj = $('#order-list');
		}

		if(obj.hasClass('unfold')){
			mb.addClass("hide");
			obj.removeClass("unfold");
			list.addClass("animated").addClass("slideOutDown");
			setTimeout(function() {
				list.addClass("hide").removeClass("slideOutDown").removeClass("animated")
			}, 300)
		}else{
			obj.children('.icon').css('transform','rotate(0deg)')
			mb.removeClass("hide");
			obj.addClass("unfold");
			list.removeClass("hide").addClass("animated").addClass("slideInUp");
			setTimeout(function() {
				list.removeClass("slideInUp").removeClass("animated")
			}, 300)
		}
	})

	$(document)
	.on("click", ".more", function() {
		var obj = $(this),
		list = obj.parent().find(".hide");
		for (var a = 0; a < Math.min(list.length, 3); a++) {
			list.eq(a).removeClass("hide");
			var img = list.eq(a).find("img");
			img.data("src") && img.attr("src", img.data("src"))
		}
		if (list.length <= 3) {
			obj.addClass("hide")
		}
	})
	.on('click', '.minus', function() {
		var obj = $(this),
				val = obj.siblings('span').html()*1,
				id = obj.siblings('span').data('id'),
				items =[];
		val--;
		if(obj.parents('.items').hasClass('selected')){
			if( val <= 0 ){
				showTips('已选项目无法清空！或者您可以选择下方包含此项目的套餐~');
			}else{
				obj.siblings('span').html(val)
				btnBook.data('item',id+'_'+val)
				$('.choose-list').find('span[data-id="'+ id +'"]').html(val);
			}
		}else if(obj.parents('ul').hasClass('choose-list')){
			if( val <= 0){
				if( id == curId){
					showTips('已选项目无法清空！或者您可以选择下方包含此项目的套餐~');
				}else{
					obj.parents('li').remove();
					$('.items').find('span[data-id="'+ id +'"]').html(0).parent().addClass('fold');
				}
			}else{
				obj.siblings('span').html(val);
				$('.items').find('span[data-id="'+ id +'"]').html(val)
			}
		}else{
			obj.siblings('span').html(val)
			$('.choose-list').find('span[data-id="'+ id +'"]').html(val)
			if( val <= 0){
				obj.parent().attr('class', 'fold');
				$('.choose-list').find('span[data-id="'+ id +'"]').parents('li').remove();
			}

		}

		$('.rec .amount').each(function() {
			var id = $(this).children('span').data('id'),
					val = $(this).children('span').html()*1;
			items.push(id+'_'+val)
		});
		btnBook.data('items', items)

		$('.statement em').html(calNum());
		var total = count()
		$('.statement label').html(total[0]);
		$('.statement b').html(total[1]);

	})

	.on('click', '.add', function() {
		var obj = $(this),
				valbox = obj.siblings('span'),
				id = valbox.data('id'),
				duration = valbox.data('duration'),
				price = valbox.data('price'),
				name = obj.parents('.item').find('h4').html(),
				val = valbox.html()*1,
				left = obj.offset().left,
				items = [],
				top = getWinHeight() - obj.offset().top + getWinScrollHeight();

		val++;
		valbox.html(val);
		if(obj.parents('.items').hasClass('selected')){
			btnBook.data('item',id+'_'+val);
			$('.item').find('span[data-id="'+ id +'"]').html(val);
			$('.choose-list').find('span[data-id="'+ id +'"]').html(val);
		}else if(obj.parents('ul').hasClass('choose-list')){
			if( id == curId){
				btnBook.data('item',id+'_'+val);
			}else{
				btnBook.data('items',id+'_'+val);
			}
			$('.item').find('span[data-id="'+ id +'"]').html(val);
		}else{
			obj.parent().attr('class','amount')
			valbox.html(val);
			$('.choose-list').find('span[data-id="'+ id +'"]').html(val);
			if (val == 1) {
				$('.choose-list').append('<li><dl><dt>'+ name +'</dt><dd>	<span><i class="icon icon-time"></i>'+ duration +'分钟</span><b>￥'+ price +'</b><div class="amount">	<a href="javascript:;" class="minus">-</a><span data-price="198" data-duration="60" data-id="'+ id +'">'+ val +'</span><a href="javascript:;" class="add">+</a></div></dd></dl></li>');
			}
		}
		$('.rec .amount').each(function() {
			var id = $(this).children('span').data('id'),
					val = $(this).children('span').html()*1;
			items.push(id+'_'+val)
		});
		btnBook.data('items', items)
		var ball = $('<i class="ball"></i>');
		ball.css({"left": (left + 2) + "px", "bottom": (top > 22 ? top - 22 : 0) + "px"})
		$('footer').append(ball)
		setTimeout(function() {
			ball.css("-webkit-transform", "translate3d(" + (30 - left) + "px, " + (top > 42 ? top - 42 : 0) + "px, 0)")
		}, 100);

		setTimeout(function() {
			$('.statement em').html(calNum());
			var total = count()
			$('.statement label').html(total[0]);
			$('.statement b').html(total[1]);
			ball.remove();
		}, 600)
	})


	function getWinHeight() {
		return window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight || 0
	}
	function getWinScrollHeight() {
		return document.documentElement.scrollTop || document.body.scrollTop
	}

	function count() {
		var count=[],
				price =0,
				duration = 0;

		$('.main .amount').each(function() {
			price += $(this).children('span').data('price') * $(this).children('span').html();
			duration += $(this).children('span').data('duration') * $(this).children('span').html();
		});
		count.push(price,duration)
		return count;
	}

	function calNum() {
    var b = 0;
    if (btnBook.data("item")) {
        b += parseInt(btnBook.data("item").split("_")[1])
    }
    if (btnBook.data("items")) {
        var e = btnBook.data("items").split(",")
          , a = e.length;
        for (var c = 0; c < a; c++) {
            b += parseInt(e[c].split("_")[1])
        }
    }
    return b
	}

	function showTips(str){
		load.html('<span class="fail"></span>'+str).removeClass("hide").addClass("animated").addClass("fadeInUp");
		setTimeout(function() {
      load.attr("class", "hide").html("");
    }, 2000)
	}

})