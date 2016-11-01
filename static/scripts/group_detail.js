$(function(){
	countDown();

	function countDown() {
		$('.countDown').each(function (index, el) {
			var ex = new Date($(this).data('expired'));
			setTime(el, ex)
		});
	}
	
	function setTime(obj, ex) {
		var now = new Date(),
		range = ex - now;

		if (range <= 0){
			$(obj).text('已结束')
			return
		}

		var rHour = Math.floor(range / (1000 * 60 * 60)),
				rMin 	= Math.floor(range / (1000 * 60)) % 60,
				rSec 	= Math.floor(range / 1000) % 60;
				rHour = rHour < 10 ? '0' + rHour : rHour;
				rMin 	= rMin < 10 ? '0' + rMin : rMin;
				rSec 	= rSec < 10 ? '0' + rSec : rSec;
		$(obj).text('剩余'+ rHour +':'+ rMin +':'+ rSec +'结束');

		setTimeout(function () {
			setTime(obj, ex);
		}, 1000);
	}
})