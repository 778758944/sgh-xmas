/**
 * 
 * @authors Your Name (you@example.org)
 * @date    2015-09-07 15:31:01
 * @version $Id$
 */
var sghService=angular.module("sghService",[]);
sghService.factory('View', function(){
	// alert(window.devicePixelRatio);
	window.devicePixelRatio=1;
	// alert(window.devicePixelRatio);
	var use=navigator.userAgent;
	var plam=true;
	if(use.indexOf("iPhone")!=-1){
		var save_img=true;
	}
	else{
		var save_img=false;
	}
	var ori_width=document.documentElement.clientWidth;
	var pixelb=ori_width/640;
	document.getElementById("view").content="width=640,minimum-scale="+pixelb+",initial-scale="+pixelb+",maximum-scale="+pixelb+",user-scalable=no";
	var width=document.documentElement.clientWidth;
	var height=document.documentElement.clientHeight;
	var bl=width/414;
	var nrem=bl*26;
	// alert(nrem);
	$("html").css("fontSize",nrem+"px");
	$("html").css("height",height+"px");
	$(".view-content").css("height",height+"px");


	function zoom(rotateStart,scaleX,cvs,c_img,isScale,isRotate){


		hammer=new Hammer.Manager(cvs);

        var pinch=new Hammer.Pinch();
        var rotate=new Hammer.Rotate();

        pinch.recognizeWith(rotate);
        hammer.add([pinch,rotate]);

        if(isRotate){
        	// hammer.on("rotatestart",function(){
        	// 	c_img.draggable(false);
        	// })
	        hammer.on("rotatemove",function(e){
	        	// console.log(e);
	        	// c_img.draggable(false);
	        	rot=e.rotation+rotateStart;
	        	c_img.rotation(rot);
	        });

	        hammer.on("rotateend",function(e){
	        	rotateStart=rot;
	        	// c_img.draggable(true);
	        });
	    }

	    if(isScale){
	    	// hammer.on("pinchstart",function(){
	    	// 	c_img.draggable(false);
	    	// });
	    	hammer.on("pinchmove",function(e){
	    		// c_img.draggable(false);
	            scaless=scaleX*e.scale;

	            c_img.scale({
	                x:scaless,
	                y:scaless
	            });
	        });

	        hammer.on("pinchend",function(){
	        	scaleX=scaless;
	        	// c_img.draggable(true);
	        });
	    }
	}

	return {
		nrem:nrem,
		bl:bl,
		width:width,
		height:height,
		zoom:zoom,
		plam:plam,
		save:save_img,
		score:0,
		prize:"",
		grade:"",
		showpp:false
	}
});
var j=0;

sghService.factory("Http",function($location,$timeout,View){


	return {
		name:"jack",
		bgm:bgm
	}
});


sghService.service("Zoom",function(){
	var Zoom=function(rotatedeg,scale,cvs,shape,isScale,isRotate){
		this.startr=rotatedeg;
		this.starts=scale;
		this.cvs=cvs;
		this.shape=shape;
		this.isScale=isScale;
		this.isZoom=isRotate;
		this.scales;
		this.rotates;
     
        this.hammer=new Hammer.Manager(this.cvs);


		if(isScale&&isRotate){
			var pinch=new Hammer.Pinch();
	        var rotate=new Hammer.Rotate();
	        pinch.recognizeWith(rotate);
	        this.hammer.add([pinch,rotate]);
		}
		else if(isScale&&!isRotate){
			var pinch=new Hammer.Pinch();
			this.hammer.add([pinch]);
		}
		else{
			var rotate=new Hammer.Rotate();
			this.hammer.add([rotate]);
		}

		this.hammer.on("rotatemove",this.scale);

        this.hammer.on("rotateend",this.scaleed);

        this.hammer.on("pinchmove",this.scale);

        this.hammer.on("pinchend",this.scaleed);
	}

	Zoom.prototype={
		scale:function(e){
			// scaless=scaleX*e.scale;
			this.scales=this.starts*e.scale;
            this.shape.scale({
                x:this.scales,
                y:this.scales
            });
            // this.starts=this.scales;
		},

		scaleend:function(){
			this.starts=this.scales;
		},

		rotation:function(e){
			this.rotates=this.startr+e.rotation;
			// rot=e.rotation+rotateStart;
        	c_img.rotation(this.rotates);	
		},

		rotationend:function(e){
			this.startr=this.rotates;
		}
	}
	return Zoom;
})





























