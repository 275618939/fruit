/******************************************************************************* * 订单信息 ******************************************************************************/function recieve(){		this.reLogin=/^1[3|4|5|8][0-9]\d{4,8}$/;	//运费	this.freight=1000;	//显示运费	this.showFreight=10;	//优惠商品组ID	this.preferentialId=144;	//免运费点	this.isFreeFreight=3900;		this.init=new initIndex();		// cookie	this.card=new CardCookie(); 	//当前服务地址	this.localHost=window.location.host; 	//送货区间	var sendIntTimeArrays=[[2,3,4,5,6],[3,4,5,6],[4,5,6]];	var sendStrTimeArrays=[["当日13：00-18：00送达","当日18：00-21：00送达","明日09：00-13：00送达","明日13：00-18：00送达","明日18：00-21：00送达"],["当日18：00-21：00送达","明日09：00-13：00送达","明日13：00-18：00送达","明日18：00-21：00送达"],["明日09：00-13：00送达","明日13：00-18：00送达","明日18：00-21：00送达"]];    //生成送货选择区间	this.showSendTimeType=function(){		var nowDate=new Date();		var hour=nowDate.getHours();		var index=0;		if(hour>=0&&hour<13){			index=0;		}else if(hour>=13&&hour<18){			index=1;		}else {			index=2;		}	    var br=$("<br/>");	    br.appendTo($("#sendTimeType"));		var len=sendIntTimeArrays[index].length;		var isCheck="";		for(var i=0;i<len;i++){		    if(i==0){			   isCheck='checked="checked"';			}else{				isCheck="";			}		    var radio=$("<input type='radio' "+isCheck+" name='sendTimeType' id='radio_"+i+"' value='"+sendIntTimeArrays[index][i]+"' />&nbsp;&nbsp;<label>"+sendStrTimeArrays[index][i]+"</label><br/><br/>");			radio.appendTo($("#sendTimeType"));		}	};	//清除优惠码输入框	this.clearActivityCodeText=function(){		$("#activityCode").val("");	};	// 发票选择	this.selectOptionsFp=function(){		var value=$('#fpSelect').val();		if(value!=0){			//alert("详细订单开具发票事宜，请联系客服中心010-82699765");			$("#fpSelect option[value=0]").attr("selected", "selected");            re_dialog2('开发票','详细订单开具发票事宜，请联系客服中心010-82699765');            return;			$("#fp").show();		}else{			$("#fp").hide();		}	};	// 立刻送选中样式	this.selectOptionsLk=function(){		$('#lks').removeClass("btn_bd_gra").addClass("btn_bd_org");		$('#dss').removeClass("btn_bd_org").addClass("btn_bd_gra");		$("#sendType").val(1);			};	// 定时送选中样式	this.selectOptionsDs=function(){		$('#dss').removeClass("btn_bd_gra").addClass("btn_bd_org");		$('#lks').removeClass("btn_bd_org").addClass("btn_bd_gra");		$("#uboxstyle3").show();		$("#sendType").val(2);	};	// 发票类型选择	this.selectInvoice=function(obj){		var t=obj.title;		if(t=='p'){			$("#invoiceInfo").text("姓名:");		}else{			$("#invoiceInfo").text("公司名称:");		}	};	// 打开收货地址增加页	this.openAddress=function()	{		//$("#addressManger").show();		$("#addressUpdate").toggle();		$("#editorType").val(1);		$("#consignee").val("");		$("#phone").val("");		$("#address").val("");			//加载用户选中的区域自动填充		var userSelectArea=this.card.getCookie("userSelectArea");		if(typeof(userSelectArea) != "undefined"  && userSelectArea != null && userSelectArea != ""){			userSelectArea=JSON.parse(userSelectArea);			$("#useXzq").val(userSelectArea.areaxzqId);			var myAddress=new addressMange();			myAddress.loadLocalUserSelectAreaXzq();			//$("#useXzq option[value='"+userSelectArea.areaxiaoquId+"']").attr("selected", "selected");			$("#useShq").val(userSelectArea.areaxiaoquId);		}	};	// 关闭收货地址增加页	this.closeAddress=function()	{		$("#addressManger").hide();	};	// 删除收货地址信息	this.deleteAddress=function(obj){		var id=obj.title;		$('#'+id).remove();		var userInfo=this.card.getCookie("userInfo");				if(typeof(userInfo) != "undefined"  && userInfo != null && userInfo != ""){			userInfo=JSON.parse(userInfo);			var sid=userInfo.sid;			$.ajax({				cache: true,				type: "delete",				url:"http://"+this.localHost+"/capi/address/"+sid+"?addressId="+id,				data:"sid="+sid+"&addressId="+id,				async: false,				error: function(request) {					alert("服务器忙请稍后!");				},				success: function(data) {									}			});		}	};	// 更新收货地址信息	this.updateAddress=function(){		var editorType=$("#editorType").val();		var requestType;		var addressId=0;		if(editorType==1){			//增加用户地址			requestType="put";		}else if(editorType==2){			//保存修改用户地址			requestType="post";			addressId= $("#editorAddressId").val();		}		// 读取用户ID		var userInfo=this.card.getCookie("userInfo");				if(typeof(userInfo) != "undefined"  && userInfo != null && userInfo != ""){			userInfo=JSON.parse(userInfo);			var sid=userInfo.sid;			$('form#address_form .error_org').remove();			//var selectArea = $("#useShq").val();						var selectArea=$('#useShq').find("option:selected").val(); 			var selectAreaText=$('#useShq').find("option:selected").text();			if(selectArea==0){				alert("请选择商圈!");				return;			}			var address = $("#address").val();			var consignee = $("#consignee").val();			var phone = $("#phone").val();			if(jQuery.trim(consignee) == ''){				$("#consignee").focus();			    $("#consignee").parent().append('<div class="error_org">收货人不能为空!</div>');			    return false;			}			if(jQuery.trim(address) == ''){				$("#address").focus();			    $("#address").parent().append('<div class="error_org">收货地址不能为空!</div>');			    return false;			}			if(!(this.reLogin.test(phone))){				$("#phone").focus();			    $("#phone").parent().append('<div class="error_org">请输入正确的手机号!</div>');			    return false;			}			$.ajax({				cache: true,				type: requestType,				url:"http://"+this.localHost+"/capi/address/"+sid,				data:"sid="+sid+"&telephone="+phone+"&address="+address+"&consignee="+consignee+"&addressId="+addressId+"&areaId="+selectArea+"&building=",				async: false,				error: function(request) {					alert("服务器忙请稍后!");				},				success: function(data) {					if(data.state==1){						var r = new recieve();						$('#addressMangerList').empty();						$("#consignee").val("");						$("#phone").val("");						$("#address").val("");							r.loadUserAdress();								$("#addressUpdate").toggle();					}else{						$("#phone").focus();					    $("#phone").parent().append('<div class="error_org">添加失败,请联系管理员!</div>');					}				}			});		}else{			$("#addressManger").hide();					}	};	//编辑用户信息	this.editorUserAdress=function(obj){		var address=obj.title;		var addressId=obj.name;		this.openAddress();				var consignee=$('#'+addressId+"_consignee").text();		var telephone=$('#'+addressId+"_telephone").text();		var address=$('#'+addressId+"_address").text();		$("#address").val(address);		$("#consignee").val(consignee);		$("#phone").val(telephone);				$("#editorType").val(2);		$("#editorAddressId").val(addressId);		$("#userAdressPhone").val(telephone);	};	// 加载用户的收货地址信息	this.loadUserAdress=function()	{		var userInfo=this.card.getCookie("userInfo");				if(typeof(userInfo) != "undefined"  && userInfo != null && userInfo != ""){			userInfo=JSON.parse(userInfo);			var sid=userInfo.sid;			// 加载用户地址信息			$.ajax({				cache: true,				type: "get",				url:"http://"+this.localHost+"/capi/address/"+sid,				data:"sid="+sid,				async: false,				error: function(request) {					alert("服务器忙请稍后!");				},				success: function(data) {					if(data.state==1){						var value=data.value;						var len=value.length;						if(len>0){							for(var i=0;i<len;i++){																 var areaAdressId=value[i].addressId+"_"+value[i].areaId;								 $("#userAdressPhone").val(value[i].telephone);								 if(i==0){									 var li=$("<li id='"+value[i].addressId+"'><input type='radio' name='userAdd'  value="+areaAdressId+" checked='checked' /> <p><strong><b id='"+value[i].addressId+"_consignee'>"+value[i].consignee+"</b></strong>&nbsp;&nbsp;<b id='"+value[i].addressId+"_address'>"+value[i].address+"</b>&nbsp;&nbsp;<b id='"+value[i].addressId+"_telephone'>"+value[i].telephone+"</b>&nbsp;&nbsp;<a href='javascript:void(0);' title="+value[i].address+" name='"+value[i].addressId+"' onclick='re.editorUserAdress(this)'  class='text_blue'>编辑</a>&nbsp;&nbsp;<a href='javascript:void(0);' onclick='re.deleteAddress(this)' title="+value[i].addressId+" class='text_blue'>删除</a></p></li>");									 li.appendTo($("#addressMangerList"));								 }else{									 var li=$("<li id='"+value[i].addressId+"'><input type='radio' name='userAdd'  value="+areaAdressId+"  /> <p><strong> <b id='"+value[i].addressId+"_consignee'>"+value[i].consignee+"</b></strong>&nbsp;&nbsp;<b id='"+value[i].addressId+"_address'>"+value[i].address+"</b>&nbsp;&nbsp;<b id='"+value[i].addressId+"_telephone'>"+value[i].telephone+"</b>&nbsp;&nbsp;<a href='javascript:void(0);' title="+value[i].address+" name='"+value[i].addressId+"' onclick='re.editorUserAdress(this)'  class='text_blue'>编辑</a>&nbsp;&nbsp;<a href='javascript:void(0);' onclick='re.deleteAddress(this)' title="+value[i].addressId+" class='text_blue'>删除</a></p></li>");									 li.appendTo($("#addressMangerList"));										 }							   }						    } 					 }				}			});		}	};	// 加载用户的购买物品信息	this.loadUserGoods=function()	{	    // 读取用户添加到购物车的信息	    var userInfo=this.card.getCookie("userInfo");		if(typeof(userInfo) != "undefined" && userInfo != null && userInfo != ""){				 userInfo=JSON.parse(userInfo);			 $.ajax({				cache: true,				type: "GET",				url:"http://"+this.localHost+"/capi/cart/"+userInfo.sid,				data:"sid="+userInfo.sid,				async: false,				error: function(request) {					alert("加载服务器购物车信息失败!");				},				success:this.createCartItems			});		}								};	//创建购买商品信息	this.createCartItems=function(data){		if(data.state==1){			  var init=new initIndex();			  var len=data.value.length;			  var commodity=null;			  var tempPrize=null;			  var sumPrize=0;			  var countItems=0;			  var price=0;			  var commodityPrizeId=null;			  $("#commons").val("");			  $("#commons_2").val("");			  var commodityArrays=new Array();			  var commodityArrays_2=new Array();			  var myRecieve = new recieve();			  for(var i=0;i<len;i++){					var commodityArray=new Array();					commodity=data.value[i];							tempPrize=commodity.amount*commodity.price;					commodityPrizeId=commodity.commodityId+"_prize"					commodityArrays_2.push(parseInt(commodity.commonId));					commodityArray.push(parseInt(commodity.commonId));					commodityArray.push(commodity.amount);					commodityArrays.push(commodityArray);					sumPrize+=tempPrize;					countItems++;					var td=$("<tr align='center' class='text_gra2 bold'><td height='48'><p class='text_gra'><a href='#'>"+commodity.commodityName+"</a></p></td><td><p>1000000"+commodity.commonId+"</p></td><td><b id='"+commodityPrizeId+"'>"+init.moneyToStr(commodity.price)+"</b></td><td><p>"+commodity.amount+"</p></td><td><p class='text_org'>￥"+init.moneyToStr(tempPrize)+"</p></td><td width='5%'>&nbsp;</td></tr><tr><td colspan='6' height='1' class='bd_gray_dash'></td></tr>");					td.appendTo($("#userBuyGoods"));					  }			  var freightStyle="";			  if(sumPrize>=myRecieve.isFreeFreight){			     myRecieve.freight=0;				 freightStyle="text-decoration: line-through;color:#AAA;font-weight: normal;";			  }			  var tr=$("<tr id='commodityBuyDetail'><td colspan='5' align='right' class='line26 text_gra'><br /><h5 class='mb10'>共"+countItems+"件<br /> 优惠：￥ <b  id='activityCodeMoney'>0</b>元<br/>金额合计：￥"+init.moneyToStr(sumPrize)+"元<br /> 运费：￥ <b style='"+freightStyle+"'>"+myRecieve.showFreight+".00</b>元<br />订单金额超过"+init.moneyToStr(myRecieve.isFreeFreight)+"元免运费<br/></h5><h3 class='text_gra2 wr'>应付总额：<span class='text_org h24' id='goodsTocalPrize'>"+init.moneyToStr(sumPrize+myRecieve.freight)+"元</span></h3> <br /></td><td width='5%'>&nbsp;</td></tr>");			  tr.appendTo($("#userBuyGoods"));				  $("#commons").val(JSON.stringify(commodityArrays));			  $("#commons_2").val(JSON.stringify(commodityArrays_2));		}	};	//显示兑换商品	this.showExchangeCommodity=function(commodityId){				$.ajax({			cache: false,			type: "GET",			url:"http://"+this.localHost+"/capi/commodity/findPresent/"+commodityId,			async: false,			error: function(request) {			},			success:function(data){				if(data.state==1){				    var init=new initIndex();				    var commodity=data;						var commodityPrizeId=commodity.commodityId+"_prize"					var tr=$("<tr align='center' class='text_gra2 bold'><td height='48'><p class='text_gra'><a href='#'>"+commodity.commodityName+"</a></p></td><td><p>1000000"+commodity.id+"</p></td><td><b id='"+commodityPrizeId+"'>"+init.moneyToStr(commodity.price)+"</b></td><td><p>1</p></td><td><p class='text_org'>￥"+init.moneyToStr(commodity.price)+"</p></td><td width='5%'>&nbsp;</td></tr><tr><td colspan='6' height='1' class='bd_gray_dash'></td></tr>");					$("#userBuyGoods #commodityBuyDetail").before(tr);					var commons=JSON.parse($("#commons").val());					//var commons_2=JSON.parse($("#commons_2").val());					var commodityArray=new Array();					commodityArray.push(parseInt(commodity.id));					commodityArray.push(1);					commons.push(commodityArray);				    $("#commons").val(JSON.stringify(commons));					//$("#commons_2").val(JSON.stringify(commodityArrays_2));				}			}		});			};	//使用优惠码	this.useActivityCode=function(){		var userInfo=this.card.getCookie("userInfo");		if(typeof(userInfo) != "undefined" && userInfo != null && userInfo != ""){				 userInfo=JSON.parse(userInfo);			 var activityCode=$("#activityCode").val();			 			 var commons=$("#commons").val();			 if(jQuery.trim(activityCode) == ''||jQuery.trim(activityCode)=="请输入8位优惠码或兑换码"){                $("#activityCode").focus();                    re_dialog2('优惠码','请输入8位优惠码或兑换码!');				return;			 }			 var isUseCode=$('#isUseActivityCode').val();			 if(isUseCode==1){				 $("#activityCode").val("");                 re_dialog2('优惠码','不能重复使用');                 return;			 }			if(null!=commons&&commons.length>1){			    commons=JSON.parse(commons);				var clen=commons.length;				for(var i=0;i<clen;i++){					if(commons[i][0]==this.preferentialId){						re_dialog2('优惠活动','亲~!对不起您已经参加了特价商品活动,不能在参加兑换活动哟!');						$("#activityCode").val("");						return;					}				}			 }			 $.ajax({				cache: true,										type: "GET",										url:"http://"+this.localHost+"/capi/activity/check/"+userInfo.sid,				data:"activityCode="+activityCode,				async: false,				error: function(request) {					alert("获取优惠活动信息失败!");				},				success:function(data){					if(data.state==1){						var init=new initIndex();						var re = new recieve();						if(data.type==1){							var commodityId=data.value;							re.showExchangeCommodity(commodityId);											}else if(data.type==2){							var goodsTocalPrize=init.strToMoney($("#goodsTocalPrize").text());							var pay=goodsTocalPrize-data.value;							if(pay<0){								pay=0;							}							$("#goodsTocalPrize").text(init.moneyToStr(pay));							$("#activityCodeMoney").text(init.moneyToStr(data.value));						}										$('#isUseActivityCode').val(1);					}else if(data.state==11){						$("#activityCode").val("");                        re_dialog2('优惠码','对不起您已经使用过了,不能重复使用!');                        return;					}else{						$("#activityCode").val("");                        re_dialog2('优惠码','此优惠活动已结束,如有疑问请联系客服中心010-82699765!');                        return;					}				}			});		}	};	// 下单	this.placeOrder=function(){		    	   		var userInfo=this.card.getCookie("userInfo");				if(typeof(userInfo) != "undefined"  && userInfo != null && userInfo != ""){			userInfo=JSON.parse(userInfo);			var sid=userInfo.sid;			var userAdd=$('input[name="userAdd"]:checked').val();			var addressId=0;			var areaId=0;			if(typeof(userAdd) == "undefined" || userAdd == null || userAdd == ""){				re_dialog2('添加收货地址',"您还没有添加收货地址，请添加!");				return;			}						var tempIds=userAdd.split("_");			addressId=tempIds[0];			areaId=tempIds[1];							//付款方式			var usrPayType=$('input[name="usrPayType"]:checked').val();				//送货时间段			var tempSendType=$('input[name="sendTimeType"]:checked').val();			if(typeof(tempSendType) == "undefined" || tempSendType == null || tempSendType == ""){				tempSendType=3;			}			//送货类型			var sendType=1;			//服务站			var stationId=0;			//发票类型			var invoiceType=0;			//发票标题			var invoiceTitle="";			//发票正文			var invoiceContent="";			//商品ID、数量			var commons=$("#commons").val();			//获得服务站ID			var userSelectArea=this.card.getCookie("userSelectArea");			if(typeof(userSelectArea) != "undefined"  && userSelectArea != null && userSelectArea != ""){				userSelectArea=JSON.parse(userSelectArea);				stationId=userSelectArea.stationId;				if(stationId==0||stationId==null||stationId==''){					this.init.showArea();					return;				}			}else{				this.init.showArea();				return;			}			var tempCommonds=JSON.parse(commons);			if(tempCommonds.length<=0){                re_dialog2('添加商品',"请选择商品");				location.href="index.html";				return;			}			//订单总额			var pay=$("#goodsTocalPrize").text().replace(".","");			pay=pay.replace("元","");			if(parseInt(pay)<=0){			   re_dialog2('选购商品',"请选购其他商品");			   //location.href="index.html";			   return;			}			//送货时间			var sendTime="2014-07-28 13:19:01";			//优惠码			var activityCode=$("#activityCode").val();			if(activityCode==null||jQuery.trim(activityCode)==""||jQuery.trim(activityCode)=="请输入8位优惠码或兑换码"){				activityCode=0;			}			var fpSelect=$('#fpSelect').val();			var invoice;			var param;			if(fpSelect!=0){				invoiceType=$('input[name="fpType"]:checked').val();				invoiceTitle=$("#invoiceTitle").val();				invoiceContent=$("#invoiceContent").val();				if(jQuery.trim(invoiceTitle) == ''||jQuery.trim(invoiceContent) == ''){                    re_dialog2('开发票','发票信息不能为空!');					return false;				}				invoice=$('#invoice').val();				param="sid="+sid+"&addressId="+addressId+"&invoiceType="+invoiceType+"&invoiceTitle="+invoiceTitle+"&invoiceContent="+invoiceContent+"&sendType="+tempSendType+"&payType="+usrPayType+"&commons="+commons+"&stationId="+stationId+"&pay="+pay+"&activityCode="+activityCode;			}else{				param="sid="+sid+"&addressId="+addressId+"&invoiceType="+invoiceType+"&invoiceTitle="+invoiceTitle+"&invoiceContent="+invoiceContent+"&sendType="+tempSendType+"&payType="+usrPayType+"&pay="+pay+"&commons="+commons+"&stationId="+stationId+"&activityCode="+activityCode;			}						$.ajax({				cache: true,				type: "put",				url:"http://"+window.location.host+"/capi/order/submit/"+sid,				data:param,				async: false,				error: function(request) {					alert("下单失败,服务器忙请稍后!");				},				success:function(data){										if(data.state==1){							var cart=new shoppingCart(); 							// 清空购物车						    var commonids=$("#commons_2").val();							cart.deleteCommoditysToServer(sid,commonids);							//re_alipayDialog("支付宝支付","支付宝支付");							if(usrPayType==2){								var init=new initIndex();								var ali=new alipay();								var pay=init.moneyToStr(data.pay);								ali.setPrizeAndOrder(pay,data.orderId);								var param=ali.createQequest();								var url="https://mapi.alipay.com/gateway.do?"+param;								//location.href=url;								re_dialog3();								$('#alipay_a').attr('target', '_blank');								$('#alipay_a').attr('href', url);									$('#alipay_a')[0].click(); 							}else{								var userPhone = $("#userAdressPhone").val();							    var goodsTocalPrize = parseFloat($("#goodsTocalPrize").text()).toFixed(2);							    // 转到用户订单页面							    location.href="order_complete.html?orderMoney="+goodsTocalPrize+"&userPhone="+userPhone; 							}							/*$('#alipay_a').attr('target', '_blank');							$('#alipay_a').attr('href', url);								$('#alipay_a')[0].click(); */														/*var userPhone = $("#userAdressPhone").val();							var goodsTocalPrize = parseFloat($("#goodsTocalPrize").text()).toFixed(2);*/							//window.top.location.href=url;							// 转到用户订单页面							//location.href="order_complete.html?orderMoney="+goodsTocalPrize+"&userPhone="+userPhone; 						}else if(data.state==20){                            re_dialog2('超过下单量',"已超过每天最多下单量！请等待收货");							location.href="myorder.html";  						}else if(data.state==25){                            re_dialog2('数量不足',"对不起商品数量不足请联系客户,请联系客服中心010-82699765!");						}else{							 re_dialog2('下单失败',"状态码:"+data.state+",重新尝试或联系客服中心010-82699765");							 //re_dialog2('再试一次',"亲!IE什么的最讨厌了,您可否换个火狐试试?或者联系客服中心010-82699765!");						}				}			});		}	}		}function re_alipayDialog(tit,txt){    $("#alipayDialog").dialog({autoOpen:false,title:tit,hide: "explode",        modal: true,        buttons: { "支付完成":function(){            $("#alipayDialog").dialog("close");        } } })        .html(txt)        .dialog("open");}function re_dialog2(tit,txt){    $("#fpiaoDialog").dialog({autoOpen:false,title:tit,hide: "explode",        modal: true,        buttons: { "确定":function(){            $("#fpiaoDialog").dialog("close");        } } })        .html(txt)        .dialog("open");}function re_dialog3(){     $("#alipay-confirm").dialog({             resizable: false,             height: 100,             modal: true,             buttons: {                 "成功": function () {  				   location.href="myorder.html";                     $(this).dialog("close");                 },                 "失败": function () {  				  location.href="myorder.html";                  $(this).dialog("close");                 }            }       }).dialog("open");     $("#alipay-confirm").css("height","30px");}	