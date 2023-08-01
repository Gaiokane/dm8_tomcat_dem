var ctrlKeyFlag = false;
function getSqlEditId(sqlEditName) {
	var edits = document.getElementsByName(sqlEditName);
	if (null == edits || edits.length != 1) {
		return "";
	}
	return edits[0].id;
}

function getElementByIdEx(elementId) {
	return document.getElementById(elementId);
}

function setSqlEditSelection(sqlEditGeneratorId, start, end) {
	var curCodeMirror = window
		.getCodeMirrorBySqlEditGeneratorId(sqlEditGeneratorId);
	if (curCodeMirror != null) {
		setCodeMirrorSelection(curCodeMirror, start, end);
	}
}

// 选中 select 通过字符串的坐标
function setCodeMirrorSelection(codeMirror, startIndex, endIndex) {
	var startPoint = getCodeMirrorPointByIndex(codeMirror, startIndex);
	var endPoint = getCodeMirrorPointByIndex(codeMirror, endIndex);
	codeMirror.extendSelection(startPoint, endPoint);
}

// 通过字符串的位置 转换成行和位置
// 可以两或多个个参数一起处理
function getCodeMirrorPointByIndex(codeMirror, index) {
	var point = new Object();
	var lineCount = codeMirror.lineCount();
	var i = 0;
	var lineLength = 0;
	for (; i < lineCount; i++) {
		lineLength = codeMirror.getLine(i).length;
		if (i != lineCount - 1) {
			lineLength = lineLength + 1;
		}

		if ((i != lineCount - 1) && index >= lineLength) {
			index = index - lineLength;
		} else {
			point.line = i;
			point.ch = index > lineLength ? lineLength : index;
			break;
		}
	}
	return point;
}

function addCodeMirrorChangeHandler(codeMirror) {
	CodeMirror.on(codeMirror, "change", codeMirrorChange);
}

function addCodeMirrorFocusHandler(codeMirror) {
	CodeMirror.on(codeMirror, "focus", codeMirrorFocus);
}

function addCodeMirrorGutterClickHandler(codeMirror) {
	codeMirror.on("gutterClick", function(cm, lineNum) {
		var info = cm.lineInfo(lineNum);
		if (info.gutterMarkers) {
			addOrRemoveBreakPoint(lineNum, true, $(
				info.gutterMarkers.breakpoints.firstChild).attr(
					"breakPointStatus"));
		} else {
			addOrRemoveBreakPoint(lineNum, false, "-1");
		}
	});
}

function addCodeMirrorCursorActivityHandler(codeMirror) {
	CodeMirror.on(codeMirror, "cursorActivity", codeMirrorCursorActivity);
}

function addLeftCodeMirrorCursorActivityHandler(codeMirror) {
	CodeMirror.on(codeMirror, "cursorActivity", leftCodeMirrorCursorActivity);
}

function addCodeMirrorMouseoverHandler(codeMirror) {
	$("div.CodeMirror-code").mouseover(function(e) {
		if (ctrlKeyFlag) {
			if (codeMirror.options.showSqlHyperlink) {
				showSqlHyperlink(codeMirror, e);
			}
		}
	});

	$("div.CodeMirror-code").mouseleave(function(e) {
		if (codeMirror) {
			setTimeout(function() {
				if (codeMirror.state.completionActive) {
					if (codeMirror.state.completionActive.options.focusOnHint) {
						return;
					}
					codeMirror.closeHint();
				}
			}, 200);
		}
	});
}

function getBpInfosForDebugPanel(codeMirror) {
	var lineCount = codeMirror.lineCount();
	var bpArr = new Array();

	var i = 0;
	for (; i < lineCount; i++) {
		var info = codeMirror.lineInfo(i);
		if (info.gutterMarkers) {
			var infoArr = new Array();
			infoArr[0] = i + "";
			infoArr[1] = $(info.gutterMarkers.breakpoints.firstChild).attr(
				"breakPointStatus")
			bpArr.push(infoArr);
		}
	}
	return bpArr;
}

