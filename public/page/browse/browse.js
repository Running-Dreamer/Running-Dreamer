$(document).ready(function(){
	getDream("all" , 0);
});


function getDream(type,skip){
	var Dream = Parse.Object.extend("Dream");
	var query = new Parse.Query(Dream);

	//如果type不為空 or all 只搜尋那個型別
	if(type != null && type != "all"){ query.equalTo("type" , type); }	
	if(skip != null){ query.skip(skip); }

	query.find({
		success: function(results){
			var $paperArea = $('.paper-area');
			$paperArea.empty(); //先清空
			var i, max = 7;
			if(results.length < max){ max = results.length; } //如果不到最大筆數 就印他的比數

			for(i = 0; i < max; i += 1) {
				var result = results[i];
				var $paper = $('<div class="paper">標題:'+result.get("title")+'<br/>內容:'+
					result.get("description")+'</div>');		
				$paper.css({'left': Math.random()*80+"%", 'top': Math.random()*80+"%"});
				$paperArea.append($paper);
			}
		},
		error: function(error){
			alert("抓取夢想失敗，請再試一次"+" "+error.message);
		}
	});
}
