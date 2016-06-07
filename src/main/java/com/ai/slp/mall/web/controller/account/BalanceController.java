package com.ai.slp.mall.web.controller.account;

import java.sql.Timestamp;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.ModelAndView;

import com.ai.net.xss.util.StringUtil;
import com.ai.opt.sdk.dubbo.util.DubboConsumerFactory;
import com.ai.opt.sdk.util.DateUtil;
import com.ai.opt.sdk.web.model.ResponseData;
import com.ai.opt.base.vo.PageInfo;
import com.ai.slp.balance.api.fundquery.interfaces.IFundQuerySV;
import com.ai.slp.balance.api.fundquery.param.AccountIdParam;
import com.ai.slp.balance.api.fundquery.param.FundInfo;
import com.ai.slp.charge.api.paymentquery.interfaces.IPaymentQuerySV;
import com.ai.slp.charge.api.paymentquery.param.ChargeBaseInfo;
import com.ai.slp.charge.api.paymentquery.param.ChargeInfoQueryByAcctIdParam;
import com.alibaba.fastjson.JSON;

@RestController
public class BalanceController {
	private static final Logger log = LoggerFactory.getLogger(BalanceController.class);
	//
	private static final String ACCOUNT_ID = "10001";
	private static final String TENANT_ID = "BIS-ST";
	private static final int AMOUNT = -777;
	//private static final int 
	//
	@RequestMapping("/account/balance/index")
	public ModelAndView index(HttpServletRequest request) {
		Map<String,Object> paramMap = new HashMap<String,Object>();
		paramMap.put("linkModel", "accountBalance");
		paramMap.put("testName", "zhangzd");
        ModelAndView view = new ModelAndView("jsp/account/balance/index",paramMap);
        return view;
    }
	@RequestMapping("/account/balance/detail")
	public ModelAndView detail(HttpServletRequest request) {
		Map<String,Object> paramMap = new HashMap<String,Object>();
		paramMap.put("linkModel", "accountBalance");
		paramMap.put("testName", "zhangzd");
        ModelAndView view = new ModelAndView("jsp/account/balance_detail/index",paramMap);
        return view;
    }
	
	@RequestMapping("/account/recharge/one")
	public ModelAndView one(HttpServletRequest request) {
		Map<String,Object> paramMap = new HashMap<String,Object>();
		paramMap.put("linkModel", "accountBalance");
		paramMap.put("testName", "zhangzd");
        ModelAndView view = new ModelAndView("jsp/account/recharge/one",paramMap);
        return view;
    }
	@RequestMapping("/account/recharge/two")
	public ModelAndView two(HttpServletRequest request) {
		Map<String,Object> paramMap = new HashMap<String,Object>();
		paramMap.put("linkModel", "accountBalance");
		paramMap.put("testName", "zhangzd");
        ModelAndView view = new ModelAndView("jsp/account/recharge/two",paramMap);
        return view;
    }
	@RequestMapping("/account/recharge/three")
	public ModelAndView three(HttpServletRequest request) {
		Map<String,Object> paramMap = new HashMap<String,Object>();
		paramMap.put("linkModel", "accountBalance");
		paramMap.put("testName", "zhangzd");
        ModelAndView view = new ModelAndView("jsp/account/recharge/three",paramMap);
        return view;
    }
	@RequestMapping("/account/recharge/four")
	public ModelAndView four(HttpServletRequest request) {
		Map<String,Object> paramMap = new HashMap<String,Object>();
		paramMap.put("linkModel", "accountBalance");
		paramMap.put("testName", "zhangzd");
        ModelAndView view = new ModelAndView("jsp/account/recharge/four",paramMap);
        return view;
    }
	//produces = "application/json;charset=UTF-8"
	//produces = "text/html;charset=UTF-8"
	@RequestMapping(value="/account/test",method = RequestMethod.POST, produces = "text/html;charset=UTF-8")
	@ResponseBody
	public String test(HttpServletRequest request) {
		String str2 = "str2";
		Map<String,Object> paramMap = new HashMap<String,Object>();
		paramMap.put("linkModel", "accountBalance");
		paramMap.put("testName", "zhangzd");
		paramMap.put("str2", str2);
		System.out.println("paramMapJson:-------------->>>>:"+JSON.toJSONString(paramMap));
		System.out.println("str2:-------------->>>>:"+str2);
        return str2;
    }
	/**
	 * 查询可用余额
	 * @param request
	 * @return
	 * @author zhangzd
	 * @ApiDocMethod
	 * @ApiCode
	 */
	@RequestMapping(value="/account/queryUsableFund",method = RequestMethod.POST, produces = "text/html;charset=UTF-8")
	@ResponseBody
	public String queryUsableFund(HttpServletRequest request) {
		AccountIdParam accountIdParam = new AccountIdParam();
		accountIdParam.setAccountId(new Long(ACCOUNT_ID));
		accountIdParam.setTenantId(TENANT_ID);
		//
		FundInfo fundInfo = DubboConsumerFactory.getService(IFundQuerySV.class).queryUsableFund(accountIdParam);
		long balance = 0;
		if(null != fundInfo){
			balance = fundInfo.getBalance();
		}
		
		log.info("账户余额："+balance);
		//
		return String.valueOf(balance);
    }
	/**
	 * 查询近七天收支记录
	 * @param request
	 * @return
	 * @author zhangzd
	 * @ApiDocMethod
	 * @ApiCode
	 */
	@RequestMapping(value="/account/queryChargeBaseInfoByAcctId",method = RequestMethod.POST, produces = "application/json;charset=UTF-8")
	@ResponseBody
	public PageInfo<ChargeBaseInfo> queryChargeBaseInfoByAcctId(HttpServletRequest request) {
		ChargeInfoQueryByAcctIdParam chargeInfoQueryByAcctIdParam = new ChargeInfoQueryByAcctIdParam();
		chargeInfoQueryByAcctIdParam.setAccountId(new Long(ACCOUNT_ID));
		chargeInfoQueryByAcctIdParam.setTenantId(TENANT_ID);
		PageInfo<ChargeBaseInfo> chargeBaseInfoPageInfo = new PageInfo<ChargeBaseInfo>();
		chargeBaseInfoPageInfo.setPageNo(1);
		chargeBaseInfoPageInfo.setPageSize(10);
		chargeInfoQueryByAcctIdParam.setPageInfo(chargeBaseInfoPageInfo);
		//
		Calendar cal = Calendar.getInstance();
		cal.add(5, AMOUNT);
		SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
		String sevenDaysAgo = sdf.format(cal.getTime());
		//
		chargeInfoQueryByAcctIdParam.setStartTime(Timestamp.valueOf(sevenDaysAgo));
		chargeInfoQueryByAcctIdParam.setEndTime(DateUtil.getSysDate());
		//
		PageInfo<ChargeBaseInfo> pageInfo = DubboConsumerFactory.getService(IPaymentQuerySV.class).queryChargeBaseInfoByAcctId(chargeInfoQueryByAcctIdParam);
		//
		System.out.println("json:"+JSON.toJSONString(pageInfo));
		return pageInfo;
    }
	
