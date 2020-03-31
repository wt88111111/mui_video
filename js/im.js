const link_src = 'http://39.106.92.181:8080/duanshiping/';
var hidden_height;
var id = '';
function social(num) { 
	switch(num){
		case '1':
			document.getElementById('check_indicator').style.webkitTransform="translate3d(0%,0,0)"
			document.getElementById('details').style.webkitTransform="translate3d(0%,0,0)"
		break;
		case '2':
			document.getElementById('check_indicator').style.webkitTransform="translate3d(100%,0,0)"
			document.getElementById('details').style.webkitTransform="translate3d(-33.333%,0,0)"
		break;
		case '3':
			document.getElementById('check_indicator').style.webkitTransform="translate3d(200%,0,0)"
			document.getElementById('details').style.webkitTransform="translate3d(-66.666%,0,0)"
		break;
	}
}
jQuery(document).ready(function($) {
	mui.plusReady(function () {
		plus.webview.currentWebview().setStyle({
		    height:document.documentElement.clientHeight || document.body.clientHeight
		});
	var old_back = mui.back;  
		mui.back = function(){  
		    plus.navigator.setStatusBarStyle('lite');
		    	setTimeout(function () {
					var h=plus.webview.getWebviewById('im');
					var wobj = h
    				wobj.reload(true);
				},300)
		    old_back();  
		}
		window.addEventListener('user_id',function(event){

		 	id = event.detail.id
		 	console.log('传值'+id)
		 	$.ajax({
			    url: link_src+"user?method=gerenzhongxin",
			    data: {userid:id},
			    async:true,
			    type: "POST",
			    dataType: "text",
			    success: function(data) {
			    	console.log(data)
			    	data = eval("(" + data + ")");
			    	$("#user_avatar").attr('src',link_src+'resources/img/'+data.userimg)
			    	$("#registration_date").text(data.username);
			    	$("#message_board p").text(data.userqianming);
			    	// $("#user_avatar").attr('src', data.userimg);
			    	$("#description").text('\xa0\xa0'+data.userhuozan+'获赞\xa0\xa0'+data.userguanzhu+'关注\xa0\xa0'+data.userfensi+'粉丝')
			    	if (!data.user) {
			    		$("#edit_information").remove();
			    		$("#exit_login").remove();
			    	}
			    	if (data.userid == undefined) {
			    		get_details(id)
			    	}else{
			    		get_details(data.userid)
			    	}
			    	
			    },
				error:function(e) {
					console.log(e)
				}
			})
		});
	})

	var social_height = $("#social").height()
	var page_4_height = $("#page_4").height()
	var fix_top_height = $("#fix_top").height()
	var bar = $(".mui-tab-item").height();
	var list_height = page_4_height-social_height-fix_top_height

	var title_img_height = $("#title_img").height();
	var title_show_height = $("#title_show").height();
		hidden_height = title_img_height + title_show_height - social_height - fix_top_height;



});

function get_details(id) {
	
	console.log(id)
	$.ajax({
	    url: link_src+"user?method=qrzuoping",
	    data: {userid:id,yeshu:1},
	    async:true,
	    type: "POST",
	    dataType: "text",
	    success: function(data) {
	    	console.log(data)
	    	data = eval("(" + data + ")");
	    	$("#zp_1").text(data.length)
	    	for (var i = 0; i < data.length; i++) {
	    		console.log(data[i])
	    		var temp_html = "<div class=\"video_box\">" +
								    "<img width=\"100%\" height=\"100%\" src=\""+link_src+"resources/videoimg/"+data[i].videoimg+"\">" +
								    "<div class=\"like\">"+data[i].videocollection+"收藏</div>" +
								"</div>";
				$("#dynamic_detailed").append(temp_html);
	    	}
	    	get_like(id);
	    },
		error:function(e) {
			console.log(e)
		}
	})
}

function get_like(id) {
	console.log(id)
	$.ajax({
	    url: link_src+"user?method=qrcollection",
	    data: {userid:id,yeshu:1},
	    async:true,
	    type: "POST",
	    dataType: "text",
	    success: function(data) {
	    	console.log(data)
	    	data = eval("(" + data + ")");
	    	$("#xh_1").text(data.length)
	    	for (var i = 0; i < data.length; i++) {
	    		console.log(data[i])
	    		var temp_html = "<div class=\"video_box\">" +
								    "<img width=\"100%\" height=\"100%\" src=\""+link_src+"resources/videoimg/"+data[i].videoimg+"\">" +
								    "<div class=\"like\">"+data[i].videocollection+"收藏</div>" +
								"</div>";
				$("#fan_detailed").append(temp_html);
	    	}
	    },
		error:function(e) {
			console.log(e)
		}
	})
}

function exit_login() {
	$.ajax({
	    url: link_src+"videologin.do?method=tuichu",
	    data: {},
	    async:true,
	    type: "POST",
	    dataType: "text",
	    success: function(data) {
	    	mui.toast("已退出登录");
			var launch_webview=plus.webview.getLaunchWebview();
			 mui.fire(launch_webview,'login_status',{
			 		status:false,
  				});
			mui.back();
	    },
		error:function(e) {
			console.log(e)
		}
	})
}