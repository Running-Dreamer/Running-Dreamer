(function () {
    var fn = funcs;
	var vs = rdvs;
    fn.start = start;

    function start() {
        $(document).ready(function () {
			getWeather();
            //判斷是否有追隨過
            isFollow();
			setInterval(function(){getWeather();},1000*60*10);
			$('#flip_page').turn({}).turn("display", "single");
            setFlipPage();
            $('.page').css('visibility','visible');
            var uploadModal = Modal().init({selector:'.upload-modal'});
			uploadModal.callFunction(uploadModalEvent, uploadModal);
            var detailModal = Modal().init({selector: '.detail-modal', transition: 'modal-transition-detail', closeByBtn: true});
            var $commentSample = vs.$commentSample = $('.comment').clone();
			var $dreamSample = vs.$dreamSample = $('.dream').first().clone();
            var mapDreamIDtoDream = {};
            getAllDreamDetail();
            $('.pencil').on('click', function () {
                uploadModal.show();
            });
            $('.eraser').on('click', function () {
                $('.delBtn').toggleClass("SHOW");
            });
            $('.detailBtn').on('click', showDetail);
            $('.delBtn').on('click', delDream);
			
			$('.edit').on('click', editDream);
            //測試用follow按紐
            $('#followBtn').on('click', followIt);
            function followIt() { //測試追隨
                $('#followBtn').text('追隨中').attr("disabled","disabled")
                            .removeClass('followBtn');

                var userID = $('#userID').attr('value'); //當下頁面的ID
                //alert(userID);
                $.ajax({
                    url: '/api/followIt',
                    type: 'POST',
                    data: {
                        FollowerId: userID,
                    }
                }).then(function (results) {
                    //if(results == 'success')
                    //alert(results);
                });
            }
			
			function setFlipPage () {
				var height = $('.lines-container').height();
				$('.page').height(height-10);
			}

            /*function getFollowList() { //測試取得追隨list
                $.ajax({
                    url: '/api/getFollowList',
                    type: 'POST',
                    data: {
                        userID: "kV1UdWaGzp", //先塞我的ID
                    }
                }).then(function (results) {
                    //if(results == 'success')
                    alert(results);
                });
            }*/

            //判斷是否有追隨過
			function isFollow(){
                var userId = $('#userID').attr('value');
                if(userId != Parse.User.current.id){
                    var User = Parse.Object.extend("User");
                    var query = new Parse.Query(User);
                    query.equalTo("objectId", Parse.User.current().id);
                    query.include('Following');
                    query.first().then(function(me){
                        var following = me.get("Following") || [];
                        
                        var isfollow = "false";
                        for(var i = 0; i<following.length; i++){
                            if(following[i].id == userId){
                                isfollow = "true";
                                break;
                            }
                        }
                        console.log(isfollow);
                        if(isfollow == "true"){
                            $('#followBtn').text('追隨中').attr("disabled","disabled")
                            .removeClass('followBtn');
                        }
                        else{

                        }
                    });
                }
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
			
			function showDetail () {
                var $self = $(this);
                var dream = mapDreamIDtoDream[$self.closest('.dream').attr('for')];

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
						var $bestComment = commentCtn.find('.best-comment');
						
						if(hasBestComment) {
							if(_comment.get('bestComment')) {
								$bestComment.parent().append($('<i class="fa fa-star"></i>'));
								$bestComment.remove();
							}
							else
								$bestComment.remove()
						}
						else if ($('body').hasClass('home-page')) {
							var data = {c_id: _comment.id, d_id:_dream.id};
							$bestComment.data('data', data);
							$bestComment.removeClass('HIDE').on("click", function(){
								var data = $(this).data('data');
								$.ajax({
									url: '/api/chooseBestComment',
									type: 'POST',
									data: data,
									success: function (result) {
										console.debug(result);
										$(this).parent().append($('<i class="fa fa-star"></i>'));
										$('.comment .best-comment').remove();
									}.bind(this),
									error: function (err) {
										console.debug(err);
									}
								})
							});
						}
//						if(_comment.get(''))
                        commentCtn.appendTo($('.comment-list'));
                    }

                };
				$('.detail-modal').data('dream', dream);
                detailModal
                    .setImgSrcBySelector('.picture img', dream.get("photo").url())
					.setHrefBySelector('.author a', '/other?UserId='+dream.get("owner").id)
					.setTextBySelector('.author a', dream.get("owner").get('displayName'))
                    .setTextByClass('title', dream.get("title"))
                    .setTextByClass('description', dream.get("description"))
                    .setTextByClass('is_done', change_done_status( dream.get("done") ))
                    .setTextByClass('type', changeType(dream.get("type")))
					.changeClassByClass('is_done', 'list-', 'list-'+dream.get("done"))
					.changeClassByClass('type', 'list-', 'list-'+dream.get("type"))
                    .callFunction(addComments, dream)
                    .show();
            }

            function delDream () {
                var $self = $(this);
                var dream = mapDreamIDtoDream[$self.closest('.dream').attr('for')];

                    swal({
                            title: "確定要刪除嗎?",
                            text: "",
                            type: "warning",
                            showCancelButton: true,
                            confirmButtonColor: "#DD6B55",
                            confirmButtonText: "確定",
                            cancelButtonText: "取消",
                            closeOnConfirm: false
                        },
                        function() {
                            $.ajax({
                                url: '/api/delDream',
                                type: 'POST',
                                data: {
                                    DreamId: dream.id
                                }
                            }).then(function (results) {
                                if (results == "success") {
                                    swal("刪除夢想成功~", "", "success")
                                    $self.parent().parent().remove();
                                }
                                else{
                                    swal("刪除夢想失敗...", "", "error")
                                }
                            });
                        }
                    );

            }
			
			function editDream () {
				var $self = $(this);
				var $confirm = $self.siblings('.confirm-edit').removeClass('HIDE');
				var $detailModal = $self.parent();
				var $is_done = $detailModal.find('.is_done');
				var $org_is_done = $is_done.clone();
				var $select = $('<select><option value="none">未完成</option><option value="already">進行中</option><option value="done">已完成</option></select>')
				$is_done.parent().append($select);
				$is_done.remove();
				$confirm.off().on('click', $org_is_done, function(e){
					var $org_is_done = e.data;
					var $self = $(this);
					var $detailModal = $self.parent();
					var $select = $detailModal.find('select');
					var value = $select.val();
					var text = $select.children(':selected').text();
					$org_is_done.text(text);
					$org_is_done.removeClassPrefix('list-').addClass('list-'+value);
					$select.parent().append($org_is_done);
					$select.remove();
					var dream = $detailModal.data('dream');
					dream.set('done', value);
					$('.dream[for='+dream.id+'] .done').text(text).removeClassPrefix('list-').addClass('list-'+value);
					dream.save().then(function(dream){
						$(this).addClass("HIDE");
					}.bind(this));
				});
			}

            function getAllDreamDetail() {
                var dreams = $('.dream');
                var promises = [];
                dreams.each(function () {
                    var $dream = $(this);
                    var dreamID = $dream.attr('for');
                    if (!dreamID) return;
                    var Dream = Parse.Object.extend("Dream");
                    var query = new Parse.Query(Dream);
                    query.equalTo("objectId", dreamID);
                    query.include('owner');
                    query.include('comment');
                    query.include('comment.creator');
                    promises.push(query.first());
                });
                $.when.apply($, promises).then(function () {
                    var i, max = arguments.length;
                    for (i = 0; i < max; i += 1) {
                        var promise = arguments[i];
                        promise.then(function (dream) {
                            mapDreamIDtoDream[dream.id] = dream;
                        });
                    }
                });
            }
			
			function getWeather() {
				navigator.geolocation.getCurrentPosition(function (position) {
					$.simpleWeather({
						location: position.coords.latitude+','+position.coords.longitude,
						woeid: '',
						unit: 'c',
						success: function (weather) {
							var vs = rdvs;
							vs.weather = weather;
							var $weather = $('.weather');
							$weather.children('span').text(weatherCode[weather.code]["CHT"]);
							$weather.children('img').attr('src', weather.thumbnail);
						},
						error: function (error) {
							console.debug("getWeather error");
						}
					});
				}, function(err){
					debugger;
				});
			}
			
			function uploadModalEvent () {
				var self = this;
				var modal = self.modal;
				var $mask = modal.find('.modal-mask');
				var $uploadModal = modal.find('.upload-modal');
				$mask.data('uploadModal', $uploadModal);
				$uploadModal.data('uploadModal', $uploadModal);
				$mask[0].addEventListener('mousewheel', wheelfunc, false);
				$uploadModal[0].addEventListener('mousewheel', wheelfunc, false);
				
				var owner = modal.find('.owner');
				owner.text(Parse.User.current().get('displayName'));
				
				var $title = modal.find('.title');
				var $description = modal.find('.description');

				$title.on('blur', trimText);
				$title.on('keydown', confirmText);
				$description.on('keydown', confirmText);

				var $file = modal.find('#file');
				var $img = modal.find('.picture img');
				$file.data('img', $img);
				$file.on("change", setFile);

				var $type = modal.find('select.type');
				$type.on('change', $uploadModal, changeTagColor);
				
				var $upload = modal.find('.upload');
				$upload.on('click', self, readyToUpload);

				$img.parent().on('click', function(){$('#file').click()});

				function wheelfunc (e) {
					var $self = $(this);
					if(e.target.tagName == 'TEXTAREA')
						return;
					var $uploadModal = $self.data('uploadModal');
					var step = -(e.deltaY / 10);
					if($(window).height() + $uploadModal.offset().top < 250 && step < 0)
						return;
					if($uploadModal.position().top >= 0 && step > 0)
						return;
					$uploadModal.css('top', '+='+step+'px');
				}

				function confirmText (ev) {
					if (ev.which==13){
						$(this).blur();
						return false;
					}
				}

				function trimText (e) {
					var $self = $(this);
					var txt = $self.val()+"";
					var len = calcLength(txt);
					if(len > 20) {
						var str = trimToTheRightSize(txt);
						$self.val(str);
					}

					function calcLength (str) {
						var count = 0;
						for (var i = 0, len = str.length; i < len; i++) {
							count += str.charCodeAt(i) < 256 ? 1 : 2;
						}
						return count;
					}

					function trimToTheRightSize (str) {
						var temp = str.substring(0, str.length - 1);
						var len = calcLength(temp);
						if(len <= 20) {
							return temp;
						} else {
							return trimToTheRightSize(temp);
						}
					}
				}

				function setFile (e) {
					var $self = $(this);
					var files = e.target.files || e.dataTransfer.files;
					$self.data('file', files[0]);

					var reader = new FileReader();
					reader.onload = function (e) {
						var $self = $(this);
						var $img = $self.data('img');
						var imgDURL = e.target.result;
						$img.attr('src', imgDURL);
					}.bind(this);
					reader.readAsDataURL(files[0]);
				}

				function changeTagColor (e) {
					var $self = $(this);
					var value = $self.val();
					var uploadModal = e.data;
					uploadModal.removeClass('ADVEN EXP SKILL TRAV FAMI OTHER');
					if(value == 'adventure') uploadModal.addClass('ADVEN');
					if(value == 'experience') uploadModal.addClass('EXP');
					if(value == 'skill') uploadModal.addClass('SKILL');
					if(value == 'travel') uploadModal.addClass('TRAV');
					if(value == 'family') uploadModal.addClass('FAMI');
					if(value == 'other') uploadModal.addClass('OTHER');
				}

				function readyToUpload (e) {
					var modal = e.data;
					swal({
							title: "確定要上傳嗎?",
							text: "",
							type: "warning",
							showCancelButton: true,
							confirmButtonColor: "#DD6B55",
							confirmButtonText: "確定",
							cancelButtonText: "取消",
							closeOnConfirm: true
						},
						function() {
							var modal = this;
							var content = modal.mapEle['content'];
							var data = {};
							var title = content.find('.title').val();
							var description = content.find('.description').val();
							var file = content.find('#file').data('file') || {base64:defaultPhoto};
							var type = content.find('.type').val() || 'others';
							if(title == "") {
								swal("請輸入標題!!")
								return;
							}
							if(description == "") {
								swal("請輸入敘述!!")
								return;
							}
							// 新增
							var parseFile = new Parse.File("photo", file);
							parseFile.save().then(function (file) {
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
								dream.save().then(function (dream) {
									//user那邊的Dreams關聯要更新
									var query = new Parse.Query(User);
									query.get(owner.id, {
										success: function (user) {
											var relation = user.relation("Dreams");
											relation.add(dream);
											user.save().then(function () {
												console.log("relation success");
												swal("新增夢想成功~", "", "success")
												addDreamToUI(dream);
												modal.reset().hide().callFunction(uploadModalEvent, modal);
											});
										},
										error: function (object, error) {
											// error is a Parse.Error with an error code and description.
											console.log(error);
											swal("新增夢想失敗...", "", "error")
										}
									});
								});
							});
							
						}.bind(modal)
					);
				}
				
				function addDreamToUI (dream) {
					mapDreamIDtoDream[dream.id] = dream;
					$dreamSample.attr('for', dream.id);
					//$dreamSample.find('.delBtn').attr('onclick', 'delDream("'+dream.id+'")');
                    $dreamSample.find('.delBtn').on('click', delDream);
					$dreamSample.find('.dream-title').text(dream.get('title'));
					$dreamSample.find('.detailBtn').on('click', showDetail);
					$('.page.p1').prepend($dreamSample);
				}

			};
        });
    }
})()

