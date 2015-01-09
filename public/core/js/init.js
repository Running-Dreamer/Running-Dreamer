(function () {
	// Initialize Parse
	Parse.initialize("XhswR68mEhMwVnswmQd5Tpkc09XSc6n6snwFm2Rn", "7jF1txHJlMP9bRT9wIUC2qiFwh6jB1ITYQDVoslt");
	// 所有全域function
	var fn = window.funcs = {};
	// 全域變數
	var vs = window.rdvs = {};
	
	// Facebook initialized
	fn.fbInitDone = fbInitDone;
	
	function fbInitDone () {
		// 設定menu
		setupMenu();
		// 開始執行主要程式
		if(fn && fn.start) fn.start();
		
		
		function setupMenu () {
			var $menu = $('.menu-menu');
			var $submenu = $('.menu-submenu');
			$menu.on('mouseenter',function(){
				$submenu.toggleClass('SHOW');
			});
		}
	}
})()