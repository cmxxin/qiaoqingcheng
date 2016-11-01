$(function(){
	var box = $('#tree');



	getData(0, function(data){
		var html = getHtml(data)
		console.log(html)
		$('#tree').append('<ul><li><a href="javascript:;" data-id=1>二董</a></li><li><a href="javascript:;" data-id=2>HH</a></li><li><a href="javascript:;" data-id=3>SS</a></li><li><a href="erdong/4">CC</a><li></ul>')
	})
	

	function getHtml(data){
		var html ="";
		for (var i = 0; i < data.length; i++) {
			if(data[i].hasChild){
				html += '<li><a href="javascript:;" data-id='+ data[i].id +'>'+ data[i].name +'</a></li>';	
			}else{
				html += '<li><a href="erdong/'+ data[i].id +'">'+ data[i].name +'</a></li>';
			}
		}
		html = '<ul>'+html+'</ul>';
		return html
	}

	function getData(id, cb){
		$.ajax({
			url: '/api/tree.json',
			type: 'GET',
			dataType: 'json',
			success: function(data) {
				cb(data.userList)
			},
			error: function(){
				alert('error')
			}
		})
	}
})