(function () {
	var fn = funcs;
	fn.start = start;
	
	function start() {
		$(document).ready(function () {

			$('.pencil').on('click', function(){
				Modal.init();
				Modal.show();
			});
			$('#photo').on("change", function(e) {
				var files = e.target.files || e.dataTransfer.files;
				$(this).data('file', files[0]);
			});
			$('#upload').on('click', function() {
					var parseFile = new Parse.File("photo", $('#photo').data('file'));
					parseFile.save().then(function(file){
						var Dream = Parse.Object.extend("Dream");
						var dream = new Dream();
						var User = Parse.Object.extend("User");
						var owner = new User();
						owner.id = Parse.User.current().id;
						dream.set("owner",owner);
						dream.set("title",$('#title').val());
						dream.set("description",$('#description').val());
						dream.set("photo",file);
						dream.set("type",$('#type').val());
						dream.save().then(function(){
							//user那邊的Dreams關聯要更新
							var query = new Parse.Query(User);
							query.get(owner.id, {
							  success: function(user) {						    
								var relation = user.relation("Dreams");
								relation.add(dream);
								user.save().then(function(){
									console.log("relation success");
									alert("新增成功!");
								});								
							  },
							  error: function(object, error) {
							    // error is a Parse.Error with an error code and description.
							    console.log(error);
							    alert("新增失敗..");
							  }
							});
							Modal.hide();
							location.reload();
						});	
									
					});
						
			});

		});
	}
})()
