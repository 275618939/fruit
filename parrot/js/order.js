/*******************************************************************************
 * 订单管理
 ******************************************************************************/
function order(){
	
	this.reLogin=/^1[3|4|5|8][0-9]\d{4,8}$/;
	// cookie
	this.card=new CardCookie(); 
	// 页面显示条数
	this.itemsOnPage=10;
	//当前服务地址
	this.localHost=window.location.host; 
	//所有订单
	this.AllOrder=0;
	//待收货
	this.AfterReceipt=1;
	//已完成
	this.EndOrder=2;
	
	// 获得总记录数
	this.getUserOrderCount=function(orderType){
		var userInfo=this.card.getCookie("userInfo");	
		var	count=0;	
		if(typeof(userInfo) != "undefined"  && userInfo != null && userInfo != ""){
			userInfo=JSON.parse(userInfo);
			var sid=userInfo.sid;
			$.ajax({
					async: false,
					type: "get",
					url:"http://"+window.location.host+"/capi/order/count/"+sid,
					data:"type="+orderType,
					error: function(request) {
						alert("服务器忙请稍后!");
					},
					success: function(data) {
						if(data.state==1){
							count=data.count;
							//alert(count);
							return count;
						}
					}
			});
		}
		return count;
	};
	//评价打分
	this.rate=function(obj,oEvent){
		var imgSrc = 'images/star.gif'; 
		var imgSrc_2 = 'images/star-hover.gif'; 
		if(obj.rateFlag) return; 
		var e = oEvent || window.event; 
		var target = e.target || e.srcElement;  
		var imgArray = obj.getElementsByTagName("img"); 
		for(var i=0;i<imgArray.length;i++){ 
			imgArray[i]._num = i; 
			imgArray[i].onclick=function(){ 
				if(obj.rateFlag)
				return; 
				obj.rateFlag=true; 
				alert("感谢您的参与,我们会及时处理您的建议！");
				//alert(this._num+1); 
			}; 
		} 
		if(target.tagName=="IMG"){ 
			for(var j=0;j<imgArray.length;j++){ 
				if(j<=target._num){ 
					imgArray[j].src=imgSrc_2; 
				}else{ 
					imgArray[j].src=imgSrc; 
				} 
			} 
		}else{ 
			for(var k=0;k<imgArray.length;k++){ 
				imgArray[k].src=imgSrc; 
			} 
		} 
	};
	//订单状态装换
	this.orderStatus=function(status,payType){
		status=parseInt(status);
		if(status==1){
		   if(payType==1){
		     return "等待配送";
		   }else{
		     return "未付款";
		   }
		}else if(status==2){
			return "已付费";
		}else if(status==3){
			return "已备货";
		}else if(status==4){
			return "已发货";
		}else if(status==10){
			return "已送达";
		}else if(status==11){
			return "<font color='red'>已撤销</font>";
		}else if(status==12){
			return "已拒收";
		}else if(status==13){
			return "无法送达";
		}else{
			return "待定";
		}
	};
	//撤销订单
	this.revocationOrder=function(id){
	$("#dialog").dialog({show: "blind",
		hide: "explode",
		modal: true,
		buttons: { "确定":function(){ 
			var card=new CardCookie(); 
			var userInfo=card.getCookie("userInfo");		
			if(typeof(userInfo) != "undefined"  && userInfo != null && userInfo != ""){
				userInfo=JSON.parse(userInfo);
				var sid=userInfo.sid;
				$.ajax({
					cache: true,
					type: "post",
					url:"http://"+window.location.host+"/capi/order/cancel/"+sid,
					data:"sid="+sid+"&orderId="+id,
					async: false,
					error: function(request) {
						alert("服务器忙请稍后!");
					},
					success: function(data) {
						if(data.state==1){
							$("#dialog").dialog("close");
							location.reload();
						}else{
							alert("撤单失败，请联系管理员!");
						}
					}
				});
			}
		}, "取消": function() { $(this).dialog("close"); } } }); 
		
	};
	//加载用户订单详情
	this.loadUserOrderDetail=function(orderid){
		var userInfo=this.card.getCookie("userInfo");		
		if(typeof(userInfo) != "undefined"  && userInfo != null && userInfo != ""){
			userInfo=JSON.parse(userInfo);
			var sid=userInfo.sid;
			$.ajax({
				cache: true,
				type: "get",
				url:"http://"+this.localHost+"/capi/order/detail/"+sid,
				data:"sid="+sid+"&orderId="+orderid,
				async: false,
				error: function(request) {
					alert("服务器忙请稍后!");
				},
				success: function(data) {
					if(data.state==1){
						$("#userOrderTable").empty();
						$("#orderId").text(orderid);
						$("#consignee").text(data.consignee);
						$("#address").text(data.address);
						var tempText="无发票";
						if(data.invoiceType==1){
							tempText="个人发票";
						}else if(data.invoiceType==2){
							tempText="单位发票";
						}
					    if(data.payType==1){
							$("#detailPayType").text("货到付款");
						}else if(data.payType==2){
							$("#detailPayType").text("支付宝支付");
						}else{
							$("#detailPayType").text("其他");
						}
						$("#invoiceType").text(tempText);
						$("#invoiceTitle").text(data.invoiceTitle);
						$("#telephone").text(data.telephone);
						$("#invoiceContent").text(data.invoiceContent);
						$("#price").text("¥"+parseFloat(data.pay*0.01).toFixed(2));
						$("#createTime").text(data.createdTime);
						var commons=data.commons;
						var len=commons.length;
						var commodity=null;
						var commodityUrls=null;
						var ctr2=$("<tr><td colspan='3' height='10'></td></tr>"); 
						ctr2.appendTo($("#userOrderTable"));
						for(var i=0;i<len;i++){
						    
							 commodity=commons[i];
							 commodityUrls=JSON.parse(commodity.thumbUrl);
							 var tr=$("<tr id='"+orderid+"'></tr>");
							 tr.appendTo($("#userOrderTable"));
							 var td=$("<td width='28%' align='center'><a href='#'><img src='images/"+commodityUrls[2]+"' id='commodityUrl' width='71' height='71' class='border_gray' /></a></td><td width='55%'><p id='commodityName'>"+commodity.commodityName+"<br />"+parseFloat(commodity.price*0.01).toFixed(2)+"元</p></td><td width='17%' align='center'><p id='amount'>"+commodity.amount+"</p></td>");
							 td.appendTo(tr);
							 if(i<len-1){
								var ctr1=$("<tr><td colspan='3' height='10' class='bd_gray_dash'></td></tr>"); 
								ctr1.appendTo($("#userOrderTable"));
							 }
							 ctr2=$("<tr><td colspan='3' height='10'></td></tr>"); 
							 ctr2.appendTo($("#userOrderTable"));
						}
					}
				}
			});
			//查询收货地址
		}
	};
	this.onceAgainAlipay=function(pay,orderId){
		
		var init=new initIndex();
		var ali=new alipay();
		pay=init.moneyToStr(pay);
		ali.setPrizeAndOrder(pay,orderId);
		var param=ali.createQequest();
		var url="https://mapi.alipay.com/gateway.do?"+param;
		//location.href=url;
		$('#alipay_a').attr('target', '_blank');
		$('#alipay_a').attr('href', url);	
		$('#alipay_a')[0].click(); 
	};
	//加载用户订单信息 
	this.loadUserOrder=function(pageNo,type){
		var userInfo=this.card.getCookie("userInfo");		
		if(typeof(userInfo) != "undefined"  && userInfo != null && userInfo != ""){
			userInfo=JSON.parse(userInfo);
			var sid=userInfo.sid;
			$.ajax({
				cache: true,
				type: "get",
				url:"http://"+this.localHost+"/capi/order/find/"+sid,
				data:"sid="+sid+"&pageNo="+pageNo+"&pageSize="+this.itemsOnPage+"&type="+type,
				async: false,
				error: function(request) {
					alert("服务器忙请稍后!");
				},
				success: function(data) {
					if(data.state==1){
						$("#userOrderTable").empty();
						var o = new order();
						var value=data.value;
						var len=value.length;
						for(var i=0;i<len;i++){
							 var tr=$("<tr class='tr_border' id='"+value[i].orderId+"'></tr>");
							 tr.appendTo($("#userOrderTable"));
							 var td;
							 var cancelOrder="";
							 var onceAgainAlipay="";
							 var tempText="其他";
							 if(value[i].status==1){
								cancelOrder="<a href='javascript:void(0);' onclick='o.revocationOrder("+value[i].orderId+")' class='btnGrey2'>撤单</a>";
							 }
							 if(value[i].payType==1){
								tempText="货到付款";
							 }else if(value[i].payType==2){
								tempText="支付宝支付";
							 }
							 if(value[i].status==1&&value[i].payType==2){
								onceAgainAlipay="<a href='javascript:void(0);' onclick='o.onceAgainAlipay("+value[i].pay+","+value[i].orderId+")' class='btnblue2'>我要支付</a>";
							 }
							 td=$("<td width='10%' class='br_gray' ><p>订单号："+value[i].orderId+"</p></td><td width='10%' class='br_gray'  align='center'><p>"+o.orderStatus(value[i].status,value[i].payType)+"</p></td><td width='11%' class='br_gray' align='center'><p>¥"+parseFloat(value[i].pay*0.01).toFixed(2)+"<br />"+tempText+"</p></td><td width='13%' class='br_gray' align='center'><p>"+value[i].createdTime+"</p></td><td width='13%' class='br_gray' align='center'><p><a href='order_detail.html?orderid="+value[i].orderId+"' class='text_gra'>订单详情&gt;&gt;</a></p></td><td width='13%' align='center'>"+onceAgainAlipay+"&nbsp;"+cancelOrder+"</td>");
							 td.appendTo(tr);
				
						}
					 }
				}
			});
		}
	}
	
}