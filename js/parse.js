/**
  	   字符文本框=1,
       整数文本框=2,
       浮点数文本框=3,
       多行文本框=4,
       意见类型=5,
       下拉列表框=6,
       日期=7,
       时间=8,
       日期时间=9,
       单选人员=10,
       多选人员=11,
       单选部门=12,
       多选部门=13,
       关联字段=14,
       手写意见=15,
       图片=16,
       年月=17,
       连接=18,
       附件=19,
       从表=0,
       流水号=21,
       复选框=23 
 **/

function parseForm(Controls) {
	console.log('一共' + Controls.length + '个元素');

	var fragment = document.createDocumentFragment();
	for(var i = 0; i < Controls.length; i++) {
		var item = Controls[i];

		switch(item.ControlType - 0) {

			case 1: // 单行文本框
				fragment.appendChild(createSingleText(item));
				break;

			case 2: // 整数文本框
				fragment.appendChild(createIntText(item));
				break;

			case 3: //浮点数文本框 
				fragment.appendChild(createFloatText(item));
				break;

			case 4: // 多行文本框
				fragment.appendChild(createMultiLineText(item));
				break;

			case 5: //意见类型
				fragment.appendChild(createOpinionControl(item));
				break;

			case 6: // 下拉列表框
				fragment.appendChild(createComboBox(item));
				break;

			case 7: // 日期
			case 8: // 时间
			case 9: // 日期时间
			case 17: // 年月
				fragment.appendChild(createDateType(item.ControlType - 0, item));
				break;

			case 10: // 单选人员
				fragment.appendChild(createRadioPerson(item));
				break;

			case 11: //  多选人员
				fragment.appendChild(createMultiPerson(item));
				break;

			case 12: // 单选部门
				fragment.appendChild(createRadioDep(item));
				break;

			case 13: // 多选部门
				fragment.appendChild(createMultiDep(item));
				break;

			case 23: // 复选框
				fragment.appendChild(createCheckBoxList(item));
				break;

			default:
				console.log('未解析类型:' + item.ControlType + '--' + item.CaptionName);
				break;
		}
	}

	return fragment;
}

// 1
function createSingleText(Control) {
	var div = document.createElement('div');
	div.className = "item-div";

	var namediv = document.createElement('div');
	namediv.className = "item-name";
	namediv.innerHTML = Control.CaptionName;
	div.appendChild(namediv);

	var valuediv = document.createElement('div');
	valuediv.className = 'item-value';

	var textarea = document.createElement('textarea');
	textarea.value = Control.Value;
	textarea.rows = Math.ceil(textarea.value.length / 10);
	textarea.maxLength = Control.Length;
	editModel(textarea, Control.EditModel);

	valuediv.appendChild(textarea);
	div.appendChild(valuediv);

	return div;
}

// 2
function createIntText(Control) {
	var div = document.createElement('div');
	div.className = "item-div";

	var namediv = document.createElement('div');
	namediv.className = "item-name";
	namediv.innerHTML = Control.CaptionName;
	div.appendChild(namediv);

	var valuediv = document.createElement('div');
	valuediv.className = 'item-value';

	var input = document.createElement('input');
	input.value = Control.Value;
	input.type = "text";
	input.pattern = "[0-9]\*";
	editModel(input, Control.EditModel);

	valuediv.appendChild(input);
	div.appendChild(valuediv);

	return div;
}

// 3
function createFloatText(Control) {
	var div = document.createElement('div');
	div.className = "item-div";

	var namediv = document.createElement('div');
	namediv.className = "item-name";
	namediv.innerHTML = Control.CaptionName;
	div.appendChild(namediv);

	var valuediv = document.createElement('div');
	valuediv.className = 'item-value';

	var input = document.createElement('input');
	input.value = Control.Value;
	input.type = "text";
	input.pattern = "^-?([1-9]/d*/./d*|0/./d*[1-9]/d*|0?/.0+|0)$";
	editModel(input, Control.EditModel);

	valuediv.appendChild(input);
	div.appendChild(valuediv);

	return div;
}
// 4
function createMultiLineText(Control) {
	var div = document.createElement('div');
	div.className = "item-div";

	var namediv = document.createElement('div');
	namediv.className = "item-name";
	namediv.innerHTML = Control.CaptionName;
	div.appendChild(namediv);

	var valuediv = document.createElement('div');
	valuediv.className = 'item-value';

	var textarea = document.createElement('textarea');
	textarea.value = Control.Value;
	editModel(textarea, Control.EditModel);

	valuediv.appendChild(textarea);
	div.appendChild(valuediv);

	return div;
}

// 5
function createOpinionControl(Control) {
	var div = document.createElement('div');
	div.className = "item-div";

	var namediv = document.createElement('div');
	namediv.className = "item-name";
	namediv.innerHTML = Control.CaptionName;
	div.appendChild(namediv);

	var valuediv = document.createElement('div');
	valuediv.className = 'item-value';

	var textarea = document.createElement('textarea');
	textarea.value = Control.HistoryValue;
	editModel(textarea, Control.EditModel);
	if(isNullStr(Control.HistoryValue)) {
		textarea.rows = 1;
	} else {
		var rows = Math.ceil(textarea.value.length / 10);
		rows += textarea.value.split("\n").length;
		textarea.rows = rows;
	}

	valuediv.appendChild(textarea);
	div.appendChild(valuediv);

	return div;
}

