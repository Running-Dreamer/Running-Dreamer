$(document).ready(function () {
	getDream("all", 0);
});


function getDream(type, skip) {
	$.ajax({
		url: '/api/getAllBrowseList',
		type: 'POST',
		data: {
			type: type,
			skip: skip
		}
	}).then(function (results) {
		var $paperArea = $('.paper-area');
		$paperArea.empty(); //先清空
		var i, max = 7;
		if (results.length < max) {
			max = results.length;
		} //如果不到最大筆數 就印他的比數

		for (i = 0; i < max; i += 1) {
			var result = results[i];
			var $paper = $('<div class="paper">標題:' + result.title + '<br/>內容:' +
				result.description + '</div>');
			$paper.css({
				'left': Math.random() * 80 + "%",
				'top': Math.random() * 80 + "%"
			});
			$paperArea.append($paper);
		}
	});
}