	/**
	 * 高级搜索 账户收支记录查询列表 分页
	 * @param request
	 * @return
	 * @author zhangzd
	 * @ApiDocMethod
	 * @ApiCode
	 */
	@RequestMapping(value="/account/queryAccountBalanceDetailList",method = RequestMethod.POST, produces = "application/json;charset=UTF-8")
	@ResponseBody
	public ResponseData<PageInfo<ChargeBaseInfo>> queryAccountBalanceDetailList(HttpServletRequest request) {
		String strPageNo=(null==request.getParameter("pageNo"))?"1":request.getParameter("pageNo");
        String strPageSize=(null==request.getParameter("pageSize"))?"10":request.getParameter("pageSize");
		//
        String busiType = request.getParameter("busiType");
        //
        String selectDateId = request.getParameter("selectDateId");
        log.info("selectDateId:"+selectDateId);
        //
		String startTime = request.getParameter("startTime");
		String endTime = request.getParameter("endTime");
		log.info("startTime:"+startTime);
		log.info("endTime:"+endTime);
        //
		ResponseData<PageInfo<ChargeBaseInfo>> responseData;
		//
		ChargeInfoQueryByAcctIdParam chargeInfoQueryByAcctIdParam = new ChargeInfoQueryByAcctIdParam();
		chargeInfoQueryByAcctIdParam.setAccountId(new Long(ACCOUNT_ID));
		chargeInfoQueryByAcctIdParam.setTenantId(TENANT_ID);
		//
		if(!StringUtil.isBlank(busiType)){
			chargeInfoQueryByAcctIdParam.setBusiType(busiType);
		}
		PageInfo<ChargeBaseInfo> chargeBaseInfoPageInfo = new PageInfo<ChargeBaseInfo>();
		chargeBaseInfoPageInfo.setPageNo(Integer.valueOf(strPageNo));
		chargeBaseInfoPageInfo.setPageSize(Integer.valueOf(strPageSize));
		chargeInfoQueryByAcctIdParam.setPageInfo(chargeBaseInfoPageInfo);
		//
		Calendar cal = Calendar.getInstance();
		cal.add(5, AMOUNT);
		SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
		String sevenDaysAgo = sdf.format(cal.getTime());
		//快速检索 近三个月  近一个月 近七天 
		if(!StringUtil.isBlank(selectDateId)){
			chargeInfoQueryByAcctIdParam.setStartTime(Timestamp.valueOf(sevenDaysAgo));
			chargeInfoQueryByAcctIdParam.setEndTime(DateUtil.getSysDate());
		}else{
			//如果开始时间和结束时间不为空
			if(!StringUtil.isBlank(startTime) && !StringUtil.isBlank(endTime)){
				chargeInfoQueryByAcctIdParam.setStartTime(DateUtil.getTimestamp(startTime+" 00:00:00",DateUtil.DATETIME_FORMAT));
				chargeInfoQueryByAcctIdParam.setEndTime(DateUtil.getTimestamp(endTime+" 23:59:59",DateUtil.DATETIME_FORMAT));
			}else{
				chargeInfoQueryByAcctIdParam.setStartTime(Timestamp.valueOf(sevenDaysAgo));
				chargeInfoQueryByAcctIdParam.setEndTime(DateUtil.getSysDate());
			}
		}
		
		//
		PageInfo<ChargeBaseInfo> pageInfo = DubboConsumerFactory.getService(IPaymentQuerySV.class).queryChargeBaseInfoByAcctId(chargeInfoQueryByAcctIdParam);
		//
		System.out.println(" queryAccountBalanceDetailList json:"+JSON.toJSONString(pageInfo));
		//
		responseData = new ResponseData<PageInfo<ChargeBaseInfo>>(ResponseData.AJAX_STATUS_SUCCESS,"可销售产品列表查询成功",pageInfo);
		//
		System.out.println(" ResponseData json:"+JSON.toJSONString(responseData));
		//
		return responseData;
    }
}
