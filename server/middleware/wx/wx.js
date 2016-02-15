/*
# SGH 2015 Christmas Game - Server
# WeChat Module for Server-Side Validations.
# Rev. 0.0.1 Dev - 14 Dec 2015
# GENERAL
*/

var wx			= {};
//Load Base Modules
var Loopback 	= require('loopback');
var Crypto		= require('crypto-js');
var util		= require('../util/util.js');
var Request		= require('request');
// WeChat App Registration details
//var appid		= ""; Please set this in db.
//var secret	= ""; Please set this in db.
// For security reasons, both appid and secret will be stored in db
// And be accessed in db in future releases.

// WeChat Web Authorization Settings
var oAuthUrl 	= "https://open.weixin.qq.com/connect/oauth2/authorize";
var scope		= "snsapi_base";
var main_host	= "http://xmas-2015.sgh.clients.inzen.com.cn";		//Main Application Domain
var wt_redir	= "/wx/getWebToken";	//URL that registered to function getWebToken of this middleware.
var main_path	= "/FindGlass/index.html#load";
var state 		= "STATE";
var saveWToken	= false; //Save WeChat Web Authorization token?


//Main Functions

//Base functions
function appendGetToUrl(url,data){
	var finalURL = url+"?";
	for(var key in data){
		var queryString = key + "=" + data[key] + "&";
		finalURL += queryString;
	}
	//Remove the last "&" character
	finalURL = finalURL.substring(0,finalURL.length-1);
	return finalURL;
}

wx.getToken 	= function(callback){	//Get Application-Wide (normal) Access_token
	util.clog('wx','getToken',0,'Invoked');
	//First check either token exists, or is expired
	var wx	= Loopback.findModel('wx');
	wx.find({where:{key:'access_token'}},function(error,data){
		if(error){
			util.clog('wx','getToken',2,'Database Error on getting wx settings from server');
			return callback(null);
		}else{
			//Preparing callback function on retrieving new AccessToken
			var getNewToken = function(callback){
				wx.find({where:{'key':'appid'}},function(error,data){
					if(error || data.length != 1){
						//Server returned an error!
						callback(1,null);
					}else{
						var appid = data[0].value;
						//Then for secret
						wx.find({where:{'key':'secret'}},function(error,data){
							if(error || data.length != 1){
								callback(1,null);
							}else{
								var secret = data[0].value;
								//Got appid and secret, now begin request module to get token
								var qs = {
									'grant_type':'client_credential',
									'appid': appid,
									'secret': secret
								};
								var httpOptions = {
									'url': 'https://api.weixin.qq.com/cgi-bin/token',
									'headers':{'accept':'*/*'},
									'qs':qs
								};
								Request(httpOptions,function(error,response,body){
									if(error){
										console.log('Request Error!');
										callback(2,null);//Request encountered an error!
									}else if(response.statusCode != 200){
										console.log('Response code from wechat is not 200:'+response.statusCode);
										callback(3,null);//Request is not 200...
									}else{
										console.log('Response code on wechat is:'+response.statusCode);
										//Parse access token here!
										var accessTokenRespond = JSON.parse(body);
										var date = new Date();
										date.setSeconds(date.getSeconds()+accessTokenRespond.expires_in);
										var expiryTime = date.getTime();
										var accessToken = accessTokenRespond.access_token;
										console.log('token:'+JSON.stringify(accessToken));
										var accessTokenObj = {'access_token':accessToken,'expiry':expiryTime};
										var accessTokenRec = {'key':'access_token','value':JSON.stringify(accessTokenObj)};
										console.log('token to store:'+JSON.stringify(accessTokenRec));
										//Save the accessToken back to server, and continue...
										wx.upsert(accessTokenRec,function(error,data){
											if(error){
												//Server cannot save the token!
												callback(4,null);
											}else{
												callback(null,accessToken);
											}
										});
									}
								});
							}
						});
					}
				});
			}
			//Now check the tokens
			if(data.length == 0){
				//No record, get new access_token...
				console.log('Access Token not found. Getting new one...');
				getNewToken(callback);
			}else{
				//Validate the expiry date. Get new one if it is expired
				var date = new Date();
				var datesec = date.getTime();
				if(data[0].expiry <= datesec){ //It is expired
					console.log('Access Token is expired, renewing...');
					getNewToken(callback);
				}else{ //Return callback with new accessToken...
					console.log('Using stored accessn token');
					var accessTokenObjStr = data[0].value;
					var accessTokenObj = JSON.parse(accessTokenObjStr);
					console.log('tokenobj:'+JSON.stringify(accessTokenObj));
					var access_token = accessTokenObj.access_token;
					console.log('token:'+JSON.stringify(access_token));
					return callback(null,access_token);
				}
			}
		}
	});
}

