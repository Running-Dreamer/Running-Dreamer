// 宣告與Cloud Code互動的物件
var cloud = {};

// 定義function(採promise機制)
// 取得使用者的list
cloud.getMyList = function () {
	var userID = Parse.User.current().id;
	var query = new Parse.Query("User");
	query.equalTo("objectId", userID);
	return query.find();
};
cloud.getUserList = function (id) {
	var query = new Parse.Query("User");
	query.equalTo("objectId", id);
	return query.find();
};
cloud.getAllUser = function () {
	var query = new Parse.Query("User");
	return query.find();
};
cloud.sayHello = function () {
	return Parse.Cloud.run('hello', {});
};

// 讓整個app可以用到
exports.getCLOUD = function () {
	return cloud;
};