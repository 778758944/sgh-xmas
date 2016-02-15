/**
 * 
 * @authors Your Name (you@example.org)
 * @date    2015-09-07 13:40:08
 * @version $Id$
 */
var hardsj=[];
var url="file/Step3/girl2.png";
var imgurl;
var imgurl2="file/Step3/girl2.png";
var bgm=new Audio();
var finalnum;
var canvas;
var localId="file/Step3/girl2.png";
var shareText=["一个万圣节换装派对，萌翻整个朋友圈"];
var stext="hhhhhhhhhhh";
var shareobj={};
var score=0;
var showpp={
	show:false
};
var openId="ccccco4cOIjiBKchlwnAAT5cjKVUkHNGd3338ddd";
var app=angular.module("myApp",["ngRoute","sghController","sghService","ngAnimate"]);
var wenan={
	text:"分享",
	show:true
};
var showppp;
var change_text;

app.config(["$routeProvider",function($routeProvider){
	$routeProvider.when("/step1",{
		templateUrl:"template/step1.html",
		controller:"FirstCtrl"
	}).
	when("/step2",{
		templateUrl:"template/step2.html",
		controller:"Step2Ctrl"
	}).
	when("/step3",{
		templateUrl:"template/step3.html",
		controller:"Step3Ctrl"
	}).
	when("/step4",{
		templateUrl:"template/step4.html",
		controller:"Step4Ctrl"
	}).
	when("/step5",{
		templateUrl:"template/step5.html",
		controller:"Step5Ctrl"
	}).
	when("/step6",{
		templateUrl:"template/step6.html",
		controller:"Step6Ctrl"
	}).
	when("/step7",{
		templateUrl:"template/step7.html",
		controller:"Step7Ctrl"
	}).
	when("/step8",{
		templateUrl:"template/step8.html",
		controller:"Step8Ctrl"
	}).
	when("/step9",{
		templateUrl:"template/step9.html",
	}).
	when("/step10",{
		templateUrl:"template/step10.html",
		controller:"Step10Ctrl"
	}).
	when("/step11",{
		templateUrl:"template/step11.html",
	}).
	when("/step12",{
		templateUrl:"template/step12.html",
		controller:"Step12Ctrl"
	}).
	when("/step13",{
		templateUrl:"template/step13.html",
	}).
	when("/step14",{
		templateUrl:"template/step14.html",
	}).
	when("/load",{
		templateUrl:"template/load.html",
		controller:"LoadCtrl"
	}).
	otherwise({
		redirectTo:"/load"
	})
}]).run(function($rootScope){
	//Get openID on load
	var url = document.location.href;
	var getobj = url.split('?');
	var getstr = getobj[getobj.length-1];
	if(getstr.indexOf('openID') == -1){
		// alert('OpenID cannot be retrieved!');
	}else{
		var openidobj = getstr.split('=');
		var openid = openidobj[openidobj.length-1];
		$rootScope.openID = openid;
		openId=openid;
		// alert(openid);
	}
});
app.directive("first",function(View){
	return {
		restrict:"A",
		link:function(scope,ele,attr){
			var move_wrap=$(".move_wrap"),
			    img_move=$("#img_move"),
			    img=new Image();

			$(".music_icon").animate({opacity:1},1000);
			img.onload=function(){
				img.className="movep";
				var img2=$(img).clone();
				img_move[0].appendChild(img);
				img_move.append(img2);
				img2[0].style.marginLeft="-1px";
				var movep_h=img.offsetHeight;
				move_wrap.height(movep_h);
				img_move.height(movep_h);
				move_wrap.css("top",(View.height-movep_h)/2+"px");
			}
			img.src="file/genal/background.jpg";
		}
	}
});


app.directive("back",function(View){
	return {
		restrict:"A",
		link:function(scope,ele,attr){
			var img=new Image(),
			    d_width=View.width,
			    d_height=View.height;


			img.onload=function(){
				img.className="backp";
				ele[0].appendChild(img);
				var height=img.offsetHeight;
				if(height>=d_height){
					$(img).css("top",(d_height-height)/2+"px");
				}
				else{
					$(img).css('height',"100%").css("width","auto").css("left",(d_width-$(img).width())/2+"px");
				}
			}
			img.src="file/Step1/Step1.png";
		}
	}
});

app.directive("text",function(){
	return {
		restrict:"A",
		link:function(scope,ele,attr){
			$(ele).css("line-height",$(ele).height()+"px");
		}
	}
});

app.directive("backpp",function(View){
	return {
		restrict:"A",
		link:function(scope,ele,attr){
			d_width=View.width,
		    d_height=View.height;
			var img=scope.bg;
			img.className="backp";
			ele[0].appendChild(img);
			var height=img.offsetHeight;
			if(height>=d_height){
				$(img).css("top",(d_height-height)/2+"px");
			}
			else{
				$(img).css('height',"100%").css("width","auto").css("left",(d_width-$(img).width())/2+"px");
			}	
		}
	}
});