wx.getUserAuth	= function(req,res){
	util.clog('wx','getUserAuth',0,'Invoked');
	util.clog('wx','getUserAuth',1,'This function is intended to get user permission via web apps only. Use getToken for application-wide authenication.');
	//Referrer data is required here... OK, get the referrer data from URL. If there are no data, then state returns null
	if(req.query.referrerid){
		var wxState = req.query.referrerid; //As WeChat docs says, this will return...
	}else{
		var wxState = 'NOREFERRER';
	}
	//See ya in getWebToken.
	//Get AppID and Password from the db. These credentials has been stored in DB for security purposes.
	var wx = Loopback.findModel('wx');
	wx.find({where:{key:'appid'}},function(error,data){
		if(error){
			util.clog('wx','getUserAuth',2,'Error occured while reading wx settings - appid in db.');
			res.send(util.respond(false,'Error occured while reading wx settings in db.',null));
			return;
		}else if(data.length != 1){	//Multiple entries!
			res.send(util.respond(false,'Database Error: Multiple entries for appid!',null));
			return;
		}else{
			//Get value of appid
			var appid = data[0].value;
			//Prepare params for user authenication...
			var authObj = {
				'appid': appid,
				'redirect_uri': encodeURI(main_host+wt_redir),
				'response_type': 'code',
				'scope': scope,
				'state': wxState + '#wechat_redirect'
			};
			console.log('authobj:'+JSON.stringify(authObj));
			console.log('url:'+appendGetToUrl(oAuthUrl,authObj));
			//Append the settings to the WeChat Authorization URL, and redirect the user to there...
			res.writeHead(302,{'Location':appendGetToUrl(oAuthUrl,authObj)});
			res.write("<html><head><title>SGH-2015Christmas</title></head><body><p>Redirecting to WeChat Authorization. Please wait</p></body></html>");
			res.end();
			return;
		}
	})
}

