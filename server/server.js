/**
# SunGlassHut 2015 Christmas Game Project 'Collect all glasses'
# Version 0.0.1-R3 - Dev Build 
# Last Update 15/12/2015
**/
var loopback  = require('loopback');
var boot      = require('loopback-boot');
var app       = module.exports = loopback();
var bodyParser= require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));

/**       Lists of middleware        **/
var lottery   = require('./middleware/lottery/lottery.js');
var admin     = require('./middleware/admin/admin.js');
var players   = require('./middleware/players/players.js');
var referrer  = require('./middleware/referrer/referrer.js');
// var prizes    = require('./middleware/prizes/prizes.js');
var wx        = require('./middleware/wx/wx.js');
// var adminsession = require('./middleware/session/session.js');
/**       Routes       **/
app.post('/players/register',players.register);
app.post('/players/remainingChances',players.remainingChances);
app.post('/players/setChances',players.setChances);
app.post('/players/useChance',players.useChance);
app.post('/players/regWinner',players.regWinner);
app.post('/players/firstPlayed',players.firstPlay);

// app.post('/prizes/addPrize',prizes.addPrize);
// app.post('/prizes/findPrize',prizes.findPrize);
// app.post('/prizes/deletePrize',prizes.deletePrize);

app.post('/lottery/startLottery',lottery.startLottery);
app.post('/lottery/checkWinnerRegistered',lottery.checkWinnerRegistered);

app.get('/wx/ua',wx.getUserAuth);
app.get('/wx/getWebToken',wx.getWebToken);

// app.get('/referrer',referrer.entrance);

app.get('/admin',admin.loginPage);
app.post('/admin/login',admin.login);
app.get('/admin/home',admin.mainPage);
app.get('/admin/logout',admin.logout);

app.get('/admin/winners',admin.userList);
app.get('/admin/exportToExcel',admin.exportToExcel);

app.get('/admin/prizes',admin.prizeList);
app.get('/admin/addPrize',admin.addPrizePage);
app.post('/admin/addPrize',admin.addNewPrize);
app.get('/admin/editPrize',admin.editPrizePage);
app.post('/admin/editPrize',admin.editPrize);
app.get('/admin/deletePrize',admin.deletePrizePage);
app.post('/admin/deletePrize',admin.deletePrize);

app.get('/admin/referrer',admin.referrerList);
app.get('/admin/genQRCode',admin.genReferrerQRCode);
app.get('/admin/addReferrer',admin.addReferrerPage);
app.post('/admin/addReferrer',admin.addReferrer);
app.get('/admin/editReferrer',admin.editReferrerPage);
app.post('/admin/editReferrer',admin.editReferrer);
app.get('/admin/deleteReferrer',admin.deleteReferrerPage);
app.post('/admin/deleteReferrer',admin.deleteReferrer);
app.get('/admin/exportReferrerToExcel',admin.exportReferrerToExcel);
// app.get('/admin/referrerSetting',admin.referrerSettings);
// app.post('/admin/referrerSetting',admin.configureReferrer);

app.get('/admin/wx',admin.wxSettings);
app.post('/admin/configureWXApp',admin.configureWX);
app.get('/admin/permissionDenied',admin.permissionDeniedRedirect);

//Redirect user if they are accessing to main page
app.get('/',function(req,res){
  var release = true; //Change this to true when game starts!
  if(!release){
    res.write('<p>Currently under development. Please stand by!</p>');
    res.end();
  }else{
    res.writeHead(302,{'Location':'./wx/ua'});
    res.write('<p>Redirecting, Please wait.</p>');
    res.end()
  }
});

//Admin access
app.start = function() {
  // start the web server
  return app.listen(function() {
    app.emit('started');
    var baseUrl = app.get('url').replace(/\/$/, '');
    console.log('Web server listening at: %s', baseUrl);
    if (app.get('loopback-component-explorer')) {
      var explorerPath = app.get('loopback-component-explorer').mountPath;
      console.log('Browse your REST API at %s%s', baseUrl, explorerPath);
    }
  });
};

// Bootstrap the application, configure models, datasources and middleware.
// Sub-apps like REST API are mounted via boot scripts.
boot(app, __dirname, function(err) {
  if (err) throw err;

  // start the server if `$ node server.js`
  if (require.main === module)
    app.start();
});