app.directive("success",function(View,$location,$timeout,$rootScope,Zoom){
	return {
		restrict:"A",
		link:function(scope,ele,attr){
			scope.openID = openId;
			var d_width=View.width,
			    d_height=View.height;
			    $("#gift").click(function(){
			    	$.ajax({
			    		type:"POST",
			    		url:"http://xmas-2015.sgh.clients.inzen.com.cn/lottery/startLottery",
			    		dataType:"json",
			    		data:{
			    			openID:scope.openID
			    		},
			    		success:function(data){
			    			// alert(JSON.stringify(data));
			    			var result = data.data;
			    			// alert(result.won);
			    			if(result.won){
			    				View.grade=result.order;
			    				View.prize=result.name;
			    				$timeout(function(){
			    					$location.path("/step6");
			    				},1);

			    			}else{
			    				// alert("loser");
			    				$.post("http://xmas-2015.sgh.clients.inzen.com.cn/players/firstPlayed",{
			    					openID:openId
			    				},function(data){
			    					// alert(data.data.firstPlayed);
			    					showppp=data.data.firstPlayed;
			    					// alert(showppp)
				    					if(showppp){
				    						$timeout(function(){
				    							$location.path("/step12");
				    						},1);
				    					}
				    					else{
				    						$.post("http://xmas-2015.sgh.clients.inzen.com.cn/players/remainingChances",{
				    							openID:openId
				    						},function(res){
				    							change_text=res.data.chances;
				    							$timeout(function(){
				    								$location.path("/step5");
				    							},1)
				    						})
				    						// $location.path("/step5");
				    					}
				    					// $location.path("/step12");
			    				});
			    			}
			    		},
			    		error:function(jqXHR){
			    			alert("出错了，请再试一次");
			    		}
			    	});
			    });
			    // $("#gift").click(function(){
			    // 	$.ajax({
			    // 		type:"POST",
			    // 		url:"http://xmas-2015.sgh.clients.inzen.com.cn/lottery/startLottery",
			    // 		dataType:"json",
			    // 		data:{
			    // 			ID:str
			    // 		}
			    // 		success:function(data){
			    // 			if(data.success){
			    // 				window.location.href="/FindGlass/index.html#/step6"
			    // 			}else{
			    // 				window.location.href="/FindGlass/index.html#/step12"
			    // 			}
			    // 		},
			    // 		error:function(jqXHR){
			    // 			alert("出错了，请再试一次");
			    // 		}
			    // 	})
			    // })
		}
	}
});
app.directive("successt",function(View,$location,$timeout){
	return {
		register:"A",
		link:function(scope,ele,attr){
			// scope.showw=showppp;
			$("#share_content").click(function(){
					// alert("kkk");
					if(!View.showpp){
						$("#share_mask2").show();
					}
				});
			$("#share_mask2").click(function(){
				$(this).hide();
			})
		}
	}
});

app.directive("successten",function(View,$location,$timeout){
	return {
		register:"A",
		link:function(scope,ele,attr){
			// scope.showw=showppp;
			$("#share_content").click(function(){
					// alert("kkk");
					if(!View.showpp){
						$("#share_mask2").show();
					}
				});
			$("#share_mask2").click(function(){
				$(this).hide();
			})
		}
	}
});

app.directive("fail",function(View){
	return {
		restrict:"A",
		link:function(scope,ele,attr){
			if(change_text){
				View.showpp=true;
				$("#share_content").text("返回首页");
			}
			else{
				View.showpp=false;
			}
			// scope.$apply(function(){
			// 	scope.finalScore=score*100;
			// });
	$("#share_content").click(function(){
		// alert(View.showpp);
		if(!View.showpp){
			$("#share_mask").show();
			$(".deal_pic").hide();
			$("#music").hide();
		}
	})
	$("#share_mask").click(function(){
		$("#share_mask").hide();
		$(".deal_pic").show();
		$("#music").show();
	})
		}


	}
})

app.directive("showw",function(View){
	return {
		restrict:"A",
		link:function(scope,ele,attr){
			// alert("kk");
			var wrap=ele[0],
			    img_list=scope.models,
			    toleft=$(".toLeft"),
			    toright=$(".toRight"),
			    cls=scope.type,
			    i=0;
			for(var i=0;i<img_list.length;i++){
				var div=document.createElement("div");
				div.className=cls;
				div.appendChild(img_list[i]);
				ele[0].appendChild(div);
			}


			if(scope.isS){
				wrap.style.width="700%";
			}
			else{
				wrap.style.width="500%";
			}

			var width=View.width,
			    min=View.width-wrap.offsetWidth,
			    max=0;

			    console.log(min);
			    console.log(max);

			toleft[0].addEventListener("touchstart",function(){
				// alert("ll");
				var pos=wrap.offsetLeft-width;
				if(pos>=min){
					$(wrap).animate({"left":pos+"px"},200);
				}
			},false);

			toright[0].addEventListener("touchstart",function(){
				// alert("kk");
				var pos=wrap.offsetLeft+width;
				if(pos<=max){
					$(wrap).animate({"left":pos+"px"},200);
				}
			})

		}
	}
});
app.directive("bcgd",function(View,$location,$timeout){
	return {
		restrict:"A",
		link:function(scope,ele,attr){
			$(".view-content").css("height",View.height+"px");
			$(".logo").css("display","block");

		}
	}
});

app.directive("cmusic",function(Http){
	return {
		restrict:"A",
		link:function(scope,ele,attr){
			var element=ele[0],
			    bgm=Http.bgm;
			if(bgm.paused){
				$(element).children("img").attr("src","file/genal/close.png");
			}
			else{
				$(element).children("img").attr("src","file/genal/open.png");
			}
			    // bgm.play();
			element.addEventListener("touchstart",function(){
				// alert("kk");
				if(!bgm.paused){
					bgm.pause();
					$(this).children("img").attr("src","file/genal/close.png");
				}
				else{
					bgm.play();
					$(this).children("img").attr("src","file/genal/open.png");
				}
			},false);
		}
	}
});

