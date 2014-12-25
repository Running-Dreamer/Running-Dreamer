// 開發模式
var dvm = true;
// -------------------引入所需的檔案-------------------
var express = require('express');
// 引入ejs layout
var expressLayouts = require('cloud/node_modules/express-ejs-layouts/lib/express-layouts.js');
// 引入CLOUD
var CLOUD = require('cloud/cloud.js').getCLOUD();
// session
var parseExpressHttpsRedirect = require('parse-express-https-redirect');
var parseExpressCookieSession = require('parse-express-cookie-session');
// -------------------引入所需的檔案-------------------

// -------------------設定app-------------------
var app = express();
// Specify the folder to find templates
app.set('views', 'cloud/views');
// Set the template engine
app.set('view engine', 'ejs');
// Middleware for reading request body
app.use(express.bodyParser());
// Require user to be on HTTPS.
app.use(parseExpressHttpsRedirect());
// cookie secret
app.use(express.cookieParser('the big fish'));
// cookie session
app.use(express.cookieSession());
// cookie session
app.use(parseExpressCookieSession({cookie: {maxAge: 3600000}}));
// 設定layout為index.ejs
app.set('layout', 'index');
// 使用ejs layout
app.use(expressLayouts);
// -------------------設定app-------------------

// 全域user
var USER = null;
// -------------------routing-------------------
// 處理fb登入session
app.post('/fblogin', function (req, res) {
	var sessionToken = req.body.sessionToken;
	Parse.User.become(sessionToken).then(function (user) {
		console.log("fblogin -- become -- success");
		// The current user is now set to user.
		Parse.User.current().fetch().then(function (user) {
			USER = user;
			console.log(user.get('email'));
			res.redirect('/');
		});
	}, function (error) {
		// The token could not be validated.
		console.log("fblogin -- become -- error = " + error);
		res.redirect('/');
	});
});
// home
app.get('/', function (req, res) {
	CLOUD.sayHello().always(function (result) {
		var email = USER ? USER.getEmail() : "";
		res.render('./pages/home', {
			title: email
		});
	});
});
app.get('/list', function (req, res) {
	res.render('./pages/list', {
		title: "LIST"
	});
});
// -------------------routing-------------------

// -------------------建立server-------------------

if (dvm) {
	try {
		app.use(express.static(__dirname + '/../public'));
	} catch (e) {

	}
	app.listen(3000);
} else app.listen();
console.log("Server is up!");
// -------------------建立server-------------------