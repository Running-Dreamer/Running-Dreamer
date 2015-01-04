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

// -------------------routing-------------------
// 管理者
app.get('/admin', function (req, res) {
	CLOUD.getAllUser().then(function(result){
		res.render('./pages/admin', {
			page: 'admin-page',
			result: result
		});
	});
});
// facebook 登入設定server session
app.get('/fblogin', function (req, res) {
	var sessionToken = req.query.session;
	Parse.User.become(sessionToken).then(function (user) {
		res.redirect('/');
	});
});
// 登入畫面
app.get('/login', function (req, res) {
	res.render('./pages/login', {page: 'login-page'});
});
// 主頁面home
app.get('/', function (req, res) {
	if(Parse.User.current())
		CLOUD.getMyList().then(function(result) {
			res.render('./pages/home', {
				page: 'home-page',
				result: result
			});
		});
	else
		res.redirect('/login');
});
// 瀏覽夢想browse
app.get('/browse', function (req, res) {
	res.render('./pages/browse', {
		page: 'browse-page'
	});
});
// 
app.get('/mylist', function (req, res) {
	if(Parse.User.current())
		CLOUD.getAllUser().then(function (result) {
			res.render('./pages/home', {
				page: 'mylist-page',
				result: result
			});
		});
	else
		res.redirect('/login');
});
// 
app.get('/hello', function (req, res) {
	if(Parse.User.current())
		CLOUD.sayHello().always(function (result) {
			res.render('./pages/home', {
				page: 'hello-page',
				result: []
			});
		});
	else
		res.render('./pages/home', {
			title: "請登入"
		});
});
// -------------------routing-------------------

// -------------------API-------------------
app.post('/api/getAllBrowseList', function(req, res){
	var type = req.body.type;
	var skip = req.body.skip;
	CLOUD.getAllBrowseList(type, skip).then(function (result) {
		res.send(result);
	});
});
// -------------------API-------------------

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