app.directive("cs",function(View,$location,$timeout){
	return {
		restrict:"A",
		link:function(scope,ele,attr){
			var width=View.width,
			    height=View.height,
			    dishw=height-width,
			    y_t=dishw/2,
			    img_list=scope.models,
			    glass_list=scope.glass,
			    bg_list=scope.bgs,
			    toleft=$(".toLeft"),
			    toright=$(".toRight"),
			    arr=[],
			    k=0,
			    hammer,
			    zoom=View.zoom,
			    velocity=500,
			    animating=false,
			    img=new Image(),
			    dym,
			    cvs,
			    next,
			    prev,
			    hammer,
			    can_next=true,
			    step=1,
			    glass_h=(glass_list[0].height*width/glass_list[0].width),
			    glass_t=height*0.4,
			    stage=new Kinetic.Stage({
					container:"container",
					width:width,
					height:height*1.7
				}),

				layer=new Kinetic.Layer({
					id:"layer1"
				}),
				group=new Kinetic.Group();


				// console.log(y_b);
				$(".logo").css("display","block");




				// console.log(cvs);

				function list(img_list,layer,layer2,c_w,c_h,x,y,opaa){
					// console.log(opaa);
					// console.log(layer2);
					var i_width=c_w||width,
					    i_height=c_h||height,
					    posx=x||width,
					    posy=y||0,
					    op=opaa||1;

					for(var i=0;i<img_list.length;i++){
						if(i==0){
							arr[i]=new Kinetic.Image({
								x:0,
								y:posy,
								image:img_list[i],
								width:i_width,
								height:i_height,
								opacity:op
							});



							if(opaa==0.01){
								// alert("opa");
								var speedd=0.5;
								var anii=new Kinetic.Animation(function(frame){
									var o=speedd*(frame.timeDiff/1000)+arr[0].opacity();
									if(o>1){
										anii.stop();
										arr[0].opacity(1);
									}
									else{
										arr[0].opacity(o);
									}
									// arr[i].opacity(opa);
								},layer);
								anii.start();
							}
							// var pos=arr[i].()-width;
						}
						else if(i==img_list.length-1){
							// console.log(i);
							arr[i]=new Kinetic.Image({
								x:-posx,
								y:posy,
								image:img_list[i],
								width:i_width,
								height:i_height
							});
						}
						else{
							arr[i]=new Kinetic.Image({
								x:posx,
								y:posy,
								image:img_list[i],
								width:i_width,
								height:i_height
							});
						}
						layer.add(arr[i]);
					}

					next=function(){
						console.log(img_list.length);
						left=true;
						if(k>=img_list.length-1&&!animating){
							ani(arr[arr.length-1],arr[0],layer2).start();
							arr[arr.length-2].x(width);
							k=0;
						}
						else if(!animating){
							ani(arr[k],arr[k+1],layer2).start();
							if(k==0){
								arr[arr.length-1].x(width);
							}
							else{
								arr[k-1].x(width);
							}
							// arr[k-1].x(width);
							k++;
						}
					}

					prev=function(){
						left=false;
						if(k<=0&&!animating){
							ani(arr[0],arr[arr.length-1],layer2).start();
							arr[arr.length-2].x(-width);
							k=arr.length-1;
						}
						else if(!animating){
							// console.log(layer2);
							ani(arr[k],arr[k-1],layer2).start();
							if(k==1){
								arr[arr.length-1].x(-width);
							}
							else{
								arr[k-2].x(-width);
							}
							// arr[k-2].x(-width);
							k--;
						}
					}
					toleft[0].addEventListener("touchstart",prev,false);


					toright[0].addEventListener("touchstart",next,false);
				}

				function init(){
					arr=[];
					k=0;
					toleft[0].removeEventListener("touchstart",prev,false);
					toright[0].removeEventListener("touchstart",next,false);
				}


				// img.onload=function(){
					list(img_list,layer,layer,width,height,0,height*0.06);
					var i_width=canvas.width,
					    i_height=canvas.height;

					show_h=((width/2)*i_height)/i_width;

				    dym=new Kinetic.Image({
				    	x:width/4,
				    	y:show_h/2+scope.img_pos.top,
				    	image:canvas,
				    	width:width/2,
				    	height:show_h,
				    	offset:{
				    		y:show_h/2
				    	},
				    	draggable:true
				    });

					layer.add(dym);
					stage.add(layer);


					cvs=layer.getCanvas()._canvas;

					zoom(0,1,cvs,dym,true,true);

			$("#toStep5").on("touchstart",function(e){
				if(animating){
					return;
				}
				hammer=null;
				step=step+1;

				if(step==2){



					$("#iff").css("opacity",1);
					finalnum=k;
					shareobj.text=shareText[0];



					layer.toImage({
						callback:function(img){
							// console.log(img);
							console.log(img.width);
							console.log(img.height);
							dym.destroy();
							arr[k].destroy();
							layer.clear();
							dym=new Kinetic.Image({
								x:width/2,
								y:height/2,
								width:img.width,
								height:img.height,
								image:img,
								offset:{
									x:width/2,
									y:height/2
								},
								draggable:true
							});
							layer.add(dym);
							layer.draw();

							var bs=1;
							var speed=660;

							$(".c_text").animate({"opacity":0},500,function(){
								// alert("kk");
								$timeout(function(){
									scope.text="选择你喜欢的墨镜";
									scope.notice="墨镜不太合适？移动或缩放人物试试看。";
									$(".c_text").animate({"opacity":1},500);
								},1)
							});


							// var ani=new Kinetic.Animation(function(frame){
							// 	var dist=bs*(frame.timeDiff/1000);
							// 	dym.
							// })
							var cvs=layer.getCanvas()._canvas;
							// hammer=null;

							// zoom(0,1,cvs,dym,true);
							// console.log(group.width());
							// group.x(-width*1.5/2);
							for(var i=0;i<arr.length;i++){
								if(i!=k){
									arr[i].destroy();
								}
							}

							init();
							// console.log(dym.scale());
							var ani=new Kinetic.Animation(function(frame){
								var dist=bs*(frame.timeDiff/1000);
								var s=speed*(frame.timeDiff/1000);
								// dym.scale();
								var x=dym.scaleX()+dist;
								var y=dym.scaleY()+dist;
								if(x>1.7){
									ani.stop();
									zoom(0,x,cvs,dym,true);
									list(glass_list,layer,layer,width,glass_h,width,glass_t,0.01);
									layer.draw();
								}
								else{
									dym.scale({
										x:x,
										y:y
									});

									dym.move({
										y:s
									});
								}
							},layer);
							ani.start();
						}
					});
				}
				else if(step==3){
					hammer=null;
					// $(".mask1").css("display","none");
					// $(".mask2").css("display","block");
					$("#toStep5").text("确定");
					// list(bg_list,layer,layer);
					// group.draggable(false);
					// layer.draggable(true);

					// layer.scale({
					// 	x:1/2.5,
					// 	y:1/2.5
					// });
					// console.log(layer.x());
					// layer.x(width/2);
					$(".c_text").animate({"opacity":0},500,function(){
						$timeout(function(){
							scope.text="选择你喜欢的场景";
							scope.notice="人物在场景中是可以缩放移动哒。";
							$(".c_text").animate({"opacity":1},500);
						},1)
					});

					layer.toImage({
						callback:function(img){
							stage.height(height);
							console.log(img.width);
							console.log(img.height);
							dym.destroy();
							arr[k].destroy();

							layer.clear();
							dym=new Kinetic.Image({
								x:width/2,
								y:height/2,
								width:img.width,
								height:img.height,
								image:img,
								offset:{
									x:width/2,
									y:height/2
								},
								draggable:true,
								dragBoundFunc:function(pos){
									y_t=pos.y;
									// console.log(dym.width());
									// console.log(dym.height());
									// if(pos.y<y_t+50){
									// 	return {
									// 		x:pos.x,
									// 		y:y_t+50
									// 	}
									// }
									// else if(pos.y>y_b-50){
									// 	return {
									// 		x:pos.x,
									// 		y:y_b-50
									// 	}
									// }
									return {
										x:pos.x,
										y:pos.y
									}
								}
							});


							for(var i=0;i<arr.length;i++){
								if(i!=k){
									arr[i].destroy();
								}
							}

							init();
							var bs=-1;
							var speed=-350;
							var speedx=120;
							var ani=new Kinetic.Animation(function(frame){
								var dist=bs*(frame.timeDiff/1000);
								var s=speed*(frame.timeDiff/1000);
								// dym.scale();
								var x=dym.scaleX()+dist;
								var y=dym.scaleY()+dist;
								var ss=speedx*(frame.timeDiff/1000);
								if(x<0.25){
									ani.stop();
									zoom(0,x,cvs,dym,true);		
								}
								else{
									dym.scale({
										x:x,
										y:y
									});

									dym.move({
										y:s,
										x:ss
									});
								}
							},layer);
							ani.start();

							// init();
							list(bg_list,layer,layer);
							layer.add(dym);
							// layer.draw();
							var cvs=layer.getCanvas()._canvas;
							// hammer=null;

							// zoom(0,1,cvs,dym,true);
							layer.draw();
						}
					})

					// for(var i=0;i<arr.length;i++){
					// 	if(i!=k){
					// 		arr[i].destroy();
					// 	}
					// }

					// init();
					// bgg.destroy();
					// list(bg_list,layer2,layer2);
					// layer2.draw();
					// layer.draw();
				}
				else if(step==4){
					// alert("kk");
					// alert(y_t);
					if(y_t-220<0){
						y_t=0;
					}
					else if(y_t-220+width>height){
						y_t=height-width;
					}
					else{
						y_t=y_t-220;
					}

					// alert(y_t);

					$(".hcing").css("display","block");
					// $(".img")
					$(".hcing").animate({opacity:1},1000);
					stage.toDataURL({
						callback:function(url){
							// alert(y_t);

							// if(View.save){
							// 	imgurl2=url;
							// 	$timeout(function(){
							// 		$location.path(scope.nexts);
							// 	},1);
							// }
							var data=url.substr(22);
							$.post("http://mp.socialvalue.cn/compaign/imageupload",{
								data:data,
								openid:use,
								starty:y_t,
								width:width
							},function(data){
								
								imgurl=JSON.parse(data).url;
								shareobj.url=JSON.parse(data).shareurl;
								// console.log(shareobj.imgUrl);
								// $(".hcing").css("display","none");
								// if(!View.save){
									imgurl2=imgurl;
									// $timeout(function(){
									// 	$(".hcing").css("display","none");
									// 	$location.path(scope.nexts);
									// },1);
								// }

								// alert(imgurl);

								// wx.onMenuShareTimeline({
						  //   		title:stext,
						  //   		link:"http://mp.socialvalue.cn/wechat/author",
						  //   		imgUrl:imgurl,
						  //   		success:function(){
						  //   			$timeout(function(){
						  //   				$location.path("/step8");
						  //   			},1);
						  //   		},
						  //   		cancel:function(){
						    			
						  //   		}
						  //   	});
                                var im=new Image();

                                im.onload=function(){
	                            	wx.onMenuShareAppMessage({
									    title: shareobj.text, // 分享标题
									    link: 'http://mp.socialvalue.cn/wechat/author', // 分享链接
									    imgUrl: shareobj.url, // 分享图标
									    success: function () { 
									        $timeout(function(){
							    				$location.path("/step8");
							    			},1);
									    },
									    cancel: function () { 
									        // 用户取消分享后执行的回调函数
									    }
									});
                                	// wx.onMenuShareAppMessage(shareobj);


								// $timeout(function(){
									wx.onMenuShareTimeline({
							    		title:shareobj.text,
							    		link:"http://mp.socialvalue.cn/wechat/author",
							    		// imgUrl:shareobj.
							    		imgUrl:shareobj.url,
							    		success:function(){
							    			$timeout(function(){
							    				$location.path("/step8");
							    			},1);
							    		},
							    		cancel:function(){
							    			
							    		}
							    	});

							    	// wx.onMenuShareTimeline(shareobj);

							    	$timeout(function(){
										// $(".hcing").css("display","none");
										$location.path(scope.nexts);
									},1);

                                }
                                // alert(shareobj.url);
                                im.src=shareobj.url;
							});
						}
					})
				}
			});




			function ani(node1,node2,layer){
				animating=true;
				var a=new Kinetic.Animation(function(frame){
					if(left){
						var dist=-velocity*(frame.timeDiff/1000);
						node1.move({
							x:dist
						});
						node2.move({
							x:dist
						});
						if(node2.x()<=0){
							node2.x(0);
							node1.x(-width);
							// node1.x(width);
							animating=false;
							a.stop();
						}
					}
					else{
						var dist=velocity*(frame.timeDiff/1000);
						node1.move({
							x:dist
						});
						node2.move({
							x:dist
						});

						if(node2.getX()>=0){
							node2.setX(0);
							node1.setX(width);
							animating=false;
							a.stop();
						}
					}
				},layer);
				return a;
			}

		}
	}
});
app.directive("rule",function(View){
	return {
		restrict:"A",
		link:function(scope,ele,attr){
			var showrule=false,
			    rule=$(".wrap_rule"),
			    share_wrap=$(".share_wrap");
			$(".close").on("touchstart",function(){
				rule.animate({opacity:0},500,function(){
					$(this).css("display","none");
				});
				showrule=true;
			});

			$("#rule").on("touchstart",function(){
				var url="/html/index.php#/step7#rule";
				// _hmt.push(["_trackPageview",url]);
				rule.css("display","block");
				rule.animate({opacity:1},500);
			});

			$("#share").on("touchstart",function(){
				var url="/html/index.php#/step7#share";
				// _hmt.push(["_trackPageview",url]);
				share_wrap.css("display","block");
				share_wrap.animate({opacity:1},500);
			});

			share_wrap.on("touchstart",function(){
				share_wrap.animate({opacity:0},500,function(){
					share_wrap.css("display","none");
				});
			})
		}
	}
})

