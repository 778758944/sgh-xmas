/*
# SGH 2015 Christmas Game - Server
# User Module for User Registration (w. Winners), chances record and others
# Rev. 0.0.1 Dev - 11 Dec 2015
*/

var players = {};
//Load Basic modules
var Loopback	= require('loopback');
var util		= require('../util/util.js');
//Main functions stated here
//Register new user, with default chances 1.
players.register = function(req,res){
	util.clog('players','register',0,'Invoked.');
	if(!req.body.openID){
		res.send(util.respond(false,'Missing OpenID to register new user',null));
		return;
	}else{
		var openID = req.body.openID;
		var players = Loopback.findModel('players');
		//Find if one exists.
		players.find({where:{openid:openID}},function(error,data){
			if(error){//Error occured on database
				util.clog('players','register',2,'Database Error on reading db.');
				res.send(util.respond(false,'Database Error on reading db.',null));
				return;
			}else if(data.length != 0){ //The user has already been registered?
				res.send(util.respond(false,'The user has been registered before',null));
				return;
			}else{
				//Give initial chance as 1...
				var initialChances = 1;
				var newMember = {'openid':openID,'chances':initialChances,'played':0};
				players.upsert(newMember,function(error){
					if(error){//Error occured on database
						util.clog('players','register',2,'Database Error on saving user to db.');
						res.send(util.respond(false,'Database Error on saving user to db',null));
						return;
					}else{
						res.send(util.respond(true,'New User Created.',{chances:initialChances}));
						return;
					}
				});
			}
		});
	}
}

players.remainingChances = function(req,res){
	if(!req.body.openID){
		res.send(util.respond(false,'Missing OpenID',null));
		return;
	}else{
		var openID = req.body.openID;
		var players = Loopback.findModel('players');
		players.find({where:{openid:openID}},function(error,data){
			if(error){
				util.clog('players','register',2,'Database Error on reading db.');
				res.send(util.respond(false,'Database Error on reading db.',null));
				return;
			}else if(data.length != 1){
				res.send(util.respond(false,'The specified user have not been registered',null));
				return;
			}else{
				var userObj = data[0];
				res.send(util.respond(true,'',{'chances':userObj.chances}));
				return;
			}
		});
	}
}

players.useChance = function(req,res){
	if(!req.body.openID){
		res.send(util.respond(false,'Missing OpenID',null));
		return;
	}else{
		var openID = req.body.openID;
		var players = Loopback.findModel('players');
		players.find({where:{openid:openID}},function(error,data){
			if(error){
				util.clog('players','useChance',2,'Database Error on reading db.');
				res.send(util.respond(false,'Database Error on reading db.',null));
				return;
			}else if(data.length != 1){
				res.send(util.respond(false,'The specified user have not been registered',null));
				return;
			}else{
				var userObj = data[0];
				console.log(JSON.stringify(data[0]));
				if(userObj.chances<=0){
					res.send(util.respond(false,'No More Chances',null));
					return;
				}else{
					userObj.chances = userObj.chances -1;
					userObj.played = userObj.played +1;
					players.updateAll({openid:openID},userObj,function(error){
						if(error){
							util.clog('user','useChance',2,'Database Error on reading db.');
							res.send(util.respond(false,'Database Error on reading db.',null));
							return;
						}else{
							res.send(util.respond(true,'Remaining Chances:'+userObj.chances,null));
							return;
						}
					});
				}
			}
		});
	}
}

