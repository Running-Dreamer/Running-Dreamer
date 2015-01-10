(function () {
    var fn = funcs;
	var vs = rdvs;
    fn.start = start;

    function start() {
        $(document).ready(function () {
			getWeather();
			setInterval(function(){getWeather();},1000*60*10);
			$('#flip_page').turn({}).turn("display", "single");
            var newDreamModal = Modal().init({selector:'.new-dream-modal'});
            var detailModal = Modal().init({selector: '.detail-modal', transition: 'modal-transition-detail', closeByBtn: true});
            var $commentSample = vs.$commentSample = $('.comment').clone();
            var mapDreamIDtoDream = {};
            getAllDreamDetail();
            $('.pencil').on('click', function () {
                newDreamModal.show();
            });
            $('.eraser').on('click', function () {
                $('.delBtn').toggleClass("SHOW");
            });
            $('#photo').on("change", function (e) {
                var files = e.target.files || e.dataTransfer.files;
                $(this).data('file', files[0]);
            });
            $('#upload').on('click', function () {
                $(this).attr('disabled' , 'disabled');

                try{
                    var parseFile = new Parse.File("photo", $('#photo').data('file'));
                    parseFile.save().then(function (file) {
                        var Dream = Parse.Object.extend("Dream");
                        var dream = new Dream();
                        var User = Parse.Object.extend("User");
                        var owner = new User();
                        owner.id = Parse.User.current().id;
                        dream.set("owner", owner);
                        dream.set("title", $('#title').val());
                        dream.set("description", $('#description').val());
                        dream.set("photo", file);
                        dream.set("type", $('#type').val());
                        dream.save().then(function () {
                            //user那邊的Dreams關聯要更新
                            var query = new Parse.Query(User);
                            query.get(owner.id, {
                                success: function (user) {
                                    var relation = user.relation("Dreams");
                                    relation.add(dream);
                                    user.save().then(function () {
                                        console.log("relation success");
                                        alert("新增成功!");
                                        location.reload();
                                    });
                                },
                                error: function (object, error) {
                                    // error is a Parse.Error with an error code and description.
                                    console.log(error);
                                    alert("新增失敗..");
                                }
                            });
                            $(this).removeAttr('disabled');
                            newDreamModal.hide();
                        });

                    });
                }
                catch(e){
                    alert("請選擇照片後再上傳");
                    $(this).removeAttr('disabled');
                }

            });
            $('.detailBtn').on('click', function () {
                var $self = $(this);
                var dream = mapDreamIDtoDream[$self.parent().attr('for')];

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
                    $('.comment-list').empty();
                    if (!_comments) return;
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
                    }
                };
                detailModal
                    .setImgSrcBySelector('.picture', dream.get("photo").url())
                    .setTextByClass('title', dream.get("title"))
                    .setTextByClass('description', dream.get("description"))
                    .callFunction(addComments, dream)
                    .show();
            });


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
                            _jf.flush(); //內容變動後，呼叫此函數刷新字型
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
        });
    }
})()

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