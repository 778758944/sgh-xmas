/**
 * 
 * @authors Your Name (you@example.org)
 * @date    2015-09-07 15:46:30
 * @version $Id$
 */
var sghController=angular.module("sghController",[]);

sghController.controller("LoadCtrl",function($scope,$location,Http,View,$timeout){
	$scope.precent="0%";

	function getImage2(){
		// console.log(data);
		var img=new Image();
		// var i=0;
		img.onload=function(){
			hardsj.push(img);
			$scope.$apply(function(){
				$scope.precent=Math.round((hardsj.length/hard.length)*100)+"%";
				// console.log($scope.precent);
			});
			
			j=j+1;
			if(j<hard.length){
				getImage2();
			}
			else{
				bgm.play();
				// console.log(hardsj);
				$timeout(function(){
					$location.path("/step1");
				},1);
			}
		}
		img.src=hard[j];
	}

	var url=$location.protocol()+"://"+$location.host()+":"+$location.port()+"/FindGlass";
	// console.log(url);

	var hard=[
	    url+"/file/Step1/Step1.png",
	    url+"/file/Step1/move.jpg",
		url+"/file/Step8/Step8.jpg",
		url+"/file/Step2/glass1.png",
		url+"/file/Step2/glass2.png",
		url+"/file/Step2/glass3.png",
		url+"/file/Step2/glass4.png",
		url+"/file/Step2/glass5.png",
		url+"/file/Step2/glass6.png",
		url+"/file/Step2/glass7.png",
		url+"/file/Step2/glass8.png",
		url+"/file/Step2/glass9.png",
		url+"/file/Step2/glass10.png",
		url+"/file/genal/coupon.jpg",
		url+"/file/genal/share1.jpg",
		url+"/css/game_background.jpg",
		url+"/file/Step2/sofa.png",
		url+"/file/Step6/Step6_back.jpg",
		url+"/file/Step3/gift.png"
		];


	  $.post('http://mp.socialvalue.cn/wechat/getticket', {
	    url: location.href.split('#')[0]
	  }).done(function(data) {
	  	var conf=JSON.parse(data);
	  		wx.config({
		      debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
		      appId: conf.appid, // 必填，公众号的唯一标识
		      timestamp: conf.timestamp, // 必填，生成签名的时间戳
		      nonceStr: conf.noncestr, // 必填，生成签名的随机串
		      signature: conf.signature,// 必填，签名，见附录1
		      jsApiList: ['onMenuShareTimeline','onMenuShareAppMessage',"chooseImage","uploadImage"] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
		    });

		    wx.ready(function(){
		    	wx.onMenuShareTimeline({
		    		title:"睛喜暖冬，sunglass hut送你闪耀圣诞礼！",
		    		link:"http://xmas-2015.sgh.clients.inzen.com.cn/wx/ua",
		    		imgUrl:"http://xmas-2015.sgh.clients.inzen.com.cn/FindGlass/file/genal/share1.jpg",
		    		success:function(){
		    			View.showpp=true;
		    			showpp.show=true;
		    			// alert(View.showpp);
		    			$("#share_content").text("返回首页");
		    			$("#share_content").click(function(){
		    				if(View.showpp){
		    					$("#share_mask").hide();
		    				}
		    			})
		    			$timeout(function(){
		    				$.ajax({
		    					type	: 'POST',
		    					url 	: 'http://xmas-2015.sgh.clients.inzen.com.cn/players/setChances',
		    					dataType: 'json',
		    					data 	: {
		    						openID: openId,
		    						chances: 3
		    					},
		    					success : function(data){
		    						if(data.success){
		    							$(".alert").show();
		    						}else{
		    							// alert('机会提交失败，请重试。');
		    						}
		    					},
		    					error 	: function(jqXHR){
		    						// alert('与服务器的通信发生错误。请重试。');
		    					}
		    				});
		    			},1);
		    		},
		    		cancel:function(){

		    		}
		    	});

		    	wx.onMenuShareAppMessage({
				    title: '不拘一格，睛喜暖冬', // 分享标题
				    link: 'http://xmas-2015.sgh.clients.inzen.com.cn/wx/ua', // 分享链接
				    imgUrl: 'http://xmas-2015.sgh.clients.inzen.com.cn/FindGlass/file/genal/share1.jpg', // 分享图标
				    desc:"睛喜暖冬，sunglass hut送你闪耀圣诞礼！",
				    success: function () { 
				    	// alert(View.showpp);
				    	View.showpp=true;
				    	showpp.show=true;
		    			$("#share_content").text("返回首页");
		    			$("#share_mask").hide();
				        $timeout(function(){
		    			    $.ajax({
		    					type	: 'POST',
		    					url 	: 'http://xmas-2015.sgh.clients.inzen.com.cn/players/setChances',
		    					dataType: 'json',
		    					data 	: {
		    						openID: openId,
		    						chances: 3
		    					},
		    					success : function(data){
		    						if(data.success){
		    							$(".alert").show();
		    							// alert('恭喜你获得额外三次机会。祝你好运！');
		    						}else{
		    							// alert('机会提交失败，请重试。');
		    						}
		    					},
		    					error 	: function(jqXHR){
		    						// alert('与服务器的通信发生错误。请重试。');
		    					}
		    				});
		    			},1);
				    },
				    cancel: function () { 
				        // 用户取消分享后执行的回调函数
				    }
				});
	    		bgm.addEventListener("canplaythrough",function(e){
					bgm.loop=true;
			    	getImage2();
				})
				bgm.src="file/bgm.mp3";
				bgm.load();
		    });
	  });










	// $scope.start=function(){
	// 	$location.path("/step1");
	// }
	// var url="/html/index.php#/load";
	// _hmt.push(["_trackPageview",url]);

})






