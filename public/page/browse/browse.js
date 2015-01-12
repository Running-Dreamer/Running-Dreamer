//存放位置點
var papers = [];


(function () {
	var fn = funcs;
	var vs = rdvs;
	fn.start = start;


	function start() {
		$(document).ready(function () {
			var type_now = "all"; //夢想分類預設值
			var skip_count = 0; //跳過夢想預設值
			var max = 8; //顯示夢想筆數預設值

			var $paperSample = $('.paper').clone();
			var $commentSample = vs.$commentSample = $('.comment').clone();
			getDream(type_now, skip_count);
			var detailModal = Modal().init();

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
				//清空夢想
				papers.length = 0;
				var max_now = max; //當次迴圈要顯示的筆數

				var Dream = Parse.Object.extend("Dream");
				var query = new Parse.Query(Dream);
				query.include('owner');
				query.include('comment');
				query.notEqualTo("owner", Parse.User.current());
				query.include('comment.creator');
				//如果type不為空 or all 只搜尋那個型別
				if (type != null && type != "all") query.equalTo("type", type);
				if (skip != null) query.skip(skip);

				query.descending("updatedAt").find().then(function (results) {
					var $paperArea = $('.paper-area');
					//$paperArea.empty(); //先清空
                    $paperArea.find('.paper').remove()
					var i;
					if (results.length <= max) {
						max_now = results.length; //如果不到最大筆數 就印他的比數
						skip_count = 0; //印到底了 將skip歸零
					}
					else{
						skip_count = skip_count + max; //將下次要skip的筆數增加
					}

					for (i = 0; i < max_now; i++ ) {
						var result = results[i];
						var $paper = $paperSample.clone();
						var checkPaper = true;
						$paper.find('.title').text(result.get("title"));
						$paper.find('.description').text(result.get("description"));
						$paper.find('img').attr('src', result.get("photo").url());
						$paper.find('.author').text(result.get('owner').get('displayName'));
						$paper.find('.done_status').text(change_done_status(result.get('done')) );
						$paper.data("result", result);
                        //按分類換顏色
                        var type1 = result.get('type');
                        changecolor(type1, $paper);
						//判斷有沒有相碰
						while(checkPaper){
							if(papers.length<1){checkPaper = false;}
                            var X = 0;
                            var Y = 7/24*$paperArea.height();
                            if(i==0){
			                     X=0;
                                 $('.paper').removeClass('fadeInRight fadeInTop fadeInDown fadeInLeft animated').addClass('fadeInRight animated').one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function(){
      $(this).removeClass('fadeInRight animated');
    });
			                 }else if(i==1){
				                    X=X+1/5*$paperArea.width();
				                    Y=Y+1/4*$paperArea.height();
                                    $('.paper').removeClass('fadeInRight fadeInTop fadeInDown fadeInLeft animated').addClass('fadeInRight animated').one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function(){
      $(this).removeClass('fadeInLeft animated');
    });
			                 }else if(i==2){
				                    X=X+1/5*$paperArea.width();
				                    Y=Y-1/6*$paperArea.height();
                                    $('.paper').removeClass('fadeInRight fadeInTop fadeInDown fadeInLeft animated').addClass('fadeInRight animated').one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function(){
      $(this).removeClass('fadeInLeft animated');
    });
			                 }else if(i==3){
				                    X=X+19/48*$paperArea.width();
				                    Y=Y+3/10*$paperArea.height();
                                    $('.paper').removeClass('fadeInRight fadeInTop fadeInDown fadeInLeft animated').addClass('fadeInRight animated').one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function(){
      $(this).removeClass('fadeInRight animated');
    });
			                 }else if(i==4){
				                    X=X+19/48*$paperArea.width();
				                    Y=Y-13/48*$paperArea.height();
                                    $('.paper').removeClass('fadeInRight fadeInTop fadeInDown fadeInLeft animated').addClass('fadeInRight animated').one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function(){
      $(this).removeClass('fadeInRight animated');
    });
                             }else if(i==5){
				                    X=X+3/5*$paperArea.width()
				                    Y=Y+1/4*$paperArea.height();
                                    $('.paper').removeClass('fadeInRight fadeInTop fadeInDown fadeInLeft animated').addClass('fadeInDown animated').one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function(){
      $(this).removeClass('fadeInDown animated');
    });
			                 }else if(i==6){
				                    X=X+3/5*$paperArea.width()
				                    Y=Y-1/6*$paperArea.height();
                                    $('.paper').removeClass('fadeInRight fadeInTop fadeInDown fadeInLeft animated').addClass('fadeInTop animated').one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function(){
      $(this).removeClass('fadeInTop animated');
    });
			                 }else{
				                    X=X+4/5*$paperArea.width();
                                  $('.paper').removeClass('fadeInRight fadeInTop fadeInDown fadeInLeft animated').addClass('fadeInRight animated').one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function(){
      $(this).removeClass('fadeInRight animated');
    });
			                 }
							var j = 0;
							for(var i=0; i<papers.length; i++){
									j++;
								if(papers.length == j)checkPaper = false;
							}
						}
						$paper.css({
							'left': /*randomNumX/100*$paperArea.width()*/ X + "px",
							'top': /*randomNumY/100*$paperArea.height()*/ Y + "px"
						});
						//存絕對位置
						var thisPaper = {"x" : parseFloat($paper.css('left')), "y" : parseFloat($paper.css('top'))};
						papers.push(thisPaper);

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
							var addComments = function () {
								var _dream = this;
								var _comments = _dream.get("comment");
			                    var user = Parse.User.current();
			                    $('.comment-CurrentUser').attr('src', user.get('fbPicture'));								
								$('.comment-list').empty();
								if (!_comments) return;
								var bestComment = _dream.get('bestComment');
								var hasBestComment = false;
								if(bestComment)
									hasBestComment = true;
								var j, maxJ = _comments.length;
								for (j = 0; j < maxJ; j += 1) {
									var _comment = _comments[j];
									var _creator = _comment.get("creator");
									var commentCtn = $commentSample.clone();
									commentCtn.find('.comment-avatar img').attr('src', _creator.get('fbPicture'));
									commentCtn.find('.comment-author a').attr('href', '/other?UserId=' + _creator.id).text(_creator.get("displayName"));
									commentCtn.find('.comment-date').text(_comment.updatedAt.toLocaleString());
									commentCtn.find('.comment-content').text(_comment.get("content"));
									commentCtn.appendTo($('.comment-list'));
									var $bestComment = commentCtn.find('.best-comment');

									if(hasBestComment) {
										if(_comment.get('bestComment')) {
											$bestComment.parent().append($('<i class="fa fa-star"></i>'));
											$bestComment.remove();
										}
										else
											$bestComment.remove()
									}
								}
							};

							detailModal
								.setImgSrcBySelector('.picture img', dream.get("photo").url())
								.setHrefBySelector('.author a', '/other?UserId='+dream.get("owner").id)
								.setTextBySelector('.author a', dream.get("owner").get('displayName'))
								.setTextByClass('title', dream.get("title"))
								.setTextByClass('description', dream.get("description"))
								.setTextByClass('is_done', change_done_status( dream.get("done") ))
								.setTextByClass('type', changeType(dream.get("type")) )        
								.callFunction(addComments, dream)
								.show();
						});
						$paperArea.append($paper.show());
					}
				});
			}
			function change_done_status(isdone) {
				var done_status;
				if(isdone == "none") done_status = "未完成";
				else if(isdone == "already") done_status = "進行中";
				else if(isdone == "done") done_status = "已完成";
				else done_status = "未完成";
				return done_status;
			}
			function changeType(type) {
			  	var result;
				if(type == "travel") {result="旅遊";}
				else if(type == "experience"){result="經驗";}
				else if(type == "adventure"){result="冒險";}
				else if(type == "skill"){result="技能";}
				else if(type == "family"){result="家庭";}
				else{result="其他";}

			    return result;
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
				commentCtn.find('.comment-avatar img').attr('src',user.get('fbPicture'));
				commentCtn.find('.comment-author a').attr('href', '/other?UserId='+user.id).text(user.get("displayName"));
				commentCtn.find('.comment-date').text(new Date().toLocaleString());
				commentCtn.find('.comment-content').text(content);
				commentCtn.appendTo($('.comment-list'));
				$('.send-comment').attr('disabled', false);;
			}
			//是否碰到
			/*function isTouch(x1 , y1 , x2 ,y2){
				var absX = Math.abs(x1-x2) < 180;
				var absY = Math.abs(y1-y2) < 270;
				return (absX && absY);
			}*/
            //夢想分類
            function changecolor(type, $paper){
						$paper.removeClass('ADVEN EXP SKILL TRAV FAMI OTHER');
                        if(type == 'adventure') $paper.addClass('ADVEN');
				        if(type == 'experience') $paper.addClass('EXP');
				        if(type == 'skill') $paper.addClass('SKILL');
				        if(type == 'travel') $paper.addClass('TRAV');
				        if(type == 'family') $paper.addClass('FAMI');
				        if(type == 'others') $paper.addClass('OTHER');
            }
		});
	}
})()
