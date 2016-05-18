package com.ai.slp.mall.web.controller.product;

import javax.servlet.http.HttpServletRequest;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.ModelAndView;

@RestController
@RequestMapping("/product")
public class ProductController {

	@RequestMapping("/detail")
	public ModelAndView index(HttpServletRequest request) {

        ModelAndView view = new ModelAndView("jsp/product/product_detail");
        return view;
    }
}