sghController.controller("FirstCtrl",function($scope,$location,View){
	var url="/html/index.php#/step7";
	_hmt.push(["_trackPageview",url]);
	$scope.next=function(){
		$location.path("/step8");
	}
});

sghController.controller("Step2Ctrl",function($scope,$location,View){
	var url="/html/index.php#/step2";
	_hmt.push(["_trackPageview",url]);
	$scope.width=View.width;
	$scope.height=View.height;
	$scope.bg=hardsj[3];
	$scope.score=0;
	$scope.totaltime=60;
	$scope.$watch("score",function(newvalue,oldvalue){
		console.log(newvalue);
	});
	$scope.nextSuccess=function(){
		$location.path("/step3");
	}
	$scope.nextFail=function(){
		$location.path("/step4");
	}
	$scope.show=View.plam;
});

sghController.controller("Step3Ctrl",function($scope,$location){
	var url="/html/index.php#/step3";
	_hmt.push(["_trackPageview",url]);
	$scope.gif=hardsj[18].src;
	// console.log(hardsj[18].src);
	$scope.formShow=true;
	$scope.finalScore=100;
	$scope.next=function(){
		$location.path("/step4");
	}

});

sghController.controller("Step4Ctrl",function($scope,$location,View){
	var url="/html/index.php#/step4";
	_hmt.push(["_trackPageview",url]);
	$scope.bg=hardsj[2];
	$scope.finalScore=score*10;
	$scope.share=0;
	$scope.showShare=function(){
		console.log("show");
		$scope.share=1;
	}
	$scope.hideShare=function(){
		console.log("hide");
		$scope.share=0;
	}
	var width=View.width;
	var height=View.height;
});

sghController.controller("Step5Ctrl",function($scope,$location,View){
	var url="/html/index.php#/step5";
	_hmt.push(["_trackPageview",url]);
	var width=View.width;
	var height=View.height;
	$scope.bg=hardsj[16];
	$scope.text="分享";
	$scope.text2="返回首页";
	$scope.next=function(){
		$location.path("/step6");
	}
	$scope.toFirst=function(){
		if(View.showpp){
			$location.path("/step1");
		}
	}
	// $scope.showpp=View.showpp;
	$scope.type="glass";
	$scope.models=hardsj.slice(11,16);
	$scope.isS=false;
	$scope.img_width=width*2.5;
	$scope.img_height=height*2.5;
	$scope.img_pos={
		left:(width-$scope.img_width)/2,
		top:height*-0.15
	};
	$scope.nexts="/step6";
	$scope.layout=false;
});
sghController.controller("Step6Ctrl",function($scope,$location,View){
	var url="/html/index.php#/step6";
	_hmt.push(["_trackPageview",url]);
	var width=View.width;
	var height=View.height;
	$scope.bg=hardsj[17];
	$scope.next=function(){
		$location.path("/step9");
	}
	$scope.grade=View.grade;
	$scope.prize=View.prize;
	$scope.type="bgg";
	$scope.models=hardsj.slice(16);
	$scope.text="选择你喜欢的背景";
	$scope.isS=false;
	$scope.img_width=width;
	$scope.img_height=height;
	$scope.img_pos={
		left:(width-$scope.img_width)/2,
		top:0
	};
	$scope.nexts="/step7";
	$scope.layout=true;
	$scope.upload=true;
});
sghController.controller("Step8Ctrl",function($scope,$location){
	var url="/html/index.php#/step8";
	_hmt.push(["_trackPageview",url]);
	$scope.bg=hardsj[2];
	$scope.next=function(){
		$location.path("/step2");
	}

});
sghController.controller("Step7Ctrl",function($scope,$location){
	var url="/html/index.php#/step7";
	_hmt.push(["_trackPageview",url]);
	$scope.url=imgurl2;
	// $scope.next=function(){
	// 	$location.path("/step9");
	// }
});
sghController.controller("Step10Ctrl",function($scope,$location,View){
	var url="/html/index.php#/step10";
	_hmt.push(["_trackPageview",url]);
	$scope.toFirst=function(){
		if(View.showpp){
			$location.path("/step1");
		}
	}
});
sghController.controller("Step12Ctrl",function($scope,$location,View){
	var url="/html/index.php#/step12";
	_hmt.push(["_trackPageview",url]);
	$scope.showw=true;
	$scope.toFirst=function(){
		$location.path("/step1");
	}
})

// sghController.controller("Step9Ctrl",function($scope,$location)



































