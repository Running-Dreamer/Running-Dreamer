require('cloud/app.js');

Parse.Cloud.define("hello", function (request, response) {
	response.success("Hello world!");
});

Parse.Cloud.define("getMyList", function (request, response) {
	var userID = request.params.userID;
	response.success(userID);
});

Parse.Cloud.define("adminNewDream", function (request, response) {
	var params = request.params;
	var ownerID = params.ownerID;
	var title = params.title;
	var description = params.description;
	var photo = params.photo;
	var type = params.type;
	var Dream = Parse.Object.extend("Dream");
	var dream = new Dream();
	var User = Parse.Object.extend("User");
	var owner = new User();
	owner.id = ownerID;
	dream.set("owner",owner);
	dream.set("title",title);
	dream.set("description",description);
	dream.set("photo",photo);
//	dream.set("type",type);
	dream.save().then(function(){
		response.success("dream saved!");
	});
});
