/*
# SGH 2015 Christmas Game - Server
# Admin Module for Backstage operations
# Rev. 0.0.1 Dev - 11 Dec 2015
*/
require("node-jsx").install({harmony:true,extension:'.jsx'}); //JSX Compiler
var admin 		= {};
//Load Base Modules
var Loopback	= require('loopback');
var React		= require('react');
var ReactDS		= require('react-dom/server');
var BCrypt		= require('bcrypt');
var util		= require('../util/util.js');
var shortID 	= require('shortid');
var ASession	= require('../session/session.js');
var Xlsx		= require('node-xlsx');
var Wx 			= require('../wx/wx.js');
var Request 	= require('request');
//React Factory modules
var mainApp		= React.createFactory(require('./reactComps/mainApp.jsx'));
var AppFrame	= React.createFactory(require('./reactComps/AppFrame.jsx'));
var qrCode 		= React.createFactory(require('./reactComps/qrcode.jsx'));
//Configs
var siteTitle	= "SGH Christmas 2015 后台服务";
var cookieDom	= "xmas-2015.sgh.clients.inzen.com.cn"; //production: 'xmas-2015.sgh.clients.inzen.com.cn'
// var cookieDom	= "127.0.0.1"; //production: 'xmas-2015.sgh.clients.inzen.com.cn'
//Main functions
admin.loginPage = function(req,res){
	//Check for existence of cookie and the sessionID string...
	var cookieStr = req.headers.cookie;
	var validSession = false;
	if(cookieStr&&cookieStr.indexOf('sessionID') != -1){
		//Seems like sessionID is set before. Validate first,
		//And if sessionID is valid (session is valid), redirect to home.
		var cookies = cookieStr.split(';')
		var pointer = -1;
		for(var i=0;i<cookies.length;i++){
			if(cookies[i].indexOf('sessionID')!= -1){
				pointer = i;
			}
		}
		var sessionID = "";
		if(pointer != -1){
			var sessionCookieStr = cookies[pointer];
			var sessionCookie = sessionCookieStr.split('=');
			sessionID = sessionCookie[sessionCookie.length -1];
		}else{
			res.send('Error on parsing cookie!');
			return;
		}
		//Validate whether the id exists, or expired
		var expiryDate = ASession.getKey(sessionID,'expiryDate');
		var date = new Date();
		var currentDate = date.getTime();
		if(expiryDate > currentDate){
			//It is still valid, jump to main menu.
			ASession.renewExpiry(sessionID);
			validSession = true;
		}
	}
	if(validSession){
		res.writeHead(302,{'Location':'/admin/home'});
		res.end();
	}else{
		admin.renderLoginPage(0,res,true);
	}
}

admin.login = function(req,res){
	if(!req.body.username){
		admin.renderLoginPage(2,res,false);
	}else if(!req.body.password){
		admin.renderLoginPage(3,res,false);
	}else if(!req.headers.cookie){
		admin.renderLoginPage(20,res,false);
	}else{
		var username = req.body.username;
		var password = req.body.password;
		var admindb = Loopback.findModel('admin');
		admindb.find({where:{username:username}},function(error,data){
			if(error){
				util.clog('admin','login',2,'Database error while reading db.');
				admin.renderLoginPage(4,res,false);
			}else if(data.length != 1){
				admin.renderLoginPage(1,res,false);
			}else{
				//Validate hashes of passwords from the db with the entered password
				var rights = data[0].rights;
				var passhash = data[0].password;
				BCrypt.compare(password,passhash,function(error,validRes){
					if(error){
						util.clog('admin','login',2,'Hash error');
						admin.renderLoginPage(5,res,false);
					}else if(!validRes){
						admin.renderLoginPage(1,res,false);
					}else{
						//Register sessionID...
						var cookieStr = req.headers.cookie;
						if(cookieStr&&cookieStr.indexOf('sessionID') != -1){
							//Grab the session ID from cookie
							var cookies = cookieStr.split(';')
							var pointer = -1;
							for(var i=0;i<cookies.length;i++){
								if(cookies[i].indexOf('sessionID')!= -1){
									pointer = i;
								}
							}
							var sessionID = "";
							if(pointer != -1){
								var sessionCookieStr = cookies[pointer];
								var sessionCookie = sessionCookieStr.split('=');
								sessionID = sessionCookie[sessionCookie.length -1];
							}else{
								res.send('Error on parsing cookie!');
								return;
							}
							ASession.createSession(sessionID,username,rights);
							//Then redirect to home page...
							res.writeHead(302,{'Location':'/admin/home'});
							res.end();
						}else{
							admin.renderLoginPage(21,res,false);
						}
					}
				});
			}
		});
	}
}

admin.logout = function(req,res){
	if(!admin.validateSession(req)){
		res.writeHead(302,{'Location':'/admin/permissionDenied'});
		res.end();
	}else{
		//Begin Logout
		var cookieStr = req.headers.cookie;
		var validSession = false;
		if(cookieStr&&cookieStr.indexOf('sessionID') != -1){
			//Seems like sessionID is set before. Validate first,
			//And if sessionID is valid (session is valid), redirect to home.
			var cookies = cookieStr.split(';')
			var pointer = -1;
			for(var i=0;i<cookies.length;i++){
				if(cookies[i].indexOf('sessionID')!= -1){
					pointer = i;
				}
			}
			var sessionID = "";
			if(pointer != -1){
				var sessionCookieStr = cookies[pointer];
				var sessionCookie = sessionCookieStr.split('=');
				sessionID = sessionCookie[sessionCookie.length -1];
			}
			//Unregister the session.
			ASession.deleteSession(sessionID);
		}
		//Redirect to main page
		res.writeHead(302,{'Location':'/admin?logout=true'});
		res.end();
	}
}

admin.mainPage = function(req,res){
	//Validate sessions first. If not, jump back to original!
	if(!admin.validateSession(req)){
		res.writeHead(302,{'Location':'/admin/permissionDenied'});
		res.end();
	}else{
		admin.renderHomePage(req,res);
	}
}

