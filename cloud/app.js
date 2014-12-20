
// These two lines are required to initialize Express in Cloud Code.
var express = require('express');
var app = express();

// Global app configuration section
//app.set('views', 'cloud/views');  // Specify the folder to find templates
app.set('views', 'views'); // 測試用 deploy前須改回上面那個
app.set('view engine', 'ejs');    // Set the template engine
app.use(express.bodyParser());    // Middleware for reading request body

app.use("/css",express.static(__dirname + "/css")); // 宣告static path來取得css檔案
app.use("/js",express.static(__dirname + "/js")); // 宣告static path來取得js檔案

// This is an example of hooking up a request handler with a specific request
// path and HTTP verb using the Express routing API.
app.get('/hello', function(req, res) {
  res.render('hello', { message: 'Congrats, you just set up your app!' });
});
app.get('/', function(req, res) {
  res.render('./pages/index', { message: 'Congrats, you just set up your app!' });
});
app.get('/about', function(req, res) {
  res.render('./pages/about', { message: 'Congrats, you just set up your app!' });
});

// // Example reading from the request query string of an HTTP get request.
// app.get('/test', function(req, res) {
//   // GET http://example.parseapp.com/test?message=hello
//   res.send(req.query.message);
// });

// // Example reading from the request body of an HTTP post request.
// app.post('/test', function(req, res) {
//   // POST http://example.parseapp.com/test (with request body "message=hello")
//   res.send(req.body.message);
// });

// Attach the Express app to Cloud Code.
//app.listen();
app.listen(8080); // 測試用 deploy前須改回上面那個
console.log("Server is up!");