app.directive("file",function($location,$timeout){
	return {
		restrict:"A",
		link:function(scope,ele,attr){
			ele[0].addEventListener("touchstart",function(){
				wx.chooseImage({
					success:function(res){
					   localId=res.localIds;
					   $timeout(function(){
					   	$location.path("/step3");
					   },1);
					}
				});
			},false);
		}
	}
})

app.directive("fileup",function($timeout,$location){
	return {
		restrict:"A",
		link:function(scope,ele,attr){
			var form=document.getElementById("forr");


			$("#user_img").change(function(){
				// alert(use);
				$("#oi").attr("value",use);
				// console.log(new FormData(form));


				// console.dir($("#user_img"));

				setTimeout(function(){
					$.ajax({
						url:"http://mp.socialvalue.cn/html/upload.php",
						type:"POST",
						data:new FormData(form),
						contentType:false,
						processData:false
					}).done(function(result){
						console.log(result);
						console.log(typeof result);
						var res=JSON.parse(result);
						// alert(res.url);
						localId=res.url;
						$timeout(function(){
							$location.path("/step3");
						},1);
					}).fail(function(err){
						alert("err");
					});
				},12);
			})
		}
	}
});

app.directive("sub",function(){
	return {
		restrict:"A",
		link:function(scope,ele,attr){
			ele[0].addEventListener("touchstart",function(){
				console.log($("#na").val());
				console.log($("#tt").val());
				var user_info={
					name:$("#na").val(),
					tel:$("#tt").val(),
					openid:use
				};
				var reg=/^1[3|4|7|5|8][0-9]\d{4,8}$/;
				if(reg.test(user_info.tel)){
					$.post("http://mp.socialvalue.cn/compaign/infoupload",user_info,function(data){
						$(".lucky").css("display","none");
						$(".formm").css("display","none");
						$("#success_info").css("display","block");
						$("#sub").css("display","none");
						$("#again").css("display","block");
					});
				}
				else{
					alert("请输入正确的手机号码");
				}
			},false);
		}
	}
});

