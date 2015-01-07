/***************************************************
		用户注册
***************************************************/
function register(){
	
	this.reLogin=/^1[3|4|5|8][0-9]\d{4,8}$/;
	this.regu = /\w*[0-9]+\w*$/;  
    this.regu2 = /\w*[a-zA-Z]+\w*$/;  
	//当前服务地址
	this.localHost=window.location.host; 
    this.registerCheck=function(){
		
    	$('form#register_form .error_org').remove();
    	var login = $("#loginPhone").val();
    	var captcha = $("#recaptcha").val();
    	if(!(this.reLogin.test(login))){
			$("#loginPhone").focus();
		    $("#loginPhone").parent().append('<div class="error_org">请输入正确的手机号!</div>');
		    return false;
		}
    	if(jQuery.trim(captcha) == ''){
			$("#recaptcha").focus();
		    $("#recaptcha").parent().append('<div class="error_org">验证码不能为空!</div>');
		    return false;
		}
		$.ajax({
			cache: true,
			type: "PUT",
			url:"http://"+this.localHost+"/capi/user/register/"+login,
			data:"login="+login+"&captcha="+captcha,
			async: false,
			error: function(request) {
				alert("服务器忙请稍后!");
			},
			success: function(data) {
				if(data.state==1){
					$("#sequence").val(data.sequence);
				}else{
					$("#loginPhone").focus();
				    $("#loginPhone").parent().append('<div class="error_org">手机号验证有误,请联系管理员!</div>');
				}

			}
		});
    };
	this.registerRequest=function(){
		$('form#register_form .error_org').remove();
		var hasError = false;
		var login = $("#loginPhone").val();
		var pass1 = $("#repassword").val();
		var pass2 = $("#repasswordok").val();
		var captcha = $("#recaptcha").val();
		var sequence = $("#sequence").val();
		if(!(this.reLogin.test(login))){
			$("#loginPhone").focus();
		    $("#loginPhone").parent().append('<div class="error_org">请输入正确的手机号!</div>');
		    return false;
		}
		if(jQuery.trim(captcha) == ''){
			$("#recaptcha").focus();
		    $("#recaptcha").parent().append('<div class="error_org">验证码不能为空!</div>');
		    return false;
		}
		if(jQuery.trim(pass1) == ''){
			$("#repassword").focus();
		    $("#repassword").parent().append('<div class="error_org">密码不能为空!</div>');
		    return false;
		}
		var len=jQuery.trim(pass1).length;
		if(len<6||len>32){
			$("#repassword").focus();
		    $("#repassword").parent().append('<div class="error_org">密码长度不符合要求!</div>');
		    return false;
		}
		if(jQuery.trim(pass1) != jQuery.trim(pass2)){
			$("#repasswordok").focus();
		    $("#repasswordok").parent().append('<div class="error_org">两次密码输入不一致!</div>');
		    return false;
		}
		var md5Pass1=$.md5(login+pass1);
		$.ajax({
			cache: true,
			type: "post",
			url:"http://"+this.localHost+"/capi/user/reset/"+login,
			data:"login="+login+"&password="+md5Pass1+"&sequence="+sequence,
			async: false,
			error: function(request) {
				alert("服务器忙请稍后!");
			},
			success: function(data) {
				if(data.state==1){
					var card=new CardCookie(); 
					var login = $("#loginPhone").val();
					var userInfo={sid:data.sid,name:login};
					card.addCookie("userInfo",JSON.stringify(userInfo));
					location.href="register_complete.html?userPhone="+login;  
				}else{
					$("#repasswordok").focus();
				    $("#repasswordok").parent().append('<div class="error_org">注册失败,请联系管理员!</div>');
				}

			}
		});
	};
	
	
}