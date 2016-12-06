var FormDeco = {
/* const */
KEY_SPACE : 32,
KEY_ENTER : 13,
MIN_CODE : 48,
MAX_CODE : 122,
KEY_UP : 38,
KEY_DOWN : 40,
EVENT_NAME : ["onabort","onbeforecopy","onbeforecut","onbeforepaste","onblur","onchange","onclick","oncontextmenu","oncopy","oncut","ondblclick","ondrag","ondragend","ondragenter","ondragleave","ondragover","ondragstart","ondrop","onerror","onfocus","oninput","oninvalid","onkeydown","onkeypress","onkeyup","onload","onmousedown","onmousemove","onmouseout","onmouseover","onmouseup","onmousewheel","onpaste","onreset","onscroll","onsearch","onselect","onselectstart","onsubmit","onwebkitfullscreenchange","onwebkitfullscreenerror","onwebkitspeechchange"],
/* C1 : checkSet Class */
checkSet : function(id){
	this.type = "CHECK";
	this.id = id;
	this.root = document.getElementById(this.id);
	this.meterial = this.root.getElementsByTagName("input");
	this.customSet = FormDeco.createCustom(this.meterial, this.type);
	if(!SenceReaderConfirm()) {
		FormDeco.destroyMaterial(this.meterial, this.type,this.customSet.custom);
		if(!document.getElementById('activeXInner'))
			setAccessText();
	}
	this.root = FormDeco.setBoxCustom(this.customSet);
	this.custom = this.customSet.custom; /* 2012.07.25 */
},
/* C2 : radioSet Class */
radioSet : function(id){
	this.type = "RADIO";
	this.id = id;
	this.root = document.getElementById(this.id);
	this.meterial = this.root.getElementsByTagName("input");
	this.customSet = FormDeco.createCustom(this.meterial, this.type);
	if(!SenceReaderConfirm()) {
		FormDeco.destroyMaterial(this.meterial, this.type,this.customSet.custom);
		if(!document.getElementById('activeXInner'))
		setAccessText();
	}
	this.root = FormDeco.setRadioCustom(this.customSet);
	this.custom = this.customSet.custom; /* 2012.07.25 */
},
/* C3 : radioSet Class */
selectSet : function(id){
	this.callbacks = [];
	if(SenceReaderConfirm()) { return this; } else {
		if(!document.getElementById('activeXInner'))
			setAccessText();
	}
	this.type = "SELECT";
	this.id = id;
	this.material = document.getElementById(this.id);
	this.name = this.material.name;
	this.options = this.material.getElementsByTagName("option");
	this.customSet = FormDeco.createCustom(this.options, this.type);
	this.customSet.className = this.customSet.className + " " + id;
	//this.index = FormDeco.getIndex(this.customSet);
	this.hidden = FormDeco.createHidden(this.id,this.name);
	// text field
	this.hiddenText = FormDeco.createHidden(this.id + "_text",this.name + "_text");
	FormDeco.destroyMaterial(this.material, this.type, this.hidden, this.hiddenText);
	this.root = FormDeco.setCustom(this.customSet,this.type, this.hidden,this.index, this.hiddenText);
	FormDeco.setLabel(this.id,this.root);
	FormDeco.setCustomKeySet(this.root,this.customSet,this.hidden, this.hiddenText);

	FormDeco.rendingCustom(this.hidden,this.root, this.hiddenText);

	//me
	// this.customSet.

},
/* F1 : create Custom Set  */
createCustom : function(obj, type){
	var element = {};
	switch(type){
	case "CHECK" :
		element.custom = FormDeco.boxCustom(obj);
		break;

	case "RADIO" :
		element.custom = FormDeco.boxCustom(obj);
		break;

	case "SELECT" :
		element.custom = FormDeco.selectCustom(obj);
		element.index =  FormDeco.getIndex(element.custom);
		element.className = obj[0].parentNode.className;
		break;
	}
	return element;
},
/* F1-1 : create Custom Set  */
boxCustom : function(obj){
	var element = [], i = 0, len = obj.length, label = obj[0].parentNode.getElementsByTagName("label"), self = this;

	for(i; i < len; i++){
		element.push(function(i){
			var check = {};
			check.origin = obj[i];
			// callback save to callback array 2012.05.10
			check.callback = (function(){
				var cb = [], len = self.EVENT_NAME.length, ind = 0;
				for(ind; ind < len; ind++){
					if(typeof check.origin[self.EVENT_NAME[ind]] === "function"){
						cb.push(check.origin[self.EVENT_NAME[ind]]);
					}
				}
				return cb;
			})();

			check.label = label[i];
			check.span = document.createElement("span");
			check.btn = document.createElement("button");
			check.btn.setAttribute("type","button");

			check.value = obj[i].value;
			check.em = document.createElement("em");
			check.em.innerHTML = check.value;

			check.name = obj[i].name;
			check.checked = obj[i].checked;

			if(check.checked){
				check.span.className = " on";
			}
			check.btn.onfocus = function(){
				if(this.parentNode.className.indexOf(" over") === -1)
					this.parentNode.className =  this.parentNode.className + " over";
			};

			check.btn.onblur = function(){
				this.parentNode.className = this.parentNode.className.replace(" over","");
			};

			check.btn.appendChild(check.em);
			check.span.appendChild(check.btn);
			return check;
		}(i));
	}

	return element;

},
/* F1-2 */
setBoxCustom : function(set){
	var element = set.custom,
	i = 0, j = 0, len = element.length;
	if(SenceReaderConfirm()) {
		for(j;j<len;j++){
			addEvent(element[j].origin, 'click', originRun.bind(element[j]));
			element[i].origin.triggerCheck = checkRun.bind(element[i].btn);
			element[i].origin.setChecked = setChecked.bind(element[i].btn);
			element[i].origin.setUnchecked = setUnchecked.bind(element[i].btn);
		}
	} else {
		for(i;i<len;i++){
			element[i].btn.onclick = checkRun;
			element[i].label.onclick = checkRun.bind(element[i].btn);
			element[i].btn.onmouseover = FormDeco.over;
			element[i].btn.onmouseout = FormDeco.out;
			element[i].label.onmouseover = FormDeco.over.bind(element[i].btn);
			element[i].label.onmouseout = FormDeco.out.bind(element[i].btn);
			element[i].origin.triggerCheck = checkRun.bind(element[i].btn);
			element[i].origin.setChecked = setChecked.bind(element[i].btn);
			element[i].origin.setUnchecked = setUnchecked.bind(element[i].btn);
		}
	}
	function originRun(e) {
		if(this.callback.length !== 0){
			runCallback(this.callback,this.origin);
		}
	}
	function setChecked(e) {
		if (navigator.userAgent.indexOf('MSIE') == -1) {
			if (typeof(e) !== 'undefined') e.preventDefault(); //FF
		} else {
			window.event.returnValue = false; //IE
		}
		if (this.parentNode.className.indexOf("on") < 0) {
			this.parentNode.className = this.parentNode.className + " on";
		}
		for (var j = 0; j < len; j++) {
			if (element[j].btn === this) {
				element[j].origin.checked = true;
				// handler 실행
				if (element[j].callback.length !== 0) {
					runCallback(element[j].callback, element[j].origin);
				}
			}
		}
	}
	function setUnchecked(e) {
		if (navigator.userAgent.indexOf('MSIE') == -1) {
			if (typeof(e) !== 'undefined') e.preventDefault(); //FF
		} else {
			window.event.returnValue = false; //IE
		}
		if (this.parentNode.className.indexOf("on") > -1) {
			this.parentNode.className = this.parentNode.className.replace(" on","");
		}
		for (var j = 0; j < len; j++) {
			if (element[j].btn === this) {
				element[j].origin.checked = false;
				// handler 실행
				if (element[j].callback.length !== 0) {
					runCallback(element[j].callback, element[j].origin);
				}
			}
		}
	}
	function checkRun(e){
		if(navigator.userAgent.indexOf('MSIE') == -1){
			if (typeof(e) !== 'undefined') e.preventDefault(); //FF
		}else {
			window.event.returnValue = false; //IE
		}

		if(this.parentNode.className.indexOf(" on") > -1){
			this.parentNode.className = this.parentNode.className.replace(" on","");
			for(var j = 0; j < len; j++){
				if(element[j].btn === this){
					element[j].origin.checked = false;
					// handler 실행
					if(element[j].callback.length !== 0){
						runCallback(element[j].callback,element[j].origin);
					}
				}
			}
		}else{
			this.parentNode.className = this.parentNode.className + " on";
			for(var j = 0; j < len; j++){
				if(element[j].btn === this){
					element[j].origin.checked = true;
					// handler 실행
					if(element[j].callback.length !== 0){
						runCallback(element[j].callback,element[j].origin);
					}
				}
			}
		}
	}
},
/* F1-3 */
setRadioCustom : function(set){
	var element = set.custom,
	i = 0, j = 0, len = element.length;
	if(SenceReaderConfirm()) {
		for(j;j<len;j++){
			addEvent(element[j].origin, 'click', originRun.bind(element[j]));
		}
	} else {
		for(i;i<len;i++){
			element[i].btn.onclick = checkRun;
			element[i].label.onclick = checkRun.bind(element[i].btn);
			element[i].btn.onmouseover = FormDeco.over;
			element[i].btn.onmouseout = FormDeco.out;
			element[i].label.onmouseover = FormDeco.over.bind(element[i].btn);
			element[i].label.onmouseout = FormDeco.out.bind(element[i].btn);
		}
	}
	function originRun(e) {
		if(this.callback.length !== 0){
			runCallback(this.callback,this.origin);
		}
	}
	function checkRun(e){

		if(navigator.userAgent.indexOf('MSIE') == -1){
			e.preventDefault(); //FF
		}else {
			window.event.returnValue = false; //IE
		}

		if(this.parentNode.className.indexOf(" on") > -1){

		}else{
			for(var j = 0; j < len; j++){
				if(element[j].span === this.parentNode){
					element[j].origin.checked = true;
					element[j].span.className = element[j].span.className + " on";
					// handler 실행
					if(element[j].callback.length !== 0){
						runCallback(element[j].callback,element[j].origin);
					}
				}else{
					element[j].span.className = element[j].span.className.replace(" on","");
				}
			}
		}

	}
},
over : function(){
	if(this.parentNode.className.indexOf(" over") === -1)
		this.parentNode.className =  this.parentNode.className + " over";
},
out : function(){
	this.parentNode.className = this.parentNode.className.replace(" over","");
},
/* F1-2 : create Custom Set  */
selectCustom : function(obj){
	var element = [], i = 0, len = obj.length, selIndex;

	for(i; i < len; i++){
		element.push(function(i){
			var options = {};
			options._li = document.createElement("li");
			options._li.onmouseover = function(){
				this.className = this.className + "over";
			};
			options._li.onmouseout = function(){
				this.className = this.className.replace("over", "");
			};
			options._a = document.createElement("button");

			options.value = obj[i].value;
			//soptions._a.attr('value',options.value);
			
			options._a.setAttribute("value", options.value);
			options._a.value = options.value;
			options.label = (obj[i].label.length !== 0) ? obj[i].label : obj[i].firstChild.nodeValue;
			options._a.innerHTML = options.label;

			options.index = i;
			options.selected = obj[i].selected;
			if(options.selected){
				selIndex = i;
			}
			options._li.appendChild(options._a);

			return options;
		}(i));
	}

	return element;

},
getIndex : function(set){
	var i = 0, len = set.length, index;
	for(i;i<len;i++){
		if(set[i].selected){
			index = set[i].index;
		}
	}
	return index;
},
/* F2 : remove Origin Element  */
destroyMaterial : function(destElmt,type,hidden,hideTxt){
	if(type === "SELECT"){
		var parent = destElmt.parentNode;
		parent.insertBefore(hideTxt,destElmt);
		parent.insertBefore(hidden,destElmt);
		parent.removeChild(destElmt);
	}else{
		var i = 0,
		arr = destElmt,
		len = arr.length,
		parent = arr[0].parentNode;

		for(i; i < len; i++){
			arr[i].style.display = "none";
			parent.insertBefore(hidden[i].span,arr[i]);
		}

	}
},
/* F3 : create New hidden Element  */
createHidden : function(id,name){
	var hiddenIpt = document.createElement("input");
	hiddenIpt.setAttribute("type","hidden");
	hiddenIpt.name  = name;
	hiddenIpt.id  = id;

	return hiddenIpt;
},
/* F4 : set Custom Element  */
setCustom : function(obj,type,hidden,ind,hideTxt){
	var _root = document.createElement("div"),
	_bSpan = document.createElement("span"),
	_Wdiv = document.createElement("div"),
	_Wdiv2 = document.createElement("div"),
	_ul = document.createElement("ul"),
	_span = document.createElement("span"),
	_button = document.createElement("button"),
	i = 0,
	set = obj.custom,
	len = set.length;

	_button.setAttribute("type","button");
	_button.innerHTML = "<span>펼치기</span>";
	_span.className = "selvalue";

	_root.className = (obj.className.length > 0) ? obj.className : "decSelector";

	if(type === "SELECT"){
		for(i; i < len; i++){
			_ul.appendChild(set[i]._li);
			if(set[i].selected){
				_span.innerHTML = set[i].label;
				hidden.value =  set[i].value;
				hideTxt.value = set[i].label;
			}
			set[i]._a.onclick = function(e){
				if(typeof e != "undefined"){
					e.preventDefault(); //FF
				}else {
					window.event.returnValue = false; //IE
				}
//				
//				if(e) {
//					e.stopPropagation();
//				} else {
//					window.event.cancelBubble = true;
//				}
				setChange(this);

				var value = this.value.slice(this.value.indexOf()+1,this.value.length);
				hidden.value = value;
				hideTxt.value = _span.innerHTML = this.firstChild.nodeValue;
				_Wdiv.style.display = "none";
				_root.style.zIndex = 'auto';
				_button.focus();
				/* for callback Function 2012.07.18 */
				if(typeof hidden.callback !== 'undefined') {
					hidden.callback();
				}
				if(typeof hideTxt.callback !== 'undefined') {
					hideTxt.callback();
				}
				return false;
			};
		}
	}

	function setChange(a){
		var j = 0;
		for(j; j < len; j++){
			if(set[j]._a === a){
				set[j].selected = true;
				obj.index = set[j].index;
			}else{
				set[j].selected = false;
			}
		}
	}
	_button.onclick = open;
	_span.onclick = open;

	function open(e){
		var t = e ? e.target : window.event.srcElement;
		if(t.tagName.toUpperCase() === 'SPAN') {
			t = t.nextSibling;
		}
		closeSelector(t, _Wdiv);

		if(e) {
			e.stopPropagation();
		} else {
			window.event.cancelBubble = true;
		}

		if(_Wdiv.style.display !== "block"){
			//me
			_button.focus();

			_Wdiv.style.display = "block";

			_Wdiv.parentNode.style.zIndex = "10";
			// _root.style.zIndex = "10";
			/*if(height - _root.offsetTop < _ul.offsetHeight){
				if(height - _ul.offsetHeight < 0){
					_ul.style.top = _root.offsetHeight + "px";
				}else{
					_ul.style.top = (height - _ul.offsetHeight) + "px";
				}

			}else{
				_ul.style.top = _root.offsetTop + _root.offsetHeight + "px";
			}
			_ul.style.left = _root.offsetLeft + "px";*/
			_button.onblur();

			_root.className = _root.className + " _onfocus";

			if(!FormDeco.currentSelect) {
				FormDeco.currentSelect = _Wdiv;
			} else {
				if(FormDeco.currentSelect !== _Wdiv) {
					FormDeco.currentSelect.style.display = 'none';
					FormDeco.currentSelect.parentNode.style.zIndex = 'auto';
					FormDeco.currentSelect.parentNode.className = FormDeco.currentSelect.parentNode.className.replace(" _onfocus","");
				}
				FormDeco.currentSelect = _Wdiv;
			}


			addEvent(document,"click",closeSelector.bind(_button));



		}
		else{
			_Wdiv.style.display = "none";
			_Wdiv.parentNode.style.zIndex = "auto";
			// _root.style.zIndex = "auto";
			_button.focus();
			// _root.className = _root.className.replace(" _onfocus","");

		}
	}


	function closeSelector(e, k){
		if(typeof e !== "Event"){
			var target = e;
		}else{
			var target = e.target ? e.target : window.event.srcElement;
		}
		if(typeof target.onclick === "function" && target.nextSibling !== k){

			if(typeof target.onmouseover !== "function"){
				removeEvent(document,"click",closeSelector);
			}else{
				FormDeco.currentSelect.style.display = 'none';
				FormDeco.currentSelect.parentNode.className = FormDeco.currentSelect.parentNode.className.replace(" _onfocus","");
				FormDeco.currentSelect.parentNode.style.zIndex = 'auto';
				FormDeco.currentSelect = null;
				removeEvent(document,"click",closeSelector);
			}
		}else{
			if(typeof FormDeco.currentSelect !== "undefined" && FormDeco.currentSelect !== k){
				// 버튼 두번 클릭시 닫히는 부분 예외처리
				FormDeco.currentSelect.style.display = 'none';
				FormDeco.currentSelect.parentNode.className = FormDeco.currentSelect.parentNode.className.replace(" _onfocus","");
				FormDeco.currentSelect.parentNode.style.zIndex = 'auto';
				removeEvent(document,"click",closeSelector);
			}
		}
	}

	_button.onfocus = function(){
		if(_root.className.indexOf("_onfocus") === -1) {
			$(document.body).click();
			_root.className = _root.className + " _onfocus";
		}

	};
	_button.onblur = function(){
		if (_Wdiv.style.display !== "block") {
			_root.className = _root.className.replace(" _onfocus","");
		}
	};


	_Wdiv.className = "list";

	_Wdiv.style.display = "none";
	_root.appendChild(_span);
	_root.appendChild(_button);
	_Wdiv2.appendChild(_ul);
	_Wdiv.appendChild(_Wdiv2);
	_Wdiv.appendChild(_bSpan);

	_root.appendChild(_Wdiv);

	/* costumize for selector */


	return _root;
},
/* F4-1 : label event custom  */
setLabel : function(id,root){

	var labels = document.getElementsByTagName("label"),
	_button = root.getElementsByTagName("button")[0],
	i = 0, len = labels.length;


	for(i; i < len; i++){
		if(labels[i].getAttribute("for") === id || labels[i]["htmlFor"] === id){
			labels[i].onclick = function(){
				if(typeof e != "undefined"){
					e.preventDefault();
				}else {
					window.event.returnValue = false;
				}

				_button.focus();

			};
		}
	}


},
/* F5 : set Custom Element  */
setCustomKeySet : function(root,obj,hidden,hideTxt){
	var _btn = root.getElementsByTagName("button")[0],
	_span = root.getElementsByTagName("span")[0],
	set = obj.custom,
	len = set.length;

	_btn.onkeydown = function(e){
		var code = FormDeco.getKey(e);
		if(code !==  9){

			if(typeof e != "undefined"){
				e.preventDefault(); //FF
			}else {
				window.event.returnValue = false; //IE
			}
		}



	};
	_btn.onkeyup = function(e){

		var code = FormDeco.getKey(e);

		if(code !==  9){

			if(typeof e != "undefined"){
				e.preventDefault(); //FF
			}else {
				window.event.returnValue = false; //IE
			}
		}

		switch(code){ // 화살표 방향키 제어
			case FormDeco.KEY_UP : {
				if(obj.index > 0){
					obj.index--;
					for(var i = 0; i < len; i++){
						if(set[i].index === obj.index){
							hidden.value = set[i].value;
							hideTxt.value = _span.innerHTML = set[i].label;
							set[i].selected = true;
						}else{
							set[i].selected = false;
						}
					}
				}
				break;
			}
			case FormDeco.KEY_DOWN : {
				if(obj.index < len-1){
					obj.index++;
					for(var i = 0; i < len; i++){
						if(set[i].index === obj.index){
							hidden.value = set[i].value;
							hideTxt.value = _span.innerHTML = set[i].label;
							set[i].selected = true;
						}else{
							set[i].selected = false;
						}
					}
				}
				break;
			}
		}
		
		/* for callback Function 2012.07.18 */
		if(typeof hidden.callback !== 'undefined') {
			hidden.callback();
		}
		if(typeof hideTxt.callback !== 'undefined') {
			hideTxt.callback();
		}
	};
},
/* F5-1 get Key code */
getKey : function(e){
	if(typeof e === "undefined"){
		key = window.event.keyCode;
	}else {
		key = e.keyCode;
	}
	return key;
},
/* F6 : rendering custom Element  */
rendingCustom : function(hidden,root,hideTxt){
	hidden.parentNode.insertBefore(root,hidden);
	hidden.parentNode.insertBefore(hideTxt,hidden);
}
};

