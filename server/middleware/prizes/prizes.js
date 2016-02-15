/*
# SGH 2015 Christmas Game - Server
# Prizes Module for properties management of available prices
# Rev. 0.0.1 Dev - 11 Dec 2015
*/

var prizes = {};
//Load Basic modules
var Loopback	= require('loopback');
var util		= require('../util/util.js');

//Main Functions
prizes.addPrize = function(req,res){
	if(!req.body.name || !req.body.percentage || !req.body.amount){
		res.send(util.respond(false,'Missing prize name, winning percentage, or amount',null));
		return;
	}else if(isNaN(req.body.percentage) || isNaN(req.body.amount)){
		res.send(util.respond(false,'Winning Percentage or amount must be a number',null));
		return;
	}else if(req.body.percentage <= 0 || req.body.percentage > 100){
		res.send(util.respond(false,'Percentage must be a positive number, between 0 and 100.0 .',null));
		return;
	}else if(req.body.amount <= 0){
		res.send(util.respond(false,'Amount should be over 0 .',null));
		return;
	}else{
		var prizes = Loopback.findModel('prizes');
		var prizeObj = {'name':req.body.name,'initialPercentage':parseFloat(req.body.percentage)/100,'amount':parseInt(req.body.amount),'remainingAmount':parseInt(req.body.amount)};
		prizes.upsert(prizeObj,function(error){
			if(error){
				util.clog('prizes','addPrize',2,'Database error occured while saving data to db.');
				res.send(util.respond(false,'Database error occured while saving data to db.',null));
				return;
			}else{
				res.send(util.respond(true,'Prizes added',null));
				return;
			}
		});
	}
}

prizes.findPrize = function(req,res){
	if(!req.body.name){
		res.send(util.respond(false,'Missing prize name',null));
		return;
	}else{
		var prizes = Loopback.findModel('prizes');
		prizes.find({where:{name:req.body.name}},function(error,data){
			if(error){
				util.clog('prizes','addPrize',2,'Database error occured while saving data to db.');
				res.send(util.respond(false,'Database error occured while saving data to db.',null));
				return;
			}else{
				res.send(util.respond(true,'',data));
				return;
			}
		});
	}
}

prizes.deletePrize = function(req,res){
	if(!req.body.name){
		res.send(util.respond(false,'Missing prize name',null));
		return;
	}
	//Should add validation of session here
	else{
		var prizes = Loopback.findModel('prizes');
		prizes.destroyAll({name:req.body.name},function(error,data){
			if(error){
				util.clog('prizes','addPrize',2,'Database error occured while saving data to db.');
				res.send(util.respond(false,'Database error occured while saving data to db.',null));
				return;
			}else{
				res.send(util.respond(true,'Prize removed.',null));
				return;
			}
		});
	}
}

module.exports = prizes;