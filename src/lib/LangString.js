let LangString = function(langx) {
	let langStr = new Object();
	langx = langx ?? top.langx ?? "zh-tw";

	if (langx == "zh-tw") {
		// index
		langStr["alert_title_default"] = "系統訊息";
	} else if (langx == "en-us") {

	}

	return langStr;
}

export default LangString;