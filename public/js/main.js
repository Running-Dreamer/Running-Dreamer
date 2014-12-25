(function () {
	// Initialize Parse
	Parse.initialize("XhswR68mEhMwVnswmQd5Tpkc09XSc6n6snwFm2Rn", "7jF1txHJlMP9bRT9wIUC2qiFwh6jB1ITYQDVoslt");

	// 所有全域function
	window.fn = new Object();

	// FB init完成
	fn.fbInitDone = fbInitDone;
	// 登入
	fn.fbLogin = fbLogin;
	// 將session帶入server
	fn.postFBLogin = postFBLogin;

	function fbInitDone() {
		console.debug("fbInitDone");
		// 檢查是否登入
		FB.getLoginStatus(function (response) {
			console.debug("getLoginStatus");
			if (response.status === 'connected') {
				console.debug("getLoginStatus connected");
				postFBLogin(Parse.User.current());
			} else if (response.status === 'not_authorized') {
				console.debug("getLoginStatus not authorized");
			} else {
				console.debug("getLoginStatus failed");
			}
		});
	}

	function fbLogin() {
		console.debug("fbLogin");
		// 透過Parse api來登入以建立Parse User與Facebook User的連結
		Parse.FacebookUtils.logIn('public_profile, email, user_birthday, user_friends', {
			success: function (user) {
				console.debug("logIn success");
				if (!user.existed()) {
					console.debug("User signed up and logged in through Facebook!");
				} else {
					console.debug("User logged in through Facebook!");
				}
				fn.postFBLogin(user);
				// 用FB graph api 去抓user資料
				FB.api('/me', function (response) {
					if (!response.error) {
						user.set("displayName", response.name);
						user.set("gender", response.gender);
						user.set("email", response.email);
						user.set("fbLink", response.link);
						user.set("birthday", response.birthday);
						user.save(null, {
							success: function (user) {
								console.debug("Successfully update user info!");
							},
							error: function (user, error) {
								console.debug("Oops, something went wrong updating user info.");
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

	function postFBLogin(user) {
		console.debug("postFBLogin -- start");
		var sessionToken = user._sessionToken;
		// Post the login
		$.ajax({
			url: '/fblogin',
			type: 'post',
			// dataType: json,
			data: {
				sessionToken: sessionToken
			},
			success: function (data) {
				console.debug("postFBLogin -- post success");
				if (data.status === 200) {
					console.debug("Facebook login success.");
					window.location.href = "/";
				}
				// If an error, show the prompt
				if (data.errorCode === 101) {
					console.debug("Facebook login error.");
				}

			},
			error: function (error) {
				console.debug("postFBLogin -- post error");

			}
		});
	}
})()