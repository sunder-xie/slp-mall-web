<%@ page contentType="text/html;charset=UTF-8" language="java" %>
    <!--导航 搜索区-->
      <div class="mainbav-main">
      <!--搜索区-->
          <div class="searchBar">
              <ul class="searchTxt">
                  <li><input type="text" class="int-xxlarge" id="serachName"></li>
                  <li><A href="#" id="BTN_SEARCH"><i class="icon-search"></i></A></li>
              </ul>
               <ul class="word">
                  <li><A href="#">搜索商品1</A></li>
                  <li><A href="#">搜索商品2</A></li>
                  <li><A href="#">搜索商品3</A></li>
                  <li><A href="#">搜索商品4</A></li>   
              </ul>
          </div>
          <!--搜索区结束-->
          <!--主导航-->
          <div class="breadcrumb">
              <ul>
                  <li><a href="${_base}">首页</a></li>
                  <li><a href="#" id="logo_nav_phoneBillFastId">话费快充</a></li>
                  <li><a href="#" id="logo_nav_flowFastId">流量快充</a></li>
                  <li><a href="#">话费卡</a></li>
                  <li><a href="#">流量卡</a></li>
                  <li><a href="#">API</a></li>
              </ul>
          </div>
          <!--主导航结束-->
     </div>
     <script type="text/javascript">
			var logo_nav_menu_pager;
			(function () {
				seajs.use('app/jsp/logonavmenu/logoNavMenu', function (HeadPager) {
					logo_nav_menu_pager = new HeadPager({element: document.body});
					logo_nav_menu_pager.render();
				});
			})();
			
		</script>
		<script type="text/javascript">
			var index_search_pager;
			(function () {
				seajs.use('app/jsp/search/search', function (SearchPager) {
					index_search_pager = new SearchPager({element: document.body});
					index_search_pager.render();
				});
			})();
			
		</script>