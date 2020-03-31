const link_src = 'http://39.106.92.181:8080/duanshiping/';
var is_login = false;
mui.plusReady(function () {
console.log("load_ok")
window.addEventListener('registereds',function(event){
 	$("#input_phone").val(event.detail.phone_num); 
 	$("#input_psw").val(event.detail.psw)
});
	plus.webview.currentWebview().setStyle({
	        height:document.documentElement.clientHeight || document.body.clientHeight
	});

	var old_back = mui.back;  
	mui.back = function(){  
	    plus.navigator.setStatusBarStyle('lite');
	    old_back();  
	}

})

var phone_num_length = false;
function login_phone_num(value) {
	console.log(value.length)
	if (value.length == '11') {
		phone_num_length = true;
	}else{
		phone_num_length = false;
	}
}

function login_up() {
	var phone_num = $("#input_phone").val();
	var password = $("#input_psw").val();
	console.log(phone_num,password);
}

function cls_num() {
	$("#input_phone").val("");
	$("#input_psw").val("");
}

function open_registered() {
	var loginPage = plus.webview.getWebviewById('registered.html');
					mui.fire(loginPage,'registereds',{
    					phone_num:"phone_num",
    					psw:'psw'
  					});
	mui.openWindow({
			url:"registered.html",
    		id:'registered',
    		createNew:false
	})
}

function login_up() {
	var phone = $("#input_phone").val();
	var psw = $("#input_psw").val();
	if (phone.length != '0' && psw.length != '0') {
		go_up(phone,psw);
	}else{
		mui.toast("请检查输入是否正确")
	}
}

function go_up(phone,psw) {
	mui.toast('验证中,请稍后');
		$.ajax({
		    url: link_src+"user?method=login",
		    data: {number:phone,password:psw},
		    async:true,
		    type: "POST",
		    dataType: "text",
		    
		    success: function(data) {
		    	console.log(data)
		    	data = eval("(" + data + ")");
		    	if (data.successs) {
					mui.toast("登录成功");
					var launch_webview=plus.webview.getLaunchWebview();
					 mui.fire(launch_webview,'login_status',{
					 		status:true,
  						});
					mui.back();
					setTimeout(function () {
						var h=plus.webview.getWebviewById('login');
						var wobj = h
    					wobj.reload(true);
					},300)
		    	}else{
		    		$("#input_psw").val("")
					mui.toast("账号或密码错误");
					console.log(data.errors)
		    	}
		    },
		    error:function(e) {
		    	console.log(e)
		    }
		})
}