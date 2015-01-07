(function () {
	var fn = funcs;
	fn.start = start;


	function start() {
		$(document).ready(function () {
			var type_now = "all"; //夢想分類預設值
			var skip_count = 0; //跳過夢想預設值
			var max = 5; //顯示夢想筆數預設值

			var $paperSample = $('.paper').clone();
			var $commentSample = $('.comment-sample').clone();
			getDream(type_now, skip_count);
			Modal.init();

			//轉換夢想
			$("#change_dream").on('click',function() {
				getDream(type_now, skip_count);
			});
			//轉換分類
			$('.type').on('click',function() {
				skip_count = 0;
				type_now = $(this).attr('type');
				//alert(type_now);
				getDream(type_now, skip_count);
			});
			

			function getDream(type, skip) {
				var max_now = max; //當次迴圈要顯示的筆數

				var Dream = Parse.Object.extend("Dream");
				var query = new Parse.Query(Dream);
				query.include('owner');
				query.include('comment');
				query.include('comment.creator');
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

					for (i = 0; i < results.length; i += 1) {
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
							var dream = $self.data('result');

							//發送訊息
							var $sendBtn = $('.send-comment').off('click');
							$sendBtn.on("click", function () {
								$sendBtn.attr('disabled', true);
								var conetnt = $('.comment-area').find('input').val();
								createComment(dream.id, conetnt);
							});
							var addComments = function(){
								var _dream = this;
								var _comments = _dream.get("comment");
								$('.comment-list').empty();
								if(!_comments) return;
								var j, maxJ = _comments.length;
								for(j = 0; j < maxJ; j +=1 ) {
									var _comment = _comments[j];
									var _creator = _comment.get("creator");
									var commentCtn = $commentSample.clone();
									commentCtn.find('.avatar img').attr('src',_creator.get('fbPicture'));
									commentCtn.find('.comment-author a').attr('href', '/other?UserId='+_creator.id).text(_creator.get("displayName"));
									commentCtn.find('.comment-meta').text(_comment.updatedAt.toLocaleString());
									commentCtn.find('.comment-content').text(_comment.get("content"));
									commentCtn.appendTo($('.comment-list'));
								}
							};
							Modal
								.setImgSrcBySelector('.picture img', dream.get("photo").url())
								.setTextByClass('title', dream.get("title"))
								.setTextByClass('description', dream.get("description"))
								.callFunction(addComments, dream)
								.show();
						});
						$paperArea.append($paper.show());
					}
				});
			}
			function createComment(	DreamId, Content) {
				$.ajax({
					url: '/api/createComment',
					type: 'POST',
					data: {
						DreamId: DreamId,
						Content: Content
					}
				}).then(function (results) {
					if(results == 'success')
						successComment();
				});
			}

			function successComment() {
				var content = $('.comment-area').find('input').val();
				$('.comment-area').find('input').val("");
				var commentCtn = $commentSample.clone();
				var user = Parse.User.current();
				commentCtn.find('.avatar img').attr('src',user.get('fbPicture'));
				commentCtn.find('.comment-author a').attr('href', '/other?UserId='+user.id).text(user.get("displayName"));
				commentCtn.find('.comment-meta').text(new Date().toLocaleString());
				commentCtn.find('.comment-content').text(content);
				commentCtn.appendTo($('.comment-list'));
				$('.send-comment').attr('disabled', false);;
			}
		});
	}
})()