admin.userList = function(req,res){
	//Validate sessions first. If not, jump to login page
	if(!admin.validateSession(req)){
		res.writeHead(302,{'Location':'/admin/permissionDenied'});
		res.end();
	}else{
		//Get lists of prizes from the server...
		var prizes = Loopback.findModel('prizes');
		var winners = Loopback.findModel('winner');
		var lottery = Loopback.findModel('lottery');
		var prizeIDFocus = null;
		var prizecontd = {};
		if(req.query.prizeid){
			prizecontd = {where:{id:req.query.prizeid}};
			prizeIDFocus = req.query.prizeid;
		}
		//First find all prize data...
		prizes.find(prizecontd,function(error,prizeres){
			if(error){
				admin.renderUserListPage(1,null,prizeIDFocus,req,res);
			}else if(prizeres.length == 0){
				admin.renderUserListPage(2,null,prizeIDFocus,req,res);
			}else{
				var prizeData = prizeres;
				//get Lottery data...
				lottery.find({},function(error,lotres){
					if(error){
						admin.renderUserListPage(1,null,prizeIDFocus,req,res);
					}else{
						var lotteryData = lotres;
						var lotprizedata = admin._mergeDataArray(prizeData,'id',lotteryData,'prize',true);
						//Get Winner List data;
						winners.find({},function(error,data){
							if(error){
								admin.renderUserListPage(1,null,prizeIDFocus,req,res);
							}else{
								// res.send(JSON.stringify(lotprizedata));
								var winnerData = admin._changePropName(data,'name','winnername');
								var finalMerge = admin._mergeDataArray(lotprizedata,'openid',winnerData,'openid',false);
								admin.renderUserListPage(0,finalMerge,prizeIDFocus,req,res);
							}
						});
					}
				});
			}
		});
	}
}

admin.prizeList = function(req,res){
	//Validate sessions first. If not, jump to login page
	if(!admin.validateSession(req)){
		res.writeHead(302,{'Location':'/admin/permissionDenied'});
		res.end();
	}else if(!admin.validateRights(req,1)){
		//Validate if user have enough rights
		res.writeHead(302,{'Location':'/admin/permissionDenied'});
		res.end();
	}else{
		admin.renderPrizeListPage(0,req,res);	
	}
}

admin.addPrizePage = function(req,res){
	if(!admin.validateSession(req)){
		res.writeHead(302,{'Location':'/admin/permissionDenied'});
		res.end();
	}else if(!admin.validateRights(req,1)){
		//Validate if user have enough rights
		res.writeHead(302,{'Location':'/admin/permissionDenied'});
		res.end();
	}else{
		admin.renderPrizeAddPage(0,req,res);
	}
}

admin.addNewPrize = function(req,res){
	if(!admin.validateSession(req)){
		res.writeHead(302,{'Location':'/admin/permissionDenied'});
		res.end();
	}else if(!admin.validateRights(req,1)){
		//Validate if user have enough rights
		res.writeHead(302,{'Location':'/admin/permissionDenied'});
		res.end();
	}else if(!req.body.name|| !req.body.percentage || !req.body.amount || !req.body.order){
		admin.renderPrizeAddPage(2,req,res);
	}else if(isNaN(req.body.percentage) || isNaN(req.body.amount)){
		admin.renderPrizeAddPage(3,req,res);
	}else if(req.body.percentage <= 0 || req.body.percentage > 100){
		admin.renderPrizeAddPage(4,req,res);
	}else if(req.body.amount <= 0){
		admin.renderPrizeAddPage(5,req,res);
	}else{
		var prizes = Loopback.findModel('prizes');
		var prizeObj = {'name':req.body.name,'order':req.body.order,'initialPercentage':parseFloat(req.body.percentage)/100,'amount':parseInt(req.body.amount),'remainingAmount':parseInt(req.body.amount)};
		prizes.upsert(prizeObj,function(error){
			if(error){
				util.clog('prizes','addPrize',2,'Database error occured while saving data to db.');
				admin.renderPrizeAddPage(1,req,res);
			}else{
				admin.renderPrizeListPage(1,req,res);
				return;
			}
		});
	}
}

admin.editPrizePage = function(req,res){
	if(!admin.validateSession(req)){
		res.writeHead(302,{'Location':'/admin/permissionDenied'});
		res.end();
	}else if(!admin.validateRights(req,1)){
		res.writeHead(302,{'Location':'/admin/permissionDenied'});
		res.end();
	}else if(!req.query.id){
		admin.renderPrizeListPage(false,req,res);
	}else{
		var prizeid = req.query.id;
		var prizes = Loopback.findModel('prizes');
		prizes.find({where:{id:prizeid}},function(error,data){
			if(error){
				admin.renderPrizeEditPage(1,{},req,res);
			}else if(data.length != 1){
				admin.renderPrizeEditPage(2,{},req,res);
			}else{
				var currentData = data[0];
				admin.renderPrizeEditPage(0,currentData,req,res);
			}
		});
	}
}

admin.editPrize = function(req,res){
	if(!admin.validateSession(req)){
		res.writeHead(302,{'Location':'/admin/permissionDenied'});
		res.end();
	}else if(!admin.validateRights(req,1)){
		res.writeHead(302,{'Location':'/admin/permissionDenied'});
		res.end();
	}else if(!req.body.id){
		admin.renderPrizeEditPage(1,{},req,res);
	}else{
		var currentFormData = req.body;
		if( !req.body.name || !req.body.initialPercentage || !req.body.amount ||!req.body.order){
			admin.renderPrizeEditPage(2,currentFormData,req,res);
		}else if(isNaN(req.body.initialPercentage) || isNaN(req.body.amount)){
			admin.renderPrizeEditPage(3,currentFormData,req,res);
		}else if(req.body.initialPercentage > 100 || req.body.initialPercentage < 0){
			admin.renderPrizeEditPage(4,currentFormData,req,res);
		}else if(req.body.amount < 0){
			admin.renderPrizeEditPage(5,currentFormData,req,res);
		}else{
			//Get data from db
			var prizeid = req.body.id;
			var prizes = Loopback.findModel('prizes');
			var newInitialPercentage = (req.body.initialPercentage / 100);
			var newPrizename = req.body.name;
			var newPrizeorder = req.body.order;
			var newAmount = parseInt(req.body.amount);
			prizes.find({where:{id:prizeid}},function(error,data){
				if(error){
					admin.renderPrizeEditPage(1,currentFormData,req,res);
				}else if(data.length != 1){
					admin.renderPrizeEditPage(2,currentFormData,req,res);
				}else{
					//Assumes the amount has changed, update the remainingAmount of the prize
					var prizeObj = data[0];
					var origAmount = prizeObj.amount;
					var origRemainingAmount = prizeObj.remainingAmount;
					var updatePrize = function(){
						prizes.updateAll({id:prizeid},prizeObj,function(error,data){
							if(error){
								//Update failed.
								admin.renderPrizeEditPage(1,currentFormData,req,res);
							}else{//Update Finished
								console.log('finaldata:'+JSON.stringify(data));
								admin.renderPrizeListPage(2,req,res);
							}
						});
					}
					if(origAmount != req.body.amount){
						//Calculate difference changes in amount
						var diff = req.body.amount - origAmount;
						if(diff < 0 && (diff + origRemainingAmount < 0)){//Reduction of remainingAmount is required. Predict whether the reduction would affect individuals who got the prize
							admin.renderPrizeEditPage(6,currentFormData,req,res);
						}else{//Passed Checking, now update the variables
							prizeObj.name = newPrizename;
							prizeObj.order = newPrizeorder;
							prizeObj.initialPercentage = newInitialPercentage;
							prizeObj.amount = newAmount;
							prizeObj.remainingAmount = diff + origRemainingAmount;
							updatePrize();
						}
					}else{
						//No Change in amount, proceed to update
						prizeObj.name = newPrizename;
						prizeObj.order = newPrizeorder;
						prizeObj.initialPercentage = newInitialPercentage;
						prizeObj.amount = newAmount;
						prizeObj.remainingAmount = origRemainingAmount;
						updatePrize();
					}
				}
			});
		}
	}
}

