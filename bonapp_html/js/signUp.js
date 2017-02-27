var vm =new Vue({
			el:"#container",
			data:{
				flag:true,
				//注册的信息
				signUpForm:{
					firstname:'',
					email:'',
					password:''
				},
				
				//注册的错误信息
				errorMsg:{
					firstNameErrorMsg:'',
					emailErrorMsg:'',
					passwordEorrorMsg:''
				},
				//登录信息
				loginForm:{
					email:'',
					password:''
				},
				//登录的错误信息
				loginError:{
					emailErrorMsg:'',
					passwordEorrorMsg:''
				},
				//注册的网址
				signUrl:"http://iservice.itshsxt.com/diner/signup",
				//登录的网址
				loginUrl:"http://iservice.itshsxt.com/diner/login",
				backUrl:"index.html"
			},
			ready : function () {
				//获取sessionStorage
				var paramsStr = sessionStorage.getItem("params");
				var paramsObj;
				if(paramsStr != '' && paramsStr != null){
					paramsObj = JSON.parse(paramsStr);
					if(paramsObj.flag != null){
						this.flag = paramsObj.flag;
						
					}
					if(paramsObj.backUrl != null){
						this.backUrl = paramsObj.backUrl
					}
				}
			},
			methods:{
				//显示登录和注册
				showDiv:function(){
					this.flag=!this.flag;
				},
				checkData: function(type){
					switch(type){
						case 0 :
							this.errorMsg.firstNameErrorMsg=this.checkDataCommon(0,this.signUpForm.firstname)
							break;
						case 1 :
							this.errorMsg.emailErrorMsg=this.checkDataCommon(1,this.signUpForm.email)
							break;
						case 2 :
							this.errorMsg.passwordEorrorMsg=this.checkDataCommon(2,this.signUpForm.password)
							break;
						case 3 :
							this.loginError.emailErrorMsg=this.checkDataCommon(3,this.loginForm.email)
							break;
						case 4 :
							this.loginError.passwordEorrorMsg=this.checkDataCommon(4,this.loginForm.password)
							break;
					}
				},
				checkDataCommon:function(type,value){
					var errorMsg='';
					if(value==''||value==null){
						switch(type){
							case 0:
								errorMsg = "Please input your firstname"
								break;
							case 1:
								errorMsg = "Please input your Password"
								break;
							case 2:
								errorMsg = "Please input your Email"
								break;
							case 3:
								errorMsg = "Please input your Email"
								break;
							case 4:
								errorMsg = "Please input your Password"
								break;
						}
					}else{
						errorMsg='';
					}
					return errorMsg;
				},
				//注册
				signUp: function () {
					this.submit(this.signUrl,this.signUpForm);
					
				},
				//登录
				logIn : function (){
					this.submit(this.loginUrl,this.loginForm);
				},
				submit : function(url,form){
					this.$http.jsonp(url,form)
					.then(
						function(res){
							var data = res.data;
							if(data.resultCode==1){//成功
								localStorage.setItem('dinerInfo',JSON.stringify(data.result));
								//跳转
								window.location.href = this.backUrl;
							}else{
								alert(data.message);
							}
						})
				}
			}
	})