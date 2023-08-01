//实现日期的中文化
var shortMonthNames_dds = [ "1月", "2月", "3月", "4月", "5月", "6月", "7月", "8月",
		"9月", "10月", "11月", "12月" ];
var shortDayNames_dds = [ "日", "一", "二", "三", "四", "五", "六" ];

var todayButtonTitle_dds = "今天";
var cancelButtonTitle_dds = "取消";
var applyButtonTitle_dds = "应用";

function repeat(str, count) {
	return str.repeat(count);
}

function checkIP(str) {
	reg = /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/;
	return reg.test(str);
}

function checkLoginName(username) {
	reg = /^[\u4E00-\u9FA5a-zA-Z0-9]{1}[\u4E00-\u9FA5a-zA-Z0-9_]{2,14}$/;
	return reg.test(username);
}

function checkMail(str) {
	reg = /^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+$/i;
	return reg.test(str);
}

function checkCellPhone(str) {
	reg = /^[0-9]{11}?$/;
	return reg.test(str);
}

function copyToClipboard(content) {
    var textarea = document.createElement("textarea");
    textarea.value = content;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand("copy");
    document.body.removeChild(textarea);
}

function getDocumentScrollArr() {
	var doc = document.documentElement, body = document.body;
	var scrollArr = new Array();
	x = doc.clientWidth;
	y = doc.clientHeight;
	scrollArr[0] = x;
	scrollArr[1] = y;
	return scrollArr;
}

function showImageDelay(imgObj, imgSrc, maxErrorNum) {
	if (maxErrorNum > 0) {
		imgObj.onerror = function() {
			showImageDelay(imgObj, imgSrc, maxErrorNum - 1);
		};
		setTimeout(function() {
			imgObj.src = imgSrc;
		}, 2000);
	} else {
		imgObj.onerror = null;
	}
}