wx.getWebToken	= function(req,res){
	if(!req.query.code){
		util.clog('wx','getWebToken',2,'Authorization code not obtained from URL...');
		res.send(util.respond(false,'Authorization Code not obtianed',null));
		return;
	}else{
		//Get auth code...
		var authCode = req.query.code;
		//Also get referrer id from state...
		var wxState = req.query.state;
		console.log('wxState var:'+req.query.state);
		//Follow up: get settings from db...
		var wx = Loopback.findModel('wx');
		var refRec = Loopback.findModel('referrerRecords');
		wx.find({where:{key:'appid'}},function(error,data){
			if(error){
				util.clog('wx','getWebToken',2,'Database error while reading wx settings');
				res.send(util.respond(false,'Database error while reading wx settings',null));
				return;
			}else if(data.length != 1){
				res.send(util.respond(false,'Multiple settings detected.',null));
				return;
			}else{
				var appid = data[0].value; //Appid shows here... Then get app secret. (password?)
				wx.find({where:{key:'secret'}},function(error,data){
					if(error){
						util.clog('wx','getWebToken',2,'Database error while reading wx settings');
						res.send(util.respond(false,'Database error while reading wx settings',null));
						return;
					}else if(data.length != 1){
						res.send(util.respond(false,'Multiple settings detected.',null));
						return;
					}else{
						var secret = data[0].value; //Got app secret. Now begin authorize
						var atAuthObj = {
							'appid': appid,
							'secret': secret,
							'code': authCode,
							'grant_type': 'authorization_code'
						};
						//Configurations for https object
						var httpsConfig = {
							'url'	: appendGetToUrl('https://api.weixin.qq.com/sns/oauth2/access_token',atAuthObj),
							'headers': {'accept':'*/*'}
						}
						//Send HTTPS configuration to target url...
						Request(httpsConfig,function(error,response,body){
							if(error){
								res.send(util.respond(false,'HTTP Request module returned an error',null));
								return;
							}else if(response.statusCode != 200){
								res.send(util.respond(false,'WeChat server returned an status code:'+response.statusCode,null));
								return;
							}else{
								util.clog('wx','getWebToken-p:httpsGet',0,'WX Server return status: '+response.statusCode);
								var returnedObj = JSON.parse(body);
								if(typeof(returnedObj.errcode) !== 'undefined'){
									res.send(util.respond(false,'WeChat returned an error: '+returnedObj.errcode+" : "+returnedObj.errmsg,null));
									return;
								}else{
									var openid = returnedObj.openid;
									util.clog('wx','getWebToken-p:httpsGet',0,'Returned OpenID: '+openid);
									//Callback function here for redirecting user to main game page with OpenID
									var redirectWithOpenID = function(openid){
								      //Write Cookie
								      //No cookies here, just redir...
								      /**
								        var cookieData = [{'key':'openid','value':openid}];
								        var cookiePreset = [{'key':'domain','value':main_host},{'key':'path','value':main_path}]//This cookie shold be domain-wide!
								        res.writeHead(304,{'Set-Cookie':util.parseCookieString(cookieData,cookiePreset),'Location':main_host+main_path});
								        res.write('<p>Redirecting to main page, please wait.</p>');
								        res.end();
								        **/
								      var locationHTML = main_host+main_path+"?openID="+openid;
								      console.log('finalHTML:'+locationHTML);
								      res.writeHead(302,{'Location':locationHTML});
								      res.write('<p>Redirecting to main page, please wait.</p>');
								      res.end();
									}
									var registerReferrer = function(){
										//Mainly checks the wxstate params for referrerid here...
										//First remove '#wechat_redirect' if found... (16 chars)
										if(wxState.indexOf('#wechat_redirect') != -1){
											wxState = wxState.substring(0,wxState.length - 16);
										}
										//Then check whether wxState is 'NOREFERRER'....
										if(wxState.indexOf('NOREFERRER') != -1){
											console.log('caught NOREFERRER, skipping');
											//No referrer, run redirection now...
											redirectWithOpenID(openid);
										}else{
											//Got referrer, extract the referrerid and saves to model here
											console.log('caught with referrerid, registering');
											var referrerid = wxState;
											//TWO MODES: one is count an entry if the user is new from every referrer, or another is count if the user is new to ONE referrer
											//Apply either first or second line below
											//refRec.find({where:{referrerid:referrerid,openid:openid}},function(error,data){
											refRec.find({where:{referrerid:referrerid,openid:openid}},function(error,data){
												if(!error && data.length == 0){
													console.log('no error found');
													//Do not affect user progress if error is found
													//Record the entry if it is not found...
													var newRecord = {referrerid:referrerid,openid:openid};
													refRec.upsert(newRecord,function(error){
														if(error){
															//Again, do not affect user progress
															util.clog('wx','getWebToken',2,'Database error on writing refrec info!');
														}else{
															util.clog('wx','getWebToken',0,'Registered');
														}
														redirectWithOpenID(openid);
													});
												}else if(error){
													//Do not affect user progress...
													util.clog('wx','getWebToken',2,'Database error on reading refrec info!');
													redirectWithOpenID(openid);
												}else{
													util.clog('wx','getWebToken',1,'Registered before. Ignoring');
													redirectWithOpenID(openid);
												}
											});
										}
									}
									if(saveWToken){
										//Get expiry date of access_token...
										var expires_in = body.expires_in;
										var date = new Date();
										date.setSeconds(date.getSeconds()+expires_in);
										var expiryTime = date.getTime(); //Got expiry time in seconds
										//Save it into the database...
										var webTokenObj = {
											'access_token':body.access_token,
											'expiry':expiryTime,
											'refresh_token':body.refresh_token
										}
										var upsertObj = {'key':'webAccessToken','value':webTokenObj};
										wx.upsert(upsertObj,function(error){
											if(error){
												util.clog('wx','getWebToken',2,'Database error on saving web token! Continuing without saving');
											}
											// redirectWithOpenID(openid);
											registerReferrer();
										});
									}else{
										//Not to save access_token?
										// redirectWithOpenID(openid);
										registerReferrer();
									}
								}
							}
						});
					}
				});
			}
		});
	}
}

module.exports = wx;