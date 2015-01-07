/***************************************************
		地址信息管理
***************************************************/
function addressMange() {
	//数字验证
	this.reg = new RegExp("^[0-9]*$");
	//手机验证
	this.reLogin=/^1[3|4|5|8][0-9]\d{4,11}$/;
	//购物车操作对象
	this.card=new CardCookie();
	//当前服务地址
	this.localHost=window.location.host; 
	this.MaxAddressCount=20;
	//默认初始化服务站
    this.initArea=function(){
		//加载行政区
		this.loadAreaOption('xzq',0);
		//加载商圈
		//var value=$('#xzq').val();
		//this.loadAreaOption('shq',value);
		//this.selectAddress();
    };
	//默认初始化用户选择服务站
    this.initUserArea=function(){
		//加载行政区
		this.loadAreaOption('useXzq',0);		//$("#useXzq option[value='0']").attr("selected", "selected");
		//加载商圈
		//var value=$('#useXzq').val();
		//this.loadAreaOption('useShq',value);
		this.selectAddress();
    };
	this.loadLocalUserSelectAreaXzq=function(){
		var value=$('#useXzq').val();
		this.loadAreaOption('useShq',value);
		this.loadLocalUserSelectAreaSq();
	};
	this.loadLocalUserSelectAreaSq=function(){
		var value=$('#useShq').val();
	};
	this.loadUserSelectAreaXzq=function(){
		var value=$('#xzq').val();
		this.loadAreaOption('shq',value);
		this.loadUserSelectAreaSq();
	};
	this.loadUserSelectAreaSq=function(){
		var value=$('#shq').val();
	};
	this.createAddress=function(){
		var userInfo=this.card.getCookie("userInfo");
		if(typeof(userInfo) != "undefined"  && userInfo != null && userInfo != ""){
			var addressCount = parseInt($("#addressCount").text());
		    if(addressCount>=this.MaxAddressCount){
				alert("最多只能创建20个地址信息!");
				return;
			}
			var sid=JSON.parse(userInfo).sid;
			$('form#address_form .error_org').remove();
			var hasError = false;
			var userAddress = $("#userAddress").val();
			var consignee = $("#consignee").val();
			var telephone = $("#telephone").val();
			var areaId=$('#useShq').find("option:selected").val(); 
			var areaText=$('#useShq').find("option:selected").text();
			if(areaId==0){
				alert("请选择商圈!");
				return;
			}
			var addressId=$("#editorAddressId").val();
			
			if(jQuery.trim(userAddress) == ''){
				$("#userAddress").focus();
				$("#userAddress").parent().append('<br/><div class="error_org">请输入详细地址!</div>');
				return false;
			}
			if(jQuery.trim(consignee) == ''){
				$("#consignee").focus();
				$("#consignee").parent().append('<br/><div class="error_org">请输入收货人!</div>');
				return false;
			}
			if(!(this.reLogin.test(telephone))){
				$("#telephone").focus();
				$("#telephone").parent().append('<br/><div class="error_org">请输入正确的手机号!</div>');
				return false;
			}
			if(jQuery.trim(areaId) == ''){
				$("#useShq").focus();
				$("#useShq").parent().append('<br/><div class="error_org">请选择小区!</div>');
				return false;
			}
			var type="put";
			if(jQuery.trim(addressId) != ''){
				type="post";
			}
			$.ajax({
				cache: true,
				type: type,
				url:"http://"+this.localHost+"/capi/address/"+sid,
				data:"sid="+sid+"&areaId="+areaId+"&address="+userAddress+"&telephone="+telephone+"&consignee="+consignee+"&addressId="+addressId+"&building=",
				async: false,
				error: function(request) {
					alert("服务器忙请稍后!");
				},
				success:function(data){
					if(data.state!=1){
						alert("添加失败,请联系客服!");
					}
					$("#addressWin").dialog("close"); 
					location.reload();
				}
			});
		}else{
			alert("请先登录!");
		}
	};
	this.closeAddressWin=function(data,sid){
		alert(data.value);
		$("#addressWin").dialog("close"); 
		location.reload();
	};
	this.selectAddress=function(){
		var userInfo=this.card.getCookie("userInfo");
		if(typeof(userInfo) != "undefined"  && userInfo != null && userInfo != ""){
			var sid=JSON.parse(userInfo).sid;
			$.ajax({
				cache: true,
				type: "get",
				url:"http://"+this.localHost+"/capi/address/"+sid,
				data:"sid="+sid,
				async: false,
				error: function(request) {
					alert("查询用户地址信息失败,服务器忙请稍后!");
				},
				success:this.selectAddressShow
			});
		}
	};
	this.selectAddressShow=function(data){
		if(data.state==1){
			var len=data.value.length;
			var address=null;
			$("#addressItems").empty();
			for(var i=0;i<len;i++){
				address=data.value[i];
				var info=$("<table width='94%' border='0' cellspacing='0' cellpadding='0' class='ct border_gray text_gra' id='"+address.addressId+"'><tr><td width='3%' height='40' align='center' bgcolor='#ececec'></td><td width='78%' align='left' bgcolor='#ececec'><h5>"+address.consignee+"</h5></td><td width='11%' align='center' bgcolor='#ececec'><h5><a href='javascript:void(0);' onclick='address.updateAddress(this)' title='"+address.addressId+"' name='"+address.areaId+"' class='text_blue'>修改地址信息</a></h5></td><td width='8%' align='center' bgcolor='#ececec'><h5><a href='javascript:void(0);' onclick='address.deleteAddress(this)' title='"+address.addressId+"' class='text_blue'>删除</a></h5></td></tr><tr><td colspan='4' height='1' bgcolor='#cccccc'></td></tr><tr><td height='15' colspan='4' valign='top'><br /><table width='94%' border='0' cellspacing='0' cellpadding='0' class='ct text_gra'><tr><td width='9%' height='26' class='text_gra1'><p>收货人：</p></td><td width='91%'><p><b id='"+address.addressId+"_consignee'>"+address.consignee+"</b> </p></td></tr><tr><td height='26' class='text_gra1'><p>地&nbsp;&nbsp;&nbsp;&nbsp;址：</p></td><td><p><b id='"+address.addressId+"_address'>"+address.address+"</b></p></td></tr><tr><td height='26' class='text_gra1'><p>手&nbsp;&nbsp;&nbsp;&nbsp;机：</p></td><td><p><b id='"+address.addressId+"_telephone'>"+address.telephone+"</b></p></td></tr></table><br /></td></tr></table><br />");
				info.appendTo($("#addressItems"));
			}
			$("#addressCount").text(len);
			
		}
	};
	this.updateAddress=function(obj){
		this.showAddress();
		var userInfo=this.card.getCookie("userInfo");
		var addressId=obj.title;
		var areaId=obj.name;
		$("#useShq").val(areaId);
		var consignee=$('#'+addressId+"_consignee").text();
		var telephone=$('#'+addressId+"_telephone").text();
		var address=$('#'+addressId+"_address").text();
		$("#userAddress").val(address);
		$("#consignee").val(consignee);
		$("#telephone").val(telephone);
		$("#editorAddressId").val(addressId);
	};
	this.deleteAddress=function(obj){
		var userInfo=this.card.getCookie("userInfo");
		if(typeof(userInfo) != "undefined"  && userInfo != null && userInfo != ""){
				$("#dialog:ui-dialog").dialog("destroy");  
				var urlPath=this.localHost;

                $("#dialog-confirm").dialog({  
                    resizable: false,  
                    height: 140,  
                    modal: true,  
                    buttons: {  
                        "确定": function () {  
                            var sid=JSON.parse(userInfo).sid;
							var id=obj.title;
							$('#'+id).remove();
							var addressCount=parseInt($("#addressCount").text());
							addressCount-=1;
							$("#addressCount").text(addressCount);
							$.ajax({
								cache: true,
								type: "DELETE",
								url:"http://"+urlPath+"/capi/address/"+sid+"?addressId="+id,
								data:"sid="+sid,
								async: false,
								error: function(request) {
									alert("查询用户地址信息失败,服务器忙请稍后!");
								},
								success:function(data){
								}
							});
							$(this).dialog("close");  
                        },  
                        "取消": function () {  
                            $(this).dialog("close");  
                        }  
                    }  
				});
            $("#dialog-confirm").css("height","40px");
            $("#msg").show();

		}
		
	};
	this.showAddress=function(){
		$("#userAddress").val("");
		$("#consignee").val("");
		$("#telephone").val("");
		$("#editorAddressId").val("");
		$("#addressWin").dialog({
			autoOpen: true,
			title:'更新收获地址',
			close:true,
			width: 600,
			height:470,
			show: "blind",
			hide: "explode",
			modal: true
		});
		$("#addressWin").dialog( "open" ); 
	};
	this.loadAreaOption=function(id,areaId){
		$.ajax({
			type: "get",
			url:"http://"+this.localHost+"/capi/area/children/"+areaId,
			data:"areaId="+areaId,
			async: false,
			error: function(request) {
				alert("服务器忙请稍后!");
			},
			success: function(data) {
				if(data.state==1){
					var results=data.value;
					var showText="";
					if(id=='xzq'||id=='useXzq'){
						showText="请选择区域";
					}else if(id=='shq'||id=='useShq'){
						showText="请选择街道（商圈）";
					}else{
						showText="请选择";
					}
					var options = "<option id='0' value='0' selected='selected'>"+showText+"</option>";  
					for (var i = 0; i < results.length; i++) {  
						options += "<option id='"+results[i].areaId+"' value='" + results[i].areaId + "'>" + results[i].areaName + "</option>";  
					}  
					$('#'+id).html(options);   
				}
			}
		});
	};
	this.loadAreaOption2=function(id,areaId){
		$.ajax({
			type: "get",
			url:"http://"+this.localHost+"/capi/area/children/"+areaId,
			data:"areaId="+areaId,
			async: false,
			error: function(request) {
				alert("服务器忙请稍后!");
			},
			success: function(data) {
				if(data.state==1){
					var results=data.value;
					
					var options = '';  
					for (var i = 0; i < results.length; i++) {  
						options=$("<li id="+results[i].areaId+">"+results[i].areaName+"</li>");
						//options += "<option id='"+results[i].areaId+"' value='" + results[i].areaId + "'>" + results[i].areaName + "</option>";  
					    $('#'+id).appendTo(options);  
					}  
					 
				}
			}
		});
	};
	
	

}

