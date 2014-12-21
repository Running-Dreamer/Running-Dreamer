require('cloud/node_modules/express-ejs-layouts/lib/express-layouts.js');
require('cloud/app.js');

Parse.Cloud.define("hello", function(request, response) {
  response.success("Hello world!");
});
