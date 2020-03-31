const link_src = 'http://39.106.92.181:8080/duanshiping/';
var click = true;
var up_video_screes = true;
$(function() { 
	mui.plusReady(function () {
		plus.webview.currentWebview().setStyle({
		    height:document.documentElement.clientHeight || document.body.clientHeight
		});
		var old_back = mui.back;  
		mui.back = function(){  
			setTimeout(function () {
				var h=plus.webview.getWebviewById('up_load');
				var wobj = h
    			wobj.reload(true);
			},500)
		    plus.navigator.setStatusBarStyle('lite');
		    old_back();  
		}
	})
	document.getElementById("setect_video_input").addEventListener("change",function () {
        	console.log("change");
		var files = $('#setect_video_input').prop('files');
		var file = document.getElementById('setect_video_input').files[0]
		var url = URL.createObjectURL(file);
		   		console.log(url);
		   		document.getElementById("play_video").src = url;
		   		$("#play_video").css('visibility','visible')
		   		$("#input_box_matte").text("")
		   		$("#input_box_matte").css('background-color','black')
				document.getElementById("play_video").play();
				$("#input_box_matte").css('pointer-events','auto');
		        auto_up_laod_video(files)
		});
});

function auto_up_laod_video(files) {         
    console.log(files)
    var formData = new FormData();
	formData.append('file', files[0]);
	$.ajax({
		url: link_src+'videoUpload.do?method=videoupload',
		type: 'POST',
		async:true, //
		cache: false,
		data: formData,
		processData: false,
		contentType: false,
		xhr:xhrOnProgress(function(e){
        	var percent=e.loaded/e.total;//文件上传百分比
        	var temp_num = percent
        		temp_num = (temp_num*100).toString().slice(0,4)
        	$("#up_load_num").text(temp_num+'%');
        	$("#progress_bar").css('width',(percent*100)*1+'%')
        	console.log(percent);
        })
	}).done(function(data) {
		console.log(data)
		data = eval("(" + data + ")");
		if (data.successs) {
			mui.toast('视频已保存到云端');
			$("#up_load_num").text('上传完成');
			$("#input_box_matte").css('pointer-events','none');
			console.log('视频已保存到云端');
		}else{
			mui.toast(data.errors);
			console.log(data.errors);
			$("#input_box_matte").css('pointer-events','none');
		}
	}).fail(function(data) {
		console.log(data);
		$("#up_load_num").text('上传失败');
		mui.toast('文件上传失败');
		$("#input_box_matte").css('pointer-events','none');
	});
};


function delete_s() {
	$.ajax({
	    url: link_src+'videoUpload.do?method=deletevideo',
	    type: 'POST',
	    async:true, //
	    cache: false,
	    data:"",
	    processData: false,
	    contentType: false
	}).done(function(res) {
		res = eval("(" + res + ")");
		mui.toast(res.msg);
	}).fail(function(res) {
		res = eval("(" + res + ")");
		mui.toast(res.msg);
	});
}

var xhrOnProgress=function(fun) {
    xhrOnProgress.onprogress = fun; //绑定监听
    //使用闭包实现监听绑
    return function() {
    	//通过$.ajaxSettings.xhr();获得XMLHttpRequest对象
    	var xhr = $.ajaxSettings.xhr();
    	//判断监听函数是否为函数
    	if (typeof xhrOnProgress.onprogress !== 'function')
    	  return xhr;
    	//如果有监听函数并且xhr对象支持绑定时就把监听函数绑定上去
    	if (xhrOnProgress.onprogress && xhr.upload) {
    	  xhr.upload.onprogress = xhrOnProgress.onprogress;
    	}
    	return xhr;
    }
}

function send_up() {
	if (click) {
		click = false;
		$("#up_bottom").css({'background-color':'#AAAAAA','color':'#ffffff'})
		$("#up_bottom").text('发布中...');
		var descr_s = $("#enter_multiple_lines_text").val();
		var moon_s = $("#mood_selection_2").val();
		if (descr_s.length == '0') {
			descr_s = '没有描述'
		}
		$.ajax({
			url: link_src+"videoUpload.do?method=upload&descr="+descr_s+"&mon="+moon_s,
			data: {},
			async:true,
			type: "POST",
			dataType: "text",
			success: function(data) {
				console.log(data);
				data = eval("(" + data + ")");
				if (data.successs) {
					mui.toast("发布成功");
					$("#up_bottom").text('发布成功');
					setTimeout(function () {
						var h=plus.webview.getWebviewById('up_load');
						var wobj = h
    					wobj.reload(true);
					},1000)
					up_video_screes = true;
				}else{
					$("#input_psw").val("");
					$("#up_bottom").text('上传');
					$("#up_bottom").css({'background-color':'black','color':'#ffdb14'});
					mui.toast('发布失败,请重新上传'+data.errors);
					up_video_screes = false;
					var h=plus.webview.getWebviewById('registered');
					var wobj = h;
    				wobj.reload(true);
				}
			},
			error:function(e) {
				$("#up_bottom").text('服务器未响应');
				mui.toast('服务器未响应,请稍后再试');
			}
		})
	}else{
		if (up_video_screes) {
			mui.toast('请稍等片刻...');
		}else{
			mui.toast('请重新打开页面上传');
		}
	}
}

