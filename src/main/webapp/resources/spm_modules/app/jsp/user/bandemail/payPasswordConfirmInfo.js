define('app/jsp/user/bandemail/payPasswordConfirmInfo', function (require, exports, module) {
    'use strict';
    var $=require('jquery'),
    Widget = require('arale-widget/1.2.0/widget'),
    Dialog = require("artDialog/src/dialog"),
    Uploader = require('arale-upload/1.2.0/index'),
    AjaxController=require('opt-ajax/1.0.0/index');
    
    require("jsviews/jsrender.min");
    require("jsviews/jsviews.min");
    require("treegrid/js/jquery.treegrid.min");
    require("treegrid/js/jquery.cookie");
    
    
    //实例化AJAX控制处理对象
    var ajaxController = new AjaxController();
    
    //定义页面组件类
    var ConfirmInfoPager = Widget.extend({
    	//属性，使用时由类的构造函数传入
    	attrs: {
    	},
    	//事件代理
    	events: {
    		//key的格式: 事件+空格+对象选择器;value:事件方法
    		"click [id='submitBtn']":"_confirmInfo",
    		"click [id='sendVerify']":"_sendVerify",
    		"click [id='random_img']":"_getImageRandomCode",
    		"click [id='changeImage']":"_getImageRandomCode",
    		"blur [id='email']":"_checkEmail",
    		"click [id='next']":"_next",
    		"click [id='passwordNext']":"_passwordNext"
        },
        init: function(){
        	_initShowView();
        	_getImageRandomCode();
        },
    	//重写父类
    	setup: function () {
    		ConfirmInfoPager.superclass.setup.call(this);
    		this._renderAccountInfo();
    	},
    
    	//加载账户数据
    	_renderAccountInfo: function(){
			var _this = this;
			//初始化展示页面
			_this._initShowView();
		},
		//初始化展示页面
		_initShowView:function(){
			 //左侧菜单显示样式
	   		$("#setEmail").addClass("current");
	   		//标题显示
	   		$("#set_title_id").html("绑定邮箱");
	   		$("#updateEmail").addClass("current");
			$("#confirmType").val("1");
			$("#confirmTypeName").html("已验证手机");
			$("#verifyName").html("短信校验码");
		},
		_getImageRandomCode:function(){
			var timestamp = (new Date()).valueOf();
			$("#pictureVerifyCode").val("");
			$("#random_img").attr("src",_base+"/user/bandEmail/getImageVerifyCode?timestamp="+timestamp);
		},
		_sendVerify:function(){
			var _this = this;
			$("#sendVerify").attr("disabled", true);
			ajaxController.ajax({
				type : "POST",
				data : {
				},
				dataType: 'json',
				url :_base+"/user/bandEmail/sendVerify?confirmType=1",
				processing: true,
				message : "正在处理中，请稍候...",
				success : function(data) {
					var resultCode = data.responseHeader.resultCode;
					if(resultCode=="100000"){
						var url = data.data;
						window.location.href = _base+url;
					}else{
						if(resultCode=="000000"){
							var step = 59;
				            $('#sendVerify').val('重新发送60');
				            $("#sendVerify").attr("disabled", true);
				            var _res = setInterval(function(){
				                $("#sendVerify").attr("disabled", true);//设置disabled属性
				                $('#sendVerify').val(step+'s后重新发送');
				                step-=1;
				                if(step <= 0){
				                $("#sendVerify").removeAttr("disabled"); //移除disabled属性
				                $('#sendVerify').val('获取验证码');
				                clearInterval(_res);//清除setInterval
				                }
				            },1000);
						}else{
							$("#sendVerify").removeAttr("disabled");
						}
						if(resultCode=="100002"){
							_this._controlMsgText("verifyCodeMsg",data.statusInfo);
							_this._controlMsgAttr("verifyCodeMsg",2);
			        	}else{
			        		_this._controlMsgText("verifyCodeMsg","");
			        		_this._controlMsgAttr("verifyCodeMsg",1);
			        	}
					}
				},
				failure : function(){
					$("#sendVerify").removeAttr("disabled"); //移除disabled属性
				},
				error : function(){
					alert("网络连接超时!");
				}
			});
		},
		//检查验证码
		_checkVerifyCode: function(){
			var verifyCode = jQuery.trim($("#pictureVerifyCode").val());
			if(verifyCode == "" || verifyCode == null || verifyCode == undefined){
				$("#verifyCodeErrorMsg").show();
	    		this._controlMsgText("verifyCodeMsg","请输入验证码");
				this._controlMsgAttr("verifyCodeMsg",2);
				return false;
			}else{
				$("#verifyCodeErrorMsg").hide();
				this._controlMsgText("verifyCodeMsg","");
				this._controlMsgAttr("verifyCodeMsg",1);
				return true;
			}
			
		},
		//检查验证码
		_checkPictureVerifyCode: function(){
			var verifyCode = jQuery.trim($("#pictureVerifyCode").val());
			if(verifyCode == "" || verifyCode == null || verifyCode == undefined){
				this._controlMsgText("pictureVerifyMsg","请输入图形验证码");
				this._controlMsgAttr("pictureVerifyMsg",2);
				return false;
			}else{
				this._controlMsgText("pictureVerifyMsg","");
				this._controlMsgAttr("pictureVerifyMsg",1);
				return true;
			}
		},
		_checkPhoneVerifyCode: function(){
			var verifyCode = jQuery.trim($("#phoneVerifyCode").val());
			if(verifyCode == "" || verifyCode == null || verifyCode == undefined){
				$("#phoneVerifyCodeError").show();
				this._controlMsgText("phoneVerifyCodeMsg","请输入手机验证码");
				this._controlMsgAttr("phoneVerifyCodeMsg",2);
				return false;
			}else{
				$("#phoneVerifyCodeError").hide();
				this._controlMsgText("phoneVerifyCodeMsg","");
				this._controlMsgAttr("phoneVerifyCodeMsg",1);
				return true;
			}
		},
		//控制显示内容
		_controlMsgText: function(id,msg){
			var doc = document.getElementById(id+"");
			doc.innerText=msg;
		},
		//控制显隐属性 1:隐藏 2：显示
		_controlMsgAttr: function(id,flag){
			var doc = document.getElementById(id+"");
			if(flag == 1){
				doc.setAttribute("style","display:none");
			}else if(flag == 2){
				doc.setAttribute("style","display");
			}
		},
		_next:function(){
			var _this = this;
			var checkPhoneVerifyCode = this._checkPhoneVerifyCode();
			alert(checkPhoneVerifyCode);
			if(!checkPhoneVerifyCode){
    			return false;
    		}
			ajaxController.ajax({
				type : "POST",
				data : _this._getSafetyConfirmData(),
				dataType: 'json',
				url :_base+"/user/bandEmail/confirmInfo",
				processing: true,
				message : "正在处理中，请稍候...",
				success : function(data) {
					var status = data.responseHeader.resultCode;
					if(status == "000000"){
						window.location.href=_base+"/user/bandEmail/updateSuccess"
					}else{
						var msg = data.statusInfo;
						//验证码
						if(status == "100002"){
							$("#phoneVerifyCodeError").show();
							_this._controlMsgText("phoneVerifyCodeMsg",msg);
							_this._controlMsgAttr("phoneVerifyCodeMsg",2);
						}else{
							$("#phoneVerifyCodeError").hide();
							_this._controlMsgText("phoneVerifyCodeMsg","");
							_this._controlMsgAttr("phoneVerifyCodeMsg",1);
						}
					}
				},
				error : function(){
					alert("网络连接超时，请重新修改登录密码");
				}
			});
		
		},
		//检查身份信息
		_confirmInfo:function(){
			var _this = this;
			var checkVerifyCode = this._checkVerifyCode();
			if(!checkVerifyCode){
    			return false;
    		}
			ajaxController.ajax({
				type : "POST",
				data : _this._getSafetyConfirmData(),
				dataType: 'json',
				url :_base+"/user/bandEmail/confirmInfo",
				processing: true,
				message : "正在处理中，请稍候...",
				success : function(data) {
					var status = data.responseHeader.resultCode;
					if(status == "000000"){
						var url = data.data;
						var bandNewEmail = $("#bandNewEmail").val();
						var emailType = "updateEmail";
						if(bandNewEmail != "" && bandNewEmail != null && bandNewEmail != undefined){
							emailType = "bandEmail";
						}
						var email = $("#email").html();
						if(email==""||email==null){
							email = $("#email").val();
						}
						
						ajaxController.ajax({
							type : "POST",
							data : {
								"email":email,
								"emailType":emailType
							},
							dataType: 'json',
							url :_base+"/user/bandEmail/sendEmail",
							processing: true,
							message : "正在处理中，请稍候...",
							success : function(data) {
								var resultCode = data.responseHeader.resultCode;
								if(resultCode == "100000"){
									var url = data.data;
								}else{
									if(resultCode=="000000"){
										var step = 59;
							            $('#submitBtn').val('重新发送60');
							            $("#submitBtn").attr("disabled", true);
							            var _res = setInterval(function(){
							                $("#submitBtn").attr("disabled", true);//设置disabled属性
							                $('#submitBtn').val('重新发送'+step);
							                step-=1;
							                if(step <= 0){
							                $("#submitBtn").removeAttr("disabled"); //移除disabled属性
							                $('#submitBtn').val('获取验证码');
							                clearInterval(_res);//清除setInterval
							                }
							            },1000);
							            window.location.href = _base+"/user/bandEmail/sendUpdateEmailSuccess";
									}else{
										$("#sendEmailBtn").removeAttr("disabled");
									}
									if(resultCode=="100002"){
										$("#verifyCodeErrorMsg").show();
										_this._controlMsgText("verifyCodeMsg",data.statusInfo);
										_this._controlMsgAttr("verifyCodeMsg",2);
						        	}else{
						        		_this._controlMsgText("verifyCodeMsg","");
						        		_this._controlMsgAttr("verifyCodeMsg",1);
						        	}
								}
							},
							failure : function(){
								$("#sendEmailBtn").removeAttr("disabled"); //移除disabled属性
							},
							error : function(){
								alert("网络连接超时!");
							}
						});
					}else{
						var msg = data.statusInfo;
						//验证码
						if(status == "100002"){
							_this._controlMsgText("verifyCodeMsg",msg);
							_this._controlMsgAttr("verifyCodeMsg",2);
						}else{
							_this._controlMsgText("verifyCodeMsg","");
							_this._controlMsgAttr("verifyCodeMsg",1);
						}
						//图片验证码
						if(status == "100001"){
							$("#verifyCodeErrorMsg").show();
							_this._controlMsgText("verifyCodeMsg",msg);
							_this._controlMsgAttr("verifyCodeMsg",2);
						}else{
							$("#verifyCodeErrorMsg").hide();
							_this._controlMsgText("verifyCodeMsg","");
							_this._controlMsgAttr("verifyCodeMsg",1);
						}
					}
				},
				error : function(){
					alert("网络连接超时，请重新修改登录密码");
				}
			});
		},
		_checkEmail:function(){
    		var isOk = this._checkEmailFormat();
    		if(isOk){
    			isOk = this._checkEmailValue();
    		}
    		return isOk;
    	},
    	_sendEmail:function(){
			ajaxController.ajax({
				type : "POST",
				data : {
					"email": function(){
						return $("#email").val()
					}
				},
				dataType: 'json',
				url :_base+"/user/bandEmail/sendEmail",
				processing: true,
				message : "正在处理中，请稍候...",
				success : function(data) {
					var resultCode = data.responseHeader.resultCode;
					if(resultCode == "100000"){
						var url = data.data;
						window.location.href = _base+"/user/bandEmail/sendEmailSuccess";
					}else{
						if(resultCode=="000000"){
							var step = 59;
				            $('#sendPhoneBtn').val('重新发送60');
				            $("#sendEmailBtn").attr("disabled", true);
				            var _res = setInterval(function(){
				                $("#sendEmailBtn").attr("disabled", true);//设置disabled属性
				                $('#sendEmailBtn').val('重新发送'+step);
				                step-=1;
				                if(step <= 0){
				                $("#sendEmailBtn").removeAttr("disabled"); //移除disabled属性
				                $('#sendEmailBtn').val('获取验证码');
				                clearInterval(_res);//清除setInterval
				                }
				            },1000);
				            window.location.href = _base+"/user/bandEmail/sendEmailSuccess";
						}else{
							$("#sendEmailBtn").removeAttr("disabled");
						}
						if(resultCode=="100002"){
							_this._controlMsgText("verifyCodeMsg",data.statusInfo);
							_this._controlMsgAttr("verifyCodeMsg",2);
			        	}else{
			        		_this._controlMsgText("verifyCodeMsg","");
			        		_this._controlMsgAttr("verifyCodeMsg",1);
			        	}
					}
				},
				failure : function(){
					$("#sendEmailBtn").removeAttr("disabled"); //移除disabled属性
				},
				error : function(){
					alert("网络连接超时!");
				}
			});
		},
    	//检查邮件格式
		_checkEmailFormat: function(){
			var email = jQuery.trim($("#email").val());
			var msg = "";
			if(email == "" || email == null || email == undefined){
				$("#emailMsgError").show();
				msg = "请输入邮箱地址";
			}else if(!/^(\w-*\.*)+@(\w-?)+(\.\w{2,})+$/.test(email)){
				$("#emailMsgError").show();
				msg = "邮箱地址格式错误";
			}
			if(msg == ""){
				this._controlMsgText("emailMsg","");
				this._controlMsgAttr("emailMsg",1);
				$("#emailMsgError").hide();
				return true;
			}else{
				this._controlMsgText("emailMsg",msg);
				this._controlMsgAttr("emailMsg",2);
				return false;
			}
		},
		//检查新邮箱是否唯一
		_checkEmailValue: function(){
			var _this = this;
			var isOk = false;
			ajaxController.ajax({
				type : "POST",
				data : {
					"email": function(){
						return $("#email").val()
					}
				},
				dataType: 'json',
				url :_base+"/user/bandEmail/checkEmailValue",
				async: false,
				processing: true,
				message : "正在处理中，请稍候...",
				success : function(data) {
					var resultCode = data.responseHeader.resultCode;
					if(resultCode == "100000"){
						isOk = false;
						var url = data.data;
						window.location.href = _base+url;
					}else{
						if(resultCode=="100006"){
				        	_this._controlMsgText("emailMsg",data.statusInfo);
							_this._controlMsgAttr("emailMsg",2);
							isOk = false;
				        }else{
				        	_this._controlMsgText("emailMsg","");
				        	_this._controlMsgAttr("emailMsg",1);
				        	isOk = true;
				        }
					}
				},
				error : function(){
					alert("网络连接超时!");
				}
			});
			return isOk;
		},
		//获取界面填写验证信息
		_getSafetyConfirmData:function(){
			return{
				"confirmType":function () {
			        return $('input:radio:checked').val();
			    },
				"pictureVerifyCode":function () {
			        return jQuery.trim($("#pictureVerifyCode").val())
			    },
				"verifyCode":function () {
			        return jQuery.trim($("#phoneVerifyCode").val())
			    }
			}
		},
		//隐藏手机提示信息
    	_hidePhoneError: function(){
    		$("#errorPhoneMsg").attr("style","display:none");
    	},
    	//校验手机
    	_validServicePho: function(){
    		$("#errorPhoneMsg").attr("style","display:none");
    		var phone = $('#phone').val();
    		if (phone==""){
    			$("#phoneText").show();
    			$('#showPhoneMsg').text("请输入手机号码");
    			$("#errorPhoneMsg").attr("style","display:");
    			$('#errorPhoneFlag').val("0");
    			$('#phoneImage').attr('src',_base+'/theme/slp/images/icon-a.png');
				return false;
			}else if( /^0?1[3|4|5|8][0-9]\d{8}$/.test(phone)){
				var	param={
    					userMp:$("#phone").val()
    				   };
        		ajaxController.ajax({
    			        type: "post",
    			        processing: false,
    			        url: _base+"/user/payPassword/checkPhone",
    			        dataType: "json",
    			        data: param,
    			        message: "正在加载数据..",
    			        success: function (data) {
    			         if(data.responseHeader.resultCode=="10003"){
    			        	    $("#errorPhoneMsg").show();
    			        	 	$("#phoneText").show();
    			        	 	$("#showPhoneMsg").show();
    			        	 	$("#phoneImage").show();
    			        		$('#phoneText').text("手机号码已注册");
    			        		$('#phoneImage').attr('src',_base+'/theme/slp/images/icon-a.png');
    							$('#errorPhoneFlag').val("0");
    							return false;
    			        	}else if(data.responseHeader.resultCode=="000000"){
    			        		$("#errorPhoneMsg").show();
    			        		$("#phoneText").hide();
    			        		$('#errorPhoneFlag').val("1");
    			        		$('#phoneImage').attr('src',_base+'/theme/slp/images/icon-b.png');
    			        	}
    			        	
    			        },
    			        error: function(XMLHttpRequest, textStatus, errorThrown) {
    						 alert(XMLHttpRequest.status);
    						 alert(XMLHttpRequest.readyState);
    						 alert(textStatus);
    						}
    			        
    			    }); 
			}else{
				$("#errorPhoneMsg").attr("style","display:");
				$("#phoneText").show();
				$('#phoneImage').attr('src',_base+'/theme/slp/images/icon-a.png');
				$('#showPhoneMsg').text("请输入正确有效的手机号码");
				$('#errorPhoneFlag').val("0");
				return false;
			}
    	},
    	_passwordNext:function(){
			ajaxController.ajax({
				type : "POST",
				data : this._getSafetyConfirmData(),
				dataType: 'json',
				url :_base+"/user/payPassword/confirmInfo",
				processing: true,
				message : "正在处理中，请稍候...",
				success : function(data) {
					var status = data.responseHeader.resultCode;
					if(status == "000000"){
						window.location.href=_base+"/user/payPassword/setPayPassword"
					}else{
						var msg = data.statusInfo;
						//验证码
						if(status == "100002"){
							$("#phoneVerifyCodeError").show();
							_this._controlMsgText("phoneVerifyCodeMsg",msg);
							_this._controlMsgAttr("phoneVerifyCodeMsg",2);
						}else{
							$("#phoneVerifyCodeError").hide();
							_this._controlMsgText("phoneVerifyCodeMsg","");
							_this._controlMsgAttr("phoneVerifyCodeMsg",1);
						}
					}
				},
				error : function(){
					alert("网络连接超时，请重新修改登录密码");
				}
			});
		
    		
    	}
    });
    
    
    module.exports = ConfirmInfoPager
});