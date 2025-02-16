(function() {
	var month_day = [31,28,31,30,31,30,31,31,30,31,30,31];
	var week_day = ["星期日","星期一","星期二","星期三","星期四","星期五","星期六"];
	var lunar_solarTerm = [
		"小寒","大寒","立春","雨水","驚蟄","春分","清明","穀雨","立夏","小滿","芒種","夏至",
		"小暑","大暑","立秋","處暑","白露","秋分","寒露","霜降","立冬","小雪","大雪","冬至"];
	var lunar_20_C = [
		6.11,20.84,4.6295,18.73,5.63,20.646,5.59,20.888,6.318,21.86,6.5,22.20,
		7.928,23.65,8.35,23.95,8.44,23.822,9.098,24.218,8.218,23.08,7.9,22.60];
	var lunar_21_C = [
		5.4055,20.12,3.87,18.73,5.63,20.646,4.81,20.1,5.52,21.04,5.678,21.37,
		7.108,22.83,7.5,23.13,7.646,23.042,8.318,23.438,7.438,22.36,7.18,21.94];
	var nation_festivals = [
		"0101 元旦",
		"0214 情人節",
		"0308 婦女節","0312 植树节","0315 消费者权益日",
		"0401 愚人节",
		"0501 劳动节","0504 青年节","0512 护士节",
		"0601 儿童节",
		"0701 建党节",
		"0801 建军节",
		"0910 教师节","0928 孔子诞辰",
		"1010 國慶日",
		"1111 复活节",
		"1224 平安夜","1225 圣诞节"];
	var colors = ["#FF6347", "#20B2AA", "#515151", "#008B45"];

	var saveColor = "#008B45";
	var storage = window.localStorage;
	if (storage.getItem("calender_color") != null) {
		saveColor = storage.getItem("calender_color");
	}

	/* 以下数据来源：
	 * 参考自：http://www.weather.gov.hk/gts/time/conversionc.htm
	 * 摘取自：https://github.com/echosoar/gdate/blob/master/0.1.2/gdate_0.1.2.js
	 * 0x ---- ---- ---- ---- ----（从左到右）
	 * 0-3位：判断闰月为大月还是小月，大月为1，小月为0
	 * 4-15位：判断每个月为大月还是小月，大月为1，小月为0
	 * 16-19位：判断是否有闰月，若无闰月则为0，若有闰月，则显示闰月的月份
	 */
	var calender_data = [
		 0x04ae0,0x0a570,0x054d5,0x0d260,0x0d950,0x16554,0x056a0,0x09ad0,0x055d2,0x04ae0,//1901-1910
		 0x0a5b6,0x0a4d0,0x0d250,0x1d255,0x0b540,0x0d6a0,0x0ada2,0x095b0,0x14977,0x04970,//以下数据以此类推
		 0x0a4b0,0x0b4b5,0x06a50,0x06d40,0x1ab54,0x02b60,0x09570,0x052f2,0x04970,0x06566,
		 0x0d4a0,0x0ea50,0x06e95,0x05ad0,0x02b60,0x186e3,0x092e0,0x1c8d7,0x0c950,0x0d4a0,
		 0x1d8a6,0x0b550,0x056a0,0x1a5b4,0x025d0,0x092d0,0x0d2b2,0x0a950,0x0b557,0x06ca0,
		 0x0b550,0x15355,0x04da0,0x0a5d0,0x14573,0x052d0,0x0a9a8,0x0e950,0x06aa0,0x0aea6,
		 0x0ab50,0x04b60,0x0aae4,0x0a570,0x05260,0x0f263,0x0d950,0x05b57,0x056a0,0x096d0,
		 0x04dd5,0x04ad0,0x0a4d0,0x0d4d4,0x0d250,0x0d558,0x0b540,0x0b5a0,0x195a6,0x095b0,
		 0x049b0,0x0a974,0x0a4b0,0x0b27a,0x06a50,0x06d40,0x0af46,0x0ab60,0x09570,0x04af5,
		 0x04970,0x064b0,0x074a3,0x0ea50,0x06b58,0x055c0,0x0ab60,0x096d5,0x092e0,0x0c960,
		 0x0d954,0x0d4a0,0x0da50,0x07552,0x056a0,0x0abb7,0x025d0,0x092d0,0x0cab5,0x0a950,
		 0x0b4a0,0x0baa4,0x0ad50,0x055d9,0x04ba0,0x0a5b0,0x15176,0x052b0,0x0a930,0x07954,
		 0x06aa0,0x0ad50,0x05b52,0x04b60,0x0a6e6,0x0a4e0,0x0d260,0x0ea65,0x0d530,0x05aa0,
		 0x076a3,0x096d0,0x04afb,0x04ad0,0x0a4d0,0x1d0b6,0x0d250,0x0d520,0x0dd45,0x0b5a0,
		 0x056d0,0x055b2,0x049b0,0x0a577,0x0a4b0,0x0aa50,0x1b255,0x06d20,0x0ada0,0x14b63,
		 0x09370,0x049f8,0x04970,0x064b0,0x168a6,0x0ea50,0x06b20,0x1a6c4,0x0aae0,0x0a2e0,
		 0x0d2e3,0x0c960,0x0d557,0x0d4a0,0x0da50,0x05d55,0x056a0,0x0a6d0,0x055d4,0x052d0,
		 0x0a9b8,0x0a950,0x0b4a0,0x0b6a6,0x0ad50,0x055a0,0x0aba4,0x0a5b0,0x052b0,0x0b273,
		 0x06930,0x07337,0x06aa0,0x0ad50,0x14b55,0x04b60,0x0a570,0x054e4,0x0d160,0x0e968,
		 0x0d520,0x0daa0,0x16aa6,0x056d0,0x04ae0,0x0a9d4,0x0a2d0,0x0d150,0x0f252,0x0d520];//2091-2100
 	var lunar_months = ["正","二","三","四","五","六","七","八","九","十","十一","腊"];
 	var lunar_date_first = ["初","十","甘","卅"];
 	var lunar_date_second = ["一","二","三","四","五","六","七","八","九","十"];
 	var lunar_tianGan_y = ["甲","乙","丙","丁","戊","己","庚","辛","壬","癸"];
 	var lunar_diZhi_y = ["子","丑","寅","卯","辰","巳","午","未","申","酉","戌","亥"];
 	var lunar_dizhi_m = ["寅","卯","辰","巳","午","未","申","酉","戌","亥","子","丑"];
 	var lunar_animal =["鼠","牛","虎","兔","龙","蛇","马","羊","猴","鸡","狗","猪"];
	
 	/*------------------------------------calender----------------------------------------------*/
	var Calender = function(IDName) {
		this._self_ = document.getElementById(IDName);
		var _s_ = this;
		this.setting = {
			"width" : "50%", //px || %
			"color" : saveColor //#008B45
		}
		/* this.calHead
		 * this.calBody
		 * this.calFoot
		 */
		var children = this._self_.childNodes;
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
		this.select = new Date();
		this.selectY = document.getElementsByName("cal_head_sel_year")[0];
		this.selectM = document.getElementsByName("cal_head_sel_month")[0];
		this.ulList = this.calBody.getElementsByTagName("ul");//cal_head_list
		this.calDetailNation = getelementsbyclassname(this.calBody, "cal_body_n_detail")[0];
		this.calDetailLunar = getelementsbyclassname(this.calBody, "cal_body_l_detail")[0];
		this.cal_body_ndetail_date = getelementsbyclassname(this.calDetailNation, "cal_body_ndetail_date")[0];
		this.cal_body_ndetail_day_p = getelementsbyclassname(this.calDetailNation, "cal_body_ndetail_day_p")[0]
		this.cal_body_ndetail_weekday = getelementsbyclassname(this.calDetailNation, "cal_body_ndetail_weekday")[0];
		this.cal_body_ndetail_festival = getelementsbyclassname(this.calDetailNation, "cal_body_ndetail_festival")[0];
		this.cal_body_ldetail_date = getelementsbyclassname(this.calDetailLunar, "cal_body_ldetail_date")[0];
		this.cal_body_ldetail_year = getelementsbyclassname(this.calDetailLunar, "cal_body_ldetail_year")[0];
		this.cal_body_ldetail_solar_term = getelementsbyclassname(this.calDetailLunar, "cal_body_ldetail_solar_term")[0];
		this.selectColor = getelementsbyclassname(this.calFoot,"sel_point")[0];
		this.selectColorBlock = getelementsbyclassname(this.calFoot,"select_color")[0];
		this.selectColorBtn = getelementsbyclassname(this.selectColorBlock, "sel_color_btn");

		this.initialize();
		this.setBColor();
		/*为日历上的按钮添加点击事件*/
		getelementsbyclassname(this.calHead, "cal_head_lbtn")[0].onclick = function() {_s_.switchLNMPage("last");_s_.changePage();};
		getelementsbyclassname(this.calHead, "cal_head_nbtn")[0].onclick = function() {_s_.switchLNMPage("next");_s_.changePage();};
		getelementsbyclassname(this.calHead, "cal_head_m_lbtn")[0].onclick = function() {_s_.switchLNMPage("last");_s_.changePage();};
		getelementsbyclassname(this.calHead, "cal_head_m_nbtn")[0].onclick = function() {_s_.switchLNMPage("next");_s_.changePage();};
		getelementsbyclassname(this.calHead, "cal_head_y_lbtn")[0].onclick = function() {_s_.switchLNYPage("last");_s_.changePage();};
		getelementsbyclassname(this.calHead, "cal_head_y_nbtn")[0].onclick = function() {_s_.switchLNYPage("next");_s_.changePage();};
		getelementsbyclassname(this.calHead, "cal_head_b_btn")[0].onclick = function() {_s_.backCurrentDay();_s_.changePage();_s_.selectDay(_s_.select.getDate());};
		this.selectY.onchange = function() {_s_.changePage();};
		this.selectM.onchange = function() {_s_.changePage();};
		var lis = this.ulList.item(1).getElementsByTagName("li");
		for (i = 0, l = lis.length; i < l; i++) {
			lis[i].onclick = function() {
				if (this.style.color != "rgb(153, 153, 153)") {
					_s_.selectDay(parseInt(this.innerHTML));
				} 
			};
		}
		this.selectColor.onclick = function() {
			if (_s_.selectColorBlock.style.display == "none") {
				_s_.selectColorBlock.style.display = "block";
			} else {
				_s_.selectColorBlock.style.display = "none";
			}
		}
		for (i = 0, l = this.selectColorBtn.length; i < l; i++) {
			this.selectColorBtn[i].onclick = function() {
				_s_.setting.color = this.style.backgroundColor;
				_s_.setBColor();
				_s_.selectColor.onclick();
			}
		}
		window.setInterval(this.autoCountTime(), 1000);
		this.setVisible(true);
	};

	/*------------------------------------prototype----------------------------------------------------*/
	Calender.prototype = {
		//初始化整个日历表
		initialize:function() {
			//样式
			this._self_.style.width = this.setting.width;

			var current = new Date();
			/*--------------cal_head----------------*/
			this.selectY.value = current.getFullYear();
			this.selectM.value = current.getMonth() + 1;

			/*--------------cal_body----------------*/
			var dateArr = curArray(new Date());
			for (var count = 0; count < dateArr.length; count++) {
				addLi(this.ulList.item(1), dateArr[count]);
			}
			changeLiColor(this.ulList);
			changeLiColorCur(this.ulList, this.selectY, this.selectM, this.select.getFullYear(), this.select.getMonth() + 1, this.select.getDate(),this.setting.color);

			/*------------ cal_body_detail----------------*/
			/*----------cal_detail_nation------------*/
			this.cal_body_ndetail_date.innerHTML = format(current, "YYYY年MM月DD日");
			this.cal_body_ndetail_day_p.innerHTML = current.getDate();
			this.cal_body_ndetail_weekday.innerHTML = week_day[current.getDay()];
			this.cal_body_ndetail_festival.innerHTML = nationFestival(current);

			/*----------cal_detail_lunar------------*/
			var lunarInfo = lunarDate(new Date());
			this.cal_body_ldetail_date.innerHTML = "农历" + printLunar(lunarInfo);
			this.cal_body_ldetail_year.innerHTML = lunarYearName(lunarInfo.year);
			this.cal_body_ldetail_solar_term.innerHTML = solarTerm(new Date());

			/*--------------cal_foot----------------*/
			var foot_cur_date = this.calFoot.getElementsByTagName("p")[0];
			foot_cur_date.innerHTML = "北京时间：" + format(current, "hh:mm:ss");
			for (var i = 0, l = this.selectColorBtn.length; i < l; i++) {
				this.selectColorBtn[i].style.backgroundColor = colors[i];
			}
		},
		//完成日历表的初始化之后对日历表可视化设置
		setVisible:function(status) {
			if (status) {
				this._self_.style.visibility = "visible";
				return;
			}
			this._self_.style.visibility = "hidden";
		},
		//根据this.setting.color对主色调进行修改
		setBColor:function() {
			var setbcolor = getelementsbyclassname(this._self_, "setBColor");
			for (var i = 0, l = setbcolor.length; i < l; i++) {
				setbcolor[i].style.backgroundColor = this.setting.color;
			}
			changeLiColorCur(this.ulList,this.selectY, this.selectM, this.select.getFullYear(), this.select.getMonth()+1, this.select.getDate(),this.setting.color);
			window.localStorage.setItem("calender_color", this.setting.color);
		},
		//返回更新当前时间信息的函数
		autoCountTime:function() {
			var _this_ = this;
			return function() {
				var current = new Date();
				var foot_cur_date = _this_.calFoot.getElementsByTagName("p")[0];
				foot_cur_date.innerHTML ="北京时间：" + format(current, "hh:mm:ss");
			}	
		},
		//将当前的年月信息进行向上或者向下的月份级修改
		switchLNMPage:function(btnStatus) {
			//上个月或者写个月
			var year = this.selectY.value,
				month =  this.selectM.value - 1;
			if (btnStatus == "last") {
				if (month - 1 < 0) {
					year--;
					month = 11;
				} else {
					month--;
				}
			} else if (btnStatus == "next") {
				if (month + 1 > 11) {
					year++;
					month = 0;
				} else {
					month++;
				}
			}
			this.selectY.value = year;
			this.selectM.value = month + 1;
		},
		//将当前的年月信息进行向上或者向下的年份级修改
		switchLNYPage:function(btnStatus) {
			//上一年或者下一年
			var year = this.selectY.value;
			if (btnStatus == "last") {
				year--;
			} else if (btnStatus == "next"){
				year++;
			}
			if (year > 1900 && year <= 2100) {
				this.selectY.value = year;
			}
		},
		//更新当前显示的日历信息，例如switchLNMPage之后进行调用，进而更新信息
		changePage:function() {
			//通过select上的数据进行更新
			var _s_ = this;
			/*--------------cal_head----------------*/
			var head_cur_date_year = this.selectY.value,
				head_cur_date_month = this.selectM.value;

			/*--------------cal_body----------------*/
			var dateArr = curArray(new Date(head_cur_date_year,head_cur_date_month-1,1));
			var li = this.ulList.item(1).getElementsByTagName("li");
			for (var count = 0; count < dateArr.length; count++) {
				changeLi(li[count], dateArr[count]);
			}
			changeLiColor(this.ulList);
			changeLiColorCur(this.ulList, this.selectY, this.selectM, this.select.getFullYear(), this.select.getMonth()+1, this.select.getDate(),this.setting.color);
		},
		//参数d为当前选择的日期信息（年和月已经选定），更新主体右侧的详细信息块等
		selectDay:function(d) {
			changeLiColorCurOri(this.ulList,this.selectY, this.selectM, this.select.getFullYear(), this.select.getMonth()+1, this.select.getDate());
			this.select.setYear(this.selectY.value);
			this.select.setMonth(this.selectM.value - 1);
			this.select.setDate(d);
			changeLiColorCur(this.ulList,this.selectY, this.selectM, this.select.getFullYear(), this.select.getMonth()+1, this.select.getDate(),this.setting.color);
			/*------------ cal_detail----------------*/
			/*----------cal_detail_nation------------*/
			this.cal_body_ndetail_date.innerHTML = format(this.select, "YYYY年MM月DD日");
			this.cal_body_ndetail_day_p.innerHTML = this.select.getDate();
			this.cal_body_ndetail_weekday.innerHTML = week_day[this.select.getDay()];
			this.cal_body_ndetail_festival.innerHTML = nationFestival(this.select);

			/*----------cal_detail_lunar------------*/
			var lunarInfo = lunarDate(new Date(this.select.getFullYear(),this.select.getMonth(),this.select.getDate()));
			this.cal_body_ldetail_date.innerHTML = "农历" + printLunar(lunarInfo);
			this.cal_body_ldetail_year.innerHTML = lunarYearName(lunarInfo.year);
			this.cal_body_ldetail_solar_term.innerHTML = solarTerm(this.select);
		},
		//对当前保存的选择数据进行修改
		backCurrentDay:function() {
			this.select = new Date();
			this.selectY.value = this.select.getFullYear();
			this.selectM.value = this.select.getMonth() + 1;
		}
	}

	/*--------------------------function-------------------------------------------*/

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
		while (arr.length != 42) {
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
	//修改li
	function changeLi(li, num) {
		li.innerHTML = num;
	}
	//根据日期判断，使用字体颜色区分本月以及上下月的数据信息
	function changeLiColor(ul) {
		var color = 0, last = 2;
		var li = ul.item(1).getElementsByTagName("li");
		for (var i = 0; i < li.length; i++) {
			if (parseInt(li[i].innerHTML) < last) color = !color; 
			if (!color) {
				li[i].style.backgroundColor = "";
				li[i].style.color = "#999";
			} else {
				li[i].style.backgroundColor = "";
				li[i].style.color = "#000";
			}
			last = parseInt(li[i].innerHTML);
		}
	}
	//在点击其他日期前，若当前页面有显示其他的日期信息，要现将其样式清除
	function changeLiColorCurOri(ul, selectY, selectM, y, m, d) {
		if (selectY.value == y && selectM.value == m) {
			var li = ul.item(1).getElementsByTagName("li");
			for (var i = 0; i < li.length; i++) {
				if (parseInt(li[i].innerHTML) == d && li[i].style.color != "rgb(153, 153, 153)") {
					li[i].style.backgroundColor = "";
					li[i].style.color = "#000";
					return;
				}
			}
		}
	}
	//当前为选择信息，改变其样式表示被选中
	function changeLiColorCur(ul, selectY, selectM, y, m, d, color) {
		if (selectY.value == y && selectM.value == m) {
			var li = ul.item(1).getElementsByTagName("li");
			for (var i = 0; i < li.length; i++) {
				if (parseInt(li[i].innerHTML) == d &&(li[i].style.color == "rgb(0, 0, 0)" || li[i].style.color == "rgb(255, 255, 255)")) {
					li[i].style.backgroundColor = color;
					li[i].style.color = "#fff";
					break;
				}
			}
		}
	}
	//国际节假日信息的判断
	function nationFestival(d) {
		var str = "";
		var month = d.getMonth() + 1,
			day = d.getDate(),
			date_str = "";
		if (month < 10) date_str += "0";
		date_str += month;
		if (day < 10) date_str += "0";
		date_str += day;

		for (var i = 0, l = nation_festivals.length; i < l; i++) {
			if (nation_festivals[i].indexOf(date_str) != -1) {
				str = nation_festivals[i].substr(5);
				return str;
			}
		}
		return str;
	}	
	/* 判断当前时间是否有节气
	 * 节气的计算公式：[Y*D+C]-L
	 * 其中，Y表示年代数，D=0.2422，L表示闰年数，C取决于气节和月份
	 * 每个月都有一气一节
	 * 根据月份只需要判断该月的两个节气与当前日期是否一致
	 */
	function solarTerm(d) {
		
		var str = "";
		var year = d.getFullYear(),
			month = d.getMonth(),
			day = d.getDate(),
			L = 0,
			resDay = 0,
			D = 0.2422;
		for (var jie = 2 * month; jie < 2 * (month + 1); jie++) {
			L = Math.floor(year / 4) - 15;
			if (year >= 2000) {//21世纪
				resDay = Math.floor(year * D + lunar_21_C[jie] - L);
				if (resDay == day) {
					str = lunar_solarTerm[jie];
					return str;
				}
			} else {
				resDay = Math.floor(year * D + lunar_20_C[jie] - L);
				if (resDay == day) {
					str = lunar_solarTerm[jie];
					return str;
				}
			}
		}
		return str;
	}

	/*-----------------------------农历---------------------------------*/
	//农历年
	function lunarYear(y) {
		var sum = 348;//按照每个月29天来计算，每个月至少29天
		for (var i = 0x8000; i > 0x8; i >>= 1) {
			sum += (calender_data[y - 1901] & i) ? 1 : 0;
		}
		return (sum + lunarRDays(y));
	}
	//闰月是哪个月份
	function lunarRMonth(y) {
		return (calender_data[y-1901] & 0xf);
	}
	//农历年是否有闰月
	function lunarRDays(y) {
		var run = 0;
		if (calender_data[y-1901] & 0xf) {
			if (calender_data[y-1901] & 0x10000) {
				//大月
				run = 30;
			} else {
				//小月
				run = 29;
			}
		}
		return run;
	}
	//该月是农历哪个月份哪一天，返回文字
	function lunarMD(year, days) {
		var obj = {"r": 0};
		var lunar_r_days = lunarRDays(year),
			lunar_r_month = lunarRMonth(year),
			countDays = 0,
			current_m_days;
		//month
		for (var i = 0x8000, count = 1; i > 0x8; i >>= 1, count++) {
			current_m_days = (calender_data[year - 1901] & i) ? 30 : 29
			countDays += current_m_days;
			if (countDays > days) {
				obj["month"] = count;
				days = days - (countDays - current_m_days);
				break;
			}
			if (lunar_r_month == count) {
				countDays += lunar_r_days;
				if (countDays > days) {
					obj["month"] = count;
					obj["r"] = 1;
					days = days - (countDays - lunar_r_days);
					break;
				}
			}
		}
		obj["day"] = days;
		return obj;
	}
	//返回详细信息的对象obj（用于保存多个信息）
	function lunarDate(d) {
		var obj = {};
		var base = new Date(1901, 1, 19, 0, 0, 0),
			current = d,
			current_y;
		var time = (current - base) / 1000; //ms级别
		var days = Math.floor(time/(24*60*60));

		for (var i = 1901; i <= 2100; i++) {
			current_y = lunarYear(i);
			if (days - current_y > 0) {
				days -= current_y;
			} else {
				break;
			}
		}

		//i days
		var temp = lunarMD(i, days);
		obj["year"] = i;
		obj["month"] = temp.month;
		obj["day"] = temp.day;
		obj["r"] = temp.r;
		return obj;
	}
	//将信息以字符串形式打印并且返回
	function printLunar(obj) {
		var str = "",
			days = obj.day;
		if (obj.r) {
			str += "闰";
		}
		str += lunar_months[obj.month - 1] + "月";
		//day
		if (days == 10) {
			str += lunar_date_first[0] + lunar_date_second[9];
			return str;
		}
		if (days == 20) {
			str += lunar_date_first[2] + lunar_date_second[9];
			return str;
		}
		str += lunar_date_first[Math.floor(days / 10)] + lunar_date_second[days % 10];
		return str;
	}
	//干支纪年的计算
	function lunarYearName(y) {
		var str = "";
		str += lunar_tianGan_y[(y - 1864) % 10];
		str += lunar_diZhi_y[(y - 1864) % 12] + "年 [";
		str += lunar_animal[(y - 1900) % 12] + "年]";
		return str;
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