admin.deletePrizePage = function(req,res){
	if(!admin.validateSession(req)){
		res.writeHead(302,{'Location':'/admin/permissionDenied'});
		res.end();
	}else if(!admin.validateRights(req,1)){
		res.writeHead(302,{'Location':'/admin/permissionDenied'});
		res.end();
	}else if(!req.query.id){
		admin.renderPrizeListPage(0,req,res);
	}else{
		//Search for the prize obj to delete
		var prizes = Loopback.findModel('prizes');
		prizes.find({where:{id:req.query.id}},function(error,data){
			if(error){
				admin.renderPrizeDeletePage(1,{},req,res);
			}else if(data.length != 1){
				admin.renderPrizeDeletePage(1,{},req,res);
			}else{
				var prizedata = data[0];
				admin.renderPrizeDeletePage(0,prizedata,req,res);
			}
		})
	}
}

admin.deletePrize = function(req,res){
	if(!admin.validateSession(req)){
		res.writeHead(302,{'Location':'/admin/permissionDenied'});
		res.end();
	}else if(!admin.validateRights(req,1)){
		res.writeHead(302,{'Location':'/admin/permissionDenied'});
		res.end();
	}else if(!req.body.id){
		admin.renderPrizeListPage(0,req,res);
	}else{
		var prizeid = req.body.id;
		var prizes = Loopback.findModel('prizes');
		prizes.find({where:{id:prizeid}},function(error,data){
			if(error){
				admin.renderPrizeDeletePage(1,{},req,res);
			}else if(data.length != 1){
				admin.renderPrizeDeletePage(2,{},req,res);
			}else{
				//Check whether the prize have been hit...
				var remainingAmount = data[0].remainingAmount;
				var amount = data[0].amount;
				if(amount != remainingAmount){
					admin.renderPrizeDeletePage(3,data[0],req,res);
				}else{
					prizes.destroyAll({id:prizeid},function(error,data){
						if(error){
							admin.renderPrizeDeletePage(1,{},req,res);
						}else{
							admin.renderPrizeListPage(3,req,res);
						}
					});
				}
			}
		});
	}
}

admin.wxSettings = function(req,res){
	if(!admin.validateSession(req)){
		res.writeHead(302,{'Location':'/admin/permissionDenied'});
		res.end();
	}else if(!admin.validateRights(req,1)){
		res.writeHead(302,{'Location':'/admin/permissionDenied'});
		res.end();
	}else{
		admin.renderWXSettingsPage(false,0,req,res);
	}
}

admin.configureWX = function(req,res){
	if(!admin.validateSession(req)){
		res.writeHead(302,{'Location':'/admin/permissionDenied'});
		res.end();
	}else if(!admin.validateRights(req,1)){
		res.writeHead(302,{'Location':'/admin/permissionDenied'});
		res.end();
	}else if(!req.body.appid || !req.body.secret){
		admin.renderWXSettingsPage(false,2,req,res);
	}else{
		var wx = Loopback.findModel('wx');
		var newAppIDObj = {'key':'appid','value':req.body.appid};
		var newSecretObj = {'key':'secret','value':req.body.secret};
		wx.upsert(newAppIDObj,function(error){
			if(error){
				admin.renderWXSettingsPage(false,1,req,res);
			}else{
				wx.upsert(newSecretObj,function(error){
					//Update Successful.
					admin.renderWXSettingsPage(true,0,req,res);
				});
			}
		});
	}
}

admin.referrerList = function(req,res){
	if(!admin.validateSession(req)){
		res.writeHead(302,{'Location':'/admin/permissionDenied'});
		res.end();
	}else{
		admin.renderReferrerListPage(0,0,req,res);
	}
}

admin.addReferrerPage = function(req,res){
	if(!admin.validateSession(req)){
		res.writeHead(302,{'Location':'/admin/permissionDenied'});
		res.end();
	}else if(!admin.validateRights(req,1)){
		res.writeHead(302,{'Location':'/admin/permissionDenied'});
		res.end();
	}else{
		admin.renderReferrerAddPage(0,req,res);
	}
}

admin.addReferrer = function(req,res){
	if(!admin.validateSession(req)){
		res.writeHead(302,{'Location':'/admin/permissionDenied'});
		res.end();
	}else if(!admin.validateRights(req,1)){
		res.writeHead(302,{'Location':'/admin/permissionDenied'});
		res.end();
	}else if(!req.body.name){
		admin.renderReferrerAddPage(2,req,res);
	}else{
		var refName = req.body.name;
		var referrer = Loopback.findModel('referrer');
		var newRefObj = {'name':refName};
		referrer.upsert(newRefObj,function(error,data){
			if(error){
				admin.renderReferrerEditPage(1,req,res);
			}else{
				admin.renderReferrerListPage(1,null,req,res);
			}
		});
	}
}

admin.genReferrerQRCode = function(req,res){
	if(!admin.validateSession(req)){
		res.writeHead(302,{'Location':'/admin/permissionDenied'});
		res.end();
	}else if(!admin.validateRights(req,1)){
		res.writeHead(302,{'Location':'/admin/permissionDenied'});
		res.end();
	}else if(!req.query.refid){
		admin.renderReferrerListPage(false,10,req,res);
	}else{
		var refid = req.query.refid;
		var referrer = Loopback.findModel('referrer');
		referrer.find({where:{id:refid}},function(error,data){
			if(error){
				admin.renderReferrerListPage(false,10,req,res);
			}else if(data.length != 1){
				admin.renderReferrerListPage(false,10,req,res);
			}else{
				//Generate base url here...
				var url = 'http://'+cookieDom+'/wx/ua?referrerid='+refid;
				admin.renderQRCodePage(url,req,res);
			}
		});
	}
}

