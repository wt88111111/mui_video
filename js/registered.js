const link_src = 'http://39.106.92.181:8080/duanshiping/';
jQuery(document).ready(function($) {
	mui.plusReady(function () { 
		plus.webview.currentWebview().setStyle({
		    height:document.documentElement.clientHeight || document.body.clientHeight
		});
		var old_back = mui.back;  
		mui.back = function(){  
		    plus.navigator.setStatusBarStyle('dark');
		    old_back();  
		}
	})
});
var phone_num = 0,verification_num = 0;

function padd_num(value) {
	phone_num = value;
	if (value.length == '11') {
		$("#input_phone_num").css('border-color','#81E556')
		in_network(value)
	}else if(value.length == '0'){
		$("#input_phone_num").css('border-color','#383838')
	}else{
		$("#input_phone_num").css('border-color','#F03737')
	}
}

function verification_check(value) {
	verification_num = value;
	if (value.length == '5') {
		$("#verification_code").css('border-color','#51B6FF')
		in_network(value)
	}else if(value.length == '0'){
		$("#verification_code").css('border-color','#383838')
	}else{
		$("#verification_code").css('border-color','#F03737')
	}
	// is_ok_1()
}

function in_network(value) {
	if (phone_num.length == '11' && verification_num.length == '5') {
		console.log(phone_num,verification_num)
		mui.toast('验证中,请稍后');
		$.ajax({
		    url: link_src+"user?method=send",
		    data: {phone_num:phone_num,ver_num:verification_num},
		    async:true,
		    type: "POST",
		    dataType: "text",
		    success: function(data) {
		    	console.log(data)
		    	data = eval("(" + data + ")");
		    	console.log(data)
		    	if (data.successs) {
					mui.toast('验证码已发送');
					is_ok_1();
		    	}else{
		    		$("#verification_code").val("")
		    		document.getElementById("yzm").src=link_src+"user?method=generate&"+Math.random();
					mui.toast(data.errors);
					console.log(data.errors)
		    	}
		    },
		    error:function(e) {
		    	console.log(e)
		    }
		})
	}
}

function is_ok_1() {
		setTimeout(function () {
			$("#s_1").remove();
			$("#s_2").css({'z-index':'11'});
		},400)
		$("#s_1").css({"opacity":"0"})
}

var input_phone_verification_code = 0;
function check(value) {
	input_phone_verification_code = value;
	if (value.length == '5') {
		$("#verification_code").css('border-color','#51B6FF')
		in_network_2(input_phone_verification_code);
	}else if(value.length == '0'){
		$("#verification_code").css('border-color','#383838')
	}else{
		$("#verification_code").css('border-color','#F03737')
	}
}

function in_network_2(value) {
	mui.toast('验证中,请稍后');
		$.ajax({
		    url: link_src+"user?method=verification",
		    data: {code:value},
		    async:true,
		    type: "POST",
		    dataType: "text",
		    success: function(data) {
		    	console.log(data)
		    	data = eval("(" + data + ")");
		    	if (data.successs) {
					is_ok_2()
		    	}else{
		    		$("#input_phone_verification_code").val("")
					mui.toast(data.errors);
					console.log(data.errors)
		    	}
		    },
		    error:function(e) {
		    	console.log(e)
		    }
		})
}

function is_ok_2() {
	if (input_phone_verification_code.length == '5') {
		setTimeout(function () {
			$("#s_3").css({'z-index':'12'});
			$("#s_2").remove()
		},400)
		$("#s_2").css({"opacity":"0"})
	}
}
var name = 0,psw = 0,email = 0;
function reset_user_name(value) {
	name = value;
	if (value.length <= '6' && value.length >= '2') {
		$("#input_name").css('border-color','#40E753')
		// if_don();
	}else if(value.length == '0'){
		$("#input_name").css('border-color','#383838')
		// if_don();
	}else{
		$("#input_name").css('border-color','#F03737')
		// if_don();
	}
}

function reset_user_password(value) {
	psw = value;
	if (value.length <= '10' && value.length >= '6') {
		$("#input_psw").css('border-color','#4CB4FE')
		// if_don();
	}else if(value.length == '0'){
		$("#input_psw").css('border-color','#383838')
		// if_don();
	}else{
		$("#input_psw").css('border-color','#F03737')
		// if_don();
	}
}
var regExp = /\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/,enail_s = false; 
function reset_user_email(value) {
	email = value;
	if (regExp.test(value)) {
		$("#input_email").css('border-color','#4CB4FE')
		enail_s = true;
		// if_don();
	}else if(value.length == '0'){
		$("#input_email").css('border-color','#383838')
		enail_s = false
		// if_don();
	}else{
		$("#input_email").css('border-color','#F03737')
		enail_s = false
		// if_don();
	}
}
// var on_read_up = false;
// function if_don() {
// 	console.log(enail_s)
// 	if (name.length <= '6' && name.length >= '2' && psw.length <= '10' && psw >= '6' && enail_s) {
// 		console.log("验证成功");
// 		$(".registered_ok").css('color','#ffffff');
// 		on_read_up = true;
// 	}else{
// 		console.log('验证失败');
// 		$(".registered_ok").css('color','#AAAAAA');
// 		on_read_up = false;
// 	}
// }

// function on_up() {
// 	if (on_read_up) {
// 		toload();
// 	}else{
// 		mui.toast('请检查资料是否完整');
// 	}
// }

function toload() {


// mui.openWindow({
// 	url:'login.html',
//     id:'login'
//   });

	mui.toast('验证中,请稍后');
	
		$.ajax({
		    url: link_src+"user?method=registered",
		    data: {userpassword:psw,username:name,useremail:email},
		    async:true,
		    type: "POST",
		    dataType: "text",
		    success: function(data) {
		    	console.log(data)
		    	data = eval("(" + data + ")");
		    	if (data.successs) {
		    		console.log("成功")
					mui.toast('成功!');
						var loginPage = plus.webview.getWebviewById('login');
						mui.fire(loginPage,'registereds',{
    						phone_num:phone_num,
    						psw:psw
  						});
						refish()
				}else{
		    		$("#input_psw").val("")
					mui.toast(data.errors);
					console.log(data.errors)
		    	}
		    },
		    error:function(e) {
		    	console.log(e)
		    }
		})
}

function refish() {
	mui.back()
	setTimeout(function () {
		var h=plus.webview.getWebviewById('registered');
		var wobj = h
    	wobj.reload(true);
	},500)
}