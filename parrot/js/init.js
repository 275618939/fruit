/***************************************************
		初始化首页JS脚本加载服务站‘商品等相关信息
***************************************************/
function initIndex() {
	//数字验证
	this.reg = new RegExp("^[0-9]*$");
	//手机验证
	this.reLogin=/^1[3|4|5|8][0-9]\d{4,11}$/;
	//购物车操作对象
	this.card=new CardCookie();
	//商品信息查询
	this.commodity=new Commodity();	
	//当前服务地址
	this.localHost=window.location.host; 
	//首页显示商品条目
	this.showCommodityCount=6;
	//默认初始化数据
	this.initialize=function(){
		this.autoLogin();
		this.loginInit();	
    };
	//默认商品
	this.initCommodity=function(){
		this.loadAllCommoditySale();
		this.loadPreferentialCommoditySale();
    };
	//加载验证码图片
	this.loadVerificationCode=function(){
	    var userName = $("#login").val();
		if(jQuery.trim(userName) == ''){
		    userName ='13611124630';
		}
		$.ajax({
			cache: true,
			type: "GET",
			url:"http://"+this.localHost+"/capi/captcha/get/"+userName,
			data:"login="+userName,
			async: false,
			error: function(request) {
			},
			success: function(data) {
				if(data.state==1){
					$("#captchaImage").attr("src",'data:image/png;base64,'+data.image); 
				}
			}
		});
	};
	//加载用户选择区域
	this.loadUserArea=function(){
		var userSelectArea=this.card.getCookie("userSelectArea");
		if(typeof(userSelectArea) != "undefined"  && userSelectArea != null && userSelectArea != ""){
			userSelectArea=JSON.parse(userSelectArea);
			$("#showUserSelectArea").text(userSelectArea.areaxiaoquText); 
		}else{
			this.showArea();
		}
    };
	//加载验证码图片
	this.loadResetVernCode=function(){
		var userInfo=this.card.getCookie("userInfo");
		if(typeof(userInfo) != "undefined"  && userInfo != null && userInfo != ""){
			userInfo=JSON.parse(userInfo);
			var name=userInfo.name;
			$.ajax({
				cache: true,
				type: "GET",
				url:"http://"+this.localHost+"/capi/captcha/get/"+name,
				data:"login="+name,
				async: false,
				error: function(request) {
				
				},
				success: function(data) {
					if(data.state==1){
						$("#resetCaptchaImage").attr("src",'data:image/png;base64,'+data.image); 
					}
				}
			});
		}
	};
	//默认自动登录
	this.autoLogin=function(){
		var userDetail=this.card.getCookie("loginUserDetail");
		if(typeof(userDetail) != "undefined"  && userDetail != null && userDetail != ""){
			userDetail=JSON.parse(userDetail);
			var userName=userDetail.userName; 
			var password=userDetail.password; 
			var urlPath="login="+userName+"&password="+password;
			$.ajax({
				cache: false,
				type: "POST",
				url:"http://"+this.localHost+"/capi/user/login/"+userName,
				data:urlPath,
				async: false,
				success: function(data) {
					if(data.state==1){
						//存放sid到cookie中
						var card=new CardCookie(); 
						var userInfo={sid:data.sid,name:userName};
						card.addCookie("userInfo",JSON.stringify(userInfo));
						$("#loginAfter").show();
						$("#loginBefore").hide();
						$("#userInfo").text("您好,　"+userName+"！");
					}
				},
				error: function(XMLHttpRequest, textStatus, errorThrown) {
					alert("服务器忙请稍后!");
				}
			});
			
		}
	};
	this.showWeiXin=function(){
		$("#wexinDialog").dialog({show: "blind",
				hide: "explode",
				modal: true,
				width: 420,
				height:420 }); 
	}
	this.showLogin=function(){
		//$("#loginWin").show();
		$("#loginWin").dialog({
		autoOpen: true,
		title:'登录与注册',
		close:true,
		width: 600,
		height:400,
		show: "blind",
		hide: "explode",
		modal: true
		});
		$("#loginWin").dialog( "open" ); 
	};
	this.showArea=function(){
		$("#areaWin").dialog({
		autoOpen: true,
		title:'选择服务区域',
		close:true,
		width: 580,
		height:350,
		show: "blind",
		hide: "explode",
		modal: true
		});
		$("#areaWin").dialog( "open" );
        $("#areaWin").prev().hide();
	};
	//加载购物车商品
	this.loadShoppingCart=function(){
		var userInfo=this.card.getCookie("userInfo");
		if(typeof(userInfo) != "undefined"  && userInfo != null && userInfo != ""){
			userInfo=JSON.parse(userInfo);
			$.ajax({
				cache: false,
				type: "GET",
				url:"http://"+this.localHost+"/capi/cart/"+userInfo.sid,
				//data:"sid="+userInfo.sid,
				async: false,
				error: function(request) {
					alert("加载服务器购物车信息失败!");
				},
				success: function(data) {
					if(data.state==1){
						var len=data.value.length;
						var myCardMount=$("#myCard").text();
						if(isNaN(myCardMount)||myCardMount.value == ""){
							myCardMount=0;
						}
						var tempCount=0;
						for(var i=0;i<len;i++){
							tempCount+=data.value[i].amount;
						}
						myCardMount=parseInt(myCardMount);
						$("#myCard").text(myCardMount+tempCount);
					}
				}
			});
		}
	};
	//加载广告Banner
	this.loadBannerCommodity=function(){
		this.commodity.result=this.createBannerCommodity;
		this.commodity.findInSaleCommodity(this.commodity.BannerCommodityID);
	}
	//加载每日优惠水果
	this.loadPreferentialCommoditySale=function(){
		this.commodity.result=this.createPreferentialCommodityInfo;
		this.commodity.findInSaleCommodity(this.commodity.PreferentialCommodityID);
	};
	//加载所有水果的在售商品
	this.loadAllCommoditySale=function(obj){
		if(obj!=null){
			$('#commodityType .sel').removeClass('sel');
		    var id=obj.id;
			$('#'+id).addClass('sel');
		}
		this.commodity.result=this.createAllCommodityInfo;
		this.commodity.findInSaleCommodity(this.commodity.AllCommodityID);
	};
	//加载所有水果的预售商品
	this.loadAllCommodityAdvance=function(obj){
		if(obj!=null){
			$('#commodityType .sel').removeClass('sel');
		    var id=obj.id;
			$('#'+id).addClass('sel');
		}
		this.commodity.result=this.createAllCommodityInfo;
		this.commodity.findAdvanceCommodity(this.commodity.AllCommodityID);
	};
	//加载所有水果的售罄商品
	this.loadAllCommoditySaleOut=function(obj){
		if(obj!=null){
			$('#commodityType .sel').removeClass('sel');
		    var id=obj.id;
			$('#'+id).addClass('sel');
		}
		this.commodity.result=this.createAllCommodityInfo;
		this.commodity.findSaleOutCommodity(this.commodity.AllCommodityID);
	};
	//设置Banner商品
	this.createBannerCommodity=function(data){
		if(data.state==1){
			 var len=data.value.length;
			 var path;
			 var aId;
			 var commodity;
			 var commodityUrls
			 var imagePath;
			 for(var i=0;i<len;i++){
				  commodity=data.value[i];
				  commodityUrls=JSON.parse(commodity.imageUrl);
				  aId="flash"+(i+1);
				  imagePath="images/"+commodityUrls[0];
				  $("#"+aId).css("background-image","url("+imagePath+")"); 
			 }
			 $(".slides li").each(function(i){
				  $(this).click(function(){
					 commodity=data.value[$(this).index()];
					 window.open("http://www.51yingwu.com/detail.html?commodityId="+commodity.commodityId+"&groupCommodityId="+commodity.id, "_blank")
					 //location.href="detail.html?commodityId="+commodity.commodityId+"&groupCommodityId="+commodity.id;  
				  });
			 });
			 /*for(var i=0;i<len;i++){
				  commodity=data.value[i];
				  commodityUrls=JSON.parse(commodity.imageUrl);
				  aId="flash"+(i+1);
				  imagePath="images/"+commodityUrls[0];
				  $("#"+aId).css("background-image","url("+imagePath+")"); 
				  $(".flexslider li").eq(i).attr("commodityId",commodity.commodityId);
				  $(".flexslider li").eq(i).attr("groupCommodityId",commodity.id);
			 }
			  $(".flexslider li").live("click",function () {
				 location.href="detail.html?commodityId="+$(this).attr("commodityId")+"&groupCommodityId="+$(this).attr("groupCommodityId");  
			  });
			 for(var i=0;i<len;i++){
				  commodity=data.value[i];
				  commodityUrls=JSON.parse(commodity.imageUrl);
				  aId="flash"+(i+1);
				  imagePath="images/"+commodityUrls[0];
				  $("#"+aId).css("background-image","url("+imagePath+")"); 
			 }
		     $("#flash1").live("click",function () {
				   location.href="detail.html?commodityId="+data.value[0].commodityId+"&groupCommodityId="+data.value[0].id;       
			 });
		     $("#flash2").live("click",function () {
				   location.href="detail.html?commodityId="+data.value[1].commodityId+"&groupCommodityId="+data.value[1].id;       
			 });
			 $("#flash3").live("click",function () {
				   location.href="detail.html?commodityId="+data.value[2].commodityId+"&groupCommodityId="+data.value[2].id;       
			 });
			 $("#flash4").live("click",function () {
				   location.href="detail.html?commodityId="+data.value[3].commodityId+"&groupCommodityId="+data.value[3].id;       
			 });
			 $("#flash5").live("click",function () {
				   location.href="detail.html?commodityId="+data.value[4].commodityId+"&groupCommodityId="+data.value[4].id;       
			 });*/
		}
	};
	//首页创建所有在售商品列表
	this.createAllCommodityInfo=function(data){
		//测试用
		//data={state:1,value:[{commodityId:100,commodityName:'澳大利亚奇异果',commodityTitle:'香甜可口',commodityUrl:['images/4294300657888891521.jpg'],thumbUrl:['images/4294300657888891521.jpg'],unit:'份',phase:'2014-07-14',source:40,price:30,amount:25,remain:15}]};	
		if(data.state==1){
			 var len=data.value.length;
			 $("#goodItems").empty();
			 var init=new initIndex();
			 var nowDate=new Date();
			 var nowMonth=nowDate.getMonth()+1;
			 var nowDay=nowDate.getDate();
			 if(nowMonth<10){
				nowMonth="0"+nowMonth;
			 }
			 if(nowDay<10){
			 	nowDay="0"+nowDay;
			 }
		     var nowPhase =nowDate.getFullYear()+"-"+nowMonth+"-"+nowDay;
			 for(var i=0;i<len&&i<6;i++){
				 var commodity=data.value[i];
				 var commodityUrls=JSON.parse(commodity.imageUrl);
				 //var price=parseFloat(commodity.price*0.01).toFixed(2);
				 //var source=parseFloat(commodity.source*0.01).toFixed(2);
				 var price=init.moneyToStr(commodity.price);
				 var source=init.moneyToStr(commodity.source);
				 var r=commodity.amount-commodity.sale;
				 var origin="";
				 try{
					 if(commodity.property!=null&&jQuery.trim(commodity.property)!=""){			
						var property= JSON.parse(commodity.property); //
						origin="产地&nbsp;:&nbsp;"+property.goodOrigin;
					 }
				 }catch (e){
					
				 } 
				 //<b id='commodityHour'>00</b>:<b id='commodityMin'>00</b>:<b id='commoditySecond'>00</b>
				/*if(i%2==0){
					if(r==0){
						//已售罄
						var element=$("<div class='main_gray'><div class='container'><div class='xs_biaozhi'><img src='images/ico_xianshi_gray.png' width='76' height='79' /></div><div class='xs_text'><h2>"+commodity.commodityName+"</h2><h3>到货时间："+commodity.phase+"<br />优选倒计时：24小时内<br />优先分数总计："+commodity.amount+"份</h3></div><div class='xs_product'><a href='detail.html?commodityId="+commodity.commodityId+"&groupCommodityId="+commodity.id+"' target='_self'><img src='images/"+commodityUrls[0]+"' width='603' height='282' /></a></div><div class='xs_buy'><img src='images/xs_none.png' width='184' height='185' class='xs_none' /><div class='time_gray'></div><div class='price'><h3 class='text_gray'>优惠价</h3><h2 class='text_gray'><em>￥</em>"+price+"<span>/份</span></h2><h4 class='text_gray'>"+source+"/份</h4></div><div class='btn_buy_gray'><a href='detail.html?commodityId="+commodity.commodityId+"&groupCommodityId="+commodity.id+"' target='_self'>立即购买</a></div></div><div class='cls'></div></div></div><div class='cls'></div>");
						element.appendTo($("#goodItems"));
					}else if(commodity.status==0){
						//已到期
						var element=$("<div class='main_gray'><div class='container'><div class='xs_biaozhi'><img src='images/ico_xianshi_org.png' width='76' height='79' /></div><div class='xs_text'><h2>"+commodity.commodityName+"</h2><h3>到货时间："+commodity.phase+"<br />优选倒计时：24小时内<br />优先分数总计："+commodity.amount+"份</h3></div><div class='xs_product'><a href='detail.html?commodityId="+commodity.commodityId+"&groupCommodityId="+commodity.id+"' target='_self'><img src='images/"+commodityUrls[0]+"' width='603' height='282' /></a></div><div class='xs_buy'><div class='time'></div><div class='price'><h3>优惠价</h3><h2><em>￥</em>"+price+"<span>/份</span></h2><h4>"+source+"/份</h4></div><div class='btn_buy'><a href='detail.html?commodityId="+commodity.commodityId+"&groupCommodityId="+commodity.id+"' target='_self'>立即购买</a></div></div><div class='cls'></div></div></div><div class='cls'></div>");
						element.appendTo($("#goodItems"));
					}else{
						var element=$("<div class='main_wh'><div class='container'><div class='xs_biaozhi'><img src='images/ico_xianshi_org.png' width='76' height='79' /></div><div class='xs_text'><h2>"+commodity.commodityName+"</h2><h3>到货时间："+commodity.phase+"<br />优选倒计时：24小时内<br />优先分数总计："+commodity.amount+"份</h3></div><div class='xs_product'><a href='detail.html?commodityId="+commodity.commodityId+"&groupCommodityId="+commodity.id+"' target='_self'><img src='images/"+commodityUrls[0]+"' width='603' height='282' /></a></div><div class='xs_buy'><div class='time'><div class='price'><h3>优惠价</h3><h2><em>￥</em>"+price+"<span>/份</span></h2><h4>"+source+"/份</h4></div><div class='btn_buy'><a href='detail.html?commodityId="+commodity.commodityId+"&groupCommodityId="+commodity.id+"' target='_self'>立即购买</a></div></div><div class='cls'></div></div></div><div class='cls'></div>");
						element.appendTo($("#goodItems"));	
					}
				 }else{*/
						//已售罄
						//待实现
						//已到期
						//待实现
						//var element=$("<div class='main_wh'><div class='container'><div class='xs_biaozhi'><img src='images/ico_xianshi_org.png' width='76' height='79' /></div><div class='xs_text'><h2>"+commodity.commodityName+"</h2><h3>到货时间："+commodity.phase+"<br />优选倒计时：24小时内<br />优先分数总计："+commodity.amount+"份</h3></div><div class='xs_product'><a href='#'><img src='images/"+commodityUrls[0]+"' width='603' height='282' /></a></div><div class='xs_buy'><div class='time'></div><div class='price'><h3>优惠价</h3><h2><em>￥</em>"+price+"<span>/份</span></h2><h4>"+source+"/份</h4></div><div class='btn_buy'><a href='detail.html?commodityId="+commodity.commodityId+"&groupCommodityId="+commodity.id+"' target='_self'>立即购买</a></div></div><div class='cls'></div></div></div><div class='cls'></div>");element.appendTo($("#goodItems"));
						var element=$("<div class='main_wh'><div class='container'><div class='xs_biaozhi'><img src='images/ico_xianshi_org.png' width='76' height='79' /></div><div class='xs_text'><h2>"+commodity.commodityName+"</h2><h3>到货时间："+nowPhase+"<br />优选倒计时：24小时内<br />优先份数总计："+commodity.amount+"份</h3></div><div class='xs_product'><a href='detail.html?commodityId="+commodity.commodityId+"&groupCommodityId="+commodity.id+"' target='_blank'><img src='images/"+commodityUrls[0]+"' width='603' height='282' /></a></div><div class='xs_buy'><div class='time'>"+origin+"<div class='price'><h3>优惠价</h3><h2><em>￥</em>"+price+"<span>/份</span></h2><h4>"+source+"/份</h4></div><div class='btn_buy'><a href='detail.html?commodityId="+commodity.commodityId+"&groupCommodityId="+commodity.id+"' target='_blank'>立即购买</a></div></div><div class='cls'></div></div></div><div class='cls'></div>");
						element.appendTo($("#goodItems"));		
				 //}
			 }
		}
	};
	//首页创建每日特惠水果商品列表
	this.createPreferentialCommodityInfo=function(data){
		//测试用
		//data={state:1,value:[{commodityId:100,commodityName:'澳大利亚奇异果',commodityTitle:'香甜可口',commodityUrl:['images/product_tehui.jpg'],thumbUrl:['images/product_tehui.jpg'],unit:'份',phase:'2014-07-14',source:40,price:30,amount:25,remain:15}]};	
		if(data.state==1){
			 var len=data.value.length;
			 $("#preferentialCommodity").empty();
			 for(var i=0;i<len;i++){
				 var commodity=data.value[i];
				 var commodityUrls=JSON.parse(commodity.imageUrl);
				 var element=$("<a href='detail.html?commodityId="+commodity.commodityId+"&groupCommodityId="+commodity.id+"' target='_blank'><img border='0' src='images/"+commodityUrls[0]+"' width='227' height='315' /></a>");
				 element.appendTo($("#preferentialCommodity"));	
			 }
		}
	};
	this.startWhen=function(intDiff){
		window.setInterval(function(){
			var day=0,
			hour=0,
			minute=0,
			second=0;//时间默认值    
			if(intDiff > 0){
				day = Math.floor(intDiff / (60 * 60 * 24));
				hour = Math.floor(intDiff / (60 * 60)) - (day * 24);
				minute = Math.floor(intDiff / 60) - (day * 24 * 60) - (hour * 60);
				second = Math.floor(intDiff) - (day * 24 * 60 * 60) - (hour * 60 * 60) - (minute * 60);
			}
			if (minute <= 9) minute = '0' + minute;
			if (second <= 9) second = '0' + second;
			/*$('#day_show').html(day+"天");
			$('#hour_show').html('<s id="h"></s>'+hour+'时');
			$('#minute_show').html('<s></s>'+minute+'分');
			$('#second_show').html('<s></s>'+second+'秒');*/
			$('#commodityHour').text(hour);
			$('#commodityMin').text(minute);
			$('#commoditySecond').text(second);
			intDiff--;
			},1000);
	};
	//用户选择区域
	this.userSelectArea=function(){
		//$("#select_id").find("option:selected").text();
		var areaxzqId=$('#xzq').find("option:selected").val(); 
		var areaxiaoquId=$('#shq').find("option:selected").val(); 
		var areaxiaoquText=$('#shq').find("option:selected").text();
		if(areaxzqId==0||areaxiaoquId==0){
			return;
		}
		//根据区域ID查询服务站
		var stationId=this.selectStationByArea(areaxiaoquId);
		var param={areaxzqId:areaxzqId,areaxiaoquId:areaxiaoquId,areaxiaoquText:areaxiaoquText,stationId:stationId};
		$("#showUserSelectArea").text(areaxiaoquText);
		this.card.addLongTimeCookie("userSelectArea", JSON.stringify(param));
		$("#areaWin").dialog("close"); 
	};
	this.selectStationByArea=function(areaId){
	   var station=0;
	   $.ajax({
				cache: false,
				type: "get",
				url:"http://"+this.localHost+"/capi/station/byAreaId/"+areaId,
				async: false,
				error: function(request) {
					//alert("获取服务站失败，暂时不能下单!");
				},
				success:function(data){
					if(data.state==1){
						station=data.id;
						return station;
					}
				}
		});
		return station;
	};
	//登陆操作
	this.loginReuest=function(){
		//$('form#login_form .error_org').remove();
		//$("form#login_form br").remove();
		$("#login_space").hide();
		var hasError = false;
		var userName = $("#login").val();
		var password = $("#password").val();
		var len=jQuery.trim(password).length;
		if(!(this.reLogin.test(userName))){
			$("#login").focus();
			$("#error_org").text('请输入正确的用户名!');
			$("#show_error").show();
		    //$("#login").parent().append('<br/><p class="error_org">请输入正确的用户名!</p>');
		    return false;
		}	
		if(len<6||len>32){
			$("#password").focus();
			//$("#password").parent().append('<br/><p class="error_org">密码不符合规范!</p>');
			$("#error_org").text('密码不符合规范!');
			$("#show_error").show();
		    return false;
		}
		var md5Pass1=$.md5(userName+password); 
		var urlPath="login="+userName+"&password="+md5Pass1;
		
		var captchaDis=$("#verificationCode").css('display');
		if(captchaDis!='none')	{
			var captcha = $("#captcha").val();
			if(jQuery.trim(captcha) == ''){
				//$("#captcha").parent().append('<br/><p class="error_org">验证码不能为空!</p>');
				$("#error_org").text('验证码不能为空!');
				$("#login_space").show();
				$("#show_error").show();
			    return false;
			}else{
				urlPath="login="+userName+"&password="+md5Pass1+"&captcha="+captcha;
			}
		}
		$.ajax({
			cache: false,
			type: "POST",
			url:"http://"+this.localHost+"/capi/user/login/"+userName,
			data:urlPath,
			async: false,
			success: function(data) {
				if(data.state==1){
					//存放sid到cookie中
					var card=new CardCookie(); 
					var userName = $("#login").val();
					var userInfo={sid:data.sid,name:userName};
					card.addCookie("userInfo",JSON.stringify(userInfo));
					var autoLoginSelcted=$("#autoLoginSelcted").attr("checked");
					if(autoLoginSelcted){
						var userName = $("#login").val();
						var password = $("#password").val();
						var md5Pass1=$.md5(userName+password); 
						var info={userName:userName,password:md5Pass1};
						card.addLongTimeCookie("loginUserDetail",JSON.stringify(info));
					}
					$("#loginAfter").show();
					$("#loginBefore").hide();
					$("#userInfo").text("您好,　"+userName+"！");
					$("#loginWin").dialog("close"); 
					location.reload();
				}else if(data.state==13){					
					$("#verificationCode").show();
					//$("#captcha").parent().append('<br/><p class="error_org">请输入正确的验证码!</p>');
					$("#error_org").text('请输入正确的验证码!');
					$("#login_space").show();
					$("#show_error").show();
					var it=new initIndex();
					it.loadVerificationCode();
				}else{
					$("#password").focus();
					//$("#password").parent().append('<br/><p class="error_org">用户名和密码错!</p>');
					$("#error_org").text('用户名或密码错!');
					$("#show_error").show();
				}
			},
			error: function(XMLHttpRequest, textStatus, errorThrown) {
				alert("服务器忙请稍后!");
			}
		
		});
	};
	//退出操作
	this.logoutReuest=function(){
		var userInfo=this.card.getCookie("userInfo");
		if(typeof(userInfo) != "undefined"  && userInfo != null && userInfo != ""){
			var sid=JSON.parse(userInfo).sid;
			this.card.delCookie("userInfo");
			this.card.delCookie("userCards");
			$.ajax({
				cache: true,
				type: "DELETE",
				url:"http://"+this.localHost+"/capi/user/logout/"+sid,
				data:"sid="+sid,
				async: false,
				error: function(request) {
					alert("服务器忙请稍后!");
				},
				success: function(data) {
					if(data.state!=1){
						alert("不能正常退出请联系管理员!");
						return;
					}
					var card=new CardCookie();
					card.delCookie("userInfo");
					card.delCookie("loginUserDetail");
					$("#loginAfter").hide();
					$("#loginBefore").show();
					location.href="index.html";  
				}
			});
		}
	};
	//忘记密码操作
	this.forgetPassword_1=function(){
		var userphone = $("#userphone").val();
		$('form#forgetPass_form .text_gra2').removeClass('error_org');
		if(!(this.reLogin.test(userphone))){
			$("#userphone").focus();
			$('form#forgetPass_form .text_gra2').text('请输入正确的手机号!');
			$('form#forgetPass_form .text_gra2').addClass('error_org');
		}else{
			location.href="password_step2.html?loginPhone="+userphone;  
		}
		
	};
	//忘记密码操作
	this.forgetPassword_2=function(){
		$('form#forgetPass_form .error_org').remove();
		$("form#forgetPass_form br").remove();
		var captcha = $("#forgetCaptcha").val();
		if(jQuery.trim(captcha) == ''){
			$("#forgetCaptcha").focus();
		    $("#forgetCaptcha").parent().append('<br/><p class="error_org">验证码不能为空!</p>');
		    return false;
		}		
		var userName = $("#loginPhone").val();
		$.ajax({
			cache: false,
			type: "POST",
			url:"http://"+this.localHost+"/capi/user/forget/"+userName,
			data:'login='+userName+'&captcha='+captcha, 
			async: false,
			error: function(request) {
				alert("服务器忙请稍后!");
			},
			success: function(data) {
				if(data.state==1){
					//跳转到重置密码页面
					var userphone = $("#userphone").val();
					location.href="password_step3.html?login="+userName+"&sequence="+data.sequence;  
				}else{
					$("#forgetCaptcha").focus();
				    $("#forgetCaptcha").parent().append('<br/><p class="error_org">请联系管理员!</p>');
				}
			}
		});
	};
	//重置密码操作
	this.resetPassword=function(){
		$('form#resetPass_form .error_org').remove();
		$("form#resetPass_form br").remove();
		var pass1 = $("#resetPassword").val();
		var pass2 = $("#resetPasswordOk").val();
		var userphone=$("#userphone").val();
		var sequence = $("#sequence").val();
		if(jQuery.trim(pass1) == ''){
			$("#resetPassword").focus();
		    $("#resetPassword").parent().append('<br/><p class="error_org"新密码不能为空!</p>');
		    return false;
		}
		var len=jQuery.trim(pass1).length;
		if(len<6||len>32){
			$("#resetPassword").focus();
		    $("#resetPassword").parent().append('<br/><p class="error_org"密码长度不符合要求!</p>');
		    return false;
		}
		if(jQuery.trim(pass1) != jQuery.trim(pass2)){
			$("#resetPasswordOk").focus();
		    $("#resetPasswordOk").parent().append('<br/><p class="error_org">两次密码输入不一致!</p>');
		    return false;
		}
		var md5Pass1=$.md5(userphone+pass1); 
		$.ajax({
			cache: true,
			type: "POST",
			url:"http://"+this.localHost+"/capi/user/reset/"+userphone,
			data:"login="+userphone+"&password="+md5Pass1+"&sequence="+sequence, 
			async: false,
			error: function(request) {
				alert("服务器忙请稍后!");
			},
			success: function(data) {
				if(data.state==1){
					location.href="index.html";
				}else{
					$("#resetPasswordOk").focus();
				    $("#resetPasswordOk").parent().append('<br/><p class="error_org">重置失败,请联系管理员!</p>');
				}
			}
		});
	};
	//修改密码
	this.updatePassword=function(){
		var userInfo=this.card.getCookie("userInfo");
		if(typeof(userInfo) != "undefined"  && userInfo != null && userInfo != ""){		
			$('form#updatePass_form .error_org').remove();
			userInfo=JSON.parse(userInfo);
			var sid=userInfo.sid;
			var name=userInfo.name;
			var pass1 = $("#resetPassword").val();
			var pass2 = $("#resetPasswordOk").val();
			var passbk = $("#passwordbk").val();
			var resetcaptcha = $("#resetcaptcha").val();
			if(jQuery.trim(passbk) == ''){
				$("#passwordbk").focus();
				$("#passwordbkMessage").append('<p class="error_org">原始密码不能为空!</p>');
				return false;
			}
			if(jQuery.trim(pass1) == ''){
				$("#resetPassword").focus();
				$("#resetPasswordMessage").append('<p class="error_org">新密码不能为空!</p>');
				return false;
			}
			if(jQuery.trim(pass1) != jQuery.trim(pass2)){
				$("#resetPasswordOk").focus();
				$("#resetPasswordOkMessage").append('<p class="error_org">两次密码输入不一致!</p>');
				return false;
			}
			if(jQuery.trim(resetcaptcha) == ''){
				$("#resetcaptcha").focus();
				$("#resetcaptchaMessage").append('<p class="error_org">验证码不能为空!</p>');
				return false;
			}
			var md5Pass1=$.md5(name+pass1); 
			var md5Pass2=$.md5(name+passbk); 
			$.ajax({
				cache: true,
				type: "POST",
				url:"http://"+this.localHost+"/capi/user/password/"+sid,
				data:"sid="+sid+"&source="+md5Pass2+"&target="+md5Pass1+"&captcha="+resetcaptcha, 
				async: false,
				error: function(request) {
					alert("服务器忙请稍后!");
				},
				success: function(data) {
					if(data.state==1){
						alert("修改成功！");
						location.href="account_safe.html"; 
					}else{
						$("#resetcaptchaMessage").append('<p class="error_org">修改失败,请联系管理员!</p>');
					}
					
				}
			});
		}else{
			alert("请先登录！");
		}
	};
	//意见建议操作
	this.userAdvice=function(){
		var userInfo=this.card.getCookie("userInfo");
		if(typeof(userInfo) != "undefined"  && userInfo != null && userInfo != ""){		
			$('form#advice_form .error_org').remove();
			$("form#advice_form br").remove();
			userInfo=JSON.parse(userInfo);
			var sid=userInfo.sid;
			var advice = $("#advice").val();
			if(jQuery.trim(advice) == ''){
				$("#advice").focus();
				$("#advice").parent().append('<br/><p class="error_org">建议信息不能为空!</p>');
				return false;
			}		
			//var userName = $("#loginPhone").val();
            re_dialog('意见建议',"感谢您提出的宝贵意见");
			/*$.ajax({
				cache: true,
				type: "POST",
				url:"http://"+this.localHost+"/capi/user/forget/"+userName,
				data:'login='+userName+'&captcha='+captcha, 
				async: false,
				error: function(request) {
					alert("服务器忙请稍后!");
				},
				success: function(data) {
					if(data.state==1){
						alert("感谢您提出的宝贵意见!");
						location.href="index.html";  
					}else{
						$("#advice").focus();
						$("#advice").parent().append('<br/><p class="error_org">提交失败,请联系管理员!</p>');
					}
				}
			});*/
		}
	};
	//初始化登陆
	this.loginInit=function(){
		//从Cookie中加载用户信息
		var userInfo=this.card.getCookie("userInfo");		
		if(typeof(userInfo) != "undefined"  && userInfo != null && userInfo != ""){
			var user=JSON.parse(userInfo);
			$("#loginAfter").show();
			$("#loginBefore").hide();
			$("#userInfo").text("您好,　"+user.name+"！");
		}
	};
	// 删除数组包含某元素，并重新构建索引
	this.arr_del=function(arr,d){
		return arr.slice(0,d-1).concat(arr.slice(d));
	};
	// 数组查找返回索引
	this.arr_find=function(arr,d){
		var length=arr.length;
		for(var i=0;i<length;i++){
			if(arr[i]==d){
				return i;
			}
		}
		return-1;
	};
	//判断下单收货电话
	this.orderPhone=function(addressId){
		var userInfo=this.card.getCookie("userInfo");		
		if(typeof(userInfo) != "undefined"  && userInfo != null && userInfo != ""){
			var user=JSON.parse(userInfo);
		    $.ajax({
				cache: true,
				type: "get",
				url:"http://"+this.localHost+"/capi/address/"+user.sid,
				async: false,
				error: function(request) {
					alert("服务器忙请稍后!");
				},
				success: function(data) {
					if(data.state==1){
						var len=data.value.length;
						for(var i=0;i<len;i++){
							if(addressId==data.value[i].addressId){
								$("#orderPhone").text(data.value[i].telephone);
								break;
							}
						}
					}
				}
			});
		}
	};
	//判断下单时间
	this.orderPrompt=function(){
		var nowDate=new Date();
		var hour=nowDate.getHours();
		var text;
		if(hour>=0&&hour<13){
			text="提示：上午"+hour+"时下单,预计下午13~18内送达";
		}else if(hour>=13&&hour<18){
			text="提示：下午"+hour+"时下单,预计晚上21点以前送达";
		}else {
			text="提示：晚上"+hour+"时下单,预计次日13点以前送达";
		}
		$("#orderPrompt").text(text);
	};
	this.moneyToStr=function(money) {
         money = money.toString();
         var len = money.length;
         var str1 = money.substring(0, len-2)
         var str2 = money.substring(len - 2, len);
         var result = str1 + "." + str2;
         return result;
    };
    this.strToMoney=function(money) {
        money = parseInt(money.replace(".", ""));
        return money;
    };
   

}

function return_top(){
    $("#back-to-top").hide();
    $(function () {
        $(window).scroll(function(){
            if ($(window).scrollTop()>100){
                $("#back-to-top").fadeIn(1500);
            }
            else
            {
                $("#back-to-top").fadeOut(1500);
            }
        });


        $("#back-to-top").click(function(){
            $('body,html').animate({scrollTop:0},1000);
            return false;
        });
    });
}

function re_dialog(tit,txt){

    $("#advice_window").dialog({autoOpen:false,title:tit,hide: "explode",

        modal: true,

        buttons: { "确定":function(){

            $("#advice_window").dialog("close");
            location.href="index.html";

        } } })



        .html(txt)



        .dialog("open");



}
