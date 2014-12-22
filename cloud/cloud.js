// 宣告與Cloud Code互動的物件
var cloud = new Object();

// 定義function(採return http request 接 promise)
cloud.sayHello = function(){
	return Parse.Cloud.run('hello', {});
};

// 讓整個app可以用到
exports.getCLOUD = function () {
	return cloud;
}