// 6
function createComboBox(Control) {
	var div = document.createElement('div');
	div.className = "item-div mui-table-view-cell";

	var namediv = document.createElement('div');
	namediv.className = "item-name";
	namediv.innerHTML = Control.CaptionName;
	div.appendChild(namediv);

	var valuediv = document.createElement('div');
	valuediv.id = Control.DataField;

	if(Control.EditModel == '0') {
		valuediv.className = 'item-value mui-table';
		valuediv.removeEventListener('tap', function() {
			event06(null);
		}, false);
	} else {
		valuediv.className = 'item-value mui-table mui-navigate-right';
		valuediv.addEventListener('tap', function() {
			event06(Control);
		}, false);
	}

	var selectedOption = getDefaultValue06(Control.Options);
	if(selectedOption != null) {
		valuediv.innerHTML = selectedOption.Text;
		valuediv.selectedOption = selectedOption;
	}
	div.appendChild(valuediv);

	return div;
}

// 7 8 9 17
function createDateType(type, Control) {
	var div = document.createElement('div');
	div.className = "item-div mui-table-view-cell";

	var namediv = document.createElement('div');
	namediv.className = "item-name";
	namediv.innerHTML = Control.CaptionName;
	div.appendChild(namediv);

	var valuediv = document.createElement('div');
	valuediv.id = Control.DataField;
	if(Control.EditModel == '0') {
		valuediv.className = 'item-value';
		valuediv.removeEventListener('tap', function() {
			if(type == 7) {
				event07(null);
			} else if(type == 8) {
				event08(null);
			} else if(type == 9) {
				event09(null);
			} else if(type == 17) {
				event17(null);
			}

		}, false);
	} else {
		valuediv.className = 'item-value mui-table mui-navigate-right';
		valuediv.addEventListener('tap', function() {
			if(type == 7) {
				event07(Control);
			} else if(type == 8) {
				event08(Control);
			} else if(type == 9) {
				event09(Control);
			} else if(type == 17) {
				event17(Control);
			}
		}, false);
	}

	valuediv.innerHTML = Control.Value;
	div.appendChild(valuediv);

	return div;
}

// 10
function createRadioPerson(Control) {
	var div = document.createElement('div');
	div.className = "item-div mui-table-view-cell";

	var namediv = document.createElement('div');
	namediv.className = "item-name";
	namediv.innerHTML = Control.CaptionName;
	div.appendChild(namediv);

	var valuediv = document.createElement('div');
	if(Control.EditModel == '0') {
		valuediv.className = 'item-value';
		valuediv.removeEventListener('tap', function() {
			event10(0);
		}, false);
	} else {
		valuediv.className = 'item-value mui-table mui-navigate-right';
		valuediv.addEventListener('tap', function() {
			event10(Control.SelectedUsers[0].UserId)
		}, false);
	}

	if(!isNullStr(Control.SelectedUsers) && Control.SelectedUsers.length != 0) {
		valuediv.innerHTML = Control.SelectedUsers[0].UserName;
		valuediv.id = Control.SelectedUsers[0].UserId;
	}
	div.appendChild(valuediv);

	return div;
}

// 11
function createMultiPerson(Control) {
	var div = document.createElement('div');
	div.className = "item-div mui-table-view-cell";

	var namediv = document.createElement('div');
	namediv.className = "item-name";
	namediv.innerHTML = Control.CaptionName;
	div.appendChild(namediv);

	var valuediv = document.createElement('div');
	if(Control.EditModel == '0') {
		valuediv.className = 'item-value';
		valuediv.removeEventListener('tap', function() {
			event11(0);
		}, false);
	} else {
		valuediv.className = 'item-value mui-table mui-navigate-right';
		valuediv.addEventListener('tap', function() {
			event11(Control.SelectedUsers[0].UserId)
		}, false);
	}

	if(!isNullStr(Control.SelectedUsers) && Control.SelectedUsers.length != 0) {
		valuediv.innerHTML = Control.SelectedUsers[0].UserName;
		valuediv.id = Control.SelectedUsers[0].UserId;
	}
	div.appendChild(valuediv);

	return div;
}

// 12
function createRadioDep(Control) {
	var div = document.createElement('div');
	div.className = "item-div mui-table-view-cell";

	var namediv = document.createElement('div');
	namediv.className = "item-name";
	namediv.innerHTML = Control.CaptionName;
	div.appendChild(namediv);

	var valuediv = document.createElement('div');
	if(Control.EditModel == '0') {
		valuediv.className = 'item-value';
		valuediv.removeEventListener('tap', function() {
			event12(0);
		}, false);
	} else {
		valuediv.className = 'item-value mui-table mui-navigate-right';
		valuediv.addEventListener('tap', function() {
			event12(Control.SelectedDeps[0].DepId)
		}, false);
	}

	if(Control.SelectedDeps.length != 0) {
		valuediv.innerHTML = Control.SelectedDeps[0].DepName;
		valuediv.id = Control.SelectedDeps[0].DepId;
	}
	div.appendChild(valuediv);

	return div;
}

