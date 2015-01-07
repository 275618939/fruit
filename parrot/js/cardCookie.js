/***************************************************
		购物车Cookie操作
***************************************************/
function CardCookie(){
	this.duration=60 * 60 * 1000;	//cookies默认保存时间 60分钟
	this.weekTime=14*24*60*60*1000;	//cookies默认保存时间 14天
	this.addLongTimeCookie=function(name,value){
		 var exp  = new Date();
	     exp.setTime(exp.getTime() + this.weekTime);
	     document.cookie = name + "="+ escape(value) +";expires="+ exp.toGMTString();
	};
	this.addCookie=function(name,value){
		 var exp  = new Date();
	     //var duration=2 * 60 * 1000;
	     exp.setTime(exp.getTime() + this.duration);
	     document.cookie = name + "="+ escape(value) +";expires="+ exp.toGMTString();
	};
	this.getCookie=function(name){
		 var arr = document.cookie.match(new RegExp("(^| )"+name+"=([^;]*)(;|$)"));
	  	 if(arr != null) return unescape(arr[2]); return null;
	};
	//删除cookie
	this.delCookie=function(name){
		  var exp = new Date();
		  exp.setTime(exp.getTime() - 1);
		  var cval=this.getCookie(name);
		  if(cval!=null) document.cookie=name +"="+cval+";expires="+exp.toGMTString();
	}
}



      
