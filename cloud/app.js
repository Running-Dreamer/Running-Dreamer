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
app.use(parseExpressCookieSession({cookie: {maxAge: 36000000}}));
// 設定layout為index.ejs
app.set('layout', 'index');
// 使用ejs layout
app.use(expressLayouts);
// -------------------設定app-------------------

// -------------------routing-------------------
app.get('/test', function(req, res) {
	res.render('./pages/test', {page: 'test-page'});
});
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
	if (Parse.User.current())
		CLOUD.getMe().then(function (user) {
			CLOUD.getUserDreams(user).then(function (dream) {
				/*var foluser = user.get("Following");
				console.log("Following:"+foluser[0].get("displayName"));*/
				user.set('Dreams', dream);
				res.render('./pages/home', {
					UserId: Parse.User.current().id,
					page: 'home-page',
					result: user,
					following: user.get("Following") || [],
				});
			});
		});
	else
		res.redirect('/login');
});
// 其他人的夢想列表home
app.get('/other', function (req, res) {
	if (Parse.User.current())
		var UserId = req.query.UserId;
		if(UserId == Parse.User.current().id) res.redirect('/');
		CLOUD.getUser(UserId).then(function (user) {	
			CLOUD.getUserDreams(user).then(function (dream) {
				user.set('Dreams', dream);
				res.render('./pages/home', {
					UserId: Parse.User.current().id,
					page: 'other-page',
					result: user,
					following: user.get("Following") || [],
				});
			});
		});
	else
		res.redirect('/login');	
});

// 瀏覽夢想browse
app.get('/browse', function (req, res) {
	if (Parse.User.current())
		res.render('./pages/browse', {
			page: 'browse-page'
		});
	else
		res.redirect('/login');	
});
// -------------------routing-------------------

// -------------------API-------------------
app.get('/autocomplete', function(req, res){
	var displayName = req.query.displayName;
	CLOUD.QueryUserName(displayName).then(function (result) {
		res.send(result);
	});
});

app.post('/api/getAllBrowseList', function(req, res){
	var type = req.body.type;
	var skip = req.body.skip;
	CLOUD.getAllBrowseList(type, skip).then(function (result) {
		res.send(result);
	});
});
app.post('/api/createComment', function(req, res){
	var DreamId = req.body.DreamId;
	var CreatorId = Parse.User.current().id;
	var Content = req.body.Content;
	
	CLOUD.createComment(DreamId, CreatorId, Content).then(
		function () {
			res.send("success");
		},
		function () {
			res.send("error");
		}
	);
});

app.post('/api/followIt', function(req, res){
	var FollowerId = req.body.FollowerId;
	console.log(FollowerId);
	
	CLOUD.followIt(FollowerId).then(
		function () {
			res.send("success");
		},
		function () {
			res.send("error");
		}
	);
});

//get follower 暫時不需要用
app.post('/api/getFollowList', function(req, res){
	var userID = req.body.userID;
	
	CLOUD.getFollowList(userID).then(
		function (users) {
			var foluser = users[0].get("Following");
			console.log("追隨的人(1):"+foluser[0].get("displayName"));
			console.log("擁有者:"+users[0].get("displayName"));
			res.send("success");
		},
		function () {
			console.log("error");
			res.send("error");
		}
	);
});

app.post('/api/createDream', function(req, res){
	console.log("createDream");
	//要塞預設的none
	var title = req.body.title;
	var description = req.body.description;
	var file = req.body.file;
	var type = req.body.type;
	console.log(type);
	console.log(file);
	res.send("success");
//
//	CLOUD.createDream(title,description,photo,type).then(
//		function () {
//			res.send("success");
//		},
//		function () {
//			res.send("error");
//		}
//	);
});
app.post('/api/delDream', function(req, res){
	var DreamId = req.body.DreamId;
	var ownerId = Parse.User.current().id;

	CLOUD.checkDream(DreamId, ownerId).then(function (dream) {
		CLOUD.delDream(dream).then(function(result){
			//success
			res.send("success");
		},function(error){
			//error
			res.send("error");
		});
	});
});
app.post('/api/chooseBestComment', function(req, res){
	var DreamId = req.body.d_id;
	var CommentId = req.body.c_id;
	CLOUD.chooseBestComment(DreamId, CommentId).then(function () {
		res.send('success');
	});
});
// -------------------API-------------------


// -------------------Function-------------------
app.locals({
  changeType  : function(type) {
  	var result;
	if(type == "travel") {result="旅遊";}
	else if(type == "experience"){result="經驗";}
	else if(type == "adventure"){result="冒險";}
	else if(type == "skill"){result="技能";}
	else if(type == "family"){result="家庭";}
	else{result="其他";}

    return result;
  },
  changeDone  : function(done) {
  	var result;
	if(done == "none") {result="未完成";}
	else if(done == "already"){result="進行中";}
	else if(done == "done"){result="完成！";}
	else{result="未完成";}

    return result;
  },  
  getLocalTime  : function(d) {

    return d.getFullYear() + '年' + (d.getMonth()+1) + '月' + d.getDate() + '日' + d.getHours() + ':' + d.getMinutes();
  },  
  getGender  : function(sex) {
  	var gender;
  	if(sex == "male") gender="男子漢";
  	else if(sex == "female") gender="女人花";
  	else gender="秘密";
    return gender;
  }, 
  //判斷是否已經追蹤過
  isFollow	: function(userId) {
  	var User = Parse.Object.extend("User");
	var query = new Parse.Query(User);
	query.equalTo("objectId", Parse.User.current().id);
	query.include('Following');
	return query.first().then(function(me){
		var following = me.get("Following") || [];
		
		var isfollow = "false";
		for(var i = 0; i<following.length; i++){
			if(following[i].id == userId){
				isfollow = "true";
				break;
			}
		}
		console.log(isfollow);
		return isfollow;
	});
  },

});
// -------------------Function-------------------

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