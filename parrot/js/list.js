/***************************************************
		初始化首页JS脚本加载服务站‘商品等相关信息
***************************************************/
function listCommodity() {
	
	
	//商品信息查询
	this.commodity=new Commodity();	
	//当前服务地址
	this.localHost=window.location.host;
	//组商品选择样式
	this.chanageGroupSelectCss=function(id){
		if(id!=null){
			$('#groupCommodityType .sel').removeClass('sel');
			$('#'+id).addClass('sel');
			$('#commodityType .sel').removeClass('sel');
			$('#sale').addClass('sel');
		}
	};
	//商品类型选择样式
	this.chanageTypeSelectCss=function(obj){
		if(obj!=null){
			$('#commodityType .sel').removeClass('sel');
		    var id=obj.id;
			$('#'+id).addClass('sel');
		}
	};
	//默认加载所有商品
	this.loadAllCommoditySale=function(id){
		if(isNaN(id)){
			id=this.commodity.AllCommodityID;
		}
		this.chanageGroupSelectCss(id);
		this.commodity.result=this.createCommodityList;
		this.commodity.findInSaleCommodity(id);
	};
	//根据组商品ID加载在售商品
	this.loadAllCommoditySaleById=function(obj){
		var id=null;
		if(obj!=null){
			id=obj.id;
		}else{
			id=this.commodity.AllCommodityID;
		}
		this.chanageGroupSelectCss(id);
		this.commodity.result=this.createCommodityList;
		this.commodity.findInSaleCommodity(id);
	};
	//根据组商品ID加载在售商品
	this.loadCommoditySaleById=function(obj){
		var id=$('#groupCommodityType .sel').attr("id");
		this.chanageTypeSelectCss(obj);
		this.commodity.result=this.createCommodityList;
		this.commodity.findInSaleCommodity(id);
	};
	//根据组商品ID加载预售商品
	this.loadCommodityAdvanceById=function(obj){
		var id=$('#groupCommodityType .sel').attr("id");
		this.chanageTypeSelectCss(obj);
		this.commodity.result=this.createCommodityList;
		this.commodity.findAdvanceCommodity(id);
	};
	//根据组商品ID加载售罄商品
	this.loadCommoditySaleOutById=function(obj){
		var id=$('#groupCommodityType .sel').attr("id");
		this.chanageTypeSelectCss(obj);
		this.commodity.result=this.createCommodityList;
		this.commodity.findSaleOutCommodity(id);
	};
	//商品列表
	this.createCommodityList=function(data){
		//测试用
		//data={state:1,value:[{commodityId:100,commodityName:'非洲红柚',commodityTitle:'香甜可口',commodityUrl:['images/list_product_1.jpg'],thumbUrl:['images/list_product_1.jpg'],unit:'份',phase:'2014-07-14',source:40,price:30,amount:25,remain:15}]};	
		if(data.state==1){
			 var len=data.value.length;
			 $("#goodItems").empty();
			 var init=new initIndex();
			 for(var i=0;i<len;i++){
				commodity=data.value[i];		
				var commodityUrls=JSON.parse(commodity.imageUrl);
				var l=commodityUrls.length;
				var commodityImagePath;
				if(l==4){
				    commodityImagePath=commodityUrls[1];
				}else{
					commodityImagePath=commodityUrls[0];
				}
			    //var price=parseFloat(commodity.price*0.01).toFixed(2);
				//var source=parseFloat(commodity.source*0.01).toFixed(2);
				var price=init.moneyToStr(commodity.price);
				var source=init.moneyToStr(commodity.source);
				var tempClass="";
				if(i%4==0&&(len-i)>3){
					tempClass="class='fr'";
				}
				var element=$("<li "+tempClass+"><div class='list_inner'><a href='detail.html?commodityId="+commodity.commodityId+"&groupCommodityId="+commodity.id+"' target='_blank'><img src='images/"+commodityImagePath+"' width='280' height='280' /></a><div class='list_info'><p class='h4'>"+commodity.commodityName+"</p><p class='text_org'><em>￥</em>"+price+"<span>/份</span></p><div class='cls'></div><p class='market'>市场价：<span>￥"+source+"</span></p> <a href='detail.html?commodityId="+commodity.commodityId+"&groupCommodityId="+commodity.id+"' target='_blank' class='btnorg'>立即购买</a></div></div></li>");
				element.appendTo($("#goodItems"));	
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
}

