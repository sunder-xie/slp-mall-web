define('app/jsp/order/orderSubmit', function (require, exports, module) {
    'use strict';
    var $=require('jquery'),
    Widget = require('arale-widget/1.2.0/widget'),
    Dialog = require("artDialog/src/dialog"),
    Paging = require('paging/0.0.1/paging-debug'),
    AjaxController = require('opt-ajax/1.0.0/index');
    require("jsviews/jsrender.min");
    require("jsviews/jsviews.min");
    require("bootstrap-paginator/bootstrap-paginator.min");
    require("app/util/jsviews-ext");
    
    require("opt-paging/aiopt.pagination");
    require("twbs-pagination/jquery.twbsPagination.min");
    var SendMessageUtil = require("app/util/sendMessage");
    
    //实例化AJAX控制处理对象
    var ajaxController = new AjaxController();
    //定义页面组件类
    var OrderSubmitPager = Widget.extend({
    	
    	Implements:SendMessageUtil,
    	//属性，使用时由类的构造函数传入
    	attrs: {
    	},
    	Statics: {
    		DEFAULT_PAGE_SIZE: 10
    	},
    	//事件代理
    	events: {
    		//查询
            "click #useBalanceChk":"_showBalanceBtnClick",
            "click #useBalanceBtn":"_useBalanceBtnClick"
        },
    	//重写父类
    	setup: function () {
    		OrderSubmitPager.superclass.setup.call(this);
    		this._renderOrderSubmitInfo();
    	},
    	_renderOrderSubmitInfo: function(){
	        if(orderSubmitJson != null && orderSubmitJson != 'undefined'){
	        	var template = $.templates("#orderSubmitTemplate");
    			var htmlOutput = template.render(orderSubmitJson);
    			$("#orderSubmitForm").html(htmlOutput);
	        }else{
    			$("#orderSubmitForm").html("没有相应的订单信息");
	        }
    	},
    	_showBalanceBtnClick:function(){
    		$(".balance-table").slideToggle(100);
    		$(".balance-title").toggleClass("reorder remove");
      	},
      	_useBalanceBtnClick:function(){
      		var balance=$("#useBalance").val();
      		var orderAmount=$("#adjustFee").val()
      		var	param={
					balance: $("#useBalance").val(),
					userPassword:$("#userPassword").val(),
					orderId:$("#orderId").val()
				   };
      		ajaxController.ajax({
						type: "post",
						dataType: "json",
						processing: true,
						message: "账户余额支付中，请等待...",
						url: _base+"/order/usebalance",
						data:param,
						success: function(data){
							if(data.data){
								
							}
						}
					}
      		);
      	}
    	
    });
    
    module.exports = OrderSubmitPager
});

