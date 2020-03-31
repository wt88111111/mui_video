const link_src = 'http://39.106.92.181:8080/duanshiping/';
var page_num = 0;
var old_num = 0;
var is_read = false; 
var playin_page = 1;
var video_pause = false;
var video_id_list = new Array();
var video_list = new Array();
var global_video_data;
var add_data_num = 0;
var num_s = 1;
var window_width;
var login = {
	status:false,
}
//初始化全屏滚动
var myFullpage=new fullpage('#fullpage',{
	menu:'#menu',
	continuousVertical:true,
	afterLoad:function(anchorLink,index){
		if (is_read) {
				num_s = (index.index+1)*1;
				console.log(num_s)
			var temp_uv_s = document.getElementById('uv_'+num_s);
				$(".pause").remove()
				temp_uv_s.play();
				video_load(num_s);
				video_pause = false
				reset_video_time();
				// $(".video_status").append("<img class=\"pause\" width=\"100%\" src=\"play.png\">")
		}
	},
	onLeave:function(index,nextIndex,direction){
		pause_video_s()
		console.log(direction)
		var lst_ = playin_page-1
		setTimeout(function () {
			$(".icon-aixin").eq(lst_).css('color', '#fff');
		},500)
		playin_page = (nextIndex.index+1);
		if (direction == 'up') {
			if (page_num == 0) {
				mui.toast('刷新中');
				var h=plus.webview.getLaunchWebview(); 
				var wobj = h
        		wobj.reload(true);
			}

		var next_num = (nextIndex.index+1)*1
				get_video_data(video_id_list[page_num-2],function (e) {
					add_data(e,next_num,false);
				});
				page_num--
		}else{
		var next_num = (nextIndex.index+2)*1
			if (next_num > 3) {
				next_num = 1;
			}
			page_num++
			// console.log(video_id_list[page_num]+":"+page_num)
			if (video_id_list[page_num] == undefined) {
				get_video_data("",function (e) {
					add_data(e,next_num,true);
				});
			}else if (page_num > 0) {
				get_video_data(video_id_list[page_num],function (e) {
					add_data(e,next_num,false);
				});
			}else{
				get_video_data("",function (e) {
					add_data(e,next_num,true);
				});
			}
		}
	},
});
//页面加载完成后初始化视频资源
jQuery(document).ready(function($) {
		window_width = $(window).width();
		comment_width = window_width*0.8;
		comment_width = comment_width-60;
		console.log(comment_width);
		
	init_video();
	init_touch()
	mui.plusReady(function () {
			window.addEventListener('login_status',function(event){
			login.status = event.detail.status;
			mui('.mui-scroll-wrapper').scroll({
				deceleration: 0.0005 //flick 减速系数，系数越大，滚动速度越慢，滚动距离越小，默认值0.0006
			});
		});
	})
});
//初始化函数
function init_video() {
	for (var i = 1; i < 4; i++) {
		get_video_data("",function (e) {
			add_data(e,i,true)
		})
	}
	is_read = true;
	console.log("init_ok")
}
//重置视频播放时长
function reset_video_time() {
	for (var i = 1; i < 4; i++) {
		var temp_uv = document.getElementById('uv_'+i);
			temp_uv.currentTime = 0.01;
	}
}
//获取据源
var a = 0;
function get_video_data(id,callback) {
	// console.log(id)
	if (id != undefined) {
		if (id.length != 0) {
				var b = id;
				$.ajax({
				    url: link_src+"video?method=videoid",
				    data: {video_id: b},
				    async:false,
				    type: "POST",
				    dataType: "json",
				    success: function(data) {
				    json = data
				    }
				})
			}else{
				console.log("null")
				$.ajax({
				    url: link_src+"video?method=videorequest",
				    data: {},
				    async:false,
				    type: "POST",
				    dataType: "json",
				    success: function(data) {
				    json = data
				    }
				})
			}
		// var json;
		
		console.log(json.video_id)

		// var json = {
		// 	video_id:a,	//视频id
		// 	video_src:"1.MP4",		//视频链接
		// 	video_like:"233",		//视频点赞
		// 	video_collection:"332",//视频收藏
		// 	video_comment:"123",	//视频评论
		// 	video_forward:"321",	//视频转发
		// 	video_description:"描述一下啊啊啊啊啊"+a,//视频描述
		// 	video_mood:"开心",		//视频心情
		// 	user_id:"0001",//用户id
		// 	user_name:"曦月",//用户名
		// 	user_avatar:"1.png",//用户头像地址
		// 	video_imger:""
		// }

		if (id.length == 0) {
			a++
		}
		callback(json)
	}else{
		id.length;
	}
}
//视频暂停
function pause_video_s() {
	if (playin_page == num_s) {
		var temp_uv_n = document.getElementById('uv_'+playin_page);
		if (video_pause) {
			console.log("播放"+playin_page)
			temp_uv_n.play();
			video_pause = false;
			$(".pause").remove()
		}else{
			console.log("暂停"+playin_page)
			temp_uv_n.pause();
			video_pause = true;
			var temp_num = (playin_page-1)
			// console.log(temp_num)
			$(".video_status:eq("+temp_num+")").append("<img class=\"pause\" width=\"100%\" src=\"play.png\">")
		}
	}
}
//切换视频源
function switch_video_stream(value) {
	console.log(value)

}
//打开菜单
function open_menu() {
	console.log("open_menu")
	$("#flow_menu").css({'visibility':'visible','opacity':'1'});
	$("#horizontal_row").css({'bottom':'-20px'});
	if (!video_pause) {
		pause_video_s()
	}
}
//打开用户中心
function open_user(id) {
	console.log("open_user")
	open_my_viwe(id)
}
//点击喜欢
function click_like(id) {
	if (login.status) {
		console.log("click_like"+id)
		$(".icon-aixin").eq(playin_page-1).css('color', 'red');
		$.ajax({
		    url:link_src+"videologin.do?method=videoCollection",
		    data: {videoid:'1'},
		    async:true,
		    type: "GET",
		    dataType: "text",
		    success: function(data) {
		    	data = eval("(" + data + ")");
		    	mui.toast(data.error)
		    	console.log(data)
		    },
			error:function(e) {
				mui.toast(e);
			}
		})
	}else{
		mui.toast('请先登录');
	}
}
//打开评论
function open_comment(id) {
	$("#scroll_comment").html('')
	$("#flow_comment").css({'visibility':'visible'})
	$("#bottom_comment").css({'transform':'translate3d(0px,0px,0px)'})
	console.log("open_comment");
	get_comment_data(id)
}
//跳转到转发
function goto_forward(id) {
	console.log("goto_forward")
}
//发送弹幕
function send_barrage(id) {
	console.log("send_barrage")
}
//切换弹幕开关
function switch_barrage(value) {
	console.log("switch_barrage")
}
//关闭菜单
function close_menu() {
	console.log("close_menu")
	$("#flow_menu").css({'opacity':'0'});
	$("#horizontal_row").css({'bottom':'-120px'});
	pause_video_s()
	setTimeout(function () {
		$("#flow_menu").css({'visibility':'hidden'});
	},300)	
}
//打开视频上传页面
function open_upload() {
	if (login.status) {
		plus.navigator.setStatusBarStyle('dark');
		mui.openWindow({
			url:"up_load.html",
    		id:'up_load',
    		createNew:false
		})
	}else{
		plus.navigator.setStatusBarStyle('dark');
		mui.toast('请登录后再使用此功能');
		mui.openWindow({
			url:"login.html",
    		id:'login',
    		createNew:false
		})
	}
}
//打开主页
function open_home() {
	// body...
}
//打开发现
function open_find() {
	// body...
}
//打开信息
function open_message() {
	// body...
}
//打开我的
function open_my() {
	if (login.status) {
		open_my_viwe('')
	}else{
		plus.navigator.setStatusBarStyle('dark');
		mui.toast('请登录后再使用此功能');
		mui.openWindow({
			url:"login.html",
    		id:'login',
    		createNew:false
		})
	}
}
//打开我的_2
function open_my_viwe(id){
var me=plus.webview.getWebviewById('im');
	mui.fire(me,'user_id',{
		id:id,
  	});


	plus.navigator.setStatusBarStyle('dark');
	mui.openWindow({
		url:"im.html",
    	id:'im',
    	createNew:false
	})
}
//打开登录
function open_login_viwe() {
	
}
//添加数据
function add_data(e,i,not_old) {
	b = i;
	b--
	console.log("重写"+b)
	if (not_old) {
		console.log("新的数据")
		video_id_list[add_data_num-1] = e.video_id;
		add_data_num++;
	}
	$(".user_name").eq(i-1).text(e.user_name);
	$(".video_description").eq(i-1).text(e.video_description);
	$(".user_avatar").eq(i-1).attr('onclick','window.event.cancelBubble=true;open_user('+e.user_id+')');
	$(".user_avatar_img").eq(i-1).attr('src',link_src+'resources/img/'+e.user_avatar);
	$(".like_button").eq(i-1).attr('onclick',"window.event.cancelBubble=true;click_like("+e.video_id+")");
	$(".like_num").eq(i-1).text(e.video_like);
	$(".comment").eq(i-1).attr('onclick',"window.event.cancelBubble=true;open_comment("+e.video_id+")");
	$(".comment_num").eq(i-1).text(e.video_comment);
	$(".forward").eq(i-1).attr('onclick',"window.event.cancelBubble=true;goto_forward("+e.video_id+")");
	$(".forward_num").eq(i-1).text(e.video_forward);
	$(".barrage_input").eq(i-1).attr('onclick',"window.event.cancelBubble=true;send_barrage("+e.video_id+")");
	$(".dan").eq(i-1).attr('onclick',"window.event.cancelBubble=true;switch_barrage("+e.video_id+")");
	$(".up_video").eq(i-1).remove()
	$(".back_vid").eq(i-1).append("<video style='width= 100%; height=100%; object-fit: fill' loop preload=\"auto\" class=\"up_video\" poster=\"black.png\" id='uv_"+i+"' src='"+e.video_src+"' ></video>");
	$(".back_img").eq(i-1).remove()
	$(".back_glass_img").eq(i-1).append("<img class=\"back_img\" src=\""+link_src+"resources/videoimger/"+e.video_imger+"\">");

	if (add_data_num == 1) {
		var temp_uv = document.getElementById('uv_'+i);
			temp_uv.play();
			video_load(i)
	}
}
function video_load(num) {
	var video = document.getElementById('uv_'+num);
		video.addEventListener('waiting', (event) => {
			console.log('卡顿');
			$(".video_status").append("<img class=\"loading_gif\" width=\"100%\" src=\"video_load.gif\">")
		});
		video.addEventListener('playing', (event) => {
		  console.log('恢复');
		  $(".loading_gif").remove();
		});
}

