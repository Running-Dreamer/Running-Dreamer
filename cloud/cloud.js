// 宣告與Cloud Code互動的物件
var cloud = {};

// 定義function(採promise機制)
// 取得使用者
cloud.getMe = function () {
	var userID = Parse.User.current().id;
	var query = new Parse.Query("User");
	query.equalTo("objectId", userID);
	return query.first();
};
// 搜尋某人
cloud.getUser = function (id) {
	var query = new Parse.Query("User");
	query.equalTo("objectId", id);
	return query.first();
};
//搜尋某人的夢想
cloud.getUserDreams = function (user) {
	var relation = user.relation("Dreams");
	return relation.query().descending("createdAt").find();
};
cloud.getAllUser = function () {
	var query = new Parse.Query("User");
	return query.find();
};
cloud.sayHello = function () {
	return Parse.Cloud.run('hello', {});
};
// browse
cloud.getAllBrowseList = function (type, skip) {
	var Dream = Parse.Object.extend("Dream");
	var query = new Parse.Query(Dream);
	query.include('owner');
	//如果type不為空 or all 只搜尋那個型別
	if(type != null && type != "all") query.equalTo("type" , type);
	if(skip != null) query.skip(skip);

	return query.find();
};

// create comment
cloud.createOneComment = function (DreamId, CreatorId, Content) {
	var result = "false";

	var User = Parse.Object.extend("User");
	var owner = new User();
	var Dream = Parse.Object.extend("Dream");
	var dream = new Dream();
	var Comment = Parse.Object.extend("Comment");
	var comment = new Comment();
	owner.id = CreatorId;
	dream.id = DreamId;

	comment.set("content",Content);
	comment.set("belongTo",dream);
	comment.set("creator",owner);
	return comment.save();
	
};
cloud.createComment = function (DreamId, CreatorId, Content) {
	var User = Parse.Object.extend("User");
	var owner = new User();
	var Dream = Parse.Object.extend("Dream");
	var dream = new Dream();
	var Comment = Parse.Object.extend("Comment");
	var comment = new Comment();
	owner.id = CreatorId;
	dream.id = DreamId;
	comment.set("content",Content);
	comment.set("belongTo",dream);
	comment.set("creator",owner);
	return comment.save().then(function(comment){
		return dream.fetch()
	}).then(function(dream){
		var comments = dream.get("comment") || [];
		comments.push(comment);
		dream.set('comment', comments);
		return dream.save();
	});
};
cloud.relationComment = function (DreamId, comment) {

	var Dream = Parse.Object.extend("Dream");
	var dream = new Dream();
	dream.id = DreamId;

	var relation = dream.relation("comments");
	relation.add(comment);
	return dream.save();	
};

//搜尋並確認該筆夢想是否為此人的
cloud.checkDream = function (DreamId , UserId) {
	var User = Parse.Object.extend("User");
	var owner = new User();
	owner.id = UserId;

	var Dream = Parse.Object.extend("Dream");
	var query = new Parse.Query(Dream);	
	query.equalTo("objectId",DreamId);
	query.equalTo("owner",owner);

	return query.first();
};

//follow someone
cloud.followIt = function (FollowerId) {
	console.log("cloud follow");
	var User = Parse.Object.extend("User");
	var follower = new User();
	follower.id = FollowerId;

	var me = Parse.User.current();
	console.log(me.id);
	var following = me.get("Following") || [];
	following.push(follower);
	me.set('Following', following);
	return me.save();	
};


//新增夢想
cloud.createDream = function(title,description,photo,type) {
		//完成度預設為none
		var Dream = Parse.Object.extend("Dream");
		var dream = new Dream();
		var User = Parse.Object.extend("User");
		var owner = new User();
        owner.id = Parse.User.current().id;

		dream.set("owner", owner);
	    dream.set("title", title);
	    dream.set("description", description);
	    dream.set("photo", file);
	    dream.set("type", type);
	    dream.set("done", "none");
	    dream.save().then(function () {
	        //user那邊的Dreams關聯要更新
	        var query = new Parse.Query(User);
	        query.get(owner.id, {
	            success: function (user) {
	                var relation = user.relation("Dreams");
	                relation.add(dream);
	                user.save().then(function () {
	                	console.log("relation success");
	                });
	            },
	            error: function (object, error) {
	                // error is a Parse.Error with an error code and description.
	                console.log(error);
	            }
	        });
	    });
	    return dream;
};

//刪除某筆夢想
cloud.delDream = function (Dream) {
	return Dream.destroy();	
};

// 讓整個app可以用到
exports.getCLOUD = function () {
	return cloud;
};