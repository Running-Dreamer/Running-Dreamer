(function () {
	var fn = funcs;
	fn.start = start;

	function start() {
		// 登入
		$('.facebook').on('click', login);
		var introModal = Modal().init({selector:'.intro-modal'});
		$('.step').on('click', openIntro);

		function login() {
			Parse.FacebookUtils.logIn('public_profile, email, user_birthday, user_friends', {
				success: function (user) {
					console.debug("logIn success");
					if (!user.existed()) {
						console.debug("User signed up and logged in through Facebook!");
					} else {
						console.debug("User logged in through Facebook!");
					}
					// 用FB graph api 去抓user資料
					FB.api('/me', function (response) {
						if (response && !response.error) {
							user.set("displayName", response.name);
							user.set("gender", response.gender);
							user.set("email", response.email);
							user.set("fbLink", response.link);
							user.set("birthday", response.birthday);
							// 抓大頭貼
							FB.api("/me/picture",{"type":"large"}, function (response) {
								if (response && !response.error) {
									user.set("fbPicture", response.data.url);
									user.save(null, {
										success: function (user) {
											console.debug("Successfully update user info!");
											// 傳送session到後端
											var sessionToken = user._sessionToken;
											window.location.href = "/fblogin?session=" + sessionToken;
										},
										error: function (user, error) {
											console.debug("Oops, something went wrong updating user info.");
										}
									});
								}
							});
						} else {
							console.debug("Oops something went wrong with facebook.");
						}
					});
				},
				error: function (user, error) {
					console.debug("User cancelled the Facebook login or did not fully authorize.");
				}
			});
		}
		
		function openIntro () {
			introModal.reset();
			var index = $(this).index();
			if(index == 0) {
				var $img = $('.intro-modal img');
				$img.attr('src','/core/images/intro/intro_1.png');
				var $parent = $img.parent();
				$parent.append($('<span class="add-new-dream">點擊鉛筆新增夢想!!</span>'));
				$parent.append($('<span class="next-intro"><i class="fa fa-arrow-right"></i></span>').on('click', $img, function(e){
					var $img = e.data;
					var $parent = $img.parent();
					$parent.children('.add-new-dream').remove();
					$img.attr('src', '/core/images/intro/intro_2.png');
					$parent.append($('<span class="add-new-dream adjust2">點<br>擊<br>即<br>可<br>快<br>速<br>上<br>傳<br>!!</span>'));
					$(this).remove();
				}));
			}
			if(index == 1) {
				var $img = $('.intro-modal img');
				$img.attr('src','/core/images/intro/intro_3.png');
				var $parent = $img.parent();
				$parent.append($('<span class="add-new-dream">點擊夢想查看詳細資訊!!</span>'));
				$parent.append($('<span class="next-intro"><i class="fa fa-arrow-right"></i></span>').on('click', $img, function(e){
					var $img = e.data;
					var $parent = $img.parent();
					$parent.children('.add-new-dream').remove();
					$img.attr('src', '/core/images/intro/intro_4.png');
					$(this).remove();
				}));
			}
			
			if(index == 2) {
				var $img = $('.intro-modal img');
				$img.attr('src','/core/images/intro/intro_5.png');
				var $parent = $img.parent();
				$parent.append($('<span class="add-new-dream adjust">選擇圓夢最佳留言!!</span>'));
			}
			setTimeout(function(introModal){introModal.show()}, 10, introModal);
		}
	}
})()