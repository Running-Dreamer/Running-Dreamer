(function () {
	var fn = funcs;
	fn.start = start;
	
	function start() {
		$(document).ready(function () {

			$('.pencil').on('click', function(){
				Modal.init();
				Modal.show();
			});
					
			$('#upload').on('click', function(){
				Modal.hide();
			});
		});
	}
})()
