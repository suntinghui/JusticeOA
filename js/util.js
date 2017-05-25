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
	//	mui.plusReady(function() {
	//		plus.nativeUI.closeWaiting(); 
	//	});

	var desp = '未知异常,请重试';
	if(type == 'timeout') {
		desp = '网络请求超时,请重试';
	} else if(type == 'error') {
		desp = '请求出错,请稍候再试';
	} else if(type == 'abort') {
		desp = '请求失败,可能是网络问题或服务器故障';
	} else if(type == 'parsererror') {
		desp = '服务器返回数据异常,请重试';
	} else if(type == 'null') {
		desp = '服务器返回数据为空,请重试';
	}

	return desp;
}

function checkNetwork() {
	// 用没有网络时返回abort
	return;

	if(window.plus) {　　
		onNetChange();
	} else {　　
		document.addEventListener("netchange", onNetChange, false);
	}
}

// 如果返回真则说明有网络,否则没有网络
function onNetChange() {
	var nt = plus.networkinfo.getCurrentType();
	if(nt == plus.networkinfo.CONNECTION_UNKNOW || nt == plus.networkinfo.CONNECTION_NONE) {
		mui.toast("当前没有网络,请检查网络设置");
		return false;
	}

	return true;
}

function formatToType(format) {
	if(format == '.doc' || format == '.docx') {
		return 1;
	} else if(format == '.xls' || format == '.xlsx') {
		return 2;
	} else if(format == '.pdf') {
		return 3;
	} else if(format == '.html') {
		return 0;
	}

	return -1;
}

function getDocumentTypeImage(type) {
	var img = '../img/format_att.png';
	switch(type - 0) {
		case 0:
			img = '../img/format_html.png';
			break;

		case 1:
			img = '../img/format_word.png';
			break;

		case 2:
			img = '../img/format_excel.png';
			break;

		case 3:
			img = '../img/format_pdf.png';
			break;
	}

	return img;
}

/**
//获取当前网络类型
function onNetChange() {
	var nt = plus.networkinfo.getCurrentType();　　
	switch(nt) {　　　　
		case plus.networkinfo.CONNECTION_ETHERNET:
		case plus.networkinfo.CONNECTION_WIFI:
			mui.toast("当前网络为WiFi");
			break;

		case plus.networkinfo.CONNECTION_CELL2G:
		case plus.networkinfo.CONNECTION_CELL3G:
		case plus.networkinfo.CONNECTION_CELL4G:
			mui.toast("当前网络非WiFi");
			break;　　　　
		default:
			mui.toast("当前没有网络");
			break;　　
	}
}

**/