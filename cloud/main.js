require('cloud/app.js');

Parse.Cloud.define("hello", function (request, response) {
	response.success("Hello world!");
});