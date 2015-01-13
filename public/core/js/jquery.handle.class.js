$.fn.stripClass = function (partialMatch, endOrBegin) {
	/// <summary>
	/// The way removeClass should have been implemented -- accepts a partialMatch (like "btn-") to search on and remove
	/// </summary>
	/// <param name="partialMatch">the class partial to match against, like "btn-" to match "btn-danger btn-active" but not "btn"</param>
	/// <param name="endOrBegin">omit for beginning match; provide a 'truthy' value to only find classes ending with match</param>
	/// <returns type=""></returns>
	var x = new RegExp((!endOrBegin ? "\\b" : "\\S+") + partialMatch + "\\S*", 'g');
	
	// http://stackoverflow.com/a/2644364/1037948
	this.attr('class', function (i, c) {
		if (!c) return;
		return c.replace(x, '');
	});
	return this;
};

$.fn.removeClassPrefix = function(prefix) {
    this.each(function(i, el) {
        var classes = el.className.split(" ").filter(function(c) {
            return c.lastIndexOf(prefix, 0) !== 0;
        });
        el.className = $.trim(classes.join(" "));
    });
    return this;
};