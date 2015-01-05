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
	return relation.query().find();
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