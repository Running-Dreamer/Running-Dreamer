(function () {
	fn.start = start;
	
	function start() {
		var $paperArea = $('.paper-area');
		var i, max = 7;
		for(i = 0; i < max; i += 1) {
			var $paper = $('<div class="paper"></div>');
			
			$paper.css({'left': Math.random()*80+"%", 'top': Math.random()*80+"%"});
			$paperArea.append($paper);
		}
	}
})()
