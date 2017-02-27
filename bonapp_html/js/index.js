//导航栏局部组件
var naviGrid =Vue.extend({
	template:'#navi-tempalte',
	data:function(){
		return {
			searchKey:"",//搜索条件
			isLogin:false,//是否登录，false:未登录
			isShow:false//是否显示下拉
		}
	},
	props :['dinerInfo'],
		ready : function(){
			var dinerInfoStr = localStorage.getItem('dinerInfo');
			var dinerInfoObj;
			if(dinerInfoStr != ''&&dinerInfoStr !=null){
				try{
					dinerInfoObj = JSON.parse(dinerInfoStr);
					if(dinerInfoObj.dinerId !=''&&dinerInfoObj.dinerId>0){
						this.$parent.dinerInfo=dinerInfoObj;
						this.isLogin=true;
					}
				}catch(e){
					console.log(e);
				}
				
			}
		},
	methods : {
		logout : function () {
			localStorage.removeItem("dinerInfo");
			this.isLogin = false;
		},
		go2signuplogin : function (type){
			 var loc = window.location.href;
			 loc = loc.substring(loc.lastIndexOf("/")+1,loc.length);
			 var params = {flag:type,backUrl:loc};
			 
			 sessionStorage.setItem("params",JSON.stringify(params));
			 window.location.href = "signup.html";
		},
		doSearch : function(){
			this.$parent.searchForm.searchKey=this.searchKey;//给父组件的searchKey赋值
			this.$parent.search();
		}
	}
});
var vm = new Vue({
	el:'#app',
	components:{
		"navi-grid":naviGrid//局部组件
	},
	data:{
		dinerInfo:{},
		findRestaurantUrl:'http://iservice.itshsxt.com/restaurant/find',//餐厅网址
		searchForm:{
			page:1,//当前页数
			searchKey:'',//搜索条件
			cuisine:'',//菜系
			neighborhood : '',//行政区商圈
			averagePrice : ''//价格
		},
		restaurants:[],//餐厅信息
		query:{},//分页信息
		showMenu : 0 ,//0不显示下拉菜单
		cuisines :[],//菜系
		areas :{},//行政区商圈
		prices : []//价格
	},
	ready : function(){
		var searchKey = sessionStorage.getItem('searchKey');
		if(searchKey !='' && searchKey != null){
			this.searchForm.searchKey=searchKey;
			//从sessionStorage中将searchKey删除//从sessionStorage中将searchKey删除
			sessionStorage.removeItem('searchKey');
			//将searchKey赋值给子组件中的searchKey，这样搜索栏可以记住搜索的条件
			var children = this.$children;//得到一个数组
			children[0].searchKey = this.searchForm.searchKey;//将searchKey赋值给子组件中的searchKey
		}
		this.search();
		this.initQueryConditions();
		
	},
	methods : {
		search : function(pages){
			if(pages!=null){
				this.searchForm.page = pages;
			}else{
				this.searchForm.page = 1;
			}
			//发送请求
			this.$http.jsonp(this.findRestaurantUrl,this.searchForm)
			.then(
				function(res){
					var data = res.data;
					if(data.resultCode==1){//成功
						this.restaurants = data.result;
						this.query = data.query;
					}else{
						console.log(data.message);
					}
					
				}
			)
		},
		//下拉框的显示
		showQueryCondition : function(type){
			if(this.showMenu!= type){
				this.showMenu = type;
			}else{
				this.showMenu = 0;
			}
		},
		//请求js中的cuisine_area.json数据
		initQueryConditions : function(){
				this.$http.get('js/cuisine_area.json')
				.then(function(res){//成功
					var data = res.data;
					this.cuisines = data.cuisines;
					this.areas = data.area;
					this.prices = data.prices;		
				},
				function(errRes){//失败
					console.log(errRes);
				})
		},
		//
		queryConditions : function(type,value){
			if(type == 1){
				this.searchForm.cuisine = value;
			}else if(type == 2){
				this.searchForm.neighborhood = value;
			}else if(type == 3){
				this.searchForm.averagePrice = value;
			}
			this.search();//搜索
		},
		//清理搜索条件
		resetQueryCondition : function (type) {
			//清理全部搜索条件
			if(type == null){
				this.searchForm.cuisine = '';
				this.searchForm.neighborhood = '';
				this.searchForm.averagePrice = '';
			}else if(type == 1){//清理菜系
				this.searchForm.cuisine = '';
			}else if(type == 2){//清理行政区商圈
				this.searchForm.neighborhood = '';
			}else if(type == 3){//清理价格
				this.searchForm.averagePrice = '';
			}
			
			this.search();
		},
		//跳转到餐厅详细页
		go2detail : function(resId){
			sessionStorage.setItem("resId",JSON.stringify({restaurantId:resId}));
			//跳转
			window.location.href="detail.html";
		}
	}
})
