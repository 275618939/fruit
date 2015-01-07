/***************************************************
		商品信息
***************************************************/
function shoppingCart(){

	this.CommodityNumMin=1;
	this.CommodityNumMax=100;
	this.card=new CardCookie(); 
	this.init=new initIndex();
	//当前服务地址
	this.localHost=window.location.host; 
	//替换为数字
	this.inputNumber=function(obj){
		obj.value=obj.value.replace(/\D/g,'');
	};
	//读取购物车中的商品信息
	this.loadMyShoppingCarts=function()	{
	    //读取用户添加到购物车的信息
	    var userInfo=this.card.getCookie("userInfo");
		if(typeof(userInfo) != "undefined" && userInfo != null && userInfo != ""){
			 $("#goodItems").empty();
			 userInfo=JSON.parse(userInfo);
			 $.ajax({
				cache: false ,
				type: "GET",
				url:"http://"+this.localHost+"/capi/cart/"+userInfo.sid,
				//data:"sid="+userInfo.sid,
				async: false,
				error: function(request) {
					alert("加载服务器购物车信息失败!");
				},
				success:this.createCartItems
				
			});
		
		}							
	};
	//删除购物车商品
	this.deleteGoods=function(obj){
		var userInfo=this.card.getCookie("userInfo");		
		if(typeof(userInfo) != "undefined"  && userInfo != null && userInfo != ""){
			userInfo=JSON.parse(userInfo);
			var sid=userInfo.sid;
			var id=obj.title;
			var commodityId = id.split("_")[0];
			//var totalPrize=parseInt($("#goodsCount").text());
			//var temPrize=parseInt($('#'+commodityId+'_prize').text());
			var totalPrize=this.init.strToMoney($("#goodsCount").text());
			var temPrize=this.init.strToMoney($('#'+commodityId+'_prize').text());
			$("#goodsCount").text(this.init.moneyToStr(totalPrize-temPrize));
			$('#'+id).remove();
			this.deleteCommodityToServer(sid,commodityId);
		}
	};
	//用户手动修改数量
	this.updateCommodityNum=function(obj){
		var userInfo=this.card.getCookie("userInfo");		
		if(typeof(userInfo) != "undefined"  && userInfo != null && userInfo != ""){
			userInfo=JSON.parse(userInfo);
			var sid=userInfo.sid;
			var id=obj.title;
			if(isNaN(obj.value)||obj.value == ""){
				obj.value=1;
			}
			if(obj.value<this.CommodityNumMin){
				alert("已是最小数量");
				obj.value=this.CommodityNumMin;
			}else if(obj.value>this.CommodityNumMax){
				alert("已超出最大数量");
				obj.value=this.CommodityNumMax;
			}
			var commodityCount=parseInt(obj.value);
			/*var totalPrize=parseFloat($("#goodsCount").text());
			var temPrize=parseFloat($('#'+id+'_prize').text());
			var temp=parseFloat($('#'+id+'_p').text());
			var tp=totalPrize-temPrize;
			var n=temp*commodityCount;
			$('#'+id+'_prize').text(n.toFixed(2));
			$("#goodsCount").text((tp+n).toFixed(2));*/
			var totalPrize=this.init.strToMoney($("#goodsCount").text());
			var temPrize=this.init.strToMoney($('#'+id+'_prize').text());
			var temp=this.init.strToMoney($('#'+id+'_p').text());
			var tp=totalPrize-temPrize;
			var n=temp*commodityCount;
			$('#'+id+'_prize').text(this.init.moneyToStr(n));
			$("#goodsCount").text(this.init.moneyToStr(tp+n));
			this.updateCommodityToServer(sid,id,commodityCount);
		}
	};
	//减少商品
	this.reduceCommodityNum=function(obj){
		var userInfo=this.card.getCookie("userInfo");		
		if(typeof(userInfo) != "undefined"  && userInfo != null && userInfo != ""){
			userInfo=JSON.parse(userInfo);
			var sid=userInfo.sid;
			var id=obj.title;
			var v=parseInt($('#'+id).val());
			if(v<=this.CommodityNumMin){
				alert("已是最小数量");
				return;
			}else{
				v-=1;
			}
			$('#'+id).val(v);
			/*var totalPrize=parseFloat($("#goodsCount").text());
			var temPrize=parseFloat($('#'+id+'_prize').text());
			var temp=parseFloat($('#'+id+'_p').text());
			$("#goodsCount").text((totalPrize-temp).toFixed(2));
			$('#'+id+'_prize').text((temPrize-temp).toFixed(2));*/
			var totalPrize=this.init.strToMoney($("#goodsCount").text());
			var temPrize=this.init.strToMoney($('#'+id+'_prize').text());
			var temp=this.init.strToMoney($('#'+id+'_p').text());
			$("#goodsCount").text(this.init.moneyToStr(totalPrize-temp));
			$('#'+id+'_prize').text(this.init.moneyToStr(temPrize-temp));
			this.updateCommodityToServer(sid,id,v);
		}
	};
	//增加商品
	this.addCommodityNum=function(obj){
		var userInfo=this.card.getCookie("userInfo");		
		if(typeof(userInfo) != "undefined"  && userInfo != null && userInfo != ""){
			userInfo=JSON.parse(userInfo);
			var sid=userInfo.sid;
			var id=obj.title;
			var v=parseInt($('#'+id).val());
			if(v>=this.CommodityNumMax){
				alert("已是最大数量");
				return;
			}else{
				v+=1;
			}
			$('#'+id).val(v);
			/*var totalPrize=parseFloat($("#goodsCount").text());
			var temPrize=parseFloat($('#'+id+'_prize').text());
			var temp=parseFloat($('#'+id+'_p').text());
			$("#goodsCount").text((totalPrize+temp).toFixed(2));
			$('#'+id+'_prize').text((temPrize+temp).toFixed(2));*/
			var totalPrize=this.init.strToMoney($("#goodsCount").text());
			var temPrize=this.init.strToMoney($('#'+id+'_prize').text());
			var temp=this.init.strToMoney($('#'+id+'_p').text());
			$("#goodsCount").text(this.init.moneyToStr(totalPrize+temp));
			$('#'+id+'_prize').text(this.init.moneyToStr(temPrize+temp));
			
			this.updateCommodityToServer(sid,id,v);
		}
	};
	//创建购物车信息
	this.createCartItems=function(data){
		if(data.state==1){
			  var init=new initIndex();
			  var len=data.value.length;
			  var commodity=null;
			  var trId=null;
			  var thumbUrls=null;
			  var prizeId=null;
			  var pId=null;
			  var tempPrize=null;
			  var sumPrize=0;
			  var price=0;
			  $("#goodItems").empty();
			  for(var i=0;i<len;i++){
					commodity=data.value[i];
					trId=commodity.commonId+"_"+i;
					prizeId=commodity.commonId+"_prize";
					//price=parseFloat(commodity.price*0.01).toFixed(2);
					//price=commodity.price;
					pId=commodity.commonId+"_p";
					thumbUrls=JSON.parse(commodity.thumbUrl);
					tempPrize=commodity.amount*commodity.price;
					sumPrize+=tempPrize;
					var td=$("<tr id='"+trId+"'><td width='17%' height='184' align='center' valign='middle'><h4><a href='#'><img src='images/"+thumbUrls[2]+"' width='71' height='71' /></a></h4></td><td width='83%' valign='top'><table width='96%' border='0' cellspacing='0' cellpadding='0' class='text_gra' id='goodItems'><tr><td colspan='5' height='25'></td></tr><tr><td width='29%' height='70' valign='middle'><p class='h4'>"+commodity.commodityName+"</p></td><td width='21%' align='center' valign='middle'><p class='h4'>￥ <b id='"+pId+"'>"+init.moneyToStr(commodity.price)+"</b>元</p></td><td width='25%' align='center' valign='middle'><a href='javascript:;' title="+commodity.commonId+"  onclick='cart.reduceCommodityNum(this)' class='btn_num'>-</a> &nbsp;<b><input id="+commodity.commonId+" value="+commodity.amount+" title="+commodity.commonId+" class='fillnum' onBlur='cart.updateCommodityNum(this)' onkeyup='cart.inputNumber(this)' onafterpaste='cart.inputNumber(this)' maxlength='3' size='14'  type='text' /></b>&nbsp;<a href='javascript:;' title="+commodity.commonId+"  onclick='cart.addCommodityNum(this)' class='btn_num'>+</a></td><td width='11%' valign='middle' class='text_org'>￥<b id="+prizeId+" class='h4 text_org'>"+init.moneyToStr(tempPrize)+"元</b></td><td width='14%' valign='middle'><a href='javascript:;' title="+trId+"  onclick='cart.deleteGoods(this)' class='btnblue2'>删除</a></td></tr><tr><td colspan='5' height='1' class='bd_gray_dash'></td></tr><tr><td height='50' colspan='5' valign='middle'><p class='text_gra2 h4'>编号：1000000"+commodity.commonId+"</p></td></tr></table></td></tr>");
					td.appendTo($("#goodItems"));	
			  }
			  $("#goodsCount").text(init.moneyToStr(sumPrize));
		}
	};
	//同步删除商品服务器购物车
	this.deleteCommodityToServer=function(sid,commodityId)	{
		var array=new Array();
		array.push(parseInt(commodityId));
		var commoditys=JSON.stringify(array);
		$.ajax({
			cache: false,
			type: "DELETE",										   
			url:"http://"+this.localHost+"/capi/cart/"+sid+"?commons="+commoditys,
			async: false,
			error: function(request) {
				alert("服务器忙请稍后!");
			},
			success: function(data) {
				//alert("delete goods to server state:"+data.state);
				if(data.state==1){
						
				}
			}
		});
	};
	//同步批次删除商品服务器购物车
	this.deleteCommoditysToServer=function(sid,commods)	{
		$.ajax({
			cache: false,
			type: "DELETE",										   
			url:"http://"+this.localHost+"/capi/cart/"+sid+"?commons="+commods,
			async: false,
			error: function(request) {
				alert("服务器忙请稍后!");
			},
			success: function(data) {
				//alert("delete goods to server state:"+data.state);
				if(data.state==1){
						
				}
			}
		});
	};
	//同步更新商品到服务器购物车
	this.updateCommodityToServer=function(sid,commodityId,commodityNum)	{
		var param="sid="+sid+"&commonId="+commodityId+"&amount="+commodityNum;
		$.ajax({
			cache: false,
			type: "post",
			url:"http://"+this.localHost+"/capi/cart/"+sid,
			data:param,
			async: false,
			error: function(request) {
				alert("服务器忙请稍后!");
			},
			success: function(data) {
				//alert("update goods to server state:"+data.state);
				if(data.state==1){
						
				}
			}
		});		
	};
	//下一步转到结算页面
	this.nextSettle=function(){
		
		//检测用户是否登录，如没有登录提示用户登录
		var userInfo=this.card.getCookie("userInfo");		
		if(typeof(userInfo) != "undefined"  && userInfo != null && userInfo != ""){
			 userInfo=JSON.parse(userInfo);
			 var totalPrize=parseFloat($("#goodsCount").text());
			 if(totalPrize<=0){
				alert("请选择商品!");
				location.href="index.html"; 
				return;
			 }
			//转到下单页面
			location.href="recieve.html";  
		}else{
			//提示用户登录
			alert("请先登录!");
		}	
	}
}