app.directive("anfile",function($location,$timeout){
	return {
		restrict:"A",
		link:function(scope,ele,attr){
			ele[0].addEventListener("touchstart",function(){
				// $timeout(function(){
	   //      		$location.path("/step3");
	   //      	},1);
				wx.chooseImage({
					count:1,
					sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
				    sourceType: ['album', 'camera'], 
				    success:function(res){
				    	var local=res.localIds[0];
				    	wx.uploadImage({
						    localId: local, // 需要上传的图片的本地ID，由chooseImage接口获得
						    isShowProgressTips: 1, // 默认为1，显示进度提示
						    success: function (res) {
						        var serverId = res.serverId;
						        // alert(serverId);
						        $.post("http://mp.socialvalue.cn/html/upload.php",{
						        	server_id:serverId,
						        	openid:use
						        },function(data){
						        	var res=JSON.parse(data);
						        	// alert(res.url);
						        	localId=res.url;
						        	$timeout(function(){
						        		$location.path("/step3");
						        	},1);
						        })
						    }
						});
				    }
				})
			},false)
		}
	}
})
app.directive("shh",function(){
	return {
		restrict:"A",
		link:function(scope,ele,attr){
			console.log(ele[0]);
			$(ele[0]).css("display","block");
		}
	}
});

app.directive("snow",function($rootScope,View,$location,$timeout){
	return {
		restrict:"A",
		link:function(scope,ele,attr){
			// var rule=$("#redo");
			// View.showpp=false;
			// showpp=false;
			var rule=$(".wrap_rule");
			scope.openID = openId;
			// alert('confirm openID:'+scope.openID);
			$("#toStep8").click(function(){
				setTimeout(function(){
					$(".snow").remove();
					clearInterval(timer);
				},1000);
				$.ajax({
					type:"POST",
					url:"http://xmas-2015.sgh.clients.inzen.com.cn/players/remainingChances",
					dataType:"json",
					data:{
						openID:scope.openID
					},
					success:function(res){
						if(res.success){ //用户已注册
							// alert(res.data);
							if(res.data.chances == 0){ //用户剩下0次机会
								$timeout(function(){
									$location.path("/step5");
								},1)
							}else{
								$timeout(function(){
									$location.path("/step8");
								},1);
							}
						}else{	//用户没注册
							$.ajax({
								type:"POST",
								url:"http://xmas-2015.sgh.clients.inzen.com.cn/players/register",
								dataType:"json",
								data:{
									openID:scope.openID
								},
								success:function(regres){
									if(regres.success){ //注册成功
										$timeout(function(){
											$location.path("/step8");
										},1);
										// window.location.href="/FindGlass/index.html#/step8";
										// alert("register");
									}else{ //注册失败
										// alert("用户注册失败。请重试");
									}
								}
							})
						}
					},
					error:function(jqXHR){
						// alert("出错了，请再试一次");
					}
				})
			})		
		

			$(".close").on("touchstart",function(){
				rule.animate({opacity:0},500,function(){
					$(this).css("display","none");
				});
				showrule=true;
			});

			$("#redo").on("touchstart",function(){
				// var url="/html/index.php#/step7#rule";
				// _hmt.push(["_trackPageview",url]);
				console.log("kkk");
				rule.css("display","block");
				rule.animate({opacity:1},500);
			});

			var SCREEN_WIDTH = window.innerWidth;
			var SCREEN_HEIGHT = window.innerHeight;
			var container;
			var particle;
			var camera;
			var scene;
			var renderer;
			var mouseX = 0;
			var mouseY = 0;
			var istrueSnow=false;
			var istrueChange=false;
			var istrueGo=false;
			var windowHalfX = window.innerWidth / 2;
			var windowHalfY = window.innerHeight / 2;
			var timer;
			
			var particles = []; 
			var particleImage = new Image();//THREE.ImageUtils.loadTexture( "img/ParticleSmoke.png" );
			particleImage.src = 'file/Step1/snow.png'; 
		
		
			function init() {
				container = document.createElement('div');
				container.setAttribute("class","snow");
				ele[0].appendChild(container);
				camera = new THREE.PerspectiveCamera( 75, SCREEN_WIDTH / SCREEN_HEIGHT, 1, 10000 );
				camera.position.z = 1000;
				scene = new THREE.Scene();
				scene.add(camera);
					
				renderer = new THREE.CanvasRenderer();
				renderer.setSize(SCREEN_WIDTH, SCREEN_HEIGHT);
				var material = new THREE.ParticleBasicMaterial( { map: new THREE.Texture(particleImage) } );
					
				for (var i = 0; i < 500; i++) {
					particle = new Particle3D( material);
					particle.position.x = Math.random() * 2000 - 1000;
					particle.position.y = Math.random() * 2000 - 1000;
					particle.position.z = Math.random() * 2000 - 1000;
					particle.scale.x = particle.scale.y =  1;
					scene.add( particle );
					
					particles.push(particle); 
				}
				container.appendChild( renderer.domElement );
				timer=setInterval( loop, 1000 / 60 );
			}
			
			//
			function loop() {
			for(var i = 0; i<particles.length; i++)
				{
					var particle = particles[i]; 
					particle.updatePhysics(); 
	
					with(particle.position)
					{
						if(y<-1000) y+=2000; 
						if(x>1000) x-=2000; 
						else if(x<-1000) x+=2000; 
						if(z>1000) z-=2000; 
						else if(z<-1000) z+=2000; 
					}				
				}
			
				camera.position.x += ( mouseX - camera.position.x ) * 0.05;
				camera.position.y += ( - mouseY - camera.position.y ) * 0.05;
				camera.lookAt(scene.position); 
				renderer.render( scene, camera );
			}

			init();
		}
	}
});
app.directive("stepe",function($rootScope,$timeout,$location){
	return {
		restrict:"A",
		link:function(scope,ele,attr){
			scope.openID = openId;
			$("#useChance").click(function(){
				$.ajax({
					type:"POST",
					url:"http://xmas-2015.sgh.clients.inzen.com.cn/players/useChance",
					dataType:"json",
					data:{
						openID:openId
					},
					success:function(data){
						$timeout(function(){
							$location.path("/step2");
						},1);
					},
					error:function(jqXHR){
						alert("出错了，请再试一次");
					}
				})
			})

			$("#rule_icon3").click(function(){
				$("#rule_detail").show();
				$("#music").hide();
			})
			$("#rule_close").click(function(){
				$("#rule_detail").hide();
				$("#music").show();
			})			
		}
	}
})
app.directive("submit",function($rootScope,$timeout,$location){
	return {
		restrict:"A",
		link:function(scope,ele,attr){
			scope.openID = openId;
			var reg=/^1[3|4|5|8][0-9]\d{4,8}$/;

			$("#sub").click(function(){
				var name=$("#na").val();
				var tel=$("#tt").val();
				var address=$("#ad").val();
				if(!name){
					alert("请输入姓名");
					return;
				}
				else if(!reg.test(tel)){
					alert("请输入正确的电话");
					return;
				}
				$.ajax({
					type:"POST",
					url:"http://xmas-2015.sgh.clients.inzen.com.cn/players/regWinner",
					dataType:"json",
					data:{
						name:$("#na").val(),
						tel:$("#tt").val(),
						address:$("#ad").val(),
						openID:scope.openID
					},
					success:function(data){
						console.log(data);
						$timeout(function(){
							$location.path("/step10");
						},1);

					},
					error:function(jqXHR){
						alert("出错了，请再试一次");
					}
				})
			})		
		}
	}
})
// app.directive("curtain",function(){
// 	return {
// 		restrict:"A",
// 		link:function(scope,ele,attr){
// 			$(".deal_pic").click(function(){
// 				var aLi=document.getElementsByTagName('li')
				
