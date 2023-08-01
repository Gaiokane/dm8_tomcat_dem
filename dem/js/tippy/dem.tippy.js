function showTippy(divId, divTop, divLeft, divWidth, divHeight, content, option) {
	var divObj = document.getElementById(divId);
	if (!divObj) {
		var divHtml = '<div id="divId"><div>';
	}
	divObj = document.getElementById(divId);
	('#' + divId).css({
		position : "absolute",
		top : divTop,
		left : divLeft,
		width : divWidth,
		height : divHeight,
	});
	tippy(divObj);
	var intance = divObj._tippy;
}