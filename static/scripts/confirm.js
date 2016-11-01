$(function(){
	var orderPage = $('#orderPage'),
			couponPage = $('#couponPage');

	$(document)

	.on('click', '.change-coupon', function(){
		changePage(1);
	})

	.on('click', '.backToOrder', function(){
		changePage(2);
	})

	.on('click', '.noCard', function(){
		$('#couponId').val('');
		changePage(2);
	})

	.on('click', '#bookBtn', function(){
		var userName = $('#userName'),
				phone = $('#telephone');
		if(userName.val()=="" || userName.val()==undefined){
			showTips('请输入预约人姓名！');
		}else if( phone.val()=="" || phone.val()==undefined){
			showTips('请输入预约人电话！');
		}else{
			$('#order').submit();
		}

	})

	$('.couponList dl').on('click', function(){
		var cid = $(this).data('id');
		$('#couponId').val(cid);
		changePage(2);
	})

	function changePage(type){
		if(type == 1){
			orderPage.addClass('hide');
			$('footer').css('visibility', 'hidden').removeClass('animated').removeClass('fadeInLeft');
			couponPage.removeClass('hide').addClass('animated').addClass('fadeInRight');
		}else{
			couponPage.addClass('hide');
			orderPage.removeClass('hide').addClass('animated').addClass('fadeInLeft');
			$('footer').css('visibility', 'visible').addClass('animated').addClass('fadeInLeft');
		}
	}

	function showTips(str){
		var load = $('#loading');
		load.html('<span class="fail"></span>'+str).removeClass("hide").addClass("animated").addClass("fadeInUp");
		setTimeout(function() {
      load.attr("class", "hide").html("");
    }, 2000)
	}
})