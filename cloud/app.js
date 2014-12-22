// 開發模式
var dvm = true;
// -------------------引入所需的檔案-------------------
var express = require('express');
// 引入ejs layout
var expressLayouts = require('cloud/node_modules/express-ejs-layouts/lib/express-layouts.js');
// 引入CLOUD
var CLOUD = require('cloud/cloud.js').getCLOUD();
// -------------------引入所需的檔案-------------------

// -------------------設定app-------------------
var app = express();
// Specify the folder to find templates
app.set('views', 'cloud/views');
// Set the template engine
app.set('view engine', 'ejs');
// Middleware for reading request body
app.use(express.bodyParser());
// 設定layout為index.ejs
app.set('layout', 'index');
// 使用ejs layout
app.use(expressLayouts);
// -------------------設定app-------------------

// -------------------routing-------------------
// home
app.get('/', function (req, res) {
	CLOUD.sayHello().always(function(result){
		res.render('./pages/home', {
			title: result
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

if(dvm) {
	try{
		app.use(express.static(__dirname + '/../public'));
	}catch(e){

	}
	app.listen(3000);
}
else app.listen();
console.log("Server is up!");
// -------------------建立server-------------------