// 				aLi[0].timer=null
// 				aLi[1].timer=null
// 				startMove(aLi[0],-400);
// 				startMove(aLi[1],700);
// 			})
// 				function startMove(obj,iTarget){
// 					clearInterval(obj.timer)
// 					obj.timer=setInterval(function(){
// 						var speed=(iTarget-obj.offsetLeft)/100
// 						speed=speed>0?Math.ceil(speed):Math.floor(speed);
// 						if(obj.offsetLeft==iTarget){
// 							clearInterval(obj.timer)
// 						}
// 						else{
// 							obj.style.left=obj.offsetLeft+speed+'px';
// 						}
// 					},30)
// 				}
						
// 		}
// 	}
// })
// app.directive("fenbu",function(View){
// 	return {
// 		restrict:"A",
// 		link:function(scope,ele,attr){
// 			var huabu=$(".wrap_choose");
// 			var h_width=2000;
// 			var width=scope.width;
// 			var height=scope.height;
// 			var glasses=hardsj.slice(3,13);
// 		    var regions=[];
// 		    var hjg=h_width/5;
// 		    var sjg=height/2;
// 		    var len=glasses.length;

// 		    var xArray=new Array(1032,1860,3421,292,419,3406,3193,216,1376,1924,1833,2839,2862,3289,2897,2385,3316);
// 		    var yArray=new Array(1794,1869,1869,1696,438,1449,1033,1914,1612,593,1612,1149,965,1183,1921,613,728);
		    