function init_touch() {
	$("#scroll_comment").on('touchstart',function (e) {
			var boxOne = document.getElementById('scroll_comment');
		    var computedStyle = window.getComputedStyle(boxOne)
		    var temp_sss = computedStyle.getPropertyValue('transform');
		    var strs = new Array(); //定义一数组 
    			strs = temp_sss.split(","); //字符分割 
    			temp_top_s = strs[5]
    			// console.log(typeof temp_top_s)
    			temp_top_s = temp_top_s.substring(0,temp_top_s.length-1)
    			// console.log(typeof temp_top_s)
    			temp_top_s = temp_top_s*1
		var touch = e.originalEvent.targetTouches[0];
			touch_start_y = touch.pageY
			console.log(typeof touch_start_y);
	})
	$("#scroll_comment").on('touchmove',function (e) {
		var touch = e.originalEvent.targetTouches[0];
			touch_move_y = touch.pageY
			var move_div = touch_move_y-touch_start_y+temp_top_s
			console.log(move_div)
			document.getElementById('scroll_comment').style.webkitTransform="translate3d(0,"+move_div+"px,0)"
	})
	$("#scroll_comment").on('touchend',function (e) {
			console.log(touch_start_y);
	})
}


function close_comment() {
	$("#bottom_comment").css({'transform':'translate3d(0px,500px,0px)'})
	setTimeout(function () {
		$("#flow_comment").css({'visibility':'hidden'})
	},300)
}

