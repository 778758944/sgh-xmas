/** 
	Session Module for Node.JS Server -- 
	Initialize this library to store session related objects to the base.
	Version 1.02 Rev B-MS0
	Core Concept: Creates session, saves and retrieves user's session status utilizing JSON key:value pair
**/
var adminsession = {};
/**Load base modules**/
var Loopback 	= require('loopback');
var Session 	= require('express-session');
var shortid		= require('shortid');
var MongoStore 	= require('connect-mongo')(Session);
/** Configurations **/
var mongoSettings = {				//MongoDB Settings
    db:'testbase',
    port:'27017',
    url:'mongodb://localhost',
};
var sessionSettings = {				//Express-Sessions setting
	genid:function(req){
		return shortid.generate();
	},//Generate new UUID for each session
	secret:'adminSessions',
	resave:false,
	saveUninitialized:false,
	unset:'keep',
	key:'aLa5ka',
	store: new MongoStore(mongoSettings)
};
/** Database Session presets **/
var d = new Date;
var globalPreset = {'DBSessionCreationDate':d.toString()}
/** Define Presets for individual sessions below, in rmsession.createSession()**/

/** This line below is all the available functions. Do not modify, except you are very clear what you are doing.**/
/** Front-end Functions **/
adminsession.checkDBSession = function(){
	console.log('adminsession::checkDBSession');
	return (this.session !== null);
}

adminsession.initDBSession = function(){		//Initialize new session
	this.session = Session(sessionSettings);
	console.log('adminsession::initDBSession - INF: Invoked Session creation');
	//Set the default variables here...
	var content = globalPreset;
	//Continuing. Save contents to session and return true for successful creation
	this.session.sessionContent = content;
	if(typeof(this.session) === "undefined"){
		console.log('adminsession::initDBSession - ERR: Session creation failed! variables not saved');
		return false;
	}else{
		console.log('adminsession::initDBSession - INF: Session created');
		return true;
	}
}

adminsession.createSession = function(sessionID,user,rights){
	if(typeof(this.session) === "undefined"){
		console.log('adminsession::createSession - WRN: No existing DB Session. Creating new one');
		if(!this.initDBSession()){
			console.log('adminsession::createSession - ERR: DB Session Creation Failed.');
			return false;
		}
	}else if(!sessionID){
		console.log('adminsession::createSession - ERR: No specified sessionID');
		return false;
	}
	/** Set individual presets here**/
	var d = new Date();
	var creationDate = d.getTime();
	//Set expiry time of the session. Default: 10 min.
	d.setMinutes(d.getMinutes()+10);
	var expiryDate = d.getTime();

	var indivPreset = {'creationDate':creationDate,'expiryDate':expiryDate,'sessionID':sessionID,'user':user,'rights':rights};
	//Do not modify code below this line.
	this.session.sessionContent[sessionID] = indivPreset;
	if(typeof(this.session.sessionContent[sessionID]) === "undefined"){
		console.log('adminsession::initDBSession - ERR: Session creation failed! variables not saved');
		return false;
	}else{
		console.log('adminsession::initDBSession - INF: Session created');
		return true;
	}
}

adminsession.getKey = function(sessionID,name){		//Get contents of new session
	if(!name || !sessionID){
		console.log('adminsession::getKey - ERR: key name or session ID not defined');
		return null;
	}else if(typeof(this.session) === "undefined"){
		console.log('adminsession::getKey - WRN: trying to access blank session');
		return null;
	}else if(typeof(this.session.sessionContent[sessionID]) === "undefined"){
		console.log('adminsession::getKey - WRN: trying to access uninitialized user session');
		return null;
	}else{
		console.log('adminsession::getKey - INF: access key:'+name+' from session:'+sessionID);
		var content = this.session.sessionContent[sessionID];
		if(!content){
			return null
		}else if(typeof(content[name]) !== "undefined"){
			return content[name];
		}else{
			console.log('adminsession::getKey - WRN: trying to access key:'+name+' but it is not set.');
			return null;
		}
	}
}

adminsession.renewExpiry = function(sessionID){	// Save key-value to new session
	if(!sessionID){
		console.log('RMSSession::saveKey - sessionID is not defined');
		return false;
	}else if(typeof(this.session) === 'undefined'){		//Session not yet created? create new one and continue...
		console.log('RMSSession::saveKey - WRN: no database session created. Creating new one.');
		if(!this.initDBSession()){
			console.log('RMSSession::saveKey - ERR: database session creation failed. Failed saving variable');
			return false;
		}
	}
	//Check for existence of user session
	if(typeof(this.session.sessionContent[sessionID]) === "undefined"){
		console.log('RMSSession::saveKey - ERR: no user session created.');
		return false;
	}else{
		var content = this.session.sessionContent[sessionID];
		var d = new Date();
		d.setMinutes(d.getMinutes()+10);
		content['expiryDate'] = d.getTime();
		this.session.sessionContent[sessionID] = content;
	}
}

adminsession.deleteSession = function(sessionID){		//Delete user session
	if(!sessionID){
		console.log('RMSSession::deleteSession - ERR: keyid is not defined');
		return false;
	}else if(typeof(this.session) === 'undefined'){
		console.log('RMSSession::deleteSession - ERR: Database session not initialized');
		return false;
	}else{
		console.log('RMSSession::deleteSession - INF: Clearing session for keyid:'+sessionID);
		this.session.sessionContent[sessionID] = null;
		return true;
	}
}
/* */
module.exports = adminsession;