// 快捷键注册
function fun_F5() {
	execF5();
}
function fun_F6() {
	execF6();
}
function fun_F7() {
	execF7();
}
function fun_F8() {
	execF8();
}
function fun_F9() {
	execF9();
}
function fun_F10() {
	execF10();
}
function fun_CtrlShiftS() {
	execCtrlShiftS();
}
function fun_CtrlShiftX() {
	execCtrlShiftX();
}
function fun_CtrlShiftM() {
	execCtrlShiftM();
}
function fun_CtrlShiftK() {
	execCtrlShiftK();
}
function fun_CtrlShiftF() {
	execCtrlShiftF();
}
function fun_Alt_Slash() {
	execAlt_Slash();
}
CodeMirror.keyMap.basic["F5"] = "fun_F5";
CodeMirror.keyMap.basic["F6"] = "fun_F6";
CodeMirror.keyMap.basic["F7"] = "fun_F7";
CodeMirror.keyMap.basic["F8"] = "fun_F8";
CodeMirror.keyMap.basic["F9"] = "fun_F9";
CodeMirror.keyMap.basic["F10"] = "fun_F10";
if (CodeMirror.mac) {
	CodeMirror.keyMap.basic["Shift-Cmd-S"] = "fun_CtrlShiftS";
	CodeMirror.keyMap.basic["Shift-Cmd-X"] = "fun_CtrlShiftX";
	CodeMirror.keyMap.basic["Shift-Cmd-M"] = "fun_CtrlShiftM";
	CodeMirror.keyMap.basic["Shift-Cmd-K"] = "fun_CtrlShiftK";
	CodeMirror.keyMap.basic["Shift-Cmd-F"] = "fun_CtrlShiftF";
} else {
	CodeMirror.keyMap.basic["Shift-Ctrl-S"] = "fun_CtrlShiftS";
	CodeMirror.keyMap.basic["Shift-Ctrl-X"] = "fun_CtrlShiftX";
	CodeMirror.keyMap.basic["Shift-Ctrl-M"] = "fun_CtrlShiftM";
	CodeMirror.keyMap.basic["Shift-Ctrl-K"] = "fun_CtrlShiftK";
	CodeMirror.keyMap.basic["Shift-Ctrl-F"] = "fun_CtrlShiftF";
	CodeMirror.keyMap.basic["Alt-/"] = "fun_Alt_Slash";
}
CodeMirror.commands.fun_F5 = fun_F5;
CodeMirror.commands.fun_F6 = fun_F6;
CodeMirror.commands.fun_F7 = fun_F7;
CodeMirror.commands.fun_F8 = fun_F8;
CodeMirror.commands.fun_F9 = fun_F9;
CodeMirror.commands.fun_F10 = fun_F10;
CodeMirror.commands.fun_CtrlShiftS = fun_CtrlShiftS;
CodeMirror.commands.fun_CtrlShiftX = fun_CtrlShiftX;
CodeMirror.commands.fun_CtrlShiftM = fun_CtrlShiftM;
CodeMirror.commands.fun_CtrlShiftK = fun_CtrlShiftK;
CodeMirror.commands.fun_CtrlShiftF = fun_CtrlShiftF;
CodeMirror.commands.fun_Alt_Slash = fun_Alt_Slash;

// 判断双引号个数
function getQuoteCount(str, quote) {
	var count = 0;
	var fromIndex = 0;
	while ((fromIndex = str.indexOf(quote, fromIndex)) != -1) {
		fromIndex++;
		count++;
	}
	return count;
};

// 判断是否是特殊字符 用于sql关键字或对象的截断
function isInvalidChar(text, offset) {
	var character = text[offset];
	if (character == ' ' || character == '\n' || character == '\t'
		|| character == '\r' || character == '(' || character == ')'
		|| character == ';' || character == ',') {
		var fCount = getQuoteCount(text.substring(0, offset), "\"");
		var bCount = getQuoteCount(text.substring(offset + 1), "\"");
		if (fCount % 2 == 0 || bCount % 2 == 0) {
			return true;
		}
	}
	return false;
};

// 获取 SqlHyperlink start index
function getPreReplacementOffset(text, offset) {
	var start = 0;
	if (text.length <= offset || isInvalidChar(text, offset)) {
		return offset;
	}
	for (var i = offset - 1; i >= 0; i--) {
		if (isInvalidChar(text, i)) {
			start = i + 1;
			break;
		}
	}
	return start;
};

// 获取 SqlHyperlink end index
function getAfterReplacementOffset(text, offset) {
	var end = text.length;
	for (var i = offset; i < text.length; i++) {
		if (isInvalidChar(text, i)) {
			end = i;
			break;
		}
	}
	return end;
};

function showSqlHyperlink(editor, e) {
	// console.log(editor);
	var cur = editor.posFromMouse(editor, e);
	var text = editor.getLine(cur.line);
	if (text != undefined && text.trim().length > 0) {
		var start = getPreReplacementOffset(text, cur.ch);
		var end = getAfterReplacementOffset(text, cur.ch);
		var subText = text.substring(start, end);
		// console.log(subText);
		if (subText != undefined && subText.trim().length > 0) {
			window.requestSqlHyperlink(subText, "" + cur.line, "" + start);
			return;
		}
	}
	if (editor) {
		editor.closeHint();
	}
};

$(document).keyup(function(event) {
	event = window.event || event;
	if (event.keyCode == 17) {
		closeSqlHyperlinkHint();
	}
});

$(document)
	.keydown(
		function(event) {
			event = window.event || event;
			ctrlKeyFlag = event.ctrlKey;
			if (event.keyCode == 116) {
				// 兼容IE
				event = window.event || event;
				event.keyCode = 0;
				return false; // 屏蔽F5刷新键
			} else if (event.keyCode == 8) {
				var ev = event || window.event;// 获取event对象
				var obj = ev.target || ev.srcElement;// 获取事件源

				var t = obj.type || obj.getAttribute('type');// 获取事件源类型

				// 获取作为判断条件的事件类型
				var vReadOnly = obj.getAttribute('readonly');
				var vEnabled = obj.getAttribute('enabled');
				// 处理null值情况
				vReadOnly = (vReadOnly == null) ? false : vReadOnly;
				vEnabled = (vEnabled == null) ? true : vEnabled;

				// 当敲Backspace键时，事件源类型为密码或单行、多行文本的，
				// 并且readonly属性为true或enabled属性为false的，则退格键失效
				var flag1 = (ev.keyCode == 8
					&& (t == "password" || t == "text" || t == "textarea") && (vReadOnly == true || vEnabled != true)) ? true
					: false;

				// 当敲Backspace键时，事件源类型非密码或单行、多行文本的，则退格键失效
				var flag2 = (ev.keyCode == 8 && t != "password"
					&& t != "text" && t != "textarea") ? true
					: false;

				// 判断
				if (flag2) {
					return false;
				}
				if (flag1) {
					return false;
				}
			}
		});
