(function () {
	window.Modal = {
		// 暫存元素
		cacheEle: {},
		// 初始化
		init: function () {
			var self = this;
			var content = self.cacheEle.content = $('.modal-content').children();
			self.cacheEle.orgcontent = content.clone();
			var modal = self.cacheEle.modal = $('.modal');
			var mask = self.cacheEle.mask = modal.find('.modal-mask');
			var container = self.cacheEle.container = modal.find('.modal-container');
			content.appendTo(container);
			mask.on('click', self, function (e) {
				var self = e.data;
				self.hide();
			});
		},
		// 重置
		reset: function () {
			var self = this;
			self.cacheEle.content.remove();
			self.cacheEle.container.append(self.cacheEle.orgcontent.clone());
		},
		// 隱藏modal
		hide: function () {
			var self = this;
			var modal = self.cacheEle.modal;
			modal.removeClass("SHOW");
			return this;
		},
		// 顯示modal
		show: function () {
			var self = this;
			var modal = self.cacheEle.modal;
			modal.addClass("SHOW");
			return self;
		},
		// 設定有某class元素的text
		setTextByClass: function (className, text) {
			var self = this;
			var eles = self.cacheEle[className] || self.cacheEle.content.find("."+className);
			self.cacheEle[className] = eles;
			var typeOfText = typeof text === "object" ? "array" : "string";
			var i, max = eles.length;
			for(var i = 0; i < max; i += 1) {
				if(typeOfText === "array")
					$(eles[i]).text(text[i]);
				else
					$(eles[i]).text(text);
			}
			return self;
		}
	};
})();