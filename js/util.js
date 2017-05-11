//判断输入字符串是否为空或者全部都是空格
function isNullStr(str) {
	if(str == "") return true;
	if(str == null) return true;
	if(str == undefined) return true;
	var regu = "^[ ]+$";
	var re = new RegExp(regu);
	return re.test(str);
}

//判断是否是手机号
function isPhoneNum(str) {　　
	var reg = /^0?1[3|4|5|8][0-9]\d{8}$/;　　
	if(reg.test(str)) {　　　　
		return true;　　
	} else {　　　　
		return false;　　
	};
}

function getHttpErrorDesp(type) {
	var desp = '未知异常,请重试';
	if(type == 'timeout') {
		desp = '网络请求超进,请重试';
	} else if(type == 'error') {
		desp = '请求出错,请稍候再试';
	} else if(type == 'abort') {
		desp = '请求被终止,请重试';
	} else if(type == 'parsererror') {
		desp = '服务器返回数据异常,请重试';
	} else if(type == 'null') {
		desp = '服务器返回数据为空,请重试';
	}

	return desp;
}