/*
function delDream(DreamId) {
    $.ajax({
        url: '/api/delDream',
        type: 'POST',
        data: {
            DreamId: DreamId
        }
    }).then(function (results) {
        alert("刪除成功!");
        location.reload();
    });
}*/

function createComment(	DreamId, Content) {
	$.ajax({
		url: '/api/createComment',
		type: 'POST',
		data: {
			DreamId: DreamId,
			Content: Content
		}
	}).then(function (results) {
//		if(results == 'success')
//			successComment();
	});
	appendCommentToUI();
}

function appendCommentToUI() {
	var vs = rdvs;
	var content = $('.comment-area').find('input').val();
	$('.comment-area').find('input').val("");
	var commentCtn = vs.$commentSample.clone();
	var user = Parse.User.current();
	commentCtn.find('.comment-avatar img').attr('src', user.get('fbPicture'));
	commentCtn.find('.comment-author a').attr('href', '/other?UserId=' + user.id).text(user.get("displayName"));
	commentCtn.find('.comment-date').text(new Date().toLocaleString());
	commentCtn.find('.comment-content').text(content);
	commentCtn.appendTo($('.comment-list'));
	$('.send-comment').attr('disabled', false);
}

(function () {
    $(document).ready(function time() {
            var n = new Date();
            var y = n.getFullYear();
            var m = n.getMonth() + 1;
            var d = n.getDate();
            var h = n.getHours();
            var min = n.getMinutes();
            var s = n.getSeconds();

            h = checkTime(h);
            min = checkTime(min);
            s = checkTime(s);


            document.getElementById("clock").innerHTML = y + "年" + m + "月" + d + "日 " + h + ":" + min + ":" + s;
            //refresh時間
            setTimeout(function () {
                time()
            }, 500);
        });
        //小逾齡多一個玲在前面
        function checkTime(i) {
            if (i < 10) {
                i = "0" + i;
            }
            return i;
        }
})()