/*
# SGH 2015 Christmas Game - Server
# Lottery Module for Prize draws and related operations
# Rev. 0.0.1 Dev - 11 Dec 2015
*/

var referrer 	= {};
// Base Modules
var Loopback	= require('loopback');
var util		= require('../util/util.js');
	
// Load Main Functions
referrer.entrance = function(req,res){
	if(!req.query.refid){
		util.clog('referrer','entrance',2,'ReferrerID Not get!');
        res.writeHead(200);
        //Redirect
        res.write('<script type="text/javascript" >');
        res.write('window.setTimeout(function(){document.location="../../wx/ua"},1000)');
        res.write('</script>');
        res.end();
	}else{
		var refid = req.query.refid;
		var referrer = Loopback.findModel('referrer');
		referrer.find({where:{id:refid}},function(error,data){
			if(error || data.length != 1){
				util.clog('referrer','entrance',2,'Database read error, or referrer id not get!');
				redirToEntrance();
			}else{
				var referrerObj = data[0];
				var counter = referrerObj.count;
				counter += 1;
				referrerObj.count = counter;
				console.log(referrerObj.count);
				//Update the counter to the db
				referrer.updateAll({id:refid},referrerObj,function(error){
					if(error){
						util.clog('referrer','entrance',2,'Database write error!');
				        res.writeHead(200);
				        //Redirect
				        res.write('<script type="text/javascript" >');
				        res.write('window.setTimeout(function(){document.location="../../wx/ua"},1000)');
				        res.write('</script>');
				        res.end();
					}else{
						console.log('debug, with count:'+referrerObj.count);
				        res.writeHead(200);
				        //Redirect
				        res.write('<script type="text/javascript" >');
				        res.write('window.setTimeout(function(){document.location="../../wx/ua"},1000)');
				        res.write('</script>');
				        res.end();
					}
				});
			}
		});
	}
}

module.exports = referrer;