
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

// 返回事件
function backAction() {
	var first = null;
	plus.key.addEventListener('backbutton', function() {　　 //首次按键，提示‘再按一次退出应用’  
		if(!first) {　　　　
			first = new Date().getTime();　　　　
			mui.toast('再按一次退出应用');　　　　
			setTimeout(function() {　　　　　　
				first = null;　　　　　
			}, 2000);　　
		} else {　　　　
			if(new Date().getTime() - first < 2000) {　　　　　　
				plus.runtime.quit();　　　　
			}　　
		}

	}, false);
}