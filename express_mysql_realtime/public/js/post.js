function bindEvents(){
	$(".btn_update").click(function(){

		var id = $(".id_cl").val();
		var title = $(".title_cl").val();
		var content = tinymce.get("content").getContent();
		var author = $(".author_cl").val();

		var body = {
			id: id,
			title: title,
			content: content,
			author: author
		};
		
		var base_url = location.protocol + "//" + document.domain + ":" + location.port;
		var url_update = base_url + "/admin/post/edit" 
		$.ajax({
			url: url_update,
			type: "PUT",
			data: body,
			dataType: "json",
			success: function(res){
				console.log(res);
				if(res.code == 200){
					location.reload();
				}else{
					alert("Loi, fucking bug");
				}
			}
		});
	});
	
	$(".delete_post").click(function(){
		var post_id = $(this).attr("id");

		var body= {
			id: post_id
		}

		var base_url = location.protocol + "//" + document.domain + ":" + location.port;
		var url_delete = base_url + "/admin/post/delete"

		$.ajax({
			url: url_delete,
			type: "DELETE",
			data: body,
			dataType: "json",
			success: function(res){
				console.log(res);
				if (res.code == 200){
					location.reload();
				}else{
					alert("loi, fucking bug");
				}
			}
		});
	});
	
}

$(document).ready(function(){
	bindEvents();
});
