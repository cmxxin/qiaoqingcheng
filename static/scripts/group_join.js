$(function(){
	$(document)
	.on('click', '.all-member>a', function() {
		$('.all-member').toggleClass('open');
	})

	function countDown() {
		var obj 	= $('.timer'),
				ex 		= new Date(obj.data('expired'));
		setTime(obj, ex)
	}
	
	function setTime(obj, ex) {
		var obj 	= $('.timer'),
				ex 		= new Date(obj.data('expired')),
				now 	= new Date(),
				range = ex - now;

		if (range <= 0){
			obj.text('已结束');
			return
		}

		var rHour = Math.floor(range / (1000 * 60 * 60)),
				rMin 	= Math.floor(range / (1000 * 60)) % 60,
				rSec 	= Math.floor(range / 1000) % 60;
				rHour = rHour < 10 ? '0' + rHour : rHour;
				rMin 	= rMin < 10 ? '0' + rMin : rMin;
				rSec 	= rSec < 10 ? '0' + rSec : rSec;
		obj.children('.t-h').text(rHour);
		obj.children('.t-m').text(rMin);
		obj.children('.t-s').text(rSec);

		setTimeout(function () {
			setTime(obj, ex);
		}, 1000);
	}

	countDown();
})