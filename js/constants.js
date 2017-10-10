//var DEFAULT_HOST = '103.43.185.166:8066';
var DEFAULT_HOST = '218.246.86.126';

function getLocalStoreageHost() {
	var host = window.localStorage.getItem(SET_HOST);
	if(isNullStr(host)) {
		host = DEFAULT_HOST;
	}
	return host;
}

function getHost() {
	var host = getLocalStoreageHost();
	return 'http://' + host + '/MobileOffice/';
}

var SET_HOST = 'SET_HOST';

var TIMEOUT = 20000

var PAGE_SIZE = 20;
var MAX_PAGE_SIZE = 19860727;

// 下面是LocalStorage key
var TokenKey = "TokenKey";
var UserName = "UserName";

var SaveUserName = 'SaveUserName';
var SavePwd = 'SavePwd';

var CheckSavePwd = 'CheckSavePwd';
var CheckAutoLogin = 'CheckAutoLogin';

var VersionName = '1.9.3';
var VersionCode = '193';

var FIR_LINK = 'https://fir.im/73zr';