function send_comment(id) {
	if(!login.status){
		mui.toast('请先登录')
	}else{
		console.log(id)
		var values = $("#input_comment").val();
		if (values.length == '0') {
			console.log("空")
		}else{
			console.log(values)
			$.ajax({
			    url:link_src+"videologin.do?method=release",
			    data: {videoid:id,comment:values},
			    async:true,
			    type: "GET",
			    dataType: "text",
			    success: function(data) {
			    	// console.log(data)
			    	// data = eval("(" + data + ")");
			    	mui.toast(data)
			    },
				error:function(e) {
					mui.toast(e);
				}
			})
			$("#input_comment").val("")
		}
	}
}

function get_comment_data(id) {
	console.log(id);
	$.ajax({
	    url: link_src+"video?method=videocomment",
	    data: {videoid:id,yeshu:1},
	    async:true,
	    type: "POST",
	    dataType: "text",
	    success: function(data) {
	    	// mui.toast('请先登录再试')
	    	console.log(data)
	    	if (data) {
	    		
				data = eval("(" + data + ")");
				for (var i = 0; i < data.length; i++) {
					var temp_html = "<div class=\"user_comment\">" +
										"<div class=\"comment_user_avatar\">" +
											"<img width=\"100%\" src=\""+link_src+"resources/videoimger/"+data[i].user+"\">" +
										"</div>" +
										"<div class=\"user_comment_name\">"+data[i].username+"</div>" +
										"<div class=\"user_comment_data\">"+data[i].comment+"</div>" +
									"</div>";
									$("#scroll_comment").append(temp_html)
				}
				$(".user_comment_data").width(comment_width)
				$("#send_comment").attr('onclick','event.stopPropagation();send_comment('+id+')')
	    	}else{
	    		$("#scroll_comment").text('没有数据')
	    	}
	    },
		error:function(e) {
			mui.toast(e);
		}
	})
}