admin.editReferrerPage = function(req,res){
	if(!admin.validateSession(req)){
		res.writeHead(302,{'Location':'/admin/permissionDenied'});
		res.end();
	}else if(!admin.validateRights(req,1)){
		res.writeHead(302,{'Location':'/admin/permissionDenied'});
		res.end();
	}else if(!req.query.id){
		admin.renderReferrerListPage(false,req,res);
	}else{
		var referrerid = req.query.id;
		var referrer = Loopback.findModel('referrer');
		referrer.find({where:{id:referrerid}},function(error,data){
			if(error){
				admin.renderReferrerEditPage(1,{},req,res);
			}else if(data.length != 1){
				admin.renderReferrerEditPage(2,{},req,res);
			}else{
				var currentData = data[0];
				admin.renderReferrerEditPage(0,currentData,req,res);
			}
		});
	}
}

admin.editReferrer = function(req,res){
	if(!admin.validateSession(req)){
		res.writeHead(302,{'Location':'/admin/permissionDenied'});
		res.end();
	}else if(!admin.validateRights(req,1)){
		res.writeHead(302,{'Location':'/admin/permissionDenied'});
		res.end();
	}else if(!req.body.id){
		admin.renderPrizeEditPage(1,{},req,res);
	}else{
		var currentFormData = req.body;
		if(!req.body.name){
			admin.renderReferrerEditPage(2,currentFormData,req,res);
		}else{
			var id = req.body.id;
			var name = req.body.name;
			var referrer = Loopback.findModel('referrer');
			referrer.find({where:{id:id}},function(error,data){
				if(error){
					admin.renderReferrerEditPage(1,currentFormData,req,res);
				}else if(data.length != 1){
					admin.renderReferrerEditPage(2,currentFormData,req,res);
				}else{
					var referrerObj = data[0];
					referrerObj.name = name;
					referrer.updateAll({id:id},referrerObj,function(error,data){
						if(error){
							admin.renderReferrerEditPage(1,currentFormData,req,res);
						}else{
							admin.renderReferrerListPage(2,null,req,res);
						}
					});
				}
			})
		}
	}
}

admin.deleteReferrerPage = function(req,res){
	if(!admin.validateSession(req)){
		res.writeHead(302,{'Location':'/admin/permissionDenied'});
		res.end();
	}else if(!admin.validateRights(req,1)){
		res.writeHead(302,{'Location':'/admin/permissionDenied'});
		res.end();
	}else if(!req.query.id){
		admin.renderPrizeListPage(0,req,res);
	}else{
		//Search for the prize obj to delete
		var referrer = Loopback.findModel('referrer');
		referrer.find({where:{id:req.query.id}},function(error,data){
			if(error){
				admin.renderReferrerDeletePage(1,{},req,res);
			}else if(data.length != 1){
				admin.renderReferrerDeletePage(1,{},req,res);
			}else{
				var referrerData = data[0];
				admin.renderReferrerDeletePage(0,referrerData,req,res);
			}
		})
	}
}

admin.deleteReferrer = function(req,res){
	if(!admin.validateSession(req)){
		res.writeHead(302,{'Location':'/admin/permissionDenied'});
		res.end();
	}else if(!admin.validateRights(req,1)){
		res.writeHead(302,{'Location':'/admin/permissionDenied'});
		res.end();
	}else if(!req.body.id){
		admin.renderReferrerListPage(0,req,res);
	}else{
		var referrerid = req.body.id;
		var referrer = Loopback.findModel('referrer');
		referrer.find({where:{id:referrerid}},function(error,data){
			if(error){
				admin.renderReferrerDeletePage(1,{},req,res);
			}else if(data.length != 1){
				admin.renderReferrerDeletePage(2,{},req,res);
			}else{
				referrer.destroyAll({id:referrerid},function(error,data){
					if(error){
						admin.renderReferrerDeletePage(1,{},req,res);
					}else{
						admin.renderReferrerListPage(3,null,req,res);
					}
				});
			}
		});
	}
}

admin.genNewAdminUser = function(req,res){
	var admin = Loopback.findModel('admin');
	BCrypt.genSalt(5,function(err,salt){
		if(err){
			res.send('err occured on generating salt');	
		}else{
			BCrypt.hash('Bwrd4DCY3h',salt,function(err,hash){
				//got hash
				var passHash = hash;
				var newAdminObj = {'username':'admin','password':passHash,'rights':1}
				admin.upsert(newAdminObj,function(error){
					if(error){
						res.send('New admin creation failed');
					}else{
						res.send('OK');
					}
				});
			});
		}
	});
}

admin.genNewUser = function(req,res){
	var admin = Loopback.findModel('admin');
	BCrypt.genSalt(5,function(err,salt){
		if(err){
			res.send('err occured on generating salt');	
		}else{
			BCrypt.hash('zB6FJNMwjR',salt,function(err,hash){
				//got hash
				var passHash = hash;
				var newAdminObj = {'username':'user','password':passHash,'rights':2}
				admin.upsert(newAdminObj,function(error){
					if(error){
						res.send('New admin creation failed');
					}else{
						res.send('OK');
					}
				});
			});
		}
	});
}

//Admin backstage functions
admin.validateSession = function(req){
	//Parse cookie from req...
	var cookieStr = req.headers.cookie;
	var validSession = false;
	if(cookieStr&&cookieStr.indexOf('sessionID') != -1){
		//Seems like sessionID is set before. Validate first,
		//And if sessionID is valid (session is valid), redirect to home.
		var cookies = cookieStr.split(';')
		var pointer = -1;
		for(var i=0;i<cookies.length;i++){
			if(cookies[i].indexOf('sessionID')!= -1){
				pointer = i;
			}
		}
		var sessionID = "";
		if(pointer != -1){
			var sessionCookieStr = cookies[pointer];
			var sessionCookie = sessionCookieStr.split('=');
			sessionID = sessionCookie[sessionCookie.length -1];
		}
		//Validate whether the id exists, or expired
		var expiryDate = ASession.getKey(sessionID,'expiryDate');
		var date = new Date();
		var currentDate = date.getTime();
		if(expiryDate > currentDate){
			//It is still valid, jump to main menu.
			validSession = true;
		}
	}
	return validSession;
}

admin.validateRights = function(req,level){
	var cookieStr = req.headers.cookie;
	var rights = "";
	if(cookieStr&&cookieStr.indexOf('sessionID') != -1){
		var cookies = cookieStr.split(';')
		var pointer = -1;
		for(var i=0;i<cookies.length;i++){
			if(cookies[i].indexOf('sessionID')!= -1){
				pointer = i;
			}
		}
		var sessionID = "";
		if(pointer != -1){
			var sessionCookieStr = cookies[pointer];
			var sessionCookie = sessionCookieStr.split('=');
			sessionID = sessionCookie[sessionCookie.length -1];
		}
		//Validate whether the id exists, or expired
		 rights = ASession.getKey(sessionID,'rights');
	}
	if(!rights){
		return false;
	}else{
		return (rights == level);
	}
}

