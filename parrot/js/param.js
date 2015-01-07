/***************************************************
		页面传递参数
***************************************************/
function param(){
	
	this.getValue=function(name){
		var str = window.location.search;
		if (str.indexOf(name) != -1) {
			var pos_start = str.indexOf(name) + name.length + 1;
			var pos_end = str.indexOf("&", pos_start);
			if (pos_end == -1) {
				return str.substring(pos_start);
			} else {
				return str.substring(pos_start, pos_end)
			}
		} else {
			return "没有这个name值";
		}
	}
	
}