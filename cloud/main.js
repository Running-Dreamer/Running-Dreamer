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
		//response.success("dream saved!");
	});

	//user那邊的Dreams關聯要更新
	var query = new Parse.Query(User);
	query.get(ownerID, {
	  success: function(user) {
	    /*//失敗做法
	    var dreamsArr = [];
		dreamsArr.push(dream);
		user.add("Dreams" , dreamsArr);
		user.save();*/
		var relation = user.relation("Dreams");
		relation.add(dream);
		user.save().then(function(){
			response.success("relation success");
		});
		/*//搜尋的方法 成功
			relation.query().find({
			success:function(dream){
				response.success(dream[0].get("Dreams"));
			}
		});*/
	  },
	  error: function(object, error) {
	    // error is a Parse.Error with an error code and description.
	    response.success(error);
	  }
	});

});

