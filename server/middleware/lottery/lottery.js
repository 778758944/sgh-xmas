/*
# SGH 2015 Christmas Game - Server
# Lottery Module for Prize draws and related operations
# Rev. 0.0.1 Dev - 11 Dec 2015
*/

var lottery 	= {};
// Base Modules
var Loopback	= require('loopback');
var util		= require('../util/util.js');
	
// Load Main Functions
lottery.startLottery = function(req,res){
	util.clog('lottery','startLottery',0,'Invoked.');
	if(!req.body.openID){
		res.send(util.respond(false,'OpenID is null, or is blank.',null));
		return;
	}else{
		var openid = req.body.openID;
		var prizes = Loopback.findModel('prizes');
		prizes.find({},function(error,data){
			if(error){
				util.clog('lottery','startLottery',2,'Database error!');
				res.send(util.respond(false,'Error occured while reading db contents.',null));
				return;
			}else if(data.length == 0){
				res.send(util.respond(false,'There are no registered prizes.',null));
				return;
			}else{
				//Begin Lottery, shall we?
				var players = Loopback.findModel('players');
				var prizedb	= Loopback.findModel('prizes');
				var lottery = Loopback.findModel('lottery');
				//	Get counts of participated users
				players.find({},function(error,data){
					if(error){
						util.clog('lottery','startLottery',2,'Database error on reading users!');
						res.send(util.respond(false,'Error occured while reading db user contents.',null));
						return;
					}else{
						//Detect how many users participated in the event. If the number is less than 100, set the default percentage of win?
						var overallPercentage = data.length;
						//Begin finding prizes
						prizedb.find({},function(error,data){
							if(error){
								util.clog('lottery','startLottery',2,'Database error on reading users!');
								res.send(util.respond(false,'Error occured while reading db user contents.',null));
								return;
							}else if(data.length <= 0){
								res.send(util.respond(false,'There are no prizes registered in db.',null));
								return;
							}else{
								var prizes = data;
								var won = false;
								var prizeObj = null;
								for(var i=0;i<prizes.length;i++){
									if(prizes[i].remainingAmount > 0 && !won){
										var prize = prizes[i];
										//If the user get a random number which is below the threshold, the user gets the prize!
										var randomDraw = Math.random();
										console.log('Got Number:'+randomDraw);
										console.log('WinningPTG:'+prize.initialPercentage);
										if(randomDraw <= prize.initialPercentage){
											//The user gets the prize!
											won = true;
											prizeObj = prizes[i];
										}
									}
								}
								var lotteryobj = {};
								var sendRespond = function(lotteryObj){
									res.send(util.respond(true,'Lucky Draw OK. Check Data whether the user win the prize',lotteryObj));
									return;
								};
								if(won){
									var prizeid = prizeObj.id;
									var prizename = prizeObj.name;
									var prizeorder = prizeObj.order;
									//Check whether the user did won the prize before...
									lottery.find({where:{openid:openid}},function(error,data){
										if(error){
											util.clog('lottery','startLottery',2,'Database error!');
											res.send(util.respond(false,'Error occured while reading db contents.',null));
											return;
										}else if(data.length != 0){
											sendRespond({won:false,name:'User won the prize before.'});
										}else{
											//First reduce amount and then register the prize
											prizeObj.remainingAmount = prizeObj.remainingAmount -1;
											prizedb.updateAll({id:prizeid},prizeObj,function(error,data){
												if(error){
													res.send(util.respond(false,'update error',null));
													return;
												}else{
													//Register the user in the lottery for prize...
													var date = new Date();
													var lotteryObj = {
														'openid': openid,
														'date': date.toString(),
														'prize': prizeid
													};
													lottery.upsert(lotteryObj,function(error){
														if(error){
															res.send(util.respond(false,'update error',null));
															return;
														}else{
															sendRespond({won:true,name:prizename,order:prizeorder});
														}
													});
												}
											});
										}
									});
								}else{
									//The user did not win the prize...
									sendRespond({won:false,name:''});
								}
							}
						});
					}
				});
			}
		});
	}
}

lottery.checkDetailsNotRegistered = function(req,res){
	if(!req.body.openID){
		res.send(util.respond(false,'OpenID is null, or is blank.',null));
		return;
	}else{
		var lottery = Loopback.findModel('lottery');
		lottery.find({where:{openid:req.body.openID}},function(error,data){
			if(error){
				res.send(false);
				return;
			}else if(data.length != 1){
				//User did not won the game before
				res.send(false);
				return;
			}else{ // The user did won the prize,check for registry
				var winner = Loopback.findModel('winner');
				winner.find({where:{openID:openid}},function(error,data){
					if(error){//Server error!
						res.send(false);
						return;
					}else if(data.length == 0){ //Data not registered!
						res.send(true);
						return;
					}else{
						res.send(false);	//User registered
						return;
					}
				})
			}
		});
	}
}

lottery.checkWinnerRegistered = function(req,res){
	util.clog('lottery','checkWinnerRegistered',0,'Invoked');
	if(!req.body.openID){
		res.send(util.respond(false,'OpenID is null, or is blank.',null));
		return;
	}else{
		var lottery = Loopback.findModel('lottery');
		var winner = Loopback.findModel('winner');
		var prizes = Loopback.findModel('prizes');
		var openid = req.body.openID;
		lottery.find({where:{openid:openid}},function(error,data){
			if(error){
				res.send(util.respond(false,'Database error',null));
				return;
			}else if(data.length == 0){
				res.send(util.respond(false,'Relevant lottery record not found, or is void.',null));
				return;
			}else{
				//The user has won the prize. Obtain prizeid and openid first...
				var lotteryData = data[0];
				var prizeid = lotteryData.prize;
				var lotteryid = lotteryData.id;
				//Find whether user has entered personal information
				winner.find({where:{openid:openid}},function(error,data){
					if(error){
						res.send(util.respond(false,'Database error on retrieving info',null));
						return;
					}else if(data.length == 0){
						//User haven't entered personal information.
						//Void the record, and allow the user to get prize again.
						prizes.find({where:{id:prizeid}},function(error,data){
							if(error){
								util.clog('lottery','checkWinnerRegistered',2,'DB Error');
								res.send(util.respond(false,'Database error on reading prize info',null));
								return;
							}else if(data.length != 1){
								util.clog('lottery','checkWinnerRegistered',2,'DB result 0');
								res.send(util.respond(false,'Data retrieval error',null));
								return;
							}else{
								var prize = data[0];
								prize.remainingAmount = prize.remainingAmount + 1;
								prizes.updateAll({id:prizeid},prize,function(error,data){
									if(error){
										res.send(util.respond(false,'Database error on updating prize info',null));
										return;
									}else{
										//Remove lottery record of the user
										lottery.destroyAll({id:lotteryid},function(error,data){
											if(error){
												util.clog('lottery','checkWinnerRegistered',2,'DB Error');
												res.send(util.respond(false,'Database error on removing user record',null));
												return;
											}else{
												util.clog('lottery','checkWinnerRegistered',0,'Lottery Removed');
												res.send(util.respond(true,'Lottery record removed. User are able to enter the draw again.',null));
												return;
											}
										})
									}
								});
							}
						})
					}else{
						res.send(util.respond(false,'User has been registered for a prize',null));
						return;
					}
				});
			}
		});
	}
}

module.exports = lottery;