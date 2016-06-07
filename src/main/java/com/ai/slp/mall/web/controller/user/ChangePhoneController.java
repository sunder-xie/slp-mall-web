package com.ai.slp.mall.web.controller.user;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

import org.mortbay.log.Log;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.ModelAndView;

import com.ai.opt.base.vo.ResponseHeader;
import com.ai.opt.sdk.dubbo.util.DubboConsumerFactory;
import com.ai.opt.sdk.web.model.ResponseData;
import com.ai.opt.sso.client.filter.SLPClientUser;
import com.ai.opt.sso.client.filter.SSOClientConstants;
import com.ai.slp.user.api.ucUserSecurity.interfaces.IUcUserSecurityManageSV;
import com.ai.slp.user.api.ucUserSecurity.param.UcUserPhoneRequest;
import com.ai.slp.user.api.ucuser.intefaces.IUcUserSV;
import com.ai.slp.user.api.ucuser.param.SearchUserRequest;

@RestController
@RequestMapping("/user/phone")
public class ChangePhoneController {

    //跳转页面
    @RequestMapping("/toChangePhone")
    public ModelAndView toChangePhone(HttpServletRequest request) {
        HttpSession session = request.getSession();
        SLPClientUser user = (SLPClientUser) session.getAttribute(SSOClientConstants.USER_SESSION_KEY);
        ModelAndView view = new ModelAndView("jsp/user/changephone/change-phone");
        //根据userId查询密码
        SearchUserRequest searchUserRequest = new SearchUserRequest();
        searchUserRequest.setUserId(user.getUserId());
        //获取dubbo服务
        IUcUserSV ucUserSV = DubboConsumerFactory.getService(IUcUserSV.class);
        String userMp="";
        try{
        userMp = ucUserSV.queryBaseInfo(searchUserRequest).getUserMp();
        }catch(Exception e){
            Log.info("查询失败");
        }
        view.addObject("phone",userMp);
        return view;
    }
    
    
    //校验原来手机
    @RequestMapping("/searchPhone")
    @ResponseBody
    public ResponseData<String> searchPhone(HttpServletRequest request){
        ResponseData<String> responseData= null;
        ResponseHeader responseHeader=null;
        HttpSession session = request.getSession();
        SLPClientUser user = (SLPClientUser) session.getAttribute(SSOClientConstants.USER_SESSION_KEY);
        //根据userId查询密码
        SearchUserRequest searchUserRequest = new SearchUserRequest();
        searchUserRequest.setUserId(user.getUserId());
        //获取dubbo服务
        IUcUserSV ucUserSV = DubboConsumerFactory.getService(IUcUserSV.class);
        String userMp="";
        try{
        userMp = ucUserSV.queryBaseInfo(searchUserRequest).getUserMp();
        responseData = new ResponseData<String>("1111", "success", null);
        responseHeader = new ResponseHeader(true, "1111", "查询成功");
        }catch(Exception e){
            Log.info("查询失败");
            responseData = new ResponseData<String>("1112", "fail", null);
            responseHeader = new ResponseHeader(false, "1112", "查询失败");
        }
        responseData.setResponseHeader(responseHeader);
        responseData.setData(userMp);
        return responseData;
    } 
    
  //校验支付密码
    @RequestMapping("/validatePassword")
    @ResponseBody
    public ResponseData<String> validatePassword(HttpServletRequest request){
        ResponseData<String> responseData= null;
        ResponseHeader responseHeader=null;
        HttpSession session = request.getSession();
        SLPClientUser user = (SLPClientUser) session.getAttribute(SSOClientConstants.USER_SESSION_KEY);
        //根据userId查询密码
        SearchUserRequest searchUserRequest = new SearchUserRequest();
        searchUserRequest.setUserId(user.getUserId());
        //获取dubbo服务
        IUcUserSV ucUserSV = DubboConsumerFactory.getService(IUcUserSV.class);
        String userMp="";
        try{
        userMp = ucUserSV.queryBaseInfo(searchUserRequest).getUserMp();
        responseData = new ResponseData<String>("1111", "success", null);
        responseHeader = new ResponseHeader(true, "1111", "查询成功");
        }catch(Exception e){
            Log.info("查询失败");
            responseData = new ResponseData<String>("1112", "fail", null);
            responseHeader = new ResponseHeader(false, "1112", "查询失败");
        }
         responseData.setResponseHeader(responseHeader);
         responseData.setData(userMp);
        return responseData;
    }
    
    
    //修改手机
    @RequestMapping("/updatePhone")
    @ResponseBody
    public ResponseData<String> updatePassword(HttpServletRequest request){
        
        ResponseData<String> responseData=null;
        ResponseHeader responseHeader=null;
        
        HttpSession session = request.getSession();
        SLPClientUser user = (SLPClientUser) session.getAttribute(SSOClientConstants.USER_SESSION_KEY);
        UcUserPhoneRequest  ucUserPhoneRequest = new UcUserPhoneRequest();
        ucUserPhoneRequest.setAccountId(Long.parseLong(user.getUserId()));
        ucUserPhoneRequest.setPhone(request.getParameter("phone"));
        //获取dubbo服务
        IUcUserSecurityManageSV ucUserSecurityManageSV = DubboConsumerFactory.getService(IUcUserSecurityManageSV.class);
        try{
            ucUserSecurityManageSV.setPhoneData(ucUserPhoneRequest);
            responseData = new ResponseData<String>("11112", "更新成功", null);
            responseHeader = new ResponseHeader(true, "11112", "更新成功");
        }catch(Exception e){
            responseData = new ResponseData<String>("11113", "更新失败", null);
            responseHeader = new ResponseHeader(false, "11113", "更新失败");
        }
        responseData.setResponseHeader(responseHeader);
        return responseData;
    } 
}