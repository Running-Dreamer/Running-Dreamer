(function () {
	// Initialize Parse
	Parse.initialize("XhswR68mEhMwVnswmQd5Tpkc09XSc6n6snwFm2Rn", "7jF1txHJlMP9bRT9wIUC2qiFwh6jB1ITYQDVoslt");
	// 所有全域function
	var fn = window.funcs = {};
	// 全域變數
	var vs = window.rdvs = {};

	// Facebook initialized
	fn.fbInitDone = fbInitDone;

	function fbInitDone() {
		$(document).ready(ready);


		function ready() {
			// 設定menu
			setupMenu();
			// 開始執行主要程式
			if (fn && fn.start) fn.start();

			$(document).unbind('keydown').bind('keydown', function (event) {
				var doPrevent = false;
				if (event.keyCode === 8) {
					var d = event.srcElement || event.target;
					if ((d.tagName.toUpperCase() === 'INPUT' &&
							(
								d.type.toUpperCase() === 'TEXT' ||
								d.type.toUpperCase() === 'PASSWORD' ||
								d.type.toUpperCase() === 'FILE' ||
								d.type.toUpperCase() === 'EMAIL' ||
								d.type.toUpperCase() === 'SEARCH' ||
								d.type.toUpperCase() === 'DATE')
						) ||
						d.tagName.toUpperCase() === 'TEXTAREA') {
						doPrevent = d.readOnly || d.disabled;
					} else {
						doPrevent = true;
					}
				}

				if (doPrevent) {
					event.preventDefault();
				}
			});


			function setupMenu() {
				var $menu = $('.menu-menu');
				var $submenu = $('.menu-submenu');
				$menu.on('mouseenter', function () {
					$submenu.toggleClass('SHOW');
				});
			}

		}
	}
})()