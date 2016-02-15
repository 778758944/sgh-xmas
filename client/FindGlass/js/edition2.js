/**
 * 
 * @authors Your Name (you@example.org)
 * @date    2015-09-13 15:32:58
 * @version $Id$
 */
 window.onload=function(){
    var width=document.documentElement.clientWidth,
    height=document.documentElement.clientHeight,

    hardsj=[],
    models,galss,bgs,

    velocityX=100;

 	var stage=new Kinetic.Stage({
 		width:width,
 		height:height,
 		container:"container"
 	});

 	var layer=new Kinetic.Layer();
 	var layer2=new Kinetic.Layer();
 	var group=new Kinetic.Group();


 	// var url=$location.protocol()+"://"+$location.host()+":"+$location.port()+"/html2";
 	// console.log(window.location);
 	var url=window.location.origin+"/html2";

	var hard=[
	    url+"/file/Step1/Step1.png",
	    url+"/file/Step1/move.jpg",
		url+"/file/Step8/Step8.jpg",
		url+"/file/Step2/Step2.jpg",
		url+"/file/Step4/model1.png",
		url+"/file/Step4/model2.png",
		url+"/file/Step4/model3.png",
		url+"/file/Step4/model4.png",
		url+"/file/Step4/model5.png",
		url+"/file/Step4/model6.png",
		url+"/file/Step4/model7.png",
		url+"/file/glass2/glass1.png",
		url+"/file/glass2/glass2.png",
		url+"/file/glass2/glass3.png",
		url+"/file/glass2/glass4.png",
		url+"/file/glass2/glass5.png",
		url+"/file/Step6/bg1.jpg",
		url+"/file/Step6/bg2.jpg",
		url+"/file/Step6/bg3.jpg",
		url+"/file/Step6/bg4.jpg",
		url+"/file/Step6/bg5.jpg"
		];

		var j=0,
		    arr=[],
		    toleft=document.getElementById("toLeft"),
		    toright=document.getElementById("toRight"),
		    toStep5=document.getElementById("toStep5");

		function getImage2(){
		// console.log(data);
			var img=new Image();
			// var i=0;
			img.onload=function(){
				hardsj.push(img);
				j=j+1;
				if(j<hard.length){
					getImage2();
				}
				else{
					models=hardsj.slice(4,11);
					glass=hardsj.slice(11,16);
					bgs=hardsj.slice(16);

					start();
				}
			}
			img.src=hard[j];
		}


		getImage2();



		function start(){
			var back=new Kinetic.Image({
				image:bgs[0],
				width:width,
				height:width,
				x:0,
				y:0
			});

			layer2.add(back);
			list(models,group,layer2);

			stage.add(layer2);
			// stage.add()

		}


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
			};


	function list(img_list,layer,layer2,c_w,c_h,x,y){
			console.log(layer2);
			var i_width=c_w||width,
			    i_height=c_h||height,
			    posx=x||width,
			    posy=y||0;

			for(var i=0;i<img_list.length;i++){
				if(i==0){
					arr[i]=new Kinetic.Image({
						x:0,
						y:posy,
						image:img_list[i],
						width:i_width,
						height:i_height
					});
					// var pos=arr[i].()-width;
				}
				else if(i==img_list.length-1){
					console.log(i);
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
			toleft.addEventListener("touchstart",prev,false);


			toright.addEventListener("touchstart",next,false);
		}

		function init(){
			arr=[];
			k=0;
			toleft.removeEventListener("touchstart",prev,false);
			toright.removeEventListener("touchstart",next,false);
		}












 }

