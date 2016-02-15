/**
 * 
 * @authors Your Name (you@example.org)
 * @date    2015-08-25 17:12:21
 * @version $Id$
 */
(function (lib, img, cjs) {

var p; // shortcut to reference prototypes

// stage content:
(lib.plane = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// 形状 5 副本 15
	this.instance = new lib.plane_1();
	this.instance.setTransform(15.1,112,1,1,75,0,0,17.6,15.5);

	this.timeline.addTween(cjs.Tween.get(this.instance).to({regY:15.6,rotation:-52.3,guide:{path:[15.1,111.9,18.2,119.7,18.3,119.9,23.7,128.7,31.2,136.3,55.6,161.1,92.4,162.6,92.5,162.6,92.5,162.6,92.6,162.6,92.6,162.6,129.3,161,153.6,135.9,165.4,123.8,171.5,111.7]}},66).to({rotation:-52.3,alpha:0},13).wait(16));

	// 形状 9 副本 13
	this.instance_1 = new lib.line();
	this.instance_1.setTransform(14,111);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance_1}]}).wait(95));

	// 形状 8 副本
	this.instance_2 = new lib.bg_cricle();

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance_2}]}).wait(95));

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(0,0,187,187);


// symbols:
(lib.bg_cricle = function() {
	this.initialize(img.bg_cricle);
}).prototype = p = new cjs.Bitmap();
p.nominalBounds = new cjs.Rectangle(0,0,187,187);


(lib.line = function() {
	this.initialize(img.line);
}).prototype = p = new cjs.Bitmap();
p.nominalBounds = new cjs.Rectangle(0,0,158,53);


(lib.plan2 = function() {
	this.initialize(img.plan2);
}).prototype = p = new cjs.Bitmap();
p.nominalBounds = new cjs.Rectangle(0,0,35,31);


(lib.plane_1 = function() {
	this.initialize();

	// 图层 1
	this.instance = new lib.plan2();

	this.addChild(this.instance);
}).prototype = p = new cjs.Container();
p.nominalBounds = new cjs.Rectangle(0,0,35,31);

})(lib = lib||{}, images = images||{}, createjs = createjs||{});
var lib, images, createjs;
