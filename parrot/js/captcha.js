/*******************************************************************************
 * 验证码操作 /* if ($("#phone").attr("checked") == true) { dealType = "phone"; }
 * else { dealType = "email"; }
 */
function captcha(){
	this.InterValObj; // timer变量，控制时间
	var curCount;	  // 当前剩余秒数
	var count=90;     // 倒计时长度
	this.codeLength = 6;// 验证码长度
	//当前服务地址
	this.localHost=window.location.host; 
	this.sendMessage=function() {
		$('form#register_form .error_org').remove();
		//$('form#register_form br').remove();
		curCount = count;
		var dealType; // 验证方式
		var login = $("#loginPhone").val();	// 用户登录名
		if(!(/^1[3|4|5|8][0-9]\d{4,8}$/.test(login))){
			$("#loginPhone").focus();
		    $("#loginPhone").parent().append('<div class="error_org">请输入正确的手机号!</div>');
		    return false;
		}
		// 设置button效果，开始计时
		$("#btnSendCode").attr("disabled", "true");
		$("#btnSendCode").val("请在" + count + "秒内输入验证码");
		this.InterValObj = window.setInterval(this.SetRemainTime, 1000); // 启动计时器，1秒执行一次
		// 向后台发送处理数据
		$.ajax({
			type : "GET", 
			url:"http://"+this.localHost+"/capi/captcha/send/"+login,
			data : "login=" + login,
			error : function(XMLHttpRequest, textStatus, errorThrown) {
				$("#loginPhone").focus();
			    $("#loginPhone").parent().append('<div class="error_org">请重新输入手机号获取验证码!</div>');
			},
			success : function(msg) {
				
			}
		});
	};
	// timer处理函数
	this.SetRemainTime=function() {
		
		// alert(curCount);
		if (curCount == 0) {
			window.clearInterval(this.InterValObj);// 停止计时器
			$("#btnSendCode").removeAttr("disabled");// 启用按钮
			$("#btnSendCode").val("重新发送验证码");
			code = ""; // 清除验证码。如果不清除，过时间后，输入收到的验证码依然有效
		} else {
			curCount--;
			$("#btnSendCode").val("请在" + curCount + "秒内输入验证码");
		}
	}
	
}