admin.getRights = function(req){
	var cookieStr = req.headers.cookie;
	var rights = "";
	if(cookieStr&&cookieStr.indexOf('sessionID') != -1){
		var cookies = cookieStr.split(';')
		var pointer = -1;
		for(var i=0;i<cookies.length;i++){
			if(cookies[i].indexOf('sessionID')!= -1){
				pointer = i;
			}
		}
		var sessionID = "";
		if(pointer != -1){
			var sessionCookieStr = cookies[pointer];
			var sessionCookie = sessionCookieStr.split('=');
			sessionID = sessionCookie[sessionCookie.length -1];
		}
		//Validate whether the id exists, or expired
		rights = ASession.getKey(sessionID,'rights');
	}
	return rights;
}
//React Admin Isophormic support

//Rendering functions
admin.renderLoginPage = function(errCode,res,setCookie){
	var pageTitle = "后台登陆";
	//Render layout here
	var LoginPage = React.createFactory(require('./reactComps/loginPage.jsx'));
	var lphtml = ReactDS.renderToStaticMarkup(LoginPage({errCode:errCode}));
	var render = ReactDS.renderToString(mainApp({title:pageTitle,siteTitle:siteTitle,children:lphtml}));
	//Generate new cookie for new user (usually errCode as 0)
	if(setCookie){
		var sessionID = shortID.generate();
        var cookieData = [{'key':'sessionID','value':sessionID}];
        var cookiePreset = [{'key':'domain','value':cookieDom},{'key':'path','value':'/admin'}]//This cookie shold be domain-wide!
        res.writeHead(200,{'Set-Cookie':util.parseCookieString(cookieData,cookiePreset)});
        res.write(render);
        res.end();
	}else{
		res.send(render);
	}
}

admin.renderAdminApp = function(pageTitle,onFocusPageName,contentHTML,req,res){
	//Then the whole page layout...
	var rfAdminMainPage = React.createFactory(require('./reactComps/AdminMainPage.jsx'));
	var rights = admin.getRights(req);
	console.log('current user rights:'+rights);
	var ampStateObj = {'page':onFocusPageName,'pageContent':contentHTML,'rights':rights};
	var adminMainPage = ReactDS.renderToString(rfAdminMainPage(ampStateObj));
	//Finally the whole page in the app...
	var render = ReactDS.renderToStaticMarkup(mainApp({title:pageTitle,siteTitle:siteTitle,children:adminMainPage}));
	res.send(render);
}

admin.renderHomePage = function(req,res){
	var pageTitle = "主页";
	var onFocusPN = "dashboard";
	//Render Home content page first...
	var rfAdminContentHome = React.createFactory(require('./reactComps/AdminContentHome.jsx'));
	var adminContentHomehtml = ReactDS.renderToString(rfAdminContentHome({}));
	//Hand to renderAdminApp to render whole app page...
	admin.renderAdminApp(pageTitle,onFocusPN,adminContentHomehtml,req,res);
}

admin.renderUserListPage = function(errCode,prizesdata,onFocusPage,req,res){
	var pageTitle = "中奖人士名单";
	var onFocusPN = "winners";
	//Set prop obj here;
	var prop = {errCode:errCode,prizedata:prizesdata,onFocusPage:onFocusPage};
	var finalRender = function(obj){
		//Render Home content page first...
		var rfUserListHome = React.createFactory(require('./reactComps/UserListHome.jsx'));
		var userListHomeHTML = ReactDS.renderToString(rfUserListHome(obj));
		//Hand to renderAdminApp to render whole app page...
		admin.renderAdminApp(pageTitle,onFocusPN,userListHomeHTML,req,res);
	}
	// Get lists of prizes here...
	var prizes = Loopback.findModel('prizes');
	prizes.find({},function(error,data){
		if(error){
			prop.prizelist = [];
			prop.errCode = 1;
			finalRender(prop);
		}else{
			prop.prizelist = data;
			finalRender(prop);
		}
	});
}

admin.renderPrizeListPage = function(success,req,res){
	var pageTitle = "奖品名单";
	var onFocusPN = "prizes";
	//Get lists of prizes
	var followUp = function(obj){
		var rfPrizeListHome = React.createFactory(require('./reactComps/PrizeListHome.jsx'));
		var prizeListHomeHTML = ReactDS.renderToString(rfPrizeListHome(obj));
		//Hand to renderAdminApp to render whole app page...
		admin.renderAdminApp(pageTitle,onFocusPN,prizeListHomeHTML,req,res);
	}
	var prizes = Loopback.findModel('prizes');
	prizes.find({},function(error,data){
		if(error){
			var obj = {success:success,errCode:1,prizedata:[]}
			followUp(obj);
		}else{
			var prizedata = [];
			for(var i=0;i<data.length;i++){
				prizedata.push(data[i]);
			}
			var obj = {success:success,errCode:0,prizedata:prizedata}
			followUp(obj);
		}
	});
}

admin.renderPrizeAddPage = function(errCode,req,res){
	var pageTitle = "奖品名单";
	var onFocusPN = "prizes";
	//Render prize add page
	var rfPrizeAddHome = React.createFactory(require('./reactComps/PrizeAdd.jsx'));
	var prizeAddHTML = ReactDS.renderToString(rfPrizeAddHome({errCode:errCode}));
	//Hand to renderAdminApp to render whole app page...
	admin.renderAdminApp(pageTitle,onFocusPN,prizeAddHTML,req,res);
}

admin.renderPrizeEditPage = function(errCode,displayData,req,res){
	var pageTitle = "修改奖品信息";
	var onFocusPN = "prizes";
	var props = {errCode:errCode,editdata:displayData}
	var rfPrizeEdit = React.createFactory(require('./reactComps/PrizeEdit.jsx'));
	var prizeEditHTML = ReactDS.renderToString(rfPrizeEdit(props));
	//Hand to renderAdminApp to render whole app page...
	admin.renderAdminApp(pageTitle,onFocusPN,prizeEditHTML,req,res);
}

admin.renderPrizeDeletePage = function(errCode,prizedata,req,res){
	var pageTitle = "删除奖品信息";
	var onFocusPN = "prizes";
	var props = {errCode:errCode,data:prizedata}
	var rfPrizeDelete = React.createFactory(require('./reactComps/PrizeDelete.jsx'));
	var prizeDeleteHTML = ReactDS.renderToString(rfPrizeDelete(props));
	//Hand to renderAdminApp to render whole app page...
	admin.renderAdminApp(pageTitle,onFocusPN,prizeDeleteHTML,req,res);
}

