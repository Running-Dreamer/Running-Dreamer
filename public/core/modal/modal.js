(function () {
	window.Modal = function() {
		var modal = {
			// 初始化參數
			initParam: {},
			// 暫存元素
			mapEle: {},
			// modal元素
			modal: null,
			// 原始內容
			orgContent: null,
			// 初始化
			init: function (param) {
				var self = this;
				// 初始化參數
				param = self.initParam = param || {};
				// 所要的template selector
				var selector = param.selector || '';
				// SHOW的動畫效果
				var transition = param.transition || '';
				// 由什麼元素關閉
				var closeBy = param.closeByBtn ? '.modal-close' : '.modal-mask';
				// map元素
				var mapEle = {};
				// modal根元素
				var modal = self.modal = self.modal || $('<div class="modal flex-center"><div class="modal-mask"></div><div class="modal-container"><span class="modal-close"></span></div></div>');
				// content容器
				var container = mapEle['container'] = modal.find('.modal-container');
				// template
				var content = mapEle['content'] = self.orgContent ? self.orgContent.clone() : $('.modal-content').children(selector);
				// 將template存起來以供reset
				self.orgContent = content.clone();
				// 將mask暫存
				var mask = mapEle['mask'] || modal.find('.modal-mask');
				// 將關閉按鈕暫存
				var close = mapEle[close] = modal.find(closeBy);
				// 如果是由mask關閉 隱藏close
				if(closeBy == '.modal-mask')
					modal.find('.modal-close').hide();
				// 加入動畫效果
				container.addClass(transition);
				// 將內容插入容器
				content.appendTo(container);
				// 將modal加入footer
				modal.appendTo($('footer'));
				// 綁定關閉事件
				close.off('click').on('click', self, function (e) {
					var self = e.data;
					self.hide();
				});
				// 存mapping表
				self.mapEle = mapEle;
				// 元素存mapping表
				modal.data('mapEle', mapEle);

				return self;
			},
			// 重置
			reset: function () {
				var self = this;
				self.mapEle['content'].remove();
				self.init(self.initParam);
				return self;
			},
			// 隱藏modal
			hide: function () {
				var self = this;
				var modal = self.modal;
				modal.removeClass("SHOW");
				return this;
			},
			// 顯示modal
			show: function () {
				var self = this;
				var modal = self.modal;
				modal.addClass("SHOW");
				return self;
			},
			// 設定有某class元素的text
			setTextByClass: function (className, text) {
				var self = this;
				var eles = self.mapEle['content'].find("." + className);
				var typeOfText = typeof text === "object" ? "array" : "string";
				var i, max = eles.length;
				for (var i = 0; i < max; i += 1) {
					if (typeOfText === "array")
						$(eles[i]).text(text[i]);
					else
						$(eles[i]).text(text);
				}
				return self;
			},
			// 以selector設定img src
			setImgSrcBySelector: function (selector, src) {
				var self = this;
				var eles = self.mapEle['content'].find(selector);
				var i, max = eles.length;
				for (var i = 0; i < max; i += 1) {
					$(eles[i]).attr('src','');
					$(eles[i]).attr('src',src);
				}
				return self;
			},
			// 設定href
			setHrefBySelector: function(selector, url) {
				var self = this;
				var eles = self.mapEle['content'].find(selector);
				var i, max = eles.length;
				for (var i = 0; i < max; i += 1) {
					$(eles[i]).attr('href','');
					$(eles[i]).attr('href',url);
				}
				return self;
			},
			setTextBySelector: function(selector, text) {
				var self = this;
				var eles = self.mapEle['content'].find(selector);
				var i, max = eles.length;
				for (var i = 0; i < max; i += 1) {
					$(eles[i]).text('');
					$(eles[i]).text(text);
				}
				return self;
			},
			// call 傳入的function帶入傳入的參數
			callFunction: function () {
				var self = this;
				var func = arguments[0];
				func.apply(arguments[1]);
				return self;
			}
		};
		return modal;
	};
})();