// 		    for(var i=0;i<len;i++){
// 		    	// var bl=glasses[i].height/glasses[i].width;
// 		    	// glasses[i].width=Math.random()*50+50;
// 		    	// glasses[i].height=glasses[i].width*bl;
// 		    	var index=Math.floor((Math.random()*xArray.length));
// 		    	posx=xArray[index]/1.85;
// 		    	posy=yArray[index]/2;
// 		    	xArray.splice(index,1);
// 		    	yArray.splice(index,1);
// 		    	//console.log(posx);
// 		    	//console.log(posy);

// 		    	// if(i<5){
// 		    	// 	var posx=Math.random()*hjg+i*hjg;
// 		    	// 	var posy=Math.random()*sjg;
// 		    	// 	if(i==4){
// 		    	// 		if(posx+glasses[i].width>h_width){
// 		    	// 			posx=h_width-glasses[i].width-10;
// 		    	// 		}
// 		    	// 	}
// 		    	// }
// 		    	// else {
// 		    	// 	var posx=Math.random()*hjg+(i-5)*hjg;
// 		    	// 	var posy=Math.random()*sjg+sjg;
// 		    	// 	if(posy+glasses[i].height>height){
// 		    	// 		posy=height-glasses[i].height-10;
// 		    	// 	}

// 		    	// 	if(i==9){
// 		    	// 		if(posx+glasses[i].width>h_width){
// 		    	// 			posx=h_width-glasses[i].width-10;
// 		    	// 		}
// 		    	// 	}
// 		    	// }
// 		    	// var opa=Math.random()+0.3;
// 		    	// opa=opa<1 ? opa:Math.random();

		    	

// 		    	$(glasses[i])
// 		    				 // .css("opacity",1)
// 		    	             .attr("class","findImg")
// 		    	             .css("left",posx+"px")
// 		    	             .css("top",posy+"px");
// 		    	huabu.append($(glasses[i]));	
// 		    }

// 		//     $(".wrap_choose").click(function(){
// 		// 		var aLi=document.getElementsByTagName('li')
				
// 		// 		aLi[0].timer=null
// 		// 		aLi[1].timer=null
// 		// 		startMove(aLi[0],-400);
// 		// 		startMove(aLi[1],2000);
// 		// 		})

// 		//     function startMove(obj,iTarget){
// 		// 	clearInterval(obj.timer)
// 		// 	obj.timer=setInterval(function(){
// 		// 		var speed=(iTarget-obj.offsetLeft)/200
// 		// 		speed=speed>0?Math.ceil(speed):Math.floor(speed);
// 		// 		if(obj.offsetLeft==iTarget){
// 		// 			clearInterval(obj.timer)
// 		// 		}
// 		// 		else{
// 		// 			obj.style.left=obj.offsetLeft+speed+'px';
// 		// 			console.log(obj.offsetLeft)
// 		// 		}
// 		// 	},30)
// 		// }

// 		    $(".findImg").on("touchstart",function(e){
// 		    	scope.$apply(function(){
// 		    		scope.score++;
// 		    	});
// 		    	$(e.target).remove();
// 		    	if(scope.score>=10){
// 		    		score=10;
// 		    		clearInterval(timer);
// 		    		scope.nextSuccess();
// 		    		scope.$apply();
// 		    	}
// 		    });

		 //    $(".wrap_choose").on("touchmove",function(){
			// 	var timer=null;			
			// 		var oDiv=document.getElementById('move_pic');
			// 		timer=setInterval(function(){
			// 			if(oDiv.offsetLeft==900){
			// 				clearInterval(timer);
			// 			}else{
			// 			oDiv.style.left=oDiv.offsetLeft+10+"px";
			// 			}
			// 		},1000)							
			// });
