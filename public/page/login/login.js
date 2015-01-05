(function () {
	var fn = funcs;
	fn.start = start;

	function start() {
		// 登入
		$('.facebook').on('click', login);

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
							FB.api("/me/picture", function (response) {
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
	}
})()