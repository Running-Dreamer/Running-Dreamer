(function () {
	// Initialize Parse
	Parse.initialize("XhswR68mEhMwVnswmQd5Tpkc09XSc6n6snwFm2Rn", "7jF1txHJlMP9bRT9wIUC2qiFwh6jB1ITYQDVoslt");
	// 所有全域function
	window.fn = {};
	
	// Facebook initialized
	fn.fbInitDone = fbInitDone;
	
	function fbInitDone () {
		// 開始執行主要程式
		fn.start();
	}
})()