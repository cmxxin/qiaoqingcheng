$(function(){
	$('.files a').height($('.files a').width())

	$(document)

	// 提交
	.on('click', 'footer a', function(){
		var val = $('.comment textarea').val();
		if(val == "" || val == undefined){
			showTips('评论内容不能为空！')
		}else{
			$('#adviceFrom').submit();
		}
	})

	// 图片选择
	.on('change', '.files input', function(e){
		var obj = $(this);
		if (!window.FileReader) return;  

	    var files = e.target.files;  
	  
	    for (var i = 0, f; f = files[i]; i++) {  
	        if (!f.type.match('image.*')) {  
	            continue;  
	        }  
	  
	        var reader = new FileReader();  
	        reader.onload = (function(theFile) {  
	            return function(e) {  
	                // img 元素  
	                obj.siblings('img').attr('src', e.target.result )
	        
	            };  
	        })(f);  
	        reader.readAsDataURL(f);  
	    }  
	})

	// 提示框
	function showTips(str){
		var load = $('#loading')
		load.html('<span class="fail"></span>'+str).removeClass("hide").addClass("animated").addClass("fadeInUp");
		setTimeout(function() {
			load.attr("class", "hide").html("");
		}, 2000)
	}
})