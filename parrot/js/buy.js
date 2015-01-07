/*******************************************************************************
 * 用户购买
 ******************************************************************************/
function userBuy(){
	
	this.reLogin=/^1[3|4|5|8][0-9]\d{4,8}$/;
	this.CommodityNumMin=1;
	this.CommodityNumMax=100;
	// cookie
	this.card=new CardCookie(); 
	//当前服务地址
	this.localHost=window.location.host; 
	this.num=0;
	//替换为数字
	this.inputNumber=function(obj){
		obj.value=obj.value.replace(/\D/g,'');
	};
	//添加商品数量
	this.addCommodity=function(){
		var num=parseInt($('#shoppCart').val());
		if(num>=this.CommodityNumMax){
			alert("已是最大数量");
			return;
		}else{
			num+=1;
		}
		$('#shoppCart').val(num);
	};
	//减少商品数量
	this.reduceCommodity=function(){
		var num=parseInt($('#shoppCart').val());
		if(num<=this.CommodityNumMin){
			alert("已是最小数量");
			return;
		}else{
			num-=1;
		}
		$('#shoppCart').val(num);
	};
	//用户手动修改数量
	this.updateCommodity=function(obj){

		if(isNaN(obj.value)||obj.value == ""){
			obj.value=1;
		}
		if(obj.value<this.CommodityNumMin){
			alert("已是最小数量");
			obj.value=this.CommodityNumMin;
			//return;
		}else if(obj.value>this.CommodityNumMax){
			alert("已超出最大数量");
			obj.value=this.CommodityNumMax;
			//return;
		}
	};
	//立即购买
	this.nowBuy=function(){
		var userInfo=this.card.getCookie("userInfo");		
		if(typeof(userInfo) == "undefined"  || userInfo == null || userInfo == ""){
						$("#loginWin").dialog({
							autoOpen: true,
							title:'登录与注册',
							close:true,
							width: 600,
							height:350,
							show: "blind",
							hide: "explode",
							modal: true
							});
						$("#loginWin").dialog( "open" ); 
						return;
		}
		var user=JSON.parse(userInfo);
		var sid=user.sid;
		var commodityId=$("#groupCommodityId").val();
		var amount=$("#shoppCart").val();
		var myCardMount=$("#myCard").text();
		if(isNaN(myCardMount)||myCardMount.value == ""){
			myCardMount=0;
		}
		myCardMount=parseInt(myCardMount);
		myCardMount+=1;
		$("#myCard").text(myCardMount);
		var commodity={sid:sid,commodityId:commodityId,amount:amount};
		this.addGoodsToServer(commodity);
		location.href="mycart.html";  
	};
	//加入购物车
	this.addCommodityToShoppCart=function(){
		var userInfo=this.card.getCookie("userInfo");		
		var user=JSON.parse(userInfo);
		var sid=user.sid;
		var commodityId=$("#groupCommodityId").val();
		var amount=$("#shoppCart").val();
		var myCardMount=$("#myCard").text();
		if(isNaN(myCardMount)||myCardMount.value == ""){
			myCardMount=0;
		}
		myCardMount=parseInt(myCardMount);
		myCardMount+=1;
		$("#myCard").text(myCardMount);
		var commodity={sid:sid,commodityId:commodityId,amount:amount};
		this.addGoodsToServer(commodity);
	};
	//同步添加商品到服务器购物车
	this.addGoodsToServer=function(obj)	{
		var param="sid="+obj.sid+"&commonId="+obj.commodityId+"&amount="+obj.amount;
		$.ajax({
			cache: true,
			type: "put",
			url:"http://"+this.localHost+"/capi/cart/"+obj.sid,
			data:param,
			async: false,
			error: function(request) {
				alert("服务器忙请稍后!");
			},
			success: function(data) {
				//alert("add goods to server state:"+data.state);
				if(data.state==1){
						
				}
			}
		});
	};
}