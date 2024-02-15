import Util from "./src/lib/Util";
import LangString from "./src/lib/LangString";

export function index() {
	let listenUtil, viewUtil;
	let util, langStr;

	init();

	function init() {
		top.util = util = new Util();
		top.langStr = langStr = new LangString();
	
		listenUtil = new ListenCenter();
		viewUtil = new ViewCenter();
	
		listenUtil.addStaticListen();
	}

	function ListenCenter() {
		let self = this;
	
		self.alert_obj = new Object();
	
		self.addMutiListener = util.addMutiListenerDefault.bind(this, "index");
	
		self.addStaticListen = function () {
			self.addMutiListener("onclick", "", "id", util.getSpan(document, "button", "name"), null);
		}
	
		self.listenCenter = function (eventStr, obj) {
			console.log(eventStr, obj ?? "");
	
			let str_arr = eventStr.split("_");
			let eventName = str_arr[0];
			let eventType = str_arr[1];
	
			// 訊息
			if (eventName == "alert") {
				if (self.alert_obj.eventStr) {
					let data = self.alert_obj.data ?? new Object();
					data["confirm"] = (eventType == "chk");
					self.alert_obj.delegate.listenCenter(self.alert_obj.eventStr, data);
				}
	
				self.alert_obj = new Object();
				util.getSpan(document, "alert").style.display = "none";
	
				return;
			}
		}
	}
	
	function ViewCenter() {
		let self = this;
	
		// 提示訊息: 訊息內容, 視窗標題
		top.alertD = function (msg, title) {
			util.getSpan(document, "alert_msg").innerHTML = msg;
			util.getSpan(document, "alert_title").innerHTML = title ?? langStr["alert_title_default"];
			util.getSpan(document, "alert_cxl").style.display = "none";
	
			listenUtil.alert_obj = new Object();
	
			util.getSpan(document, "alert").style.display = "";
			util.getSpan(document, "alert_chk").focus();
		}
	
		// 確認訊息: 訊息內容, 視窗標題, 事件名稱, 事件資料
		top.confirmD = function (msg, title, eventStr, data) {
			util.getSpan(document, "alert_msg").innerHTML = msg;
			util.getSpan(document, "alert_title").innerHTML = title ?? langStr["alert_title_default"];
			util.getSpan(document, "alert_cxl").style.display = "";
	
			listenUtil.alert_obj.eventStr = eventStr;
			listenUtil.alert_obj.data = data;
			listenUtil.alert_obj.delegate = listenUtil;
	
			util.getSpan(document, "alert").style.display = "";
		}
	}
}