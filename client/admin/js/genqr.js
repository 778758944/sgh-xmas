/**
# SGH 2015 Christmas Game - Server
# Browser-side QR Generator module
*/

var beginGenerateQR = function(){
	var inputObj = document.getElementById('targetURL');
	var canvasElem = document.getElementById('qrcode');
	var url = inputObj.value;
	qr.canvas({
		canvas:canvasElem,
		value:url,
		size:10
	});
}

window.addEventListener('load',beginGenerateQR);