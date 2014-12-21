(function () {
	// Initialize Parse
	Parse.initialize("XhswR68mEhMwVnswmQd5Tpkc09XSc6n6snwFm2Rn", "7jF1txHJlMP9bRT9wIUC2qiFwh6jB1ITYQDVoslt");
	// 登入
	window.fbLogin = function () {
		// 透過Parse api來登入以建立Parse User與Facebook User的連結
		Parse.FacebookUtils.logIn('public_profile, email, user_birthday, user_friends', {
			success: function (user) {
				if (!user.existed()) {
					console.debug("User signed up and logged in through Facebook!");
				} else {
					console.debug("User logged in through Facebook!");
				}
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
	};
})()