// 
			//  $(".wrap_choose").on("touchend",function(){
			//  		var oDiv=document.getElementById('move_pic');
			// 		oDiv.style.left=oDiv.offsetLeft;		
			// });

// 			 $(".wrap_choose")[0].addEventListener("touchstart",function(){
// 			 	console.log("ssss");
// 			 },false);
// 			 $(".wrap_choose")[0].addEventListener("touchmove",function(){
// 			 	console.log("111");
// 			 },false);
// 			 $(".wrap_choose")[0].addEventListener("touchend",function(){
// 			 	console.log("222");
// 			 },false);
			//  function(){

			// 	var timer=null;			
			// 		var oDiv=document.getElementById('wrap_choose');
			// 		timer=setInterval(function(){
			// 			if(oDiv.offsetLeft==0){
			// 				clearInterval(timer);
			// 			}else{
			// 			oDiv.style.left=oDiv.offsetLeft+10+"px";
			// 			alert("2");
			// 			}
			// 		},1000)							
			// });

			


// 		    var timer=setInterval(function(){
// 		    	if(scope.totaltime==1){
// 		    		clearInterval(timer);
// 		    		if(scope.score<10){
// 		    			score=scope.score;
// 		    			scope.nextFail();
// 		    			scope.$apply();
// 		    		}
// 		    		else{
// 		    			score=10;
// 		    			scope.nextSuccess();
// 		    			scope.$apply();
// 		    		}
// 		    	}
// 		    	else{
// 			    	scope.$apply(function(){
// 			    		scope.totaltime--;
// 			    	})
// 		    	}
// 		    },1000)
// 		}
// 	}
// });
app.directive("fenbu",function(View){
	return {
		restrict:"A",
		link:function(scope,ele,attr){
			var huabu=$(".wrap_choose");
			var h_width=2000;
			var width=scope.width;
			var height=scope.height;
			var glasses=hardsj.slice(3,13);
		    var regions=[];
		    var hjg=h_width/5;
		    var sjg=height/2;
		    var len=glasses.length;



		    var xArray=new Array(158,228,116,558,1041,1300,1565,1852,1842,1778,1727,1535,1560,1800,930);
		    var yArray=new Array("84%","21.7%","96.3%","89%","29.4%","30.4%","95.2%","92.8%","72%","58.66%","52.2%","57%","48%","36.7%","73.9%");


		    for(var i=0;i<len;i++){
		    	var index=Math.floor((Math.random()*xArray.length));
		    	var posx=xArray[index];
		    	var posy=yArray[index];

		    	xArray.splice(index,1);
		    	yArray.splice(index,1);
		    	

		    	$(glasses[i])
		    				 // .css("opacity",opa)
		    	             .attr("class","findImg")
		    	             .css("width","69")
		    	             .css("height","30")
		    	             .css("left",posx+"px")
		    	             .css("top",posy);
		    	huabu.append($(glasses[i]));

		    }

		    $(glasses[6]) .css("left",800+"px")
					      .css("top","79.9%");
		    $(glasses[7]) .css("left",396+"px")
		    			  .css("width","30")
					      .css("top","27.5%");
		    $(glasses[8]) .css("left",335+"px")
		    			  .css("width","30")
					      .css("top","83.4%");
            $(glasses[9]) .css("left",1000+"px")
        			      .css("top","91%");

					   
        	$("#hint").click(function(){
				$("#hint").hide();
				timer=setInterval(function(){
			    	if(scope.totaltime==1){
			    		clearInterval(timer);
			    		if(scope.score<10){
			    			score=scope.score;
			    			scope.nextFail();
			    			scope.$apply();
			    		}
			    		else{
			    			score=10;
			    			scope.nextSuccess();
			    			scope.$apply();
			    		}
			    	}
			    	else{
				    	scope.$apply(function(){
				    		scope.totaltime--;
				    	})
			    	}
			    },1000);
			})

		    $(".findImg").on("touchstart",function(e){
		    	scope.$apply(function(){
		    		scope.score++;
		    	});
		    	$(e.target).remove();
		    	if(scope.score>=10){
		    		score=10;
		    		clearInterval(timer);
		    		scope.nextSuccess();
		    		scope.$apply();
		    	}
		    });

		    var timer;
		    	
		    var oWrap=document.getElementById('wrap_choose');
		    var oPic=document.getElementById('move_pic'); 
		    var startX=0,starY=0;
		    var speed;
		    	 
		     $(".wrap_choose")[0].addEventListener("touchstart",function(event){ 
		     	  $(".wn").css("display","none");
		     	  event.preventDefault();
		     	  var touch = event.targetTouches[0];
		     	  var x=touch.pageX;//开始的x坐标
		     	  startX=x;		
		     	  // alert("kk");          	  	
			 },false);		     
			


			 
			  $(".wrap_choose")[0].addEventListener("touchmove",function(event){
			  	event.preventDefault();
			  	var touch = event.targetTouches[0];
			  	var x=touch.pageX;//开始的x坐标
			  	//判断左右
			  	var speed=x-startX;
			  	startX=x;

			 	startMove(speed);			 	
			 },false);


			  function startMove(speed){

			  	        // console.log(speed);
		  	            if(speed+oWrap.offsetLeft<0&&speed+oWrap.offsetLeft>(-(h_width-width))){
			  				oWrap.style.left=oWrap.offsetLeft+speed+"px";
							oPic.style.left=oPic.offsetLeft+speed*1.5+"px";	
						}	  							

		  			}
		}
	}
})

app.directive("coupon",function(View){
	return {
		restrict:"A",
		link:function(scope,ele,attr){
			$(".location_back").click(function(){
					window.history.back();
				});		
		}
	}
})
























