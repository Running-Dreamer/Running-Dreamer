// 開發模式
var dvm = true;

// -------------------引入所需的檔案-------------------
var express = require('express');
// 引入ejs layout
var expressLayouts = require(dvm?'express-ejs-layouts':'cloud/node_modules/express-ejs-layouts/lib/express-layouts.js');
// -------------------引入所需的檔案-------------------

// -------------------設定app-------------------
var app = express();
// 監聽的port
var port = 8080;
// Specify the folder to find templates
app.set('views', (dvm?'':'cloud/')+'views');
// Set the template engine
app.set('view engine', 'ejs');
// Middleware for reading request body
app.use(express.bodyParser());
// 設定layout為index.ejs
app.set('layout', 'index');
// 使用ejs layout
app.use(expressLayouts);
// 宣告static path來取得css檔案
if(dvm) app.use("/css",express.static(__dirname + "/../public/css"));
// 宣告static path來取得js檔案
if(dvm) app.use("/js",express.static(__dirname + "/../public/js"));
// -------------------設定app-------------------

// -------------------routing-------------------
// home
app.get('/', function(req, res){
  res.render('./pages/home', {title: "HOME"})
});
app.get('/list', function(req, res){
  res.render('./pages/list', {title: "LIST"})
});
// -------------------routing-------------------

// -------------------建立server-------------------
var server = (dvm?app.listen(port):app.listen());
console.log("Server is up on port " + (dvm?server.address().port:"") + "!");
// -------------------建立server-------------------