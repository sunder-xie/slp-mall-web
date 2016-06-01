package com.ai.slp.mall.web.util;

import java.util.ArrayList;
import java.util.List;

import com.ai.opt.sdk.components.idps.IDPSClientFactory;
import com.ai.paas.ipaas.image.IImageClient;

public class ImageUtil {
   public static String getImage(String vsid){
       IImageClient im = null;
       //应用场景
       String idpsns="slp-mall-web-idps";
       //获取imageClient
       im = IDPSClientFactory.getImageClient(idpsns);
      //获取上传图片的URL
       return im.getImageUrl(vsid, ".jpg");
   }
   public static String getHotImage(){
       IImageClient im = null;
       //应用场景
       String idpsns="slp-mall-web-idps";
       //获取imageClient
       im = IDPSClientFactory.getImageClient(idpsns);
      //获取上传图片的URL
       return im.getImageUrl("574558c6d601800009c0b0e5", ".jpg");
       //获取上传图片指定尺寸的URL
      // System.out.println(im.getImageUrl("574514c1d601800009c0b0ba", ".jpg","100x80"));
   }
   public static List<String> getImages(List<String> imgList){
       IImageClient im = null;
       //应用场景
       String idpsns="slp-mall-web-idps";
       //获取imageClient
       im = IDPSClientFactory.getImageClient(idpsns);
       List<String> list = new ArrayList<String>();
       //获取上传图片指定尺寸的URL
       for(String visIDs:imgList){
           String url = im.getImageUrl(visIDs, ".jpg","100x80"); 
           list.add(url);
       }
       return list;
   }
}
