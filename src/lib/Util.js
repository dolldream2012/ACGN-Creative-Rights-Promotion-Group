let Util = function() {
	let self = this;

	self.eventArr = new Array();

	// 取得元件: document, 名稱, 類型(預設為 id)
	/* tagName:
		未指定: 取得 id = item 的元件
		name: 取得 name = item 的元件
		tag: 取得 tagName = item 的元件
		class: 取得 className = item 的元件
		checkbox: 取得 name = item 的元件中所有被選取的元件
		radio: 取得 name = item 的元件中被選取的元件
	*/
	self.getSpan = function (doc, item, tagName) {
		if (tagName == "tag") {
			return Array.apply(null, doc.getElementsByTagName(item)) ?? null;
		} else if (tagName == "name") {
			return Array.apply(null, doc.getElementsByName(item)) ?? null;
		} else if (tagName == "class") {
			return Array.apply(null, doc.getElementsByClassName(item)) ?? null;
		} else if (tagName == "checkbox") {
			let arr = Array.apply(null, doc.getElementsByName(item));
			arr = arr.filter(function (div) {
				return div.checked;
			});

			return arr ?? null;
		} else if (tagName == "radio") {
			let arr = Array.apply(null, doc.getElementsByName(item));
			arr = arr.filter(function (div) {
				return div.checked;
			});

			return null;
		} else {
			return doc.getElementById(item) ?? null;
		}
	}

	/*/------ 監聽事件 ------/*/
	// 建立監聽事件: 群組, 監聽事件類型, 事件名稱, 元件, 資料, 額外動作
	/* 需在呼叫的層級建立 listenCenter，觸發監聽時會將訊息帶入 listenCenter 處理
		group: 用於區分不同網頁的監聽事件，避免同名事件互相覆寫
		data: 觸發監聽後，帶入 listenCenter 的資料
	*/
	self.addListenerDefault = function (group, act, eventName, div, data, extra_action) {
		if (div[act]) self.removeListener(group, eventName);
		let delegate = this;

		let listenData = new Object();
		listenData.act = act;
		listenData.div = div;
		if (data) listenData.data = data;

		div[act] = function (e) {
			listenData.e = e;

			if (extra_action) extra_action(listenData);
			if (delegate.listenCenter) delegate.listenCenter(eventName, listenData);
		}

		if (!self.eventArr[group]) self.eventArr[group] = new Array();
		self.eventArr[group][eventName] = listenData;
	}

	// 移除監聽事件: 群組, 事件名稱
	self.removeListener = function (group, eventName) {
		if (self.eventArr[group] == null) return;

		if (typeof eventName == "undefined") {
			for (let eventName of self.eventArr[group]) {
				if (div = self.eventArr[group][eventName].div) div[div.act] = null;
				delete self.eventArr[group][eventName];
			}
		} else {
			if (self.eventArr[group][eventName] != null) {
				if (div = self.eventArr[group][eventName].div) div[div.act] = null;
				delete self.eventArr[group][eventName];
			}
		}

		if (self.eventArr[group].length == 0) delete self.eventArr[group];
	}

	// 批次建立監聽事件: 群組, 監聽事件類型, 事件名稱, 事件類別, 元件陣列, 資料, 額外動作
	self.addMutiListenerDefault = function (group, act, eventName, eventType, arr, data, extra_action) {
		for (let div of arr) {
			if (div.getAttribute(eventType)) {
				let eventStr = "";
				if (eventName) {
					eventStr += (eventName.indexOf("data-") > -1) ? div.getAttribute(eventName) ?? "nodata" : eventName;
					eventStr += "_";
				}
				eventStr += div.getAttribute(eventType);

				self.addListenerDefault.call(this, group, act, eventStr, div, data ?? div.getAttribute("data-func"), extra_action);
			}
		}
	}

	// 建立選項監聽事件: 群組, 事件名稱, 事件類別, 元件陣列, 資料
	self.addRadioListenerDefault = function (group, eventName, eventType, arr, data) {
		let extra_action = function (obj) {
			self.setSpanClass(arr, "on", "remove");
			self.setSpanClass(obj.div, "on", "add");

			for (let div of arr) div.checked = false;
			obj.div.checked = true;
		}

		self.addMutiListenerDefault.call(this, group, "onclick", eventName, eventType, arr, data, extra_action);
	}
}

export default Util;