admin.renderReferrerListPage = function(success,errCode,req,res){
	var pageTitle = "推荐人管理";
	var onFocusPN = "referrer";
	var rights = admin.getRights(req);
	var props = {'success':success,'errCode':errCode,'rights':rights}
	//Get lists of referrers
	var referrer = Loopback.findModel('referrer');
	var refRec = Loopback.findModel('referrerRecords');
	var finalRender = function(propsObj){
		var rfRefsList = React.createFactory(require('./reactComps/ReferrerListHome.jsx'));
		var RefsListHTML = ReactDS.renderToString(rfRefsList(props));
		//Hand to renderAdminApp to render whole app page...
		admin.renderAdminApp(pageTitle,onFocusPN,RefsListHTML,req,res);
	}//props.data as final passing key
	//First find all available referrers
	referrer.find({},function(error,data){
		if(error){
			props.data = [];
			props.errCode = 10;
			finalRender(props);
		}else{
			var referrers = data;
			//Then get all referrer records
			refRec.find({},function(error,data){
				if(error){
					props.data = [];
					props.errCode = 10;
					finalRender(props);
				}else{
					var refRecs = data;
					//Merge the results again
					// var mergedData = admin._mergeDataArray(referrers,'id',refRecs,'referrerid',false);
					var countData = admin._countObjectWithSameProp(refRecs,'referrerid');
					//Merge again with data...
					var finalData = admin._mergeDataArray(referrers,'id',countData,'item',false);
					//Hand in to the render page for rendering results
					props.data = finalData;
					console.log(JSON.stringify(finalData));
					props.errCode = null;
					finalRender(props);
				}
			});
		}
	});
}

admin.renderReferrerAddPage = function(errCode,req,res){
	var pageTitle = "新增推荐人";
	var onFocusPN = "referrer";
	//Render referrer add page
	var rfRefsAdd = React.createFactory(require('./reactComps/ReferrerAdd.jsx'));
	var RefsAddHTML = ReactDS.renderToString(rfRefsAdd({errCode:errCode}));
	//Hand to renderAdminApp to render whole app page...
	admin.renderAdminApp(pageTitle,onFocusPN,RefsAddHTML,req,res);
}

admin.renderQRCodePage = function(urlcode,req,res){
	var props = {'urlcode':urlcode};
	var QRGenHTML = ReactDS.renderToStaticMarkup(qrCode(props));
	//Hand to renderAdminApp to render whole app page...
	res.send(QRGenHTML);
}

admin.renderReferrerEditPage = function(errCode,data,req,res){
	var pageTitle = "修改推荐人";
	var onFocusPN = "referrer";
	//Render referrer edit page
	var rfRefsEdit = React.createFactory(require('./reactComps/ReferrerEdit.jsx'));
	var refsEditHTML = ReactDS.renderToString(rfRefsEdit({errCode:errCode,editdata:data}));
	//Hand to renderAdminApp to render whole app page...
	admin.renderAdminApp(pageTitle,onFocusPN,refsEditHTML,req,res);
}

admin.renderReferrerDeletePage = function(errCode,referrerData,req,res){
	var pageTitle = "删除推荐人";
	var onFocusPN = "referrer";
	var props = {errCode:errCode,data:referrerData}
	var rfRefsDelete = React.createFactory(require('./reactComps/ReferrerDelete.jsx'));
	var refsDeleteHTML = ReactDS.renderToString(rfRefsDelete(props));
	//Hand to renderAdminApp to render whole app page...
	admin.renderAdminApp(pageTitle,onFocusPN,refsDeleteHTML,req,res);
}

admin.renderWXSettingsPage = function(success,errCode,req,res){
	var pageTitle = "微信公众号设定";
	var onFocusPN = "wxsettings";
	var props = {'success':success,'errCode':errCode}; //This will be sent to the React Component
	var wx = Loopback.findModel('wx');
	var finalRender = function(props){
		var rfWXSettings = React.createFactory(require('./reactComps/wxSettings.jsx'));
		var prizeListHomeHTML = ReactDS.renderToString(rfWXSettings(props));
		//Hand to renderAdminApp to render whole app page...
		admin.renderAdminApp(pageTitle,onFocusPN,prizeListHomeHTML,req,res);
	}
	wx.find({where:{key:'appid'}},function(error,data){
		if(error || data.length == 0){
			props.appSettings = {'appid':null};
			finalRender(props);
		}else{
			props.appSettings = {'appid':data[0].value};
			finalRender(props);
		}
	});
}

admin.renderReferrerSettingsPage = function(success,errCode,req,res){
	var pageTitle = "推荐人二维码设定";
	var onFocusPN = "referrerSettings";
	var props = {'success':success,'errCode':errCode};
	var appSettings = {};
	//Get lists of referrers
	var referrer = Loopback.findModel('referrer');
	var wx = Loopback.findModel('wx');
	var finalRender = function(propsObj){
		var rfRefsSettings = React.createFactory(require('./reactComps/ReferrerSettings.jsx'));
		var RefsSettingsHTML = ReactDS.renderToString(rfRefsSettings(props));
		//Hand to renderAdminApp to render whole app page...
		admin.renderAdminApp(pageTitle,onFocusPN,RefsSettingsHTML,req,res);
	}
	wx.find({where:{key:'appid'}},function(error,data){
		if(error){
			props.errCode = 10;
			props.appSettings = appSettings;
			finalRender(props);
		}else{
			if(data.length == 1){
				appSettings.appid = data[0].value;
			}else{
				appSettings.appid = null;
			}
			wx.find({where:{key:'qrexpiry'}},function(error,data){
				if(error){
					props.errCode = 1;
					props.appSettings = appSettings;
					finalRender(props);
				}else{	//WX Settings validated. Now retrieve and render referrer info
					if(data.length == 1){
						appSettings.qrexpiry = data[0].value;
					}else{
						appSettings.qrexpiry = null;
					}
					referrer.find({},function(error,data){
						if(error){
							props.errCode = 1;
							props.appSettings = appSettings;
							finalRender(props);
						}else{
							props.errCode = 0;
							props.appSettings = appSettings;
							finalRender(props);
						}
					});
				}
			});
		}
	});
}

admin.permissionDeniedRedirect = function(req,res){
	admin.renderLoginPage(10,res,true);
}

