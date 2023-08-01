function showHistory(url) {
	ajaxGet(url, historyCallBack);
}

function historyCallBack(responseText) {
	document.getElementById("timeline").innerHTML = responseText;
	$().timelinr({
		autoPlay : 'false',
		autoPlayDirection : 'forward'
	})
}

function ajaxGet(url, callback) {
	var httpRequest = createRequest();
	if (!httpRequest) {
		alert(false);
		return false;
	}

	httpRequest.onreadystatechange = function() {
		internalResponse(httpRequest, callback);
	};
	httpRequest.open("GET", url, true);
	httpRequest.send(null);
}

function ajaxPost(url, params, callback) {
	var httpRequest = createRequest();
	if (!httpRequest) {
		return false;
	}

	httpRequest.onreadystatechange = function() {
		internalResponse(httpRequest, callback);
	};
	httpRequest.open("POST", url, true);
	httpRequest.setRequestHeader("Content-Type",
			"application/x-www-form-urlencoded");
	httpRequest.send(params);
}

function internalResponse(httpRequest, callback) {
	if (httpRequest.readyState == 4) {
		if (httpRequest.status == 200) {
			if (callback) {
				callback(httpRequest.responseText);
			}
		}
	}
}

function createRequest() {
	var httpRequest = false;

	try {
		// Firefox, Opera 8.0+, Safari
		httpRequest = new XMLHttpRequest();
	} catch (trymicrosoft) {
		// IE
		try {
			httpRequest = new ActiveXObject("Msxml2.XMLHTTP");
		} catch (othermicrosoft) {
			try {
				httpRequest = new ActiveXObject("Microsoft.XMLHTTP");
			} catch (failed) {
				httpRequest = false;
			}
		}
	}

	if (!httpRequest) {
		alert("您的浏览器不支持AJAX!");
		return false;
	}

	return httpRequest;
}