players.setChances = function(req,res){
	if(!req.body.openID || !req.body.chances){
		res.send(util.respond(false,'Missing OpenID or Chances',null));
		return;
	}else if(isNaN(req.body.chances)){
		res.send(util.respond(false,'Invalid input for Chances. It should be a number',null));
		return;
	}else if(req.body.chances <= 0){
		res.send(util.respond(false,'Invalid input for Chances. The number should be 1 or greater than 1.',null));
		return;
	}else{
		var openID = req.body.openID;
		var chances = parseInt(req.body.chances);
		var players = Loopback.findModel('players');
		players.find({where:{openid:openID}},function(error,data){
			if(error){
				util.clog('players','setChances',2,'Database Error on reading db.');
				res.send(util.respond(false,'Database Error on reading db.',null));
				return;
			}else if(data.length != 1){
				res.send(util.respond(false,'The specified user have not been registered',null));
				return;
			}else{
				var openid = data[0].openid;
				var newRecord = data[0];
				newRecord.chances = chances;
				console.log(JSON.stringify(newRecord));
				players.updateAll({openid:openid},newRecord,function(error,newData){
					if(error){
						util.clog('players','setChances',2,'Database Error on saving info to db.');
						res.send(util.respond(false,'Database Error on saving info to db.',null));
						return;
					}else{
						console.log('new:'+JSON.stringify(newData));
						res.send(util.respond(true,'Operation Successful.',null));
						return;
					}
				});
			}
		});
	}
}

players.firstPlay = function(req,res){
	if(!req.body.openID){
		res.send(util.respond(false,'Missing OpenID',null));
	}else{
		var players = Loopback.findModel('players');
		var openID = req.body.openID;
		players.find({where:{openid:openID}},function(error,data){
			if(error){
				util.clog('players','firstPlay',2,'Database Error on saving info to db.');
				res.send(util.respond(false,'Database Error on reading info to db.',null));
				return;
			}else if(data.length != 1){
				res.send(util.respond(false,'User have not been registered before',null));
				return;
			}else{
				var chance = data[0].played;
				var firstPlayed = (chance <= 1);
				if(firstPlayed){
					data[0].chances = data[0].chances+1;
					var openID = data[0].openID;
					players.updateAll({openid:openID},data[0],function(error){
						if(error){
							res.send(util.respond(false,'Upsert error',null));
						}else{
							res.send(util.respond(true,'',{firstPlayed:true}));
						}
					})
				}else{
					res.send(util.respond(true,'',{firstPlayed:false}));
				}
			}
		});
	}
}

players.regWinner = function(req,res){
	console.log('body:'+JSON.stringify(req.body));
	if(!req.body.name || !req.body.tel || !req.body.openID){
		res.send(util.respond(false,'Missing OpenID, name, tel or address',null));
		return;
	}else{
		var tel = req.body.tel;
		var name = req.body.name;
		if(typeof(req.body.address) !== 'undefined'){
			var address = req.body.address;
		}else{
			var address = null;
		}
		var openid = req.body.openID;
		//T-Section: Whether use openid as lotteryid or openid?
		//First validate the openid in the lottery whether the user wins or not
		var lottery = Loopback.findModel('lottery');
		var winner = Loopback.findModel('winner');
		lottery.find({where:{openid:openid}},function(error,data){
			if(error){
				util.clog('user','regWinner',2,'Database error on reading db.');
				res.send(util.respond(false,'Database Error on reading db.',null));
				return;
			}else if(data.length == 0){	//User did not win the game but attempts to register the attempt as winner.
				util.clog('user','regWinner',2,'An attempt on registering user which does not win the game as a winner is blocked.');
				res.send(util.respond(false,'The user did not win the game.',null));
				return;
			}else{ //The user did win the game. Next is to validate the user for attempts to register prizes more than one time.
				winner.find({where:{openid:openid}},function(error,data){
					if(error){
						util.clog('user','regWinner',2,'Database error on reading db.');
						res.send(util.respond(false,'Database Error on reading db.',null));
						return;
					}else if(data.length != 0){ //The user had been registered for a price.
						util.clog('user','regWinner',2,'An attempt on registering prizes multiple times have been blocked.');
						res.send(util.respond(false,'The user has already won the price.',null));
						return;
					}else{ //The winner did not claimed for the price yet. Register the price
						var newWinner = {name:name,tel:tel,address:address,openid:openid}
						winner.upsert(newWinner,function(error,data){
							if(error){
								util.clog('user','regWinner',2,'Database error on writing db.');
								res.send(util.respond(false,'Database Error on writing to db.',null));
								return;
							}else{
								res.send(util.respond(true,'Register Successful.',null));
								return;
							}
						});
					}
				});
			}
		});
	}
}

//  Non-exposed features


module.exports = players;