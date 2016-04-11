(function() {
	var month_day = [31,28,31,30,31,30,31,30,31,30,31,30];
	var week_day = ["星期日","星期一","星期二","星期三","星期四","星期五","星期六"];
	var Calender = function(IDName) {
		this._self_ = document.getElementById(IDName);
		var children = this._self_.childNodes;

		/* this.calHead
		 * this.calBody
		 * this.calFoot
		 */
		for (var i = 0, l = children.length, temp; i < l; i++) {
			temp = children.item(i);
			if (temp.nodeType == 1 && temp.className.indexOf("cal_head") != -1) {
				this.calHead = temp;
			} else if (temp.nodeType == 1 && temp.className.indexOf("cal_body") != -1) {
				this.calBody = temp;
			} else if (temp.nodeType == 1 && temp.className.indexOf("cal_foot") != -1) {
				this.calFoot = temp;
			}
		}
		this.ulList = this.calBody.getElementsByTagName("ul");//cal_list
		this.calDetailNation = getelementsbyclassname(this.calBody, "cal_nation_detail")[0];
		this.calDetailLunar = getelementsbyclassname(this.calBody, "cal_lunar_detail")[0];
		this.initialize();
		window.setInterval(this.autoCountTime(), 1000);
	};

	Calender.prototype = {
		initialize:function() {
			var current = new Date();

			/*--------------cal_head----------------*/
			var head_cur_date = this.calHead.getElementsByTagName("button")[2];
			head_cur_date.innerHTML = format(current, "YYYY年MM月");

			/*--------------cal_body----------------*/
			var dateArr = curArray(new Date());
			for (var i = 1, count = 0, l = this.ulList.length; i < l; i++) {
				for (var j = 0; j < 7; j++) {
					addLi(this.ulList.item(i), dateArr[count]);
					count++;
				}
			}

			/*------------ cal_detail----------------*/
			/*----------cal_detail_nation------------*/				
			var cal_detail_date = getelementsbyclassname(this.calDetailNation, "cal_detail_date")[0];
			var cal_detail_date_day = getelementsbyclassname(this.calDetailNation, "cal_detail_date_day")[0]
			var cal_detail_weekday = getelementsbyclassname(this.calDetailNation, "cal_weekday")[0];
			cal_detail_date.innerHTML = format(current, "YYYY年MM月DD日");
			cal_detail_date_day.innerHTML = current.getDate();
			cal_detail_weekday.innerHTML = week_day[current.getDay()];

			/*----------cal_detail_lunar------------*/
			var cal_detail_lunar = getelementsbyclassname(this.calDetailLunar, "cal_lunar_detail");




			/*--------------cal_foot----------------*/
			var foot_cur_date = this.calFoot.getElementsByTagName("p")[0];
			foot_cur_date.innerHTML = "北京时间：" + format(current, "hh:mm:ss");
			

		},
		autoCountTime:function() {
			var _this_ = this;
			return function() {
				var current = new Date();
				var foot_cur_date = _this_.calFoot.getElementsByTagName("p")[0];
				foot_cur_date.innerHTML ="北京时间：" + format(current, "hh:mm:ss");
			}
			
		}
	}

	//IE8下不支持getElementsByClassname()
	function getelementsbyclassname(element, classname) {
		if (!document.getElementsByClassName) {
			var children = (element || document).getElementsByTagName("*");
			var elements = [];
			for (var i = 0; i < children.length; i++) {
				var classnameArr = [];
				classnameArr = children[i].className.split(' ');
				for (var j = 0; j < classnameArr.length; j++) {
					if (classname == classnameArr[j]) {
						classnameArr.push(children[i]);
						break;
					}
				}
			}
			return elements;
		} else {
			return element.getElementsByClassName(classname);
		}
	}

	//该月有几天
	function daysNum(y, m) {
		if (m == 2) {
			if ((y % 4 == 0 && y % 100 != 0) || (y % 400 == 0)) {
				return month_day[1] + 1;
			}
		}
		return month_day[m - 1];
	}
	//该月日历表数组
	function curArray(d) {
		d.setDate(1);
		var arr = [], lastMD, cur_month, left;
		var year = d.getFullYear(),
			month = d.getMonth() + 1,
			w_day = d.getDay();

		if (month == 1) lastMD = daysNum(year - 1, 12);
		else lastMD = daysNum(year, month - 1);
		cur_month = daysNum(year, month);

		if (w_day == 0) w_day = 7;
		for (left = -(w_day - 2); left <= 0; left++) {
			arr.push(lastMD + left);
		}
		for (var i = 1; i <= cur_month; i++) {
			arr.push(i);
		}
		i = 1;
		while (arr.length != 49) {
			arr.push(i++);
		}
		return arr;
	}

	//添加li
	function addLi(ul, num) {
		var li = document.createElement("li");
		li.innerHTML = num;
		ul.appendChild(li);
	}

	//提供格式化日期
	function format(d, str) {
		var date = {
			"M+": d.getMonth() + 1,
			"D+": d.getDate(),
			"h+": d.getHours(),
			"m+": d.getMinutes(),
			"s+": d.getSeconds()
		};
		if (/(Y+)/.test(str)) {
			str = str.replace(RegExp.$1, (d.getFullYear() + "").substr(4-RegExp.$1.length));
		}
		for (var key in date) {
			if (new RegExp("(" + key + ")").test(str)) {
				str = str.replace(RegExp.$1, date[key]>9? date[key] : ("00" + date[key]).substr((date[key]+"").length));
			}
		}
		return str;
	}
	window["Calender"] = Calender;
})();