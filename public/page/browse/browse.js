(function () {
	var fn = funcs;
	fn.start = start;


	function start() {
		$(document).ready(function () {
			var type_now = "all"; //夢想分類預設值
			var skip_count = 0; //跳過夢想預設值
			var max = 5; //顯示夢想筆數預設值

			var $paperSample = $('.paper').clone();
			getDream(type_now, skip_count);
			Modal.init();

			//轉換夢想
			$("#change_dream").on('click',function(event) {
				getDream(type_now, skip_count);
			});
			

			function getDream(type, skip) {
				var max_now = max; //當次迴圈要顯示的筆數

				var Dream = Parse.Object.extend("Dream");
				var query = new Parse.Query(Dream);
				query.include('owner');
				//如果type不為空 or all 只搜尋那個型別
				if (type != null && type != "all") query.equalTo("type", type);
				if (skip != null) query.skip(skip);

				query.find().then(function (results) {
					var $paperArea = $('.paper-area');
					$paperArea.empty(); //先清空
					var i;
					if (results.length <= max) {
						max_now = results.length; //如果不到最大筆數 就印他的比數
						skip_count = 0; //印到底了 將skip歸零
					}  
					else{
						skip_count = skip_count + max; //將下次要skip的筆數增加
					}

					for (i = 0; i < max_now; i += 1) {
						var result = results[i];
						var $paper = $paperSample.clone();
						$paper.find('.title').text(result.get("title"));
						$paper.find('.description').text(result.get("description"));
						$paper.find('img').attr('src', result.get("photo").url());
						$paper.find('.author').text(result.get('owner').get('displayName'));
						$paper.data("result", result);
						$paper.css({
							'left': Math.random() * 80 + "%",
							'top': Math.random() * 80 + "%"
						});
						$paper.on("click", function () {
							var $self = $(this);
							var result = $self.data('result');

							//發送訊息
							var $sendBtn = $('.send-comment');
							$sendBtn.on("click", function () {			
								$sendBtn.attr('disabled', true);
								var conetnt = $('.comment-area').find('input').val();
								createComment(result.id, conetnt);
							});

							Modal
								.setImgSrcBySelector('.picture img', result.get("photo").url())
								.setTextByClass('title', result.get("title"))
								.setTextByClass('description', result.get("description")).show();
						});
						$paperArea.append($paper.show());
					}
				});
				

				/*relation失敗
				query.find().then(function (results) {

					var $paperArea = $('.paper-area');
					$paperArea.empty(); //先清空
					var i, max = 7, j = 0;
					if (results.length < max) {
						max = results.length;
					} //如果不到最大筆數 就印他的比數	

					for (i = 0; i < max; i += 1) {
						var result_getComment = results[i];
						//取得Comment
            			var relation = result_getComment.relation("comments");
            			relation.query().find({
            				success:function(comment){
            					results[j].set('comments', comment );
            					j++;
            					if (j == max) {FineDream = results};
            				}
            			});
					}
				}).then(function() {
						query.find().then(function (results) {
							var $paperArea = $('.paper-area');
							$paperArea.empty(); //先清空
							var i, max = 7;
							if (results.length < max) {
								max = results.length;
							} //如果不到最大筆數 就印他的比數

							for (i = 0; i < max; i += 1) {
								var result = results[i];
								var $paper = $paperSample.clone();
								$paper.find('.title').text(result.get("title"));
								$paper.find('.description').text(result.get("description"));
								$paper.find('img').attr('src', result.get("photo").url());
								$paper.find('.author').text(result.get('owner').get('displayName'));
								$paper.data("result", result);
								$paper.css({
									'left': Math.random() * 80 + "%",
									'top': Math.random() * 80 + "%"
								});
								$paper.on("click", function () {
									var $self = $(this);
									var result = $self.data('result');
									Modal
										.setImgSrcBySelector('.picture img', result.get("photo").url())
										.setTextByClass('title', result.get("title"))
										.setTextByClass('description', result.get("description"))
										.setTextByClass('comment', result.get("comments")[0].get("content")).show();
								});
								$paperArea.append($paper.show());
							}

				});*/

			}

		});
	}
})()
//.setTextByClass('comment', result.get("comments")[0].get("content"))   
var resultvar;

function createComment(	DreamId, Content) {
	
	$.ajax({
		url: '/api/createComment',
		type: 'POST',
		data: {
			DreamId: DreamId,
			Content: Content
		}
	}).then(function (results) {
		alert(results);
		successComment();
	});
}

function successComment() {
	var conetnt = $('.comment-area').find('input').val();
	$('.comment-area').find('input').val("");
	$('.comment ul').append("<li>"+conetnt+"</li>")

	$('.send-comment').attr('disabled', false);;
}