FormDeco.$Array = function(arr) {
    var length = arr.length;
    var result = [];
    if (length > 0) {
        while(length--) {
            result[length] = arr[length];
        }
    }
    return result;
};
Function.prototype.bind = function() {
    if (arguments.length < 2 && !arguments[0]) {
        return this;
    }
    var __method = this;
    var args = FormDeco.$Array(arguments);
    var object = args.shift();
    return function() { return __method.apply(object, args.concat(FormDeco.$Array(arguments))); };
};//Fsz bind 참조
/* lib for event Handler */
function addEvent(obj, evt, fn) {
	if (obj.addEventListener) {
		obj.addEventListener(evt, fn, false);
	} else if (obj.attachEvent) {
		obj["_"+fn] = fn;
		obj.fn = function() {
			obj["_"+fn](window.event);
		};
		obj.attachEvent("on" + evt, obj.fn);
	}
}
function removeEvent(obj, evt, fn) {
	if (obj.removeEventListener) {
		obj.removeEventListener(evt, fn, false);
	} else if (obj.detachEvent) {
		if(obj.fn != null){
			obj.detachEvent("on" + evt, obj.fn);
			obj.fn = null;
			obj["_"+fn] = null;
		}
	}
}
/* 2012.05.08 */
function runCallback(cb_arr,master){
	var len = cb_arr.length, i = 0;
	for(i;i<len;i++){
		cb_arr[i].call(master);
	}
}

function SenceReaderConfirm() {
	if(navigator.userAgent.indexOf('MSIE') === -1) {
		return false;
	}
	try {
		var SenceReaderApp = new ActiveXObject("sensereader.application");
		return true;
	} catch ( e ) {
		return false;
	}
}
function setAccessText() {
	var activeXInner = document.createElement('div');
	var bodyFirst = document.body.firstChild;
	document.body.insertBefore(activeXInner,bodyFirst);
	activeXInner.style.cssText ='position:absolute; left:-10000px; top:auto; width:1px; height:1px; overflow:hidden;';
	activeXInner.id = 'activeXInner';
	activeXInner.innerHTML = '<!-- activeX, flash 콘텐츠 이용 안내 문구 추가(start) --><div tabindex="0" class="notificationMsg"><p>회원 가입을 위해 추가 실행이 필요합니다. 알트키와 엔키를 눌러서 추가 기능을 실행할 수 있습니다. </p></div><!-- activeX, flash 콘텐츠 이용 안내 문구 추가(end) -->';
}

$(document).ready(function(){
	$(document.body).on("focus", "*", function(e) {
		e.stopPropagation();
		if (!$(this).closest(".list").length) {
			$(document.body).click();
		}
	});
});