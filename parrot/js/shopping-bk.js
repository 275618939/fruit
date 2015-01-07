;(function($){
	$.extend($.fn,{
		shoping:function(options){
			var self=this,
				$shop=$('.J-shoping'),
				$title=$('.J-shoping-title'),
				$body=$('.J-shoping-body'),
				$num=$('.J-shoping-num'),
				$close=$('.J-shoping-close');
			var S={
				init:function(){
					$title.bind('click',this.clickOnTitle);
					$close.live('click',this.removeList);
					$(self).data('click',true).live('click',this.addShoping);
					$(document).bind('click',S.slideBoxMini);
					$body.bind('click',this.clickOnBody);
				},
				clickOnBody:function(e){
					if(!$(e.target).hasClass('J-shoping-close')){
						e.stopPropagation(); //阻止冒泡	
					};
				},
				/*添加商品*/
				addShoping:function(e){
					
					var goodsId = $(this).attr("id").split("-")[1];
			        var card=new CardCookie(); 
					var userArea=card.getCookie("userArea");				
					if(typeof(userArea) == "undefined"  || userArea == null || userArea == ""){
						$("#modal_read").click();
						return;
					}
			        var v=card.getCookie("ptGoods");
			        var goods=JSON.parse(v);
			        var index=0;
			        var l=goods.length;
					for(var i=0;i<l;i++){						
						 if(goods[i].commodityId==goodsId){
							 index=i;
							 break;
						 }
					}
					e.stopPropagation();
					var $target=$(e.target),
						id=$target.attr('id'),
						dis=$target.data('click'),
					    x = $target.offset().left + 30,
						y = $target.offset().top + 10,
						X = $shop.offset().left+$shop.width()/2-$target.width()/2+10,
						Y = $shop.offset().top;
					if(dis){
						if ($('#floatOrder').length <= 0) {
							$('body').append('<div id="floatOrder"><img src="images/product_bd.jpg" width="50" height="50" /></div');
						};
						var $obj=$('#floatOrder');
						if(!$obj.is(':animated')){
							$obj.css({'left': x,'top': y}).animate({'left': X,'top': Y-80},500,function() {
								$obj.stop(false, false).animate({'top': Y-20,'opacity':0},500,function(){
									$obj.fadeOut(300,function(){
										$obj.remove();	
										$target.data('click',false).addClass('dis-click');
										var l=$('.J-shoping-list').length,
											num=Number($num.text());
										if(l<5){
											$body.prepend('<div class="J-shoping-list" data-id="'+id+'" good-id="'+goods[index].commodityId+'"><a href="#" title="123"><img src="'+goods[index].commodityUrl+'"  width="50" height="50"/></a><div class="J-shoping-list-a"><p>'+goods[index].commodityName+'</p><p><span class="left">TDC51D+AZ</span><span class="right"><em>'+goods[index].price+'</em>元</span></p></div><div class="baseBg J-shoping-close"></div></div>');
											//添加商品到Cookie
											 var cards= card.getCookie("userCards"); 
											 var isExist=false;
											 if(typeof(cards) != "undefined" && cards != null && cards != ""){
												 cards=JSON.parse(cards);
												 var len=cards.length;
												 for(var i=0;i<len;i++){
													 isExist=false;
													 if(cards[i].commodityId==goodsId){
														 isExist=true;
														 break;
													 }
												 }
												 if(isExist){
													 cards[i].commodityNum+=1;
												 } else{
													 var good={commodityId:goodsId,commodityNum:1};
													 cards.push(good);
												 }
											 }else{
												 cards=[];
												 var good={commodityId:goodsId,commodityNum:1};
												 cards.push(good);
											 }				
											 card.addCookie("userCards",JSON.stringify(cards));					
										};
										$num.text(num+1);
									});
								});
							});	
						};
					};
				},
				clickOnTitle:function(e){
					e.stopPropagation();
					var length=$('.J-shoping-list').length;	
					if(length>0){
						if(!$shop.hasClass('J-shoping-small')){
							$body.slideToggle();	
						}else{
							$('.J-shoping-mx').hide();
							$('.J-shoping-px').show();
							$shop.animate({'width':289},100,function(){
								$shop.removeClass('J-shoping-small');
								$body.slideDown();
							});
						};
					};
				},
				slideBoxMini:function(){
					$('.J-shoping-px,.J-shoping-body').hide();
					$('.J-shoping-mx').show();
					$shop.animate({'width':119},100,function(){
						$shop.addClass('J-shoping-small');
					});	
				},
				removeList:function(e){
					e.stopPropagation();
					var $target=$(e.target),
						$parent=$target.parents('.J-shoping-list'),
						id=$parent.attr('data-id');
					var goodId=$parent.attr('good-id');
					var cardCook=new CardCookie(); 
					var cards=cardCook.getCookie("userCards");
					if(typeof(cards) != "undefined" && cards != null && cards != ""){
						 var c = new Array();
						 cards=JSON.parse(cards);
						 var len=cards.length;
						 for(var i=0;i<len;i++){
							if(cards[i].commodityId!=goodId){
								c.push(cards[i]);
							}
						 }			
						 cardCook.addCookie("userCards",JSON.stringify(c));
					}							
					$parent.addClass('J-shoping-list-remove').fadeOut(300,function(){
						$('#'+id).data('click',true).removeClass('dis-click');
						$parent.remove();
						S.hideBody();
						if(options&&options.callback){
							options.callback($(self));	
						};	
						
					});	
				},
				hideBody:function(){
					var length=$('.J-shoping-list').length;	
					$num.text(length);
					if(length==0){
						$('.J-shoping-px,.J-shoping-body').hide();
						$('.J-shoping-mx').show();
						$shop.animate({'width':119},100,function(){
							$shop.addClass('J-shoping-small');
						});	
					};
				}
			};
			S.init(); 
			
		}
		
	});	
})(jQuery);