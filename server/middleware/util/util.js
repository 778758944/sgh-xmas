/*
# SGH 2015 Christmas Game - Server
# Utility Module
# Rev. 0.0.1 Dev - 11 Dec 2015
*/

var util 	= {};
// No modules required.

//Main Functions here
//Respond template message
util.respond = function(success,message,data){
	return {'success':success,'message':message,'data':data};
}

util.clog = function(className,funcName,type,info){
	var logging = true; //Logging?
	var loggingClasses = []; //Classes which shows logging
	if(logging){
		var logging = function(className,funcName,type,info){
			var eventType = '';
			switch(type){
				case 0: eventType = 'INF';break;
				case 1: eventType = 'WRN';break;
				case 2: eventType = 'ERR';break;
				default: eventType = 'DEF';break;
			}
			console.log(className+"::"+funcName+" - "+eventType+":"+info);
		}
		if(loggingClasses.length == 0){//No classes defined. Logging events from all classes
			logging(className,funcName,type,info);
		}else if(loggingClasses.indexOf(className) != -1){
			logging(className,funcName,type,info);
		}
	}
}

util.parseCookieString = function(cookies,preset){
	//Check whether cookie and preset str contains "key" & "value" pair
	var parse = true;
	for(var i=0; i<cookies.length;i++){
		if(typeof(cookies[i]['key']) === "undefined" || typeof(cookies[i]['value']) === "undefined"){
			parse = false;
		}
	}
	for(var i=0; i<preset.length;i++){
		if(typeof(preset[i]['key']) === "undefined" || typeof(preset[i]['value']) === "undefined"){
			parse = false;
		}
	}
	//Return empty string and return error if input params does not match pre-defined style
	if(!parse){
		this.clog('util','parseCookieString',0,'Cookies object does not match defined settings!');
		return;
	}else{
		var string = "";
		for(var i=0;i<cookies.length;i++){
			string += cookies[i]['key']+'='+cookies[i]['value']+';';
		}
		//Insert Preset
		for(var i=0;i<preset.length;i++){
			string += preset[i]['key']+'='+preset[i]['value']+';';
		}
		return string;
	}
}

module.exports = util;