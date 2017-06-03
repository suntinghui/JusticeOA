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
       ╳关联字段=14, 
       ╳手写意见=15,
       ╳图片=16,
       年月=17,
       ╳连接=18,
       ╳附件=19,
       ╳从表=0,
       ╳流水号=21,
       复选框=23 
 **/
/**
显示只读=0,
显示可更新=1,
显示可更新必填=2,
不显示用默认值更新=3,
显示用默认值更新=4
**/

function parseForm(Controls) {
	console.log('一共' + Controls.length + '个元素');

	var fragment = document.createDocumentFragment();
	for(var i = 0; i < Controls.length; i++) {
		var item = Controls[i];

		if(item.EditModel == '3') {
			console.log('不可见元素：' + item.CaptionName + '，不进行解析。');
			continue;
		}

		switch(item.ControlType - 0) {

			case 1: // 字符文本框
			case 2: // 整数文本框
			case 3: // 浮点数文本框 
			case 4: // 多行文本框
				fragment.appendChild(createTextarea(item));
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

/**
 对于可编辑字段的处理思路：
 
 不显示用默认值更新=3，不进行解析，取值时直接取值。
 显示只读=0, 
显示可更新=1,  显示用默认值更新=4  显示可更新必填=2且循环遍历检查

**/

/* 1 单行文本框
   单行文本框的处理是可编辑模式下为文本框，在不可编辑模式为div
   
   2 整数文本框
   
   3 浮点数文本框 
   
   4 多行文本框
   
 */
function createTextarea(Control) {
	var div = createDiv("item-div");

	div.appendChild(createNameDiv(Control.CaptionName));

	var valuediv = createDiv("item-value");

	if(Control.EditModel == '0') {
		var textdiv = createTextDiv(Control.Value, Control.EditModel);
		textdiv.id = Control.DataField;
		valuediv.appendChild(textdiv);

	} else {
		var textarea = document.createElement('textarea');
		textarea.id = Control.DataField;
		textarea.value = Control.Value;
		if(Control.ControlType == '4') {
			textarea.rows = 4;
		} else {
			textarea.rows = 1;
		}

		textarea.maxLength = Control.Length;
		valuediv.appendChild(textarea);
	}
	div.appendChild(valuediv);

	return div;
}

/* 
 5 意见类型
 在只读状态下，只显示历史意见
 
 在可编辑模式下需要显示历史意见，可输入框及常用意见按纽
 */
function createOpinionControl(Control) {
	var div = createDiv("item-div");

	div.appendChild(createNameDiv(Control.CaptionName));

	var valuediv = createDiv("item-value");

	// 历史意见
	var textdiv = createTextDiv(Control.HistoryValue, Control.EditModel);
	valuediv.appendChild(textdiv);

	// 意见
	var textarea = document.createElement('textarea');
	textarea.id = Control.DataField;
	textarea.value = Control.Value;
	textarea.rows = 2;
	valuediv.appendChild(textarea);

	// 常用意见
	var button = document.createElement('button');
	button.innerHTML = '请选择常用意见';
	button.className = 'mui-btn mui-btn-primary mui-btn-outlined';
	button.style.marginTop = '5px'
	button.addEventListener('tap', function() {
		event05(textarea, Control);
	}, false);
	valuediv.appendChild(button);

	if(Control.EditModel == '0') {
		button.style.display = 'none';
		textarea.style.display = 'none';
	} else {
		textdiv.style.marginBottom = '10px';
	}

	div.appendChild(valuediv);

	return div;
}

/*
 * 6 下拉列表框
 */
function createComboBox(Control) {
	var div = createDiv("item-div mui-table-view-cell");

	div.appendChild(createNameDiv(Control.CaptionName));

	var valuediv = createDiv("item-value");
	valuediv.id = Control.DataField;
	valuediv.value = '';

	// 设置默认值 
	var selectedOption = getDefaultValue06(Control.Options);
	if(selectedOption != null) {
		valuediv.innerHTML = selectedOption.Text;
		valuediv.value = selectedOption.Value;
		valuediv.selectedOption = selectedOption;
	}

	if(Control.EditModel == '0') {
		valuediv.className = 'item-value mui-table';
		valuediv.removeEventListener('tap', function() {
			event06(null, null);
		}, false);
	} else {
		valuediv.className = 'item-value mui-table mui-navigate-right';
		valuediv.addEventListener('tap', function() {
			event06(valuediv, Control);
		}, false);
	}

	div.appendChild(valuediv);

	return div;
}

/* 
 * 7 8 9 17
 * 注意DateFormat类型必须为yyyy-MM-dd HH:mm  MM-dd
 */
function createDateType(type, Control) {
	var div = createDiv("item-div mui-table-view-cell");

	div.appendChild(createNameDiv(Control.CaptionName));

	var valuediv = createDiv("item-value");
	valuediv.id = Control.DataField;
	valuediv.value = Control.Value;

	if(Control.EditModel == '0') {
		valuediv.className = 'item-value';
		valuediv.removeEventListener('tap', function() {
			if(type == 7) {
				event07(null, null);
			} else if(type == 8) {
				event08(null, null);
			} else if(type == 9) {
				event09(null, null);
			} else if(type == 17) {
				event17(null, null);
			}

		}, false);
	} else {
		valuediv.className = 'item-value mui-table mui-navigate-right';
		valuediv.addEventListener('tap', function() {
			if(type == 7) {
				event07(valuediv, Control);
			} else if(type == 8) {
				event08(valuediv, Control);
			} else if(type == 9) {
				event09(valuediv, Control);
			} else if(type == 17) {
				event17(valuediv, Control);
			}
		}, false);
	}

	valuediv.innerHTML = Control.Value;
	div.appendChild(valuediv);

	return div;
}

/* 
 * 10  单选人员
 * 
 * 如果DataSource不为null，则从DataSource中取值,并以复选框的形式展现，
 * 如果DataSource为null，则从人员列表 userlist.html 中取值。
 * 
 */
function createRadioPerson(Control) {
	var div = createDiv("item-div mui-table-view-cell");

	div.appendChild(createNameDiv(Control.CaptionName));

	var valuediv = createDiv("item-value");
	valuediv.id = Control.DataField;

	if(Control.EditModel == '0') {
		// 如果是不可编辑状态，则直接取已选中的默认值
		if(!isNullStr(Control.SelectedUsers) && Control.SelectedUsers.length != 0) {
			// TODO 无
			valuediv.innerHTML = Control.SelectedUsers[0].UserName;
			valuediv.value = Control.SelectedUsers[0].UserId;
		}

		valuediv.className = 'item-value';
		valuediv.removeEventListener('tap', function() {
			event10(null, null);
		}, false);

	} else {
		// 如果是可编辑状态，则区分是userlist取值还是通过datasource取值。
		if(isNullStr(Control.DataSource)) {
			// from userlist.html
			valuediv.className = 'item-value mui-table mui-navigate-right';
			valuediv.addEventListener('tap', function() {
				event10(valuediv, Control);
			}, false);

		} else {
			var selectedIdArrs = new Array();
			for(var i = 0; i < Control.SelectedUsers.length; i++) {
				selectedIdArrs.push(Control.SelectedUsers[i].UserId);
			}

			// 单选
			for(var i = 0; i < Control.DataSource.length; i++) {
				var temp = Control.DataSource[i];
				var tempdiv = document.createElement('div');
				tempdiv.className = "mui-input-row mui-radio mui-left";

				var checked = (contains(selectedIdArrs, temp.UserId) ? ' checked ' : ' ');
				tempdiv.innerHTML = '<label>' + temp.UserName + '</label><input name="' + Control.DataField + '" value="' + temp.UserId + '" type="radio" ' + checked + ' > ';
				valuediv.appendChild(tempdiv);
			}
		}
	}

	div.appendChild(valuediv);

	return div;
}

/*
 * 11 多选人员
 */
function createMultiPerson(Control) {
	var div = createDiv("item-div mui-table-view-cell");

	div.appendChild(createNameDiv(Control.CaptionName));

	var valuediv = createDiv("item-value");
	valuediv.id = Control.DataField;

	if(Control.EditModel == '0') {
		// 如果是不可编辑状态，则直接取已选中的默认值
		if(!isNullStr(Control.SelectedUsers) && Control.SelectedUsers.length != 0) {
			var arrName = new Array();
			var arrId = new Array();
			for(var i = 0; i < Control.SelectedUsers.length; i++) {
				arrName.push(Control.SelectedUsers[i].UserName);
				arrId.push(Control.SelectedUsers[i].UserId);
			}
			valuediv.innerHTML = arrName;
			valuediv.value = arrId;
		}

		valuediv.className = 'item-value';
		valuediv.removeEventListener('tap', function() {
			event11(null, null);
		}, false);

	} else {
		// 如果是可编辑状态，则区分是userlist取值还是通过datasource取值。
		if(isNullStr(Control.DataSource)) {
			// from userlist.html
			valuediv.className = 'item-value mui-table mui-navigate-right';
			valuediv.addEventListener('tap', function() {
				event11(valuediv, Control);
			}, false);

		} else {
			var selectedIdArrs = new Array();
			for(var i = 0; i < Control.SelectedUsers.length; i++) {
				selectedIdArrs.push(Control.SelectedUsers[i].UserId);
			}

			// 多选
			for(var i = 0; i < Control.DataSource.length; i++) {
				var temp = Control.DataSource[i];
				var tempdiv = document.createElement('div');
				tempdiv.className = "mui-input-row mui-checkbox mui-left";

				var checked = (contains(selectedIdArrs, temp.UserId) ? ' checked ' : ' ');
				tempdiv.innerHTML = '<label>' + temp.UserName + '</label><input name="' + Control.DataField + '" value="' + temp.UserId + '" type="checkbox" ' + checked + ' > ';
				valuediv.appendChild(tempdiv);
			}
		}
	}

	div.appendChild(valuediv);

	return div;
}

// 12
function createRadioDep(Control) {
	var div = createDiv("item-div mui-table-view-cell");

	div.appendChild(createNameDiv(Control.CaptionName));

	var valuediv = createDiv("item-value");
	valuediv.id = Control.DataField;

	if(Control.EditModel == '0') {
		// 如果是不可编辑状态，则直接取已选中的默认值
		if(!isNullStr(Control.SelectedDeps) && Control.SelectedDeps.length != 0) {
			// TODO 无
			valuediv.innerHTML = Control.SelectedDeps[0].DepName;
			valuediv.value = Control.SelectedDeps[0].DepId;
		}

		valuediv.className = 'item-value';
		valuediv.removeEventListener('tap', function() {
			event12(null, null);
		}, false);

	} else {
		// 如果是可编辑状态，则区分是deptlist取值还是通过datasource取值。
		if(isNullStr(Control.DataSource)) {
			// from deptlist.html
			valuediv.className = 'item-value mui-table mui-navigate-right';
			valuediv.addEventListener('tap', function() {
				event12(valuediv, Control);
			}, false);

		} else {
			var selectedIdArrs = new Array();
			for(var i = 0; i < Control.SelectedDeps.length; i++) {
				selectedIdArrs.push(Control.SelectedDeps[i].DepId);
			}

			// 单选
			for(var i = 0; i < Control.DataSource.length; i++) {
				var temp = Control.DataSource[i];
				var tempdiv = document.createElement('div');
				tempdiv.className = "mui-input-row mui-radio mui-left";

				var checked = (contains(selectedIdArrs, temp.DepId) ? ' checked ' : ' ');
				tempdiv.innerHTML = '<label>' + temp.DepName + '</label><input name="' + Control.DataField + '" value="' + temp.DepId + '" type="radio" ' + checked + ' > ';
				valuediv.appendChild(tempdiv);
			}
		}
	}

	div.appendChild(valuediv);

	return div;
}

// 13
function createMultiDep(Control) {
	var div = createDiv("item-div mui-table-view-cell");

	div.appendChild(createNameDiv(Control.CaptionName));

	var valuediv = createDiv("item-value");
	valuediv.id = Control.DataField;

	if(Control.EditModel == '0') {
		// 如果是不可编辑状态，则直接取已选中的默认值
		if(!isNullStr(Control.SelectedDeps) && Control.SelectedDeps.length != 0) {
			var arrName = new Array();
			var arrId = new Array();
			for(var i = 0; i < Control.SelectedDeps.length; i++) {
				arrName.push(Control.SelectedDeps[i].DepName);
				arrId.push(Control.SelectedDeps[i].DepId);
			}
			valuediv.innerHTML = arrName;
			valuediv.value = arrId;
		}

		valuediv.className = 'item-value';
		valuediv.removeEventListener('tap', function() {
			event13(null, null);
		}, false);

	} else {
		// 如果是可编辑状态，则区分是deptlist取值还是通过datasource取值。
		if(isNullStr(Control.DataSource)) {
			// from userlist.html
			valuediv.className = 'item-value mui-table mui-navigate-right';
			valuediv.addEventListener('tap', function() {
				event13(valuediv, Control);
			}, false);

		} else {
			var selectedIdArrs = new Array();
			for(var i = 0; i < Control.SelectedDeps.length; i++) {
				selectedIdArrs.push(Control.SelectedDeps[i].DepId);
			}

			// 多选
			for(var i = 0; i < Control.DataSource.length; i++) {
				var temp = Control.DataSource[i];
				var tempdiv = document.createElement('div');
				tempdiv.className = "mui-input-row mui-checkbox mui-left";

				var checked = (contains(selectedIdArrs, temp.DepId) ? ' checked ' : ' ');
				tempdiv.innerHTML = '<label>' + temp.DepName + '</label><input name="' + Control.DataField + '" value="' + temp.DepId + '" type="checkbox" ' + checked + ' > ';
				valuediv.appendChild(tempdiv);
			}
		}
	}

	div.appendChild(valuediv);

	return div;
}

/* 
 * 23 复选框
 */
function createCheckBoxList(Control) {
	var div = createDiv("item-div");

	div.appendChild(createNameDiv(Control.CaptionName));

	var valuediv = createDiv("item-value");
	valuediv.id = Control.DataField;

	// 不可编辑模式下，查找已选择的数据
	if(Control.EditModel == '0') {
		var text = '';
		var value = '';
		for(var i = 0; i < Control.Options.length; i++) {
			var item = Control.Options[i];
			if(item.Selected) {
				text += (item.Text + '</br>');
				value += (item.Value + Control.SplitStr);
			}
		}

		if(value.length > 0) {
			value = value.substring(0, value.length - 1);
		}

		valuediv.innerHTML = text;
		valuediv.value = value;

	} else {
		for(var i = 0; i < Control.Options.length; i++) {
			var temp = Control.Options[i];
			var tempdiv = document.createElement('div');
			tempdiv.className = "mui-input-row mui-checkbox mui-left checkbox";
			tempdiv.innerHTML = '<label>' + temp.Text + '</label><input name="' + Control.DataField + '" value="' + temp.Value + '" type="checkbox" ' + (temp.Selected ? "checked" : "") + ' > ';
			valuediv.appendChild(tempdiv);
		}
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

function event05(textarea, Control) {
	var data = new Array();
	for(var i = 0; i < Control.ComOpinions.length; i++) {
		var item = Control.ComOpinions[i];
		data.push({
			value: item.OpinionId,
			text: item.OpinionText
		});
	}

	var userPicker = new mui.PopPicker();
	userPicker.setData(data);
	userPicker.show(function(selectItems) {
		textarea.value += selectItems[0].text;
	});
}

function event06(valuediv, Control) {
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
		valuediv.value = selectItems[0].value;
	});
}

function event07(valuediv, Control) {
	var picker = new mui.DtPicker(JSON.parse('{"type":"date"}'));
	picker.show(function(selectItems) {
		valuediv.innerHTML = selectItems.text;
		valuediv.value = selectItems.value;
		picker.dispose();
	});
}

function event08(valuediv, Control) {
	var picker = new mui.DtPicker(JSON.parse('{"type":"time"}'));
	picker.show(function(selectItems) {
		valuediv.innerHTML = selectItems.text;
		valuediv.value = selectItems.value;
		picker.dispose();
	});
}

function event09(valuediv, Control) {
	var picker = new mui.DtPicker(JSON.parse('{}'));
	picker.show(function(selectItems) {
		valuediv.innerHTML = selectItems.text;
		valuediv.value = selectItems.value;
		picker.dispose();
	});
}

function event10(valuediv, Control) {
	mui.plusReady(function() {
		var prePage = plus.webview.currentWebview();

		mui.openWindow({
			url: 'userlist.html',
			id: Math.random(),
			preload: true,
			show: {
				aniShow: 'pop-in'
			},
			extras: {
				selectedUsers: Control.SelectedUsers,
				radioType: true,
				firevent: 'event10',
				webviewId: prePage.id,
				divid: valuediv.id
			}
		});
	})
}

function event11(valuediv, Control) {
	mui.plusReady(function() {
		var prePage = plus.webview.currentWebview();

		mui.openWindow({
			url: 'userlist.html',
			id: Math.random(),
			preload: true,
			show: {
				aniShow: 'pop-in'
			},
			extras: {
				selectedUsers: Control.SelectedUsers,
				radioType: false,
				firevent: 'event10',
				webviewId: prePage.id,
				divid: valuediv.id
			}
		});
	})
}

function event12(valuediv, Control) {
	mui.plusReady(function() {
		var prePage = plus.webview.currentWebview();

		mui.openWindow({
			url: 'deptlist.html',
			id: Math.random(),
			preload: true,
			show: {
				aniShow: 'pop-in'
			},
			extras: {
				selectedUsers: Control.SelectedDeps,
				radioType: true,
				firevent: 'event10',
				webviewId: prePage.id,
				divid: valuediv.id
			}
		});
	})
}

function event13(valuediv, Control) {
	mui.plusReady(function() {
		var prePage = plus.webview.currentWebview();

		mui.openWindow({
			url: 'deptlist.html',
			id: Math.random(),
			preload: true,
			show: {
				aniShow: 'pop-in'
			},
			extras: {
				selectedUsers: Control.SelectedDeps,
				radioType: false,
				firevent: 'event10',
				webviewId: prePage.id,
				divid: valuediv.id
			}
		});
	})
}

mui.plusReady(function() {
	window.addEventListener('event10', function(event) {
		//获得事件参数
		var data = event.detail.data;

		var valuediv = document.getElementById(data.divid);
		valuediv.value = data.value; // 本身以,分隔
		valuediv.innerHTML = data.text;
	});

}); // end

function event17(valuediv, Control) {
	var picker = new mui.DtPicker(JSON.parse('{"type":"month"}'));
	picker.show(function(selectItems) {
		valuediv.innerHTML = selectItems.text;
		valuediv.value = selectItems.value;
		picker.dispose();
	});
}

// 创建一个普通div，指定class
function createDiv(className) {
	var div = document.createElement('div');
	div.className = className;
	return div;
}

// 创建左边的文本标题区域
function createNameDiv(name) {
	var namediv = document.createElement('div');
	namediv.className = "item-name";
	namediv.innerHTML = name;
	return namediv;
}

// 值域部分，不可编辑模式下，只显示文本
function createTextDiv(value, editModel) {
	var textdiv = document.createElement('div');
	textdiv.className = "item-value";
	textdiv.style.width = '100%';
	textdiv.innerHTML = value;
	return textdiv;
}

// 得到各字段的值
function getFormValue(Controls) {
	var keyValue = new Object();

	for(var i = 0; i < Controls.length; i++) {
		var item = Controls[i];
		// 如果是不可见，则不解析至界面，直接取值。
		if(item.EditModel == '3') {
			keyValue[item.DataField] = item.Value;
			continue;
		}

		switch(item.ControlType - 0) {
			// 如果是单选和多选的情况下
			case 10:
			case 11:
			case 12:
			case 13:
				{
					// 并且是在可编辑且datasource不为空的情况下取值方式为，在其他情况下已经赋值
					if((item.EditModel != '0') && !isNullStr(item.DataSource)) {
						var ele = document.getElementById(item.DataField);

						var checkboxArray = [];
						var checkedValues = [];
						if(item.ControlType == '10' || item.ControlType == '12') {
							checkboxArray = [].slice.call(ele.querySelectorAll('input[type="radio"]'));
						}
						if(item.ControlType == '11' || item.ControlType == '13') {
							checkboxArray = [].slice.call(ele.querySelectorAll('input[type="checkbox"]'));
						}
						checkboxArray.forEach(function(box) {
							if(box.checked) {
								checkedValues.push(box.value);
								document.getElementById(item.DataField).value = checkedValues;

								keyValue[item.DataField] = checkedValues;
							}
						});
					} else {
						// 10 11 12 13 在其他情况下已经赋值
						var value = document.getElementById(item.DataField).value;
						keyValue[item.DataField] = value;
					}
				}
				break;

			case 23:
				{
					var ele = document.getElementById(item.DataField);

					var checkboxArray = [].slice.call(ele.querySelectorAll('input[type="checkbox"]'));
					var checkedValues = '';
					checkboxArray.forEach(function(box) {
						if(box.checked) {
							checkedValues += (box.value + item.SplitStr);
							if(checkedValues.length > 0) {
								checkedValues.substring(0, checkedValues.length - 1);
							}
							document.getElementById(item.DataField).value = checkedValues;
							keyValue[item.DataField] = checkedValues;
						}
					});
				}
				break;

			default:
				{
					var value = document.getElementById(item.DataField).value;
					keyValue[item.DataField] = value;
				}

				break;
		}
	}

	console.log("得到的KeyValue为：");
	var count = 0;
	for(var key in keyValue) {
		console.log(key + '- ' + keyValue[key]);
		count++;
	}
	console.log("共：" + count);

	return keyValue;

}

/**
显示只读=0, 不显示用默认值更新=3,

显示可更新=1,  显示用默认值更新=4（4是1的特殊情况)  显示可更新必填=2且循环遍历检查

**/
function checkFormInput(Controls, keyValue) {
	console.log('开始检查必填输入项...' + keyValue.size());
	for(var i = 0; i < Controls.length; i++) {
		var item = Controls[i];

		if(item.EditModel == '2' && isNullStr(keyValue[item.DataField])) {
			mui.toast(item.CaptionName + '为必填项，请检查');
			return false;
		}

		// TODO 检查数据合法性

	}

	return true;
}