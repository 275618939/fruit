/***************************************************
		商品操作
***************************************************/
function Commodity(){
	//所有商品ID
	this.AllCommodityID=100;
	//优惠水果ID
	this.DiscountCommodityID=102;
	//当季水果ID
	this.NowCommodityID=103;
	//进口水果ID
	this.ImportedCommodityID=104;
	//国产水果ID
	this.LocalCommodityID=105;
	//每日特惠水果ID
	this.PreferentialCommodityID=106;
	//Banner水果ID
	this.BannerCommodityID=107;
	//当前服务地址
	this.localHost=window.location.host;
	//回调函数
	this.result=null;
	//初始化对象
	this.init=null;
	//获取预售商品
	this.findAdvanceCommodity=function(id){
		$.ajax({
			cache: false,
			type: "GET",
			url:"http://"+this.localHost+"/capi/commodity/findAdvance/"+id,
			data:"groupId="+id,
			async: false,
			error: function(request) {
			},
			success:this.result
		});
	};
	//获取在售商品
	this.findInSaleCommodity=function(id){
		$.ajax({
			cache: false,
			type: "GET",
			url:"http://"+this.localHost+"/capi/commodity/findInSale/"+id,
			data:"groupId="+id,
			async: false,
			error: function(request) {
				alert("不能获取商品,服务器忙请稍后!");
			},
			success:this.result
		});
	};
	//获取售罄商品
	this.findSaleOutCommodity=function(id){
		$.ajax({
			cache: false,
			type: "GET",
			url:"http://"+this.localHost+"/capi/commodity/findSaleOut/"+id,
			data:"groupId="+id,
			async: false,
			error: function(request) {
			},
			success:this.result
		});
	};
	//查询商品明细
	this.findCommodityDetail=function(id){
		$.ajax({
			cache: false,
			type: "GET",
			url:"http://"+this.localHost+"/capi/commodity/detail/"+id,
			data:"commodityId="+id,
			async: false,
			error: function(request) {
			},
			success:this.createCommodityDetail
		});
	};
	//查询组商品明细
	this.findGroupCommodityDetail=function(id){
		$.ajax({
			cache: false,
			type: "GET",
			url:"http://"+this.localHost+"/capi/commodity/findByGcId/"+id,
			data:"groupCommodityId="+id,
			async: false,
			error: function(request) {
			},
			success:this.createGroupCommodityDetail
		});
	};
	//商品详细操作
	this.createCommodityDetail=function(data){
		//测试用
		//var testData={state:1,value:[{commodityId:100,commodityName:'澳大利亚奇异果',commodityTitle:'香甜可口',property:{'产地':'海南','最佳品尝':'24小时以内','编号':'01019303888'},commodityUrl:'images/4294300657888891521.jpg',thumbUrl:'images/4294300657888891521.jpg',phase:'2014-07-14',source:40.00,price:30.00,amount:25,remain:15}]};	
		if(data.state==1){
			var commodity=data;
			$("#commodityName").text(commodity.commodityName);
			$("#commodityTitle").text(commodity.commodityTitle);
			$("#commodityDetail").html(data.description);
		}
	};
	//商品组详细操作
	this.createGroupCommodityDetail=function(data){
		//测试用
		//data={state:1,value:[{id:102,commodityId:100,commodityName:'澳大利亚奇异果',commodityTitle:'香甜可口',property:{'产地':'海南','最佳品尝':'24小时以内','编号':'01019303888'},commodityUrl:'images/4294300657888891521.jpg',thumbUrl:'images/4294300657888891521.jpg',phase:'2014-07-14',source:40.00,price:30.00,amount:25,remain:15}]};	
		if(data.state==1){
			var init=new initIndex();
			//$("#phase").text(data.phase);
			$("#amount").text(data.amount);
			$("#remain").text(data.amount-data.sale);
			$("#code").text("1000000"+data.id);
			//$("#price").text(parseFloat(data.price*0.01).toFixed(2));
			//$("#source").text(parseFloat(data.source*0.01).toFixed(2));
			$("#price").text(init.moneyToStr(data.price));
			$("#source").text(init.moneyToStr(data.source));
			$('#navigationCommodity').text(data.commodityName);
			var groupId=100;
			if(data.groupId!=null&&data.groupId!="undefined"){
				groupId=data.groupId;
			}
			var setCommodity=new Commodity();	
			setCommodity.setBreadcrumbNavigation(groupId);
			if(data.property!=null&&jQuery.trim(data.property)!=""){			
				var property= JSON.parse(data.property); //
				$("#origin").text(property.goodOrigin);
				$("#best").text(property.goodBestTast);
			}
			//设置图片商品展示
			try{
				var imageUrls=JSON.parse(data.imageUrl);
				var thumbUrls=JSON.parse(data.thumbUrl);
				var len=imageUrls.length;
				if(len==3){
					for(var i=0;i<len;i++){
						var id="commodityDetailImage_"+(i+1);
						$("#"+id).attr("src","images/"+thumbUrls[i]); 
						$("#"+id).attr("name","images/"+imageUrls[i]); 
					}
					$("#commodityDetailImage").css("background-image","url(images/"+imageUrls[0]+")");
				}else if(len==4){
					for(var i=1;i<len;i++){
						var id="commodityDetailImage_"+i;
						$("#"+id).attr("src","images/"+thumbUrls[i]); 
						$("#"+id).attr("name","images/"+imageUrls[i]); 
					}
					$("#commodityDetailImage").css("background-image","url(images/"+imageUrls[1]+")");
				}
				
	
			}
			catch (e){
				alert("商品图片为空,暂时不能加载!"+e.message);
			} 
		}
	};
	//设置导航面包屑
	this.setBreadcrumbNavigation=function(groupId){
		$('#breadcrumbNavigation').attr('href',"list.html?groupId=="+groupId); 
		var text=this.getGroupNameById(groupId);
		$('#navigatioNName').text(text);
	};
	//获得分组名称
	this.getGroupNameById=function(groupId){
	    var text="";
		if(groupId==this.AllCommodityID){
			text="所有水果";
		}else if(groupId==this.DiscountCommodityID){
			text="优惠水果";
		}else if(groupId==this.NowCommodityID){
			text="当季水果";
		}else if(groupId==this.ImportedCommodityID){
			text="进口水果";
		}else if(groupId==this.LocalCommodityID){
			text="国产水果";
		}else if(groupId==this.LocalCommodityID){
			text="国产水果";
		}else if(groupId==this.PreferentialCommodityID){
			text="每日特惠水果";
		}else if(groupId==this.BannerCommodityID){
			text="精选水果";
		}
		return text;
	};
	//显示商品图片
	this.showCommodityDetailImage=function(obj){
	    var id=obj.id;
		var imagePath=obj.name;
		$("#commodityDetailImage").css("background-image","url("+imagePath+")");
	};
	this.startPhase=function(intDiff){
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



      
