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
			sessionStorage.setItem("searchKey",this.searchKey);
			window.location.href="index.html";
		}
	}
});
var vm = new Vue({
	el:'#app',
	data : {
		dinerInfo:{},//用户信息
		findUrl : 'http://iservice.itshsxt.com/restaurant/detail',	//餐厅详情url
		revUrl : 'http://iservice.itshsxt.com/review/find',//发送请求
		restaurantId : 0,	//餐厅id
		resInfo:{},			//餐厅信息
		page : 0,			//当前页
		query:{},
		reviews:[],
	},
	components:{
		"navi-grid":naviGrid//局部组件
	},
	ready : function (){
		var resIdStr = sessionStorage.getItem("resId");
		
		if(resIdStr == '' || resIdStr ==null){
			alert("Oops something wrong , please try again.");
			setTimeout(function(){
				history.go(-1)
			},1000)
		}
		var resIdObj = JSON.parse(resIdStr);
		var restaurantId = resIdObj.restaurantId;
		
		if(isNaN(restaurantId)){
			alert("Oops something wrong , please try again.");
			return;
		}
		this.restaurantId = restaurantId;
		
		this.findUrl = this.findUrl+"/"+this.restaurantId;
		this.findRestaurant();
		this.findReview();
	},
	methods : {
		//餐厅查询
		findRestaurant : function(){
			this.$http.jsonp(this.findUrl)
			.then(
				function(res){
//					console.log(res);
					var data = res.data;
					if(data.resultCode == 1){//成功
							this.resInfo = data.result;
						}else {//失败
							console.log(data.message);
						}
					
				}
			)
		},
		//发送请求
		findReview : function (pages){
			if(pages != null){
				this.page = pages;
			}else{
				this.page = 1;
			}
			this.$http.jsonp(this.revUrl,{restaurantId:this.restaurantId,page:this.page})
			.then(
				function(res){
//					console.log(res);
					var data = res.data;
					if(data.resultCode==1){
						this.query = data.query;
						this.reviews = data.result;
					}else{
						console.log(data.message);
					}
			})
		}
		
	}
})
