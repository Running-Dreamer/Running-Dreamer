(function () {
	var fn = funcs;
	fn.start = start;

	function start() {
		$(document).ready(function () {
			var $paperSample = $('.paper').clone();
			getDream("all", 0);
			Modal.init();

			function getDream(type, skip) {
				var Dream = Parse.Object.extend("Dream");
				var query = new Parse.Query(Dream);
				query.include('owner');
				//如果type不為空 or all 只搜尋那個型別
				if (type != null && type != "all") query.equalTo("type", type);
				if (skip != null) query.skip(skip);

				query.find().then(function (results) {
					var $paperArea = $('.paper-area');
					$paperArea.empty(); //先清空
					var i, max = 7;
					if (results.length < max) {
						max = results.length;
					} //如果不到最大筆數 就印他的比數

					for (i = 0; i < max; i += 1) {
						var result = results[i];
						var $paper = $paperSample.clone();
						$paper.find('.title').text(result.get("title"));
						$paper.find('.description').text(result.get("description"));
						$paper.find('img').attr('src', result.get("photo").url());
						$paper.find('.author').text(result.get('owner').get('displayName'));
						$paper.data("result", result);
						$paper.css({
							'left': Math.random() * 80 + "%",
							'top': Math.random() * 80 + "%"
						});
						$paper.on("click", function () {
							var $self = $(this);
							var result = $self.data('result');
							Modal
								.setImgSrcBySelector('.picture img', result.get("photo").url())
								.setTextByClass('title', result.get("title"))
								.setTextByClass('description', result.get("description")).show();
						});
						$paperArea.append($paper.show());
					}
				});
			}
		});
	}
})()