//Internal backstage function
admin.exportToExcel = function(req,res){
	//Validate sessions first. If not, jump to login page
	if(!admin.validateSession(req)){
		res.writeHead(302,{'Location':'/admin/permissionDenied'});
		res.end();
	}else{
		//Get lists of prizes from the server...
		var prizes = Loopback.findModel('prizes');
		var winners = Loopback.findModel('winner');
		var lottery = Loopback.findModel('lottery');
		var prizeIDFocus = null;
		var prizecontd = {};
		var xlsxPrizename = "";
		if(req.query.prizeid){
			prizecontd = {where:{id:req.query.prizeid}};
			prizeIDFocus = req.query.prizeid;
		}
		var parseString = function(string){
			if(!string){
				return '--未填写--'
			}else{
				return string
			}
		}
		var outputXlsx = function(finalData){
			//Output to xlsx format using node-xlsx
			var title=['SGH 2015 圣诞游戏项目 中奖名单'];
			if(!xlsxPrizename){
				var subtitle = ['所有奖品的中奖名单']
			}else{
				var subtitle = [xlsxPrizename+' 的中奖名单:'];
			}
			//Print date to xls
			var date = new Date();
			var daterow = ['文档建立时间: '+date.toString()];
			var header = ['中奖人姓名','电话号码','中奖人地址','奖品名称'];
			var xlsxbuffer = [];
			xlsxbuffer.push(title);
			xlsxbuffer.push(subtitle);
			xlsxbuffer.push(daterow);
			xlsxbuffer.push([]);
			xlsxbuffer.push(header);
			//Push row to xlsbuffer...
			for(var i=0;i<finalData.length;i++){
				var name = parseString(finalData[i].winnername);
				var tel = parseString(finalData[i].tel);
				var address = parseString(finalData[i].address);
				var prizename = parseString(finalData[i].name);
				var rowdata = [name,tel,address,prizename];
				xlsxbuffer.push(rowdata);
			}
			xlsxbuffer.push([]);
			xlsxbuffer.push(['--本文档完--']);
			var file = Xlsx.build([{name:title[0],data:xlsxbuffer}]);
			//Begin set res header
			res.setHeader('Content-Type','application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
			res.write(file);
			res.end();
		}
		//First find all prize data...
		prizes.find(prizecontd,function(error,prizeres){
			if(error){
				admin.renderUserListPage(1,null,prizeIDFocus,res);
			}else if(prizeres.length == 0){
				admin.renderUserListPage(2,null,prizeIDFocus,res);
			}else{
				var prizeData = prizeres;
				if(req.query.prizeid){
					xlsxPrizename = prizeData[0].name;
				}
				//get Lottery data...
				lottery.find({},function(error,lotres){
					if(error){
						admin.renderUserListPage(1,null,prizeIDFocus,res);
					}else{
						var lotteryData = lotres;
						var lotprizedata = admin._mergeDataArray(prizeData,'id',lotteryData,'prize',true);
						//Get Winner List data;
						winners.find({},function(error,data){
							if(error){
								admin.renderUserListPage(1,null,prizeIDFocus,res);
							}else{
								// res.send(JSON.stringify(lotprizedata));
								var winnerData = admin._changePropName(data,'name','winnername');
								var finalMerge = admin._mergeDataArray(lotprizedata,'openid',winnerData,'openid',false);
								//Output the final merge to JSON document
								outputXlsx(finalMerge);
							}
						});
					}
				});
			}
		});
	}
}

admin.exportReferrerToExcel = function(req,res){
	if(!admin.validateSession(req)){
		res.writeHead(302,{'Location':'/admin/permissionDenied'});
		res.end();
	}else{
		var referrer = Loopback.findModel('referrer');
		var refRec = Loopback.findModel('referrerRecords');
		var parseResult = function(dataArr,propName){
			var newObjArray = [];
			var defaultVal = 0;
			for(var i=0;i<dataArr.length;i++){
				var currentObj = dataArr[i];
				if(typeof(currentObj[propName]) === 'undefined'){
					currentObj[propName] = defaultVal;
					newObjArray.push(currentObj);
				}else{
					//State exists, push back to the array...
					newObjArray.push(currentObj);
				}
			}
			return newObjArray;
		};
		var outputXlsx = function(finalData){
			//Output to xlsx format using node-xlsx
			var title=['SGH 2015 圣诞游戏项目 中奖名单'];
			var subtitle = ['推荐人名单和访问人数']
			//Print date to xls
			var date = new Date();
			var daterow = ['文档建立时间: '+date.toString()];
			var header = ['推荐人姓名','二维码访问人数'];
			var xlsxbuffer = [];
			xlsxbuffer.push(title);
			xlsxbuffer.push(subtitle);
			xlsxbuffer.push(daterow);
			xlsxbuffer.push([]);
			xlsxbuffer.push(header);
			//Push row to xlsbuffer...
			for(var i=0;i<finalData.length;i++){
				var name = finalData[i].name;
				var count = finalData[i].count;
				var rowdata = [name,count];
				xlsxbuffer.push(rowdata);
			}
			xlsxbuffer.push([]);
			xlsxbuffer.push(['--本文档完--']);
			var file = Xlsx.build([{name:title[0],data:xlsxbuffer}]);
			//Begin set res header
			res.setHeader('Content-Type','application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
			res.write(file);
			res.end();
		}
		//First find all available referrers
		referrer.find({},function(error,data){
			if(error){
				util.clog('admin','exportReferrerToExcel',2,'DB Error on retrieving contents');
				admin.renderReferrerListPage(null,1,req,res);
			}else{
				var referrers = data;
				//Then get all referrer records
				refRec.find({},function(error,data){
					if(error){
						util.clog('admin','exportReferrerToExcel',2,'DB Error on retrieving contents');
						admin.renderReferrerListPage(null,1,req,res);
					}else{
						var refRecs = data;
						//Merge the results again
						// var mergedData = admin._mergeDataArray(referrers,'id',refRecs,'referrerid',false);
						var countData = admin._countObjectWithSameProp(refRecs,'referrerid');
						//Merge again with data...
						var finalData = admin._mergeDataArray(referrers,'id',countData,'item',false);
						//Add count properties if no count is defined in obj
						finalData = parseResult(finalData,'count');
						//Hand in to the XLSX module to output excel file
						outputXlsx(finalData);
					}
				});
			}
		});
	}
}

//
admin._mergeDataArray = function(array1,a1key,array2,a2key,removeBlanks){
	//Merge data with two arrays by matching mergekey
	var mergedData = [];
	// console.log('Arr1:'+JSON.stringify(array1));
	// console.log('Arr2:'+JSON.stringify(array2));
	var allMatches = [];
	for(var i=0;i<array1.length;i++){
		var currentArrOneObj = array1[i];
		//Compare with data in second array...
		var match = false;
		for(var j=0;j<array2.length;j++){
			var currentArrTwoObj = array2[j];
			if(currentArrOneObj[a1key] == currentArrTwoObj[a2key]){
				match = true;
				var currentMatch = [];
				currentMatch.push(currentArrOneObj);
				currentMatch.push(currentArrTwoObj);
				//Push current match to the server
				allMatches.push(currentMatch);
			}
		}
		if(!match && !removeBlanks){
			// console.log('match called?');
			var currentMatch = [];
			currentMatch.push(currentArrOneObj);
			currentMatch.push({});
			allMatches.push(currentMatch);
		}
	}
	// Remove individuals with no matched objects...
	// if(removeBlanks){
	// 	console.log('called removeBlanks');
	// 	var blankRemovedMatches = [];
	// 	for(var i=0;i<allMatches.length;i++){
	// 		var currentMatch = allMatches[i];
	// 		if(currentMatch.length == 2){
	// 			blankRemovedMatches.push(currentMatch);
	// 		}
	// 	}
	// 	allMatches = blankRemovedMatches;
	// }
	// Begin data matching in arrays...
	// console.log('matches list');
	// console.log(JSON.stringify(allMatches));
	// console.log('---111---');
	for(var i=0;i<allMatches.length;i++){
		var currentMatch = allMatches[i];
		if(currentMatch.length == 2){
			var ArrOneObj = currentMatch[0];
			var ArrTwoObj = currentMatch[1];
			//Set new object here...
			var newObj = {};
			for(var ArrOneProps in ArrOneObj){
				if(ArrOneProps.indexOf('_') == -1){
					newObj[ArrOneProps] = ArrOneObj[ArrOneProps];
				}
			}
			for(var ArrTwoProps in ArrTwoObj){
				if(ArrTwoProps != a2key && ArrTwoProps.indexOf('_') == -1){
					newObj[ArrTwoProps] = ArrTwoObj[ArrTwoProps];
				}
			}
			// console.log('pushed new obj');
			mergedData.push(newObj);
		}
		// }else{
		// 	//There should be no matches with length = 1 if removeBlanks is true by now
		// 	var ArrObj = currentMatch[0];
		// 	console.log('indivObj.stringify-'+JSON.stringify(ArrObj));
		// 	console.log('pushed individual obj');
		// 	mergedData.push(ArrObj);
		// }
	}
	// console.log('--00--');
	// console.log('final');
	// console.log(JSON.stringify(mergedData));
	// console.log('------');
	return mergedData;
}

admin._changePropName = function(objArr,oldName,newName){
	var newObjArray=[];
	for(var i=0;i<objArr.length;i++){
		var currentObj = objArr[i];
		var newObj = {};
		for(var props in currentObj){
			if(props.indexOf('_') == -1){
				if(props === oldName){
					newObj[newName] = currentObj[props];
				}else{
					newObj[props] = currentObj[props];
				}
			}
		}
		newObjArray.push(newObj);
	}
	return newObjArray;
}

admin._countObjectWithSameProp = function(arrObj,propName){
	console.log('_countObjectWithSameProp invoked');
	var availableItems = [];
	//First populate available items in specified propName
	for(var i=0;i<arrObj.length;i++){
		var currentObj = arrObj[i];
		for(var props in currentObj){
			if(props == propName){	//Check whether the object is already in the string...
				var currentItem = currentObj[propName];
				if(availableItems.indexOf(currentItem) == -1){
					availableItems.push(currentItem);
				}
			}
		}
	}
	console.log('found availableITems:'+JSON.stringify(availableItems));
	//Populated available items, now create another array to count!
	var finalResult = [];
	for(var j=0;j<availableItems.length;j++){
		var currentCounter = 0;
		var currentProp = availableItems[j];
		//Iter the arrObj again...
		for(var i=0;i<arrObj.length;i++){
			if(arrObj[i][propName] === currentProp){
				currentCounter++;
			}
		}
		//Push the counter result to counter array (it is position-specific...)
		var countObj = {
			'item':currentProp,
			'count': currentCounter
		}
		finalResult.push(countObj);
	}
	return finalResult;
}

module.exports = admin;

//Trash bin here
		// var newReferrerObj = {name:req.body.name};
		// var wxqrhtml = 'https://api.weixin.qq.com/cgi-bin/qrcode/create?access_token='
		// var wxqrsettings = {};
		// //Now generate WX Settings from server...
		// var wx = Loopback.findModel('wx');
		// var referrer = Loopback.findModel('referrer');
		// var refname = req.body.name;
		// wx.find({where:{key:'qrexpiry'}},function(error,data){
		// 	if(error){
		// 		admin.renderReferrerAddPage(1,res);
		// 		return;
		// 	}else if(data.length != 1){
		// 		admin.renderReferrerAddPage(10,res);
		// 		return;
		// 	}else{
		// 		//Set a callback function to create new url token...
		// 		var qrexpiry = data[0].value;
		// 		var accessTokenCallback = function(error,accessToken){
		// 			if(error){
		// 				console.log('Error Received!');
		// 				var errCode = 20+parseInt(error);
		// 				admin.renderReferrerAddPage(errCode,res);
		// 			}else{
		// 				var url = wxqrhtml + accessToken;
		// 				var body = {
		// 					'expire_seconds':qrexpiry,
		// 					'action_name':'QR_SCENE',
		// 					'action_info':{
		// 						'scene':{'scene_id':100}
		// 					}
		// 				};
		// 				var httpOptions = {
		// 					'url':url,
		// 					'method':'POST',
		// 					'json':true,
		// 					'body':body
		// 				};
		// 			 	Request(httpOptions,function(error,response,body){
		// 			 		if(error){
		// 			 			admin.renderReferrerAddPage(30,res);
		// 			 			return;
		// 			 		}else if(response.statusCode != 200){
		// 			 			admin.renderReferrerAddPage(31,res);
		// 			 			return;
		// 			 		}else{
		// 			 			console.log('Wechat server returned statusCode:'+response.statusCode);
		// 			 			//Get the parameters here...
		// 			 			console.log('Returns');
		// 			 			console.log(JSON.stringify(body));
		// 			 			if(typeof('body.errcode') !== 'undefined'){
		// 			 				//An error from wechat server has been passed
		// 			 				admin.renderReferrerAddPage(31,res);
		// 			 				return;
		// 			 			}else{
		// 			 				newReferrerObj.ticket = body.ticket;
		// 			 				newReferrerObj.url = body.url;
		// 			 				var expirysec = body.expire_seconds;
		// 			 				//Set the expiry now...
		// 			 				var date = new Date();
		// 			 				date.setSeconds(d.getSeconds()+expirysec);
		// 			 				newReferrerObj.expiry = date.getTime();
		// 			 				newReferrerObj.count = 0;
		// 			 				//Add new item to the server...
		// 			 				referrer.upsert(newReferrerObj,function(error){
		// 			 					if(error){
		// 			 						//An Error occured while updating to db
		// 			 						admin.renderReferrerAddPage(1,res);
		// 			 					}else{
		// 			 						//Notify success, jumps back to the original place
		// 			 						admin.renderReferrerListPage(1,res);
		// 			 					}
		// 			 				});
		// 			 			}
		// 			 		}
		// 			 	});
		// 			}
		// 		}
		// 		//Call wx now to access the accesstoken...
		// 		Wx.getToken(accessTokenCallback);
		// 	}
		// });