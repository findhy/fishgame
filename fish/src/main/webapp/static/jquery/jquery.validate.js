/*
 * jQuery validation plug-in 1.5.1
 *
 * http://bassistance.de/jquery-plugins/jquery-plugin-validation/
 * http://docs.jquery.com/Plugins/Validation
 *
 * Copyright (c) 2006 - 2008 Jörn Zaefferer
 *
 * $Id: jquery.validate.js 6096 2009-01-12 14:12:04Z joern.zaefferer $
 *
 * Dual licensed under the MIT and GPL licenses:
 *   http://www.opensource.org/licenses/mit-license.php
 *   http://www.gnu.org/licenses/gpl.html
 */
 /*
  *     required: 必填项验证,
  * 		email: 邮箱验证,
  *		  url:  URL验证,
  *  		date: 日期验证,
  *     postcode:邮编验证,
  *     phone:电话号码验证,
  *     mobilephone:手机号码验证,
  *     on_select:下拉选必填项验证',
  *     bankCardkValidate:银行卡验证
  *     bankBookValidate:银行存折验证
  *  		number: 数字验证,
  *  digits:非负整数验证,
  *  positiveFloat:正浮点数验证,
  *     checkCard :身份证号验证,
  *  		equalTo: "请输入相同值",
  *  		maxlength:最大长度验证,
  *  		minlength: 最小长度验证,
  *  		max:最大值验证,
  *  		min: 最小值验证
  *lessThan:小于等于指定字段
  *greatThan:大于等于指定字段
  *dateLessThan:时间小于指定字段
  *dateGreatThan:时间大于指定字段
  *dateLessEqThan:时间小于等于指定字段
  *dateGreatEqThan:时间大于等于指定字段
  *numberScale:"输入数字不满足精度",
  *
  *
  *9.3lq添加关于FLEXBOX增加必填和红框显示：
  *1.flexbox需要在validate验证之前创建
  *2.flexbox需要设置inputName和showName属性，如inputName:"inpUserId"  showName:"inpUserName"
  *3.validate中rules的写法： 
  *rules:{
  *	"inpUserId":{
  *		required:true,
  *		showName:"inpUserName"
  *	}
  *}
  */
(function($) {

$.extend($.fn, {
	// http://docs.jquery.com/Plugins/Validation/validate
	validate: function( options ) {

		// if nothing is selected, return nothing; can't chain anyway
		if (!this.length) {
			options && options.debug && window.console && console.warn( "nothing selected, can't validate, returning nothing" );
			return;
		}

		// check if a validator for this form was already created
		var validator = $.data(this[0], 'validator');
		if ( validator ) {
			return validator;
		}

		validator = new $.validator( options, this[0] );
		$.data(this[0], 'validator', validator);

		if ( validator.settings.onsubmit ) {

			// allow suppresing validation by adding a cancel class to the submit button
			this.find("input, button").filter(".cancel").click(function() {
				validator.cancelSubmit = true;
			});

			// validate the form on submit
			this.submit( function( event ) {
				if ( validator.settings.debug )
					// prevent form submit to be able to see console output
					event.preventDefault();

				function handle() {
					if ( validator.settings.submitHandler ) {
						validator.settings.submitHandler.call( validator, validator.currentForm );
						return false;
					}
					return true;
				}

				// prevent submit for invalid forms or custom submit handlers
				if ( validator.cancelSubmit ) {
					validator.cancelSubmit = false;
					return handle();
				}
				if ( validator.form() ) {
					if ( validator.pendingRequest ) {
						validator.formSubmitted = true;
						return false;
					}
					return handle();
				} else {
					validator.focusInvalid();
					return false;
				}
			});
		}

		return validator;
	},
	// http://docs.jquery.com/Plugins/Validation/valid
	valid: function() {
        if ( $(this[0]).is('form')) {
            return this.validate().form();
        } else {
            var valid = false;
            var validator = $(this[0].form).validate();
            this.each(function() {
				valid |= validator.element(this);
            });
            return valid;
        }
    },
	// attributes: space seperated list of attributes to retrieve and remove
	removeAttrs: function(attributes) {
		var result = {},
			$element = this;
		$.each(attributes.split(/\s/), function(index, value) {
			result[value] = $element.attr(value);
			$element.removeAttr(value);
		});
		return result;
	},
	// http://docs.jquery.com/Plugins/Validation/rules
	rules: function(command, argument) {
		var element = this[0];
		$(element).parent().find("em").remove();
		if (command) {
			var settings = $.data(element.form, 'validator').settings;
			//if(settings==null)
				//return;
			
			var staticRules = settings.rules;
			var existingRules = $.validator.staticRules(element);
			switch(command) {
			case "add":
				$.extend(existingRules, $.validator.normalizeRule(argument));
				staticRules[element.name] = existingRules;
				if(argument.required){//必填或者必选时加样式
					$(element).addClass("border_red");   //增加样式
					if(argument.showName)
						$("input[name="+argument.showName+"]").addClass("border_red");
				}
				if(argument.on_select){
					//2013-11-30添加，修复onselect后台动态拼接验证时，非IE7下面select会显示两层红色
					if(navigator.userAgent.indexOf("MSIE")>0&&navigator.appVersion.match(/7./i)=="7.") { 
						$(element).wrap( $('<span class="border_red"></span>'));
					 }else{
						   $(element).addClass("border_red");
					 }
				}
					
					//$(element).attr("style","border:1px solid blue!important");
				    //$(element).attr("style","border:1px solid blue!important");
				if (argument.messages)
					settings.messages[element.name] = $.extend( settings.messages[element.name], argument.messages );
				break;
			case "remove":
				$(element).removeClass("border_red");  //移除样式
				if(argument=="on_select"){
					$(element).removeClass("border_red");  //移除样式
					$(element).parent("span").replaceWith($(element));  //移除样式
				}
				if (!argument) {
					delete staticRules[element.name];
					return existingRules;
				}
				var filtered = {};
				$.each(argument.split(/\s/), function(index, method) {
					filtered[method] = existingRules[method];
					delete existingRules[method];
				});
				return filtered;
			}
		}

		var data = $.validator.normalizeRules(
		$.extend(
			{},
			$.validator.metadataRules(element),
			$.validator.classRules(element),
			$.validator.attributeRules(element),
			$.validator.staticRules(element)
		), element);

		// make sure required is at front
		if (data.required) {
			var param = data.required;
			delete data.required;
			data = $.extend({required: param}, data);
		}

		return data;
	}
});

// Custom selectors
$.extend($.expr[":"], {
	// http://docs.jquery.com/Plugins/Validation/blank
	blank: function(a) {return !$.trim(a.value);},
	// http://docs.jquery.com/Plugins/Validation/filled
	filled: function(a) {return !!$.trim(a.value);},
	// http://docs.jquery.com/Plugins/Validation/unchecked
	unchecked: function(a) {return !a.checked;}
});

$.formatlen = function(source, params) {
	if ( arguments.length == 1 )
		return function() {
			var args = $.makeArray(arguments);
			args.unshift(source);
			return $.formatlen.apply( this, args );
		};
	if ( arguments.length > 2 && params.constructor != Array  ) {
		params = $.makeArray(arguments).slice(1);
	}
	if ( params.constructor != Array ) {
		params = [ params ];
	}
	$.each(params, function(i, n) {
		var j = n;
		if(!isNaN(n)){
			j = Math.floor(n/3);
		}
		source = source.replace(new RegExp("\\{" + i + "\\}"), j);
		source = source.replace(new RegExp("\\{" + i + "\\}"), n);
	});
	return source;
};

$.format = function(source, params) {
	if ( arguments.length == 1 )
		return function() {
			var args = $.makeArray(arguments);
			args.unshift(source);
			return $.format.apply( this, args );
		};
	if ( arguments.length > 2 && params.constructor != Array  ) {
		params = $.makeArray(arguments).slice(1);
	}
	if ( params.constructor != Array ) {
		params = [ params ];
	}
	$.each(params, function(i, n) {
		source = source.replace(new RegExp("\\{" + i + "\\}", "g"), n);
	});
	return source;
};

// constructor for validator
$.validator = function( options, form ) {
	this.settings = $.extend( {}, $.validator.defaults, options );
	this.currentForm = form;
	this.init();
};

$.extend($.validator, {

	defaults: {
		messages: {},
		groups: {},
		rules: {},
		errorClass: "error",
		errorElement: "em",
		focusInvalid: true,
		errorContainer: $( [] ),
		errorLabelContainer: $( [] ),
		onsubmit: true,
		ignore: [],
		ignoreTitle: false,
		onfocusin: function(element) {
			this.lastActive = element;

			// hide error label and remove error class on focus if enabled
			if ( this.settings.focusCleanup && !this.blockFocusCleanup ) {
				this.settings.unhighlight && this.settings.unhighlight.call( this, element, this.settings.errorClass );
				this.errorsFor(element).hide();
			}
		},
		onfocusout: function(element) {
			if ( !this.checkable(element) && (element.name in this.submitted || !this.optional(element)) ) {
				this.element(element);
			}
		},
		onkeyup: function(element) {
			if ( element.name in this.submitted || element == this.lastElement ) {
				this.element(element);
			}
		},
		onclick: function(element) {
			if ( element.name in this.submitted )
				this.element(element);
		},
		highlight: function( element, errorClass ) {
			$( element ).addClass( errorClass );
		},
		unhighlight: function( element, errorClass ) {
			$( element ).removeClass( errorClass );
		}
	},

	// http://docs.jquery.com/Plugins/Validation/Validator/setDefaults
	setDefaults: function(settings) {
		$.extend( $.validator.defaults, settings );
	},

	messages: {
		required: "该项为必填项",
		remote: "请修正该字段",
		lettersNumber:"请输入字母数字组合",
		logNumber:"请输入数字，首位不能为0",
		lessThan:"输入必须小于指定字段",
		greatThan:"输入必须大于指定字段",
		lessThanNull:"输入必须小于指定字段",
		greatThanNull:"输入必须大于指定字段",
		dateLessEqThan:"时间小于等于指定字段",
		greatThanAllowNull:"输入必须大于指定字段或者为空",
		dateGreatEqThan:"时间大于等于指定字段",
		dateLessThan:"输入时间必须小于指定字段",
		dateGreatThan:"输入时间必须大于于指定字段",
		numberScale:"输入数字不满足精度",
		checkCode:"请输入字母或数字",
		email: "请输入有效的邮箱",
		url: "请输入有效的URL",
		accuScale:"请输入正确的公积金比例",
		date: "请输入有效的日期",
		dateyear: "请输入有效的年份",
    postcode:'请输入有效的邮编',
    phone:'请输入有效的电话号码',
    mobilephone:'请输入有效的手机号码',
    telPhone:"请输入包含区号的固话或输入手机号码",
    on_select:'该项为必填项',
    bankCardValidate:'卡号不符合规则',
    bankBookValidate:'存折号不符合规则',
    showName:'请选择内容',
    numberCheck:$.format("请输入整数长度{0}，小数长度{1}的值。"),
    checkName:'名称格式不正确',
    checkEmpName:"姓名格式不正确",
		//dateISO: "Please enter a valid date (ISO).",
		dateDE: "Bitte geben Sie ein gültiges Datum ein.",
		number: "请输入有效数字",
		moneylessthanten: "余额应大于10",
		digits:"请输入非负整数",
	//	numberDE: "Bitte geben Sie eine Nummer ein.",
		positiveFloat:"请输入正浮点数",
   // dateStyle_user:'请输入正确的日期格式',
    checkCard :"请输入有效的身份证号",
		equalTo: "请输入相同值",
	//	accept: "请输入拥有合法后缀名的字符串",
		maxlength: $.formatlen("最多可输入{0}个字或{0}个字符"),
		minlength: $.formatlen("至少输入{0}个字或{0}个字符"),
		//只能输入数字的长度约束-最大长度
		num_maxlength: $.format("最多可输入{0}个数字"),
		//只能输入数字的长度约束-最小长度
		num_minlength: $.format("至少输入{0}个数字"),
		//只能输入N位数字
		num_length: $.format("请输入{0}位数字"),
		digits_length:$.format("请输入{0}位非负整数"),
		rangelength: $.format("字符长度为 {0} 和 {1} 之间。"),
		range: $.format("请输入在 {0} 和 {1} 之间的值。"),
		max: $.format("最大值为 {0}。"),
		min: $.format("最小值为 {0}。"),
		textareaForNumAndEnter:"请输入数字",
		textareaForNumAndXHX:"请输入正确的查询条件",
		orgCode:'请输入正确的组织机构代码',
		passport:'请输入7-9位的有效护照号码'

	},

	autoCreateRanges: false,

	prototype: {

		init: function() {
			this.labelContainer = $(this.settings.errorLabelContainer);
			this.errorContext = this.labelContainer.length && this.labelContainer || $(this.currentForm);
			this.containers = $(this.settings.errorContainer).add( this.settings.errorLabelContainer );
			this.submitted = {};
			this.valueCache = {};
			this.pendingRequest = 0;
			this.pending = {};
			this.invalid = {};
			this.reset();

			var groups = (this.groups = {});
			$.each(this.settings.groups, function(key, value) {
				$.each(value.split(/\s/), function(index, name) {
					groups[name] = key;
				});
			});
			var rules = this.settings.rules;
			
			var newFormId = this.currentForm.id;
			$.each(rules, function(key, value) {
				if(value.required||value.on_select){  //判断必填项    必填项增加红框
					if(value.on_select){
					  if(navigator.userAgent.indexOf("MSIE")>0&&navigator.appVersion.match(/7./i)=="7.") { 
						$("#"+newFormId).find("select[name='"+key+"']").each(function(){
							if($(this).parent("span.border_red").length==0){
								$(this).wrap($('<span class="border_red"></span>'));
							}
						});
					   }else{
						   $("#"+newFormId).find("select[name='"+key+"']").addClass("border_red");
					   }
					}
					$("#"+newFormId).find("input[name='"+key+"']").addClass("border_red");
					
					$("#"+newFormId).find("textarea[name='"+key+"']").addClass("border_red");
					if(value.showName)
						$("#"+newFormId+" input[name='"+value.showName+"']").addClass("border_red").blur(function(){
							$("#"+newFormId+" input[name='"+key+"']").valid();
						});
				}
				rules[key] = $.validator.normalizeRule(value);
			});

			function delegate(event) {
				var validator = $.data(this[0].form, "validator");
				validator.settings["on" + event.type] && validator.settings["on" + event.type].call(validator, this[0] );
			}
			$(this.currentForm)
				.delegate("focusin focusout keyup", ":text, :password, :file, select, textarea", delegate)
				.delegate("click", ":radio, :checkbox", delegate);

			if (this.settings.invalidHandler)
				$(this.currentForm).bind("invalid-form.validate", this.settings.invalidHandler);
		},

		// http://docs.jquery.com/Plugins/Validation/Validator/form
		form: function() {
			this.checkForm();
			$.extend(this.submitted, this.errorMap);
			this.invalid = $.extend({}, this.errorMap);
			if (!this.valid())
				$(this.currentForm).triggerHandler("invalid-form", [this]);
			this.showErrors();
			return this.valid();
		},

		checkForm: function() {
			this.prepareForm();
			for ( var i = 0, elements = (this.currentElements = this.elements()); elements[i]; i++ ) {
				this.check( elements[i] );
			}
			return this.valid();
		},

		// http://docs.jquery.com/Plugins/Validation/Validator/element
		element: function( element ) {
			element = this.clean( element );
			this.lastElement = element;
			this.prepareElement( element );
			this.currentElements = $(element);
			var result = this.check( element );
			if ( result ) {
				delete this.invalid[element.name];
			} else {
				this.invalid[element.name] = true;
			}
			if ( !this.numberOfInvalids() ) {
				// Hide error containers on last error
				this.toHide = this.toHide.add( this.containers );
			}
			this.showErrors();
			return result;
		},

		// http://docs.jquery.com/Plugins/Validation/Validator/showErrors
		showErrors: function(errors) {
			if(errors) {
				// add items to error list and map
				$.extend( this.errorMap, errors );
				this.errorList = [];
				for ( var name in errors ) {
					this.errorList.push({
						message: errors[name],
						element: this.findByName(name)[0]
					});
				}
				// remove items from success list
				this.successList = $.grep( this.successList, function(element) {
					return !(element.name in errors);
				});
			}
			this.settings.showErrors
				? this.settings.showErrors.call( this, this.errorMap, this.errorList )
				: this.defaultShowErrors();
		},

		// http://docs.jquery.com/Plugins/Validation/Validator/resetForm
		resetForm: function() {
			if ( $.fn.resetForm )
				$( this.currentForm ).resetForm();
			this.submitted = {};
			this.prepareForm();
			this.removeErrors();
			$("#"+this.currentForm.id)[0].reset();
			this.elements().removeClass( this.settings.errorClass );
		},

		numberOfInvalids: function() {
			return this.objectLength(this.invalid);
		},

		objectLength: function( obj ) {
			var count = 0;
			for ( var i in obj )
				count++;
			return count;
		},

		hideErrors: function() {
			this.addWrapper( this.toHide ).hide();
		},
		//重置FORM表单的时候删除错误元素
		removeErrors:function(){
			this.addWrapper(this.toHide).remove();
		},
		valid: function() {
			return this.size() == 0;
		},

		size: function() {
			return this.errorList.length;
		},

		focusInvalid: function() {
			if( this.settings.focusInvalid ) {
				try {
					$(this.findLastActive() || this.errorList.length && this.errorList[0].element || []).filter(":visible").focus();
				} catch(e) {
					// ignore IE throwing errors when focusing hidden elements
				}
			}
		},

		findLastActive: function() {
			var lastActive = this.lastActive;
			return lastActive && $.grep(this.errorList, function(n) {
				return n.element.name == lastActive.name;
			}).length == 1 && lastActive;
		},

		elements: function() {
			var validator = this,
				rulesCache = {};

			// select all valid inputs inside the form (no submit or reset buttons)
			// workaround $Query([]).add until http://dev.jquery.com/ticket/2114 is solved
			return $([]).add(this.currentForm.elements)
			.filter(":input")
			.not(":submit, :reset, :image, [disabled]")
			.not( this.settings.ignore )
			.filter(function() {
				!this.name && validator.settings.debug && window.console && console.error( "%o has no name assigned", this);

				// select only the first element for each name, and only those with rules specified
				if ( this.name in rulesCache || !validator.objectLength($(this).rules()) )
					return false;

				rulesCache[this.name] = true;
				return true;
			});
		},

		clean: function( selector ) {
			return $( selector )[0];
		},

		errors: function() {
			return $( this.settings.errorElement + "." + this.settings.errorClass, this.errorContext );
		},

		reset: function() {
			this.successList = [];
			this.errorList = [];
			this.errorMap = {};
			this.toShow = $([]);
			this.toHide = $([]);
			this.formSubmitted = false;
			this.currentElements = $([]);
		},

		prepareForm: function() {
			this.reset();
			this.toHide = this.errors().add( this.containers );
		},

		prepareElement: function( element ) {
			this.reset();
			this.toHide = this.errorsFor(element);
		},

		check: function( element ) {
			element = this.clean( element );

			// if radio/checkbox, validate first element in group instead
			if (this.checkable(element)) {
				element = this.findByName( element.name )[0];
			}

			var rules = $(element).rules();
			var dependencyMismatch = false;
			for( method in rules ) {
				var rule = { method: method, parameters: rules[method] };
				try {
					var result = $.validator.methods[method].call( this, element.value, element, rule.parameters );

					// if a method indicates that the field is optional and therefore valid,
					// don't mark it as valid when there are no other rules
					if ( result == "dependency-mismatch" ) {
						dependencyMismatch = true;
						continue;
					}
					dependencyMismatch = false;

					if ( result == "pending" ) {
						this.toHide = this.toHide.not( this.errorsFor(element) );
						return;
					}

					if( !result ) {
						this.formatAndAdd( element, rule );
						return false;
					}
				} catch(e) {
					this.settings.debug && window.console && console.log("exception occured when checking element " + element.id
						 + ", check the '" + rule.method + "' method");
					throw e;
				}
			}
			if (dependencyMismatch)
				return;
			if ( this.objectLength(rules) )
				this.successList.push(element);
			return true;
		},

		// return the custom message for the given element and validation method
		// specified in the element's "messages" metadata
		customMetaMessage: function(element, method) {
			if (!$.metadata)
				return;

			var meta = this.settings.meta
				? $(element).metadata()[this.settings.meta]
				: $(element).metadata();

			return meta && meta.messages && meta.messages[method];
		},

		// return the custom message for the given element name and validation method
		customMessage: function( name, method ) {
			var m = this.settings.messages[name];
			return m && (m.constructor == String
				? m
				: m[method]);
		},

		// return the first defined argument, allowing empty strings
		findDefined: function() {
			for(var i = 0; i < arguments.length; i++) {
				if (arguments[i] !== undefined)
					return arguments[i];
			}
			return undefined;
		},
		//该方法是在验证规则没有设置提示信息的时候 显示默认提示信息。
		//当看到该提示的时候 表示需要设置对应验证规则的提示信息
		defaultMessage: function( element, method) {
			return this.findDefined(
				this.customMessage( element.name, method ),
				this.customMetaMessage( element, method ),
				// title is never undefined, so handle empty string as undefined
				!this.settings.ignoreTitle && element.title || undefined,
				$.validator.messages[method],
				//"<strong>Warning: No message defined for " + element.name + "</strong>"
				"<strong>内容未通过 "+method+" 验证</strong>"
			);
		},

		formatAndAdd: function( element, rule ) {
			var message = this.defaultMessage( element, rule.method );
			if ( typeof message == "function" )
				message = message.call(this, rule.parameters, element);
			this.errorList.push({
				message: message,
				element: element
			});
			this.errorMap[element.name] = message;
			this.submitted[element.name] = message;
		},

		addWrapper: function(toToggle) {
			if ( this.settings.wrapper )
				toToggle = toToggle.add( toToggle.parents( this.settings.wrapper ) );
			return toToggle;
		},

		defaultShowErrors: function() {
			for ( var i = 0; this.errorList[i]; i++ ) {
				var error = this.errorList[i];
				this.settings.highlight && this.settings.highlight.call( this, error.element, this.settings.errorClass );
				this.showLabel( error.element, error.message );
			}
			if( this.errorList.length ) {
				this.toShow = this.toShow.add( this.containers );
			}
			if (this.settings.success) {
				for ( var i = 0; this.successList[i]; i++ ) {
					this.showLabel( this.successList[i] );
				}
			}
			if (this.settings.unhighlight) {
				for ( var i = 0, elements = this.validElements(); elements[i]; i++ ) {
					this.settings.unhighlight.call( this, elements[i], this.settings.errorClass );
				}
			}
			this.toHide = this.toHide.not( this.toShow );
			this.hideErrors();
			this.addWrapper( this.toShow ).show();
		},

		validElements: function() {
			return this.currentElements.not(this.invalidElements());
		},

		invalidElements: function() {
			return $(this.errorList).map(function() {
				return this.element;
			});
		},

		showLabel: function(element, message) {
			var label = this.errorsFor( element );
			if ( label.length ) {
				// refresh error/success class
				label.removeClass().addClass( this.settings.errorClass );

				// check if we have a generated label, replace the message then
				label.attr("generated") && label.html(message);
			} else {
				// create label
				//2.21  防止success和error标签同时存在
				$(this.settings.errorElement+"[htmlfor="+this.idOrName(element)+"]").remove();
				label = $("<" + this.settings.errorElement + "/>")
					.attr({"htmlfor":  this.idOrName(element), generated: true})
					.addClass(this.settings.errorClass)
					.html(message || "");
				if ( this.settings.wrapper ) {
					// make sure the element is visible, even in IE
					// actually showing the wrapped element is handled elsewhere
					label = label.hide().show().wrap("<" + this.settings.wrapper + "/>").parent();
				}
				if ( !this.labelContainer.append(label).length ){
					if(this.settings.errorPlacement){
						this.settings.errorPlacement(label, $(element) );
					}else{
						//如果要验证的标签所在的父级下，有多个标签，则把em放在父级标签里面最后一个标签的后面
						//先不启用labelLast设置 3.7
						//if(this.settings.rules[$(element).attr("name")].labelLast)
							label.insertAfter($(element).parent().children().last());
						//else
						//	label.insertAfter(element);
					}
				}
			}
			if ( !message && this.settings.success ) {
				label.text("");
				typeof this.settings.success == "string"
					? label.removeClass().addClass( this.settings.success )
					: this.settings.success( label );
			}else{
				this.settings.success =function(label){
					label.text("").removeClass().addClass("success");
				};
			}
			this.toShow = this.toShow.add(label);
		},

		errorsFor: function(element) {
			return this.errors().filter("[htmlfor='" + this.idOrName(element) + "']");
		},

		idOrName: function(element) {
			return this.groups[element.name] || (this.checkable(element) ? element.name : element.id || element.name);
		},

		checkable: function( element ) {
			return /radio|checkbox/i.test(element.type);
		},

		findByName: function( name ) {
			// select by name and filter by form for performance over form.find("[name=...]")
			var form = this.currentForm;
			return $(document.getElementsByName(name)).map(function(index, element) {
				return element.form == form && element.name == name && element  || null;
			});
		},

		getLength: function(value, element) {
			switch( element.nodeName.toLowerCase() ) {
			case 'select':
				return $("option:selected", element).length;
			case 'input':
				if( this.checkable( element) )
					return this.findByName(element.name).filter(':checked').length;
			}
			return value.length;
		},

		depend: function(param, element) {
			return this.dependTypes[typeof param]
				? this.dependTypes[typeof param](param, element)
				: true;
		},

		dependTypes: {
			"boolean": function(param, element) {
				return param;
			},
			"string": function(param, element) {
				return !!$(param, element.form).length;
			},
			"function": function(param, element) {
				return param(element);
			}
		},

		optional: function(element) {
			return !$.validator.methods.required.call(this, $.trim(element.value), element) && "dependency-mismatch";
		},

		startRequest: function(element) {
			if (!this.pending[element.name]) {
				this.pendingRequest++;
				this.pending[element.name] = true;
			}
		},

		stopRequest: function(element, valid) {
			this.pendingRequest--;
			// sometimes synchronization fails, make sure pendingRequest is never < 0
			if (this.pendingRequest < 0)
				this.pendingRequest = 0;
			delete this.pending[element.name];
			if ( valid && this.pendingRequest == 0 && this.formSubmitted && this.form() ) {
				$(this.currentForm).submit();
			} else if (!valid && this.pendingRequest == 0 && this.formSubmitted) {
				$(this.currentForm).triggerHandler("invalid-form", [this]);
			}
		},

		previousValue: function(element) {
			return $.data(element, "previousValue") || $.data(element, "previousValue", previous = {
				old: null,
				valid: true,
				message: this.defaultMessage( element, "remote" )
			});
		}

	},

	classRuleSettings: {
		required: {required: true},
		email: {email: true},
		url: {url: true},
		date: {date: true},
		dateISO: {dateISO: true},
		dateDE: {dateDE: true},
		number: {number: true},
		numberDE: {numberDE: true},
		digits: {digits: true},
		logNumber:{logNumber:true}
	},

	addClassRules: function(className, rules) {
		className.constructor == String ?
			this.classRuleSettings[className] = rules :
			$.extend(this.classRuleSettings, className);
	},

	classRules: function(element) {
		var rules = {};
		var classes = $(element).attr('class');
		classes && $.each(classes.split(' '), function() {
			if (this in $.validator.classRuleSettings) {
				$.extend(rules, $.validator.classRuleSettings[this]);
			}
		});
		return rules;
	},

	attributeRules: function(element) {
		var rules = {};
		var $element = $(element);

		for (method in $.validator.methods) {
			var value = $element.attr(method);
			if (value) {
				rules[method] = value;
			}
		}

		// maxlength may be returned as -1, 2147483647 (IE) and 524288 (safari) for text inputs
		if (rules.maxlength && /-1|2147483647|524288/.test(rules.maxlength)) {
			delete rules.maxlength;
		}

		return rules;
	},

	metadataRules: function(element) {
		if (!$.metadata) return {};

		var meta = $.data(element.form, 'validator').settings.meta;
		return meta ?
			$(element).metadata()[meta] :
			$(element).metadata();
	},

	staticRules: function(element) {
		var rules = {};
		var validator = $.data(element.form, 'validator');
		if (validator!=null&&validator.settings.rules) {
			rules = $.validator.normalizeRule(validator.settings.rules[element.name]) || {};
		}
		return rules;
	},

	normalizeRules: function(rules, element) {
		// handle dependency check
		$.each(rules, function(prop, val) {
			// ignore rule when param is explicitly false, eg. required:false
			if (val === false) {
				delete rules[prop];
				return;
			}
			if (val.param || val.depends) {
				var keepRule = true;
				switch (typeof val.depends) {
					case "string":
						keepRule = !!$(val.depends, element.form).length;
						break;
					case "function":
						keepRule = val.depends.call(element, element);
						break;
				}
				if (keepRule) {
					rules[prop] = val.param !== undefined ? val.param : true;
				} else {
					delete rules[prop];
				}
			}
		});

		// evaluate parameters
		$.each(rules, function(rule, parameter) {
			rules[rule] = $.isFunction(parameter) ? parameter(element) : parameter;
		});

		// clean number parameters
		$.each(['minlength', 'maxlength', 'min', 'max'], function() {
			if (rules[this]) {
				rules[this] = Number(rules[this]);
			}
		});
		$.each(['rangelength', 'range'], function() {
			if (rules[this]) {
				rules[this] = [Number(rules[this][0]), Number(rules[this][1])];
			}
		});

		if ($.validator.autoCreateRanges) {
			// auto-create ranges
			if (rules.min && rules.max) {
				rules.range = [rules.min, rules.max];
				delete rules.min;
				delete rules.max;
			}
			if (rules.minlength && rules.maxlength) {
				rules.rangelength = [rules.minlength, rules.maxlength];
				delete rules.minlength;
				delete rules.maxlength;
			}
		}

		// To support custom messages in metadata ignore rule methods titled "messages"
		if (rules.messages) {
			delete rules.messages;
		}

		return rules;
	},

	// Converts a simple string to a {string: true} rule, e.g., "required" to {required:true}
	normalizeRule: function(data) {
		if( typeof data == "string" ) {
			var transformed = {};
			$.each(data.split(/\s/), function() {
				transformed[this] = true;
			});
			data = transformed;
		}
		return data;
	},

	// http://docs.jquery.com/Plugins/Validation/Validator/addMethod
	addMethod: function(name, method, message) {
		$.validator.methods[name] = method;
		$.validator.messages[name] = message;
		if (method.length < 3) {
			$.validator.addClassRules(name, $.validator.normalizeRule(name));
		}
	},

	methods: {

		// http://docs.jquery.com/Plugins/Validation/Methods/required
		required: function(value, element, param) {
			// check if dependency is met
			if ( !this.depend(param, element) )
				return "dependency-mismatch";
			switch( element.nodeName.toLowerCase() ) {
			case 'select':
				var options = $("option:selected", element);
				return options.length > 0 && ( element.type == "select-multiple" || ($.browser.msie && !(options[0].attributes['value'].specified) ? options[0].text : options[0].value).length > 0);
			case 'input':
				if ( this.checkable(element) )
					return this.getLength($.trim(value), element) > 0;
			default:
				return $.trim(value).length > 0;
			}
		},

		// http://docs.jquery.com/Plugins/Validation/Methods/remote
		remote: function(value, element, param) {
			if ( this.optional(element) )
				return "dependency-mismatch";

			var previous = this.previousValue(element);

			if (!this.settings.messages[element.name] )
				this.settings.messages[element.name] = {};
			this.settings.messages[element.name].remote = typeof previous.message == "function" ? previous.message(value) : previous.message;

			param = typeof param == "string" && {url:param} || param;

			if ( previous.old !== value ) {
				previous.old = value;
				var validator = this;
				this.startRequest(element);
				var data = {};
				data[element.name] = value;
				$.ajax($.extend(true, {
					url: param,
					mode: "abort",
					port: "validate" + element.name,
					dataType: "json",
					async:false,
					data: data,
					success: function(response) {
						if ( response ) {
							var submitted = validator.formSubmitted;
							validator.prepareElement(element);
							validator.formSubmitted = submitted;
							validator.successList.push(element);
							validator.showErrors();
						} else {
							var errors = {};
							errors[element.name] =  response || validator.defaultMessage( element, "remote" );
							validator.showErrors(errors);
						}
						previous.valid = response;
						validator.stopRequest(element, response);
					}
				}, param));
				return "pending";
			} else if( this.pending[element.name] ) {
				return "pending";
			}
			return previous.valid;
		},

		// http://docs.jquery.com/Plugins/Validation/Methods/minlength
		minlength: function(value, element, param) {
			value = $.trim(value);
			var length = value.length;
		    for(var i = 0; i < value.length; i++){
		        if(value.charCodeAt(i) > 126||value.charCodeAt(i) < 27){
		            length++;
		            length++;
		        }
		    }
			return this.optional(element) || length >= param;
		},

		// http://docs.jquery.com/Plugins/Validation/Methods/maxlength
		maxlength:function(value, element, param){
			 value = $.trim(value);
			 var length = value.length;
			    for(var i = 0; i < value.length; i++){
			        if(value.charCodeAt(i) > 126||value.charCodeAt(i) < 27){
			            length++;
			            length++;
			        }
			  }
			  return this.optional(element) || length <= param;
		},
		
		//只能输入数字的长度验证
		// http://docs.jquery.com/Plugins/Validation/Methods/minlength
		num_minlength: function(value, element, param) {
			var length = value.length;
			if((value.length>0&&$.trim(value)=="")||value.length!=$.trim(value).length)
				return false;
			return this.optional(element) || (/^-?(?:\d+|\d{1,3}(?:,\d{3})+)(?:\.\d+)?$/.test(value)&&length >= param);
		},

		//只能输入数字的长度验证
		// http://docs.jquery.com/Plugins/Validation/Methods/maxlength
		num_maxlength:function(value, element, param){
			var length = value.length;
			if((value.length>0&&$.trim(value)=="")||value.length!=$.trim(value).length)
				return false;
			return this.optional(element) || (/^-?(?:\d+|\d{1,3}(?:,\d{3})+)(?:\.\d+)?$/.test(value)&&length <= param);
		},
		
		//只能输入固定位数的数字
		// http://docs.jquery.com/Plugins/Validation/Methods/maxlength
		num_length:function(value, element, param){
			var length = value.length;
			if((value.length>0&&$.trim(value)=="")||value.length!=$.trim(value).length)
				return false;
			return this.optional(element) || (/^-?(?:\d+|\d{1,3}(?:,\d{3})+)(?:\.\d+)?$/.test(value)&&length==param);
		},

		//只能输入固定位数的非负整数
		digits_length:function(value, element, param){
			var length = value.length;
			if((value.length>0&&$.trim(value)=="")||value.length!=$.trim(value).length)
				return false;
			return this.optional(element) || (/^\d+$/.test(value)&&length==param);
		},
		
		// http://docs.jquery.com/Plugins/Validation/Methods/rangelength
		rangelength: function(value, element, param) {
			var length = this.getLength($.trim(value), element);
			return this.optional(element) || ( length >= param[0] && length <= param[1] );
		},

		// http://docs.jquery.com/Plugins/Validation/Methods/min
		min: function( value, element, param ) {
			return this.optional(element) || value >= param;
		},

		// http://docs.jquery.com/Plugins/Validation/Methods/max
		max: function( value, element, param ) {
			return this.optional(element) || value <= param;
		},

		// http://docs.jquery.com/Plugins/Validation/Methods/range
		range: function( value, element, param ) {
			return this.optional(element) || ( value >= param[0] && value <= param[1] );
		},
		fesco : function(value,element){
		    return this.optional(element) || /^-?(?:\d+|\d{1,3}(?:,\d{3})+)(?:\.\d+)?$/.test(value);
		},
		// http://docs.jquery.com/Plugins/Validation/Methods/email
		email: function(value, element) {
			// contributed by Scott Gonzalez: http://projects.scottsplayground.com/email_address_validation/
			return this.optional(element) || /^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?$/i.test(value);
		},
		//正浮点数
		positiveFloat:function(value,element){
		    return this.optional(element) || /^(([0-9]+\.[0-9]*[1-9][0-9]*)|([0-9]*[1-9][0-9]*\.[0-9]+)|([0-9]*[1-9][0-9]*))$/.test(value);
		},
		// http://docs.jquery.com/Plugins/Validation/Methods/url
		url: function(value, element) {
			// contributed by Scott Gonzalez: http://projects.scottsplayground.com/iri/
			return this.optional(element) || /^(https?|ftp):\/\/(((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:)*@)?(((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?)(:\d*)?)(\/((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)?)?(\?((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(\#((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|\/|\?)*)?$/i.test(value);
		},
		//公积金比例验证 11+22
		accuScale:function(value,element){
			return this.optional(element)||/^\d{1,2}\+\d{1,2}$/.test(value);
		},
		
		labelLast:function(){
			return true;
		},

		// http://docs.jquery.com/Plugins/Validation/Methods/date
		date: function(value, element) {

			return this.optional(element) || /^\d{4}[\/-]\d{1,2}[\/-]\d{1,2}$/.test(value)||!/Invalid|NaN/.test(new Date(value))|| /^\d\d?\.\d\d?\.\d\d\d?\d?$/.test(value);
			//return this.optional(element) || !/Invalid|NaN/.test(new Date(value));
		},

		// http://docs.jquery.com/Plugins/Validation/Methods/dateISO
		dateISO: function(value, element) {
			return this.optional(element) || /^\d{4}[\/-]\d{1,2}[\/-]\d{1,2}$/.test(value);
		},

		// http://docs.jquery.com/Plugins/Validation/Methods/dateDE
		dateDE: function(value, element) {
			return this.optional(element) || /^\d\d?\.\d\d?\.\d\d\d?\d?$/.test(value);
		},

		// http://docs.jquery.com/Plugins/Validation/Methods/number
		number: function(value, element) {
			if((value.length>0&&$.trim(value)=="")||value.length!=$.trim(value).length)
				return false;
			return this.optional(element) || /^-?(?:\d+|\d{1,3}(?:,\d{3})+)(?:\.\d+)?$/.test(value);
		},
			 textareaForNumAndEnter:function(value, element, param){
			if(value.length==0||$.trim(value)=="")
			    return true;
			var r;
			var a = $.trim(value).replace(/\n/g,"_");
			for(var i=0;i<a.split('_').length;i++){
				if($.trim($(a.split('_'))[i])!=""){
					r =  this.optional(element)||/^-?(?:\d+|\d{1,3}(?:,\d{3})+)(?:\.\d+)?$/.test($(a.split('_'))[i].toString());
					if(r==false){
						return r;
					}
				}else if($.trim($(a.split('_'))[i])==""&& i!=a.split('_').length-1){
					return false;
				}
			}
			return r;
		},
		textareaForNumAndXHX:function(value, element, param){
			if(value.length==0||$.trim(value)=="")
			    return true;
			var r;
			var a = $.trim(value).replace(/\n/g,"_").replace(/-/g,"0");
			for(var i=0;i<a.split('_').length;i++){
				if($.trim($(a.split('_'))[i])!=""){
					r =  this.optional(element)||/^-?(?:\d+|\d{1,3}(?:,\d{3})+)(?:\.\d+)?$/.test($(a.split('_'))[i].toString());
					if(r==false){
						return r;
					}
				}else if($.trim($(a.split('_'))[i])==""&& i!=a.split('_').length-1){
					return false;
				}
			}
			return r;
		},
 
		// http://docs.jquery.com/Plugins/Validation/Methods/numberDE
		numberDE: function(value, element) {
			return this.optional(element) || /^-?(?:\d+|\d{1,3}(?:\.\d{3})+)(?:,\d+)?$/.test(value);
		},

		// http://docs.jquery.com/Plugins/Validation/Methods/digits
		digits: function(value, element) {
			if((value.length>0&&$.trim(value)=="")||value.length!=$.trim(value).length)
				return false;
			return this.optional(element) || /^\d+$/.test(value);
		},
		dateyear: function(value,element){
			return this.optional(element) || /^\d{4}$/.test(value);
		},
		/*手机验证*/
		 mobilephone:function(value, element, params) {
			 return this.optional(element) || /^[1][3-8]+\d{9}$/.test(value);
		},
		/*  固定电话或者手机 */
		telPhone:function(value,element,params){
			return this.optional(element) ||/^\d{1,4}-{1}\d{7,8}$/.test(value)|| /^[1][3-8]+\d{9}$/.test(value);
		},
		   /*电话验证*/
		phone:function(value, element, params) {
				return this.optional(element) ||   /^\d{1,4}-?\d{7,8}$/.test(value)||/^\d{1,4}-?\d{7,8}-{1}\d{1,4}$/.test(value)||(value.length<9&&/^\d{7,8}$/.test(value))||(value.length>8&&/^[1][3-8]+\d{9}$/.test(value));
		},
		   /*邮政编码验证*/
		 postcode:function(value, element, params) {
		        return this.optional(element) || /^\d{6}$/.test(value);
		},
		//字母和数字的组合
		lettersNumber:function(value, element, params) {
		        return this.optional(element) || /^[A-Za-z0-9]+$/.test(value);
		},
		//登录批号
		logNumber:function(value, element, params) {
		        return this.optional(element) || /^[1-9][0-9]*$/.test(value);
		},
			/*身份证验证*/
		checkCard:function(value, element, params) {
					 try
      {if(this.optional(element)) return true;
      	var area={11:"北京",12:"天津",13:"河北",14:"山西",15:"内蒙古",21:"辽宁",22:"吉林",23:"黑龙江",31:"上海",32:"江苏",33:"浙江",34:"安徽",35:"福建",36:"江西",37:"山东",41:"河南",42:"湖北",43:"湖南",44:"广东",45:"广西",46:"海南",50:"重庆",51:"四川",52:"贵州",53:"云南",54:"西藏",61:"陕西",62:"甘肃",63:"青海",64:"宁夏",65:"新疆",71:"台湾",81:"香港",82:"澳门",91:"国外"};
  			var idcard=value,Y,JYM;
  			var S,M;
  			var idcard_array = new Array();
  			idcard_array = idcard.split("");
  			//地区检验
  			if(area[parseInt(idcard.substr(0,2))]==null) return false;
  			//身份号码位数及格式检验
  			switch(idcard.length){
  			case 15:
  			if ( (parseInt(idcard.substr(6,2))+1900) % 4 == 0 || ((parseInt(idcard.substr(6,2))+1900) % 100 == 0 && (parseInt(idcard.substr(6,2))+1900) % 4 == 0 )){
  			ereg=/^[1-9][0-9]{5}[0-9]{2}((01|03|05|07|08|10|12)(0[1-9]|[1-2][0-9]|3[0-1])|(04|06|09|11)(0[1-9]|[1-2][0-9]|30)|02(0[1-9]|[1-2][0-9]))[0-9]{3}$/;//测试出生日期的合法性
  			} else {
  			ereg=/^[1-9][0-9]{5}[0-9]{2}((01|03|05|07|08|10|12)(0[1-9]|[1-2][0-9]|3[0-1])|(04|06|09|11)(0[1-9]|[1-2][0-9]|30)|02(0[1-9]|1[0-9]|2[0-8]))[0-9]{3}$/;//测试出生日期的合法性
  			}
  			if(ereg.test(idcard)) return true;
  			else return false;
  			break;
  			case 18:
  			//18位身份号码检测
  			//出生日期的合法性检查
  			//闰年月日:((01|03|05|07|08|10|12)(0[1-9]|[1-2][0-9]|3[0-1])|(04|06|09|11)(0[1-9]|[1-2][0-9]|30)|02(0[1-9]|[1-2][0-9]))
  			//平年月日:((01|03|05|07|08|10|12)(0[1-9]|[1-2][0-9]|3[0-1])|(04|06|09|11)(0[1-9]|[1-2][0-9]|30)|02(0[1-9]|1[0-9]|2[0-8]))
  			if ( parseInt(idcard.substr(6,4)) % 4 == 0 || (parseInt(idcard.substr(6,4)) % 100 == 0 && parseInt(idcard.substr(6,4))%4 == 0 )){
  			ereg=/^[1-9][0-9]{5}[1-2][0-9][0-9]{2}((01|03|05|07|08|10|12)(0[1-9]|[1-2][0-9]|3[0-1])|(04|06|09|11)(0[1-9]|[1-2][0-9]|30)|02(0[1-9]|[1-2][0-9]))[0-9]{3}[0-9Xx]$/;//闰年出生日期的合法性正则表达式
  			} else {
  			ereg=/^[1-9][0-9]{5}[1-2][0-9][0-9]{2}((01|03|05|07|08|10|12)(0[1-9]|[1-2][0-9]|3[0-1])|(04|06|09|11)(0[1-9]|[1-2][0-9]|30)|02(0[1-9]|1[0-9]|2[0-8]))[0-9]{3}[0-9Xx]$/;//平年出生日期的合法性正则表达式
  			}
  			if(ereg.test(idcard)){//测试出生日期的合法性
  			//计算校验位
  			S = (parseInt(idcard_array[0]) + parseInt(idcard_array[10])) * 7
  			+ (parseInt(idcard_array[1]) + parseInt(idcard_array[11])) * 9
  			+ (parseInt(idcard_array[2]) + parseInt(idcard_array[12])) * 10
  			+ (parseInt(idcard_array[3]) + parseInt(idcard_array[13])) * 5
  			+ (parseInt(idcard_array[4]) + parseInt(idcard_array[14])) * 8
  			+ (parseInt(idcard_array[5]) + parseInt(idcard_array[15])) * 4
  			+ (parseInt(idcard_array[6]) + parseInt(idcard_array[16])) * 2
  			+ parseInt(idcard_array[7]) * 1
  			+ parseInt(idcard_array[8]) * 6
  			+ parseInt(idcard_array[9]) * 3 ;
  			Y = S % 11;
  			M = "F";
  			JYM = "10X98765432";
  			M = JYM.substr(Y,1);//判断校验位
  			if(M == idcard_array[17]) return true; //检测ID的校验位
  			else return false;
  			}
  			else return false;
  			break;
  			default:
  			return false;
  			break;
  			}


      }
      catch(e)
      {
          return false;
      }
		   },

		   /*非中文验证*/
		  user_name:function(value, element, params) {
		    return this.optional(element) || /^\w+$/.test(value);
		},
		   /*验证下拉菜单*/
		on_select:function(value,element,params){
			return value!=null&&value!=""&&value!="-1";
		},
		showName:function(value,element,param){
			return value;
		},
		
		/*验证银行存折*/
		bankBookValidate:function(value,element,param){
			var result=false;
			var str=$.trim(value);
			if(str.length>0 && !isNaN(str)){
				//北京银行
				if($("#"+param).val()=="21"){
				
					if(str.length=="13"){
						//数组存储符合条件的存折的前六个字符
						var heads=new Array("602969","621030","421317","422160","422161"); 
						if(heads.indexOf(str.substring(0,6))>-1){
							return true;
						}
					}
				
				//福建兴业银行
				}else if($("#"+param).val()=="12"){
					if(str.length=="18"){
						//定义数组存储符合条件的存折的前六位数字
						var heads=new Array("966666","622908","622909");
						if(heads.indexOf(str.substring(0,6))>-1){
							return true;
						}
					}
					
					
				//邮政储蓄
				}else if($("#"+param).val()=="20"){
					if(str.length=="18" || str.length=="19"){
						if(str.substring(0,4)=="6010"){
							return true;
						}
					}
				//工商银行	
				}else if($("#"+param).val()=="2"){
				
					if(str.length=="19"){
						if(str.substring(0,4)=="0200"){
							return true;
						}
					}
				//中信银行
				}else if($("#"+param).val()=="23"){
					if(str.length=="19"){
						if(str.substring(0,1)=="7"){
							return true;
						}
					}
					
			    //建设银行
				}else if($("#"+param).val()=="1"){
					if(str.length=="19"){
						if(str.substring(0,3)=="110"){
							return true;
						}
					}
				}else{
					return true;
				}
			}
			
			return result;
		},
		
		/*
		 * 验证银行卡
		 */
		bankCardValidate:function(value,element,param){
			var result=false;
			var str=$.trim(value);
				//验证数字
				if(str.length>0 &&!isNaN(str)){
					//招商银行
					if($("#"+param).val()=="10"){
						//判断账户长度
						if(str.length=="16"||str.length=="12"){
							//截取账号的前六个数字
							var cardHead=str.substring(0,6);
							//数组保存所有符合该银行的卡头
							var heads=new Array("410062","468203","512425","524011","622580",
									"622588","622608","622609","955550","690755","621286"); 
								if(heads.indexOf(cardHead)>-1){
									return  true;
								}
						}
					 //北京银行
				    }else if($("#"+param).val()=="21"){  
				    	//判断账户长度
				    	if(str.length=="16"){
							//截取账号的前六个数字
							var cardHead=str.substring(0,6);
							//数组保存所有符合该银行的卡头
							var heads=new Array("602969","621030","421317","422160","422161"); 
								if(heads.indexOf(cardHead)>-1){
									return true;
								}
						}
				     //交通银行
					}else if($("#"+param).val()=="5"){
						//判断账户长度
						if(str.length=="17"||str.length=="19"){
							//定义数组存储改行的银行卡卡头
							var heads=new Array("601428","405512","622258091","622260");
							if(heads.indexOf(str.substring(0,6))>-1||heads.indexOf(str.substring(0,9))>-1){
								return true;
							}
						}
					//农业银行	
					}else if($("#"+param).val()=="3"){
						//判断账户长度
						if(str.length=="19"){
							//判断卡头
							if(value.substring(0,5)=="95599" ||
									(str.substring(0,4)=="6228" && str.substring(6,9)=="001")){
								return true;
							}
							
						}
					//福建兴业银行
					}else if($("#"+param).val()=="12"){
						//判断账户长度
						if(str.length=="18"){
							//定义数组存储改行的银行卡卡头
							var heads=new Array("966666","622908","622909");
							var cardHead=str.substring(0,6);
							if(heads.indexOf(cardHead)>-1){
								return true;
							}
						}
					//民生银行
					}else if($("#"+param).val()=="11"){
						//判断账户长度
						if(str.length=="16"){
							//定义数组存储改行的银行卡卡头
							var  heads=new Array("415599","421393","421865",
									"427570","427571","472067","472068",
									"488888","622616","622617","622618","622620","622622");
							var cardHead=str.substring(0,6);
							if(heads.indexOf(cardHead)>-1){
								return true;
							}
						}
					//华夏银行
					}else if($("#"+param).val()=="7"){
						//判断账户长度
						if(str.length=="16"){
							//定义数组存储改行的银行卡卡头
							var heads=new Array("4315","62263001","62263101","62263201","622633");
							if(heads.indexOf(str.substring(0,4))>-1||
									heads.indexOf(str.substring(0,8))>-1 ||
									heads.indexOf(str.substring(0,6))>-1){
								return true;
							}
							
						}
					//深圳发展银行
					}else if($("#"+param).val()=="22"){
						//判断账户长度
						if(str.length=="16"){
							//定义数组存储改行的银行卡卡头
							var heads=new Array("998800","622538","412963");
							if(heads.indexOf(str.substring(0,6))>-1){
								return true;
							}
						}
					//广大银行
					}else if($("#"+param).val()=="8"){
						//判断账户长度
						if(str.length=="16"){
							//定义数组存储改行的银行卡卡头
							var heads=new Array("3033","9003","6226");
							if(heads.indexOf(str.substring(0,4))>-1){
								return true;
							}
						}
					//邮政储蓄
					}else if($("#"+param).val()=="20"){
						//判断账户长度
						//if(str.length=="18" || str.length=="19"){
						//	if(value.substring(0,4)=="6010"){
							//	return true;
							//}
						//}
						return true;
					//工商银行
					}else if($("#"+param).val()=="2"){
						//判断账户长度
						if(str.length=="16" || str.length=="19"){
							//定义数组存储改行的银行卡卡头
							var heads=new Array("53098010","45806010","622202"
									,"622203","955880","955881","955882","955888",
									"622200","622202","622203","622208","621225",
									"621226","621227","621288","620058"
									);
							if(heads.indexOf(str.substring(0,8))>-1 ||
									heads.indexOf(str.substring(0,6))>-1||
									str.substring(7,11)=="0200"){
								return true;
							}
						}
					//中信实业银行	
					}else if($("#"+param).val()=="23"){
						//判断账户长度
						if(str.length=="19"){
							if(str.substring(0,1)=="7"){
								return true;
							}
						}
					//中国银行
					}else if($("#"+param).val()=="4"){
						//判断账户长度
						if(str.length=="19" || str.length=="16"){
							if(str.substring(0,5)=="45635" || str.substring(0,4)=="6227"||str.substring(0,1)=="5"){
								return true;
							}
						}
					//上海浦东发展银行
					}else if($("#"+param).val()=="25"){
						//判断账户长度
						if(str.length=="16"){
							//定义数组存储改行的银行卡卡头
							var heads=new Array("984301","984303","622516","622517",
									"622519","622520","622521","622522","62252306");
							if(heads.indexOf(str.substring(0,6))>-1 ||heads.indexOf(str.substring(0,8))>-1){
								return true;
							}
						}
				    //广东发展银行
					}else if($("#"+param).val()=="17"){
						//判断账户长度
						if(str.length=="18" || str.length=="19"){

							//定义数组存储改行的银行卡卡头
							var heads=new Array("137","685800137","62256837");
							if(heads.indexOf(str.substring(0,3))>-1||heads.indexOf(str.substring(0,9))>-1
									||heads.indexOf(str.substring(0,8))>-1||
									(str.substring(0,4)=="9111" && str.substring(6,8)=="37" 
										&& parseInt(str.substring(4,6))>=21 
										&&parseInt(str.substring(4,6))<=60)){
								return true;
							}
							
						}
					//建设银行
					}else if($("#"+param).val()=="1"){
						//判断账户长度
						if(str.length=="16" ||str.length=="19" ){
							//定义数组存储改行的银行卡卡头
							var heads=new Array("436742001","622700001","622280001",
									"421349001","434061001","434062001","526410001",
									"524094001","552245001","622280","622700");
							if(heads.indexOf(str.substring(0,9))>-1 ||
									heads.indexOf(str.substring(0,6))>-1
									){
								return true;
							}
						}
					}
					
				}
				return result;
		},
		/*
		 * numberCheck :[9,4]
		 * 
		 */
		numberCheck:function(value,element,params){
			if(!params[1]){
				var ex = "/^[0-9]{1,"+params+"}$/";
				return eval(ex).test(value)&&value.indexOf(".")<0;
			}else{
				var num = params[0];
				var fl = params[1];
				
				if(value.indexOf(".")<0){
					var ex = "/^[0-9]{0,"+num+"}$/";
					return eval(ex).test(value);
				}else{
					var ex = "/^[0-9]{0,"+num+"}$/";
					var ex2 = "/^[0-9]+(\.[0-9]{0,"+fl+"})?$/";
					return this.optional(element)||(eval(ex).test(value.substring(0,value.indexOf(".")))&&eval(ex2).test(value)&&value.substring(value.indexOf(".")+1));
				}
			}
		},
		checkName:function(value,element,params){
			//return !/^\s|\s$|[\u4e00-\u9fa5]\s/.test(value);  2013-11-11 史俊伟修改
			return /^(([\u4e00-\u9fa5]+)|([A-Z]{1}[a-z]*[\s]?[a-zA-Z]*))$/.test(value);
		},
		//验证雇员姓名中不能有特殊符号
		checkEmpName:function(value,element,params){
			return  /^[^?!@#$%\\^&*()]+/.test(value);
		},
		checkCode:function(value,element,params){
			return this.optional(element) ||/^[A-Za-z0-9_	-]+$/.test(value);
		},
		// http://docs.jquery.com/Plugins/Validation/Methods/creditcard
		// based on http://en.wikipedia.org/wiki/Luhn

		// http://docs.jquery.com/Plugins/Validation/Methods/accept
		accept: function(value, element, param) {
			param = typeof param == "string" ? param : "png|jpe?g|gif";
			return this.optional(element) || value.match(new RegExp(".(" + param + ")$", "i"));
		},
		// http://docs.jquery.com/Plugins/Validation/Methods/equalTo
		equalTo: function(value, element, param) {
			return value == $(param).val();
		},
		lessThan:function(value, element, param) {
			//比较两个字段的大小
			var tarValue = $(element).parents("form").find("input[name='"+param+"']").attr("value");
			if(tarValue==undefined||tarValue==""){
				return false;
			}else{
				return Number(value)<=Number(tarValue);
			}
		},
		lessThanNull:function(value, element, param) {
			//比较两个字段的大小
			var tarValue = $(element).parents("form").find("input[name='"+param+"']").attr("value");
			if(tarValue==undefined||tarValue==""){
				return true;
			}else{
				return Number(value)<=Number(tarValue);
			}
		},
		greatThan:function(value, element, param) {
			var tarValue = $(element).parents("form").find("input[name='"+param+"']").attr("value");
			if(tarValue==undefined||tarValue==""){
				return false;
			}else{
				return Number(value)>=Number(tarValue);
			}
		},
		greatThanAllowNull:function(value, element, param) {
			var tarValue = $(element).parents("form").find("input[name='"+param+"']").attr("value");
			if((tarValue==undefined||tarValue=="")&&(value==undefined||value=="")){
				return true;
			}else if((tarValue!=undefined&&tarValue!="")){
				if(value==undefined||value==""){
					return true;
				}else{
					var regS = new RegExp("-","gi");
					value = value.replace(regS,"/");
					tarValue = tarValue.replace(regS,"/");
					return new Date(Date.parse(value)) > new Date(Date.parse(tarValue));
				}
			}
		},
		greatThanNull:function(value, element, param) {
			var tarValue = $(element).parents("form").find("input[name='"+param+"']").attr("value");
			if(tarValue==undefined||tarValue==""||value==""){
				return true;
			}else{
				return Number(value)>=Number(tarValue);
			}
		},
		dateLessThan:function(value, element, param) {
			//时间比较两个字段的大小
			var tarValue = $(element).parents("form").find("input[name='"+param+"']").attr("value");
			if(value==""||value==null||value==undefined||tarValue==undefined||tarValue==""){
				return true;
			}else{
				var regS = new RegExp("-","gi");
				value = value.replace(regS,"/");
				tarValue = tarValue.replace(regS,"/");
				return new Date(Date.parse(value)) < new Date(Date.parse(tarValue));
			}
		},
		dateGreatThan:function(value, element, param) {
			//时间比较两个字段的大小
			var tarValue = $(element).parents("form").find("input[name='"+param+"']").attr("value");
			if(value==""||value==null||value==undefined||tarValue==undefined||tarValue==""){
				return true;
			}else{
				var regS = new RegExp("-","gi");
				value = value.replace(regS,"/");
				tarValue = tarValue.replace(regS,"/");
				return new Date(Date.parse(value)) > new Date(Date.parse(tarValue));
			}
		},dateLessEqThan:function(value, element, param) {
			//时间比较两个字段的大小
			var tarValue = $(element).parents("form").find("input[name='"+param+"']").attr("value");
			if(value==""||value==null||value==undefined||tarValue==undefined||tarValue==""){
				return true;
			}else{
				var regS = new RegExp("-","gi");
				value = value.replace(regS,"/");
				tarValue = tarValue.replace(regS,"/");
				return new Date(Date.parse(value)) <= new Date(Date.parse(tarValue));
			}
		},
		dateGreatEqThan:function(value, element, param) {
			//时间比较两个字段的大小
			var tarValue = $(element).parents("form").find("input[name='"+param+"']").attr("value");
			if(value==""||value==null||value==undefined||tarValue==undefined||tarValue==""){
				return true;
			}else{
				var regS = new RegExp("-","gi");
				value = value.replace(regS,"/");
				tarValue = tarValue.replace(regS,"/");
				return new Date(Date.parse(value)) >= new Date(Date.parse(tarValue));
			}
		},
		numberScale:function(value, element, param){
			if($.trim(value)==""&&value!="")
				return false;
			return this.optional(element) || /^[0-9]+(\.[0-9]{0,2})?$/.test(value);
		},
		/*公积金验证流水余额是否小于10*/
		moneylessthanten:function(value, element){
			return Number(value)>10;
		},
		/**组织机构代码验证**/
		orgCode: function( value, element, param ) {
//            return this.optional(element) || ( value.length >= 8 && value.length <= 9 );
            return this.optional(element) || (/^[A-Z0-9]{8}-[A-Z0-9]$/.test(value));	//2013-11-14  周宝修改
		},
		/*7-9位的有效护照号码*/
		passport:function(value, element, param){
			return this.optional(element) || (/^[^\u4e00-\u9fa5]{7,9}$/.test(value));
		}
	}

});

})(jQuery);

// ajax mode: abort
// usage: $.ajax({ mode: "abort"[, port: "uniqueport"]});
// if mode:"abort" is used, the previous request on that port (port can be undefined) is aborted via XMLHttpRequest.abort()
;(function($) {
	var ajax = $.ajax;
	var pendingRequests = {};
	
	$.ajax = function(settings) {
		// create settings for compatibility with ajaxSetup
		settings = $.extend(settings, $.extend({}, $.ajaxSettings, settings));
		var port = settings.port;
		if (settings.mode == "abort") {
			if ( pendingRequests[port] ) {
				pendingRequests[port].abort();
			}
			return (pendingRequests[port] = ajax.apply(this, arguments));
		}
		return ajax.apply(this, arguments);
	};
})(jQuery);

// provides cross-browser focusin and focusout events
// IE has native support, in other browsers, use event caputuring (neither bubbles)

// provides delegate(type: String, delegate: Selector, handler: Callback) plugin for easier event delegation
// handler is only called when $(event.target).is(delegate), in the scope of the jquery-object for event.target

// provides triggerEvent(type: String, target: Element) to trigger delegated events
;(function($) {
	$.each({
		focus: 'focusin',
		blur: 'focusout'
	}, function( original, fix ){
		$.event.special[fix] = {
			setup:function() {
				if ( $.browser.msie ) return false;
				this.addEventListener( original, $.event.special[fix].handler, true );
			},
			teardown:function() {
				if ( $.browser.msie ) return false;
				this.removeEventListener( original,
				$.event.special[fix].handler, true );
			},
			handler: function(e) {
				arguments[0] = $.event.fix(e);
				arguments[0].type = fix;
				return $.event.handle.apply(this, arguments);
			}
		};
	});
	$.extend($.fn, {
		delegate: function(type, delegate, handler) {
			return this.bind(type, function(event) {
				var target = $(event.target);
				if (target.is(delegate)) {
					return handler.apply(target, arguments);
				}
			});
		},
		triggerEvent: function(type, target) {
			return this.triggerHandler(type, [$.event.fix({ type: type, target: target })]);
		}
	})
})(jQuery);