// 13
function createMultiDep(Control) {
	var div = document.createElement('div');
	div.className = "item-div";

	var namediv = document.createElement('div');
	namediv.className = "item-name";
	namediv.innerHTML = Control.CaptionName;
	div.appendChild(namediv);

	var valuediv = document.createElement('div');
	valuediv.className = 'item-value';	
	// TODO 这表示的都是选中的
	for(var i = 0; i < Control.SelectedDeps.length; i++) {
		var temp = Control.SelectedDeps[i];
		var tempdiv = document.createElement('div');
		tempdiv.className = "mui-input-row mui-checkbox mui-left checkbox";
		tempdiv.innerHTML = '<label>' + temp.DepName + '</label><input name="' + Control.DataField + '" value="' + temp.DepId + '" type="checkbox" > ';
		valuediv.appendChild(tempdiv);
	}
	div.appendChild(valuediv);

	return div;
}

// 23
function createCheckBoxList(Control) {
	var div = document.createElement('div');
	div.className = "item-div";

	var namediv = document.createElement('div');
	namediv.className = "item-name";
	namediv.innerHTML = Control.CaptionName;
	div.appendChild(namediv);

	var valuediv = document.createElement('div');
	valuediv.className = 'item-value';
	for(var i = 0; i < Control.Options.length; i++) {
		var temp = Control.Options[i];
		var tempdiv = document.createElement('div');
		tempdiv.className = "mui-input-row mui-checkbox mui-left checkbox";
		tempdiv.innerHTML = '<label>' + temp.Text + '</label><input name="' + Control.DataField + '" value="' + temp.Value + '" type="checkbox" ' + (temp.Selected ? "checked" : "") + ' > ';
		valuediv.appendChild(tempdiv);
	}
	div.appendChild(valuediv);

	return div;
}

/**************************************/

function getDefaultValue06(Options) {
	for(var i = 0; i < Options.length; i++) {
		if(Options[i].Selected == true) {
			return Options[i];
		}
	}

	return null;
}

/**************************************/

function event06(Control) {
	var valuediv = document.getElementById(Control.DataField);

	var data = new Array();
	for(var i = 0; i < Control.Options.length; i++) {
		var item = Control.Options[i];
		data[i] = {
			value: item.Value,
			text: item.Text
		};
	}

	var userPicker = new mui.PopPicker();
	userPicker.setData(data);
	userPicker.pickers[0].setSelectedValue(valuediv.selectedOption.Value, 1000);
	userPicker.show(function(selectItems) {
		valuediv.selectedOption = {
			Value: selectItems[0].value,
			Text: selectItems[0].text
		};
		valuediv.innerHTML = selectItems[0].text;
	});
}

function event07(Control) {
	var picker = new mui.DtPicker(JSON.parse('{"type":"date"}'));
	picker.show(function(selectItems) {
		document.getElementById(Control.DataField).innerHTML = selectItems.text;
		picker.dispose();
	});
}

function event08(Control) {
	var picker = new mui.DtPicker(JSON.parse('{"type":"time"}'));
	picker.show(function(selectItems) {
		document.getElementById(Control.DataField).innerHTML = selectItems.text;
		picker.dispose();
	});
}

function event09(Control) {
	var picker = new mui.DtPicker(JSON.parse('{}'));
	picker.show(function(selectItems) {
		document.getElementById(Control.DataField).innerHTML = selectItems.text;
		picker.dispose();
	});
}

function event10(selectedId) {
	mui.openWindow({
		url: 'userlist.html',
		id: Math.random(),
		preload: true,
		show: {
			aniShow: 'pop-in'
		},
		extras: {
			selectedId: selectedId
		}
	});
}

function event11(selectedId) {
	mui.openWindow({
		url: 'userlist.html',
		id: Math.random(),
		preload: true,
		show: {
			aniShow: 'pop-in'
		},
		extras: {
			selectedId: selectedId
		}
	});
}

function event12(selectedId) {

}

function event17(Control) {
	var picker = new mui.DtPicker(JSON.parse('{"type":"month"}'));
	picker.show(function(selectItems) {
		document.getElementById(Control.DataField).innerHTML = selectItems.text;
		picker.dispose();
	});
}

/**
显示只读=0,
显示可更新=1,
显示可更新必填=2,
不显示用默认值更新=3,
显示用默认值更新=4
**/
function editModel(control, editmodel) {
	switch(editmodel - 0) {
		case 0:
			control.style.visibility = 'visible';
			control.style.border = 'hidden';
			control.readOnly = true;
			break;

		case 1:
			control.style.visibility = 'visible';
			control.readOnly = false;
			break;

		case 2:
			control.style.visibility = 'visible';
			control.readOnly = false;
			control.required = true;
			break;

		case 3:
			control.style.visibility = 'hidden';
			control.readOnly = false;
			break;

		case 4:
			control.style.visibility = 'visible';
			control.readOnly = false;
			break;
	}

}