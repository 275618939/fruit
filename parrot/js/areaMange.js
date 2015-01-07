/***************************************************
		服务站信息
***************************************************/
function area(parentId,areaid,name){
	this.parentId=parentId;			//父服务站ID
	this.areaid=areaid;    			//服务站ID
	this.name=name;					//服务站名称
	this.getName=function(){
		return this.name;
	};
	this.getAreaId=function(){
		return this.areaid;
	}
	this.getParentId=function(){
		return this.parentId;
	}
}
      
