/*----------------------------------------
stsLib.js
Standard Software Library JavaScript
----------------------------------------
ModuleName:     Web Module
FileName:       stslib_web.js
----------------------------------------
License:        MIT License
All Right Reserved:
    Name:       Standard Software
    URL:        https://www.facebook.com/stndardsoftware/
--------------------------------------
Version:        2017/04/18
//----------------------------------------*/

/*----------------------------------------
	Cookieの書込み読込み処理
機能：	
備考：	
履歴：	
2014/07/16(水)
・	作成
//----------------------------------------*/

//配列を渡すとnameValueに指定した値で保存する
function setCookie(nameValue, arrayValue){
    exp=new Date();
    exp.setTime(exp.getTime()+1000*60*60*24*31);

//	alert('setCookie:\n' + arrayToString(arrayValue, "%00"));
//window.status = encodeURIComponentArrayToString(arrayValue);

    document.cookie = 
        nameValue + "=" + encodeURIComponentArrayToString(arrayValue) + "; " + 
        "expires=" + exp.toGMTString();
}

//nameValueで指定した値があれば配列を返す
function getCookie(nameValue){
    //alert('getCookie:\n'+document.cookie);
    //alert(nameValue);

    var cookieArray = document.cookie.split("; ");
    var cookieString = "";
    i = 0;
    while (cookieArray[i]){
        if (cookieArray[i].substr(0,nameValue.length+1) === (nameValue + "=")){
            cookieString = cookieArray[i].substr(nameValue.length+1,cookieArray[i].length);
            break;
        }
        i++;
    }

    //alert('getCookie:\n'+cookieString);
    return decodeURIComponentStringToArray(cookieString);
};
//----------------------------------------*/

//配列内文字列をencodeURIComponentでエンコードしてから
//接続文字列%00で接続して文字列にする関数
function encodeURIComponentArrayToString(arrayValue) {
    var undefined;
    if (arrayValue[0] === undefined) { return ""; };
    var delimiter = "%00";
    var result = encodeURIComponent(arrayValue[0]);
    var i = 1;
    while(arrayValue[i] !== undefined) {
        result += delimiter + encodeURIComponent(arrayValue[i]);
        i++;
    }
    return result;
}

function decodeURIComponentStringToArray(value) {
    //alert('getCookie:\n'+cookieString);
    if (value === "") { return ""; }
    var resultArray = value.split("%00");

    var undefined;
    resultArray[0] = decodeURIComponent(resultArray[0]);
    var i = 1;
    while(resultArray[i] !== undefined) {
        resultArray[i] = decodeURIComponent(resultArray[i]);
        i++;
    }
    return resultArray;
}

//----------------------------------------
//◆URLパラメータの受取
//----------------------------------------
function getUrlParameter() {
    var arg = new Object;
    var pair=location.search.substring(1).split('&');
    for(var i=0;pair[i];i++) {
        var kv = pair[i].split('=');
        arg[kv[0]]=kv[1];
    }
    return arg;
}

function test_getUrlParameter() {
    //….html?a=1&b=2
    //というアドレスで受け取ると次のように動作する
    var arg = getUrlParameter();
    check("1", arg.a);
    check("2", arg.b);
}

//----------------------------------------
//◆ループ制御
//----------------------------------------

//----------------------------------------
//・遅延ループ
//----------------------------------------

//初回は即時実行
function intervalForTo1(startIndex,endIndex, interval, func) {
	if (!(startIndex <= endIndex)) { return; }
	var i = startIndex;
	var loopFunc = function () {
		if ( func(i) === false) {
			//戻り値がfalseならループをbreakする
			return;
		}
		if (i < endIndex) {
			setTimeout(loopFunc, interval);
		}
		i++;
	}
	loopFunc();
}

//初回からinterval後の実行
function intervalForTo2(startIndex,endIndex, interval, func) {
	if (!(startIndex <= endIndex)) { return; }
	var i = startIndex;
	var timer = setInterval(function(){
	    if (func(i) === false) {
			clearInterval(timer);
			return;
		}
		if (endIndex <= i){
			clearInterval(timer);
			return;
		}
		i++;
	},interval);
}

//初回は即時実行
function intervalForTo3(startIndex,endIndex, interval, func) {
	if (!(startIndex <= endIndex)) { return; }
	var i = startIndex;
    if (func(i) === false) {
		return;
	}
	var timer = setInterval(function(){
		if (endIndex <= i){
			clearInterval(timer);
			return;
		}
		i++;
	    if (func(i) === false) {
			clearInterval(timer);
			return;
		}
	},interval);
}

function intervalForTo(startIndex,endIndex, interval, func) {
	return intervalForTo1(startIndex, endIndex, interval, func);
	//return intervalForTo2(startIndex, endIndex, interval, func);
	//return intervalForTo3(startIndex, endIndex, interval, func);
}

function test_intervalForTo(intervalForToFunc) {

	var test01 = '';
	intervalForToFunc(5, 10, 500, function(index) {

		test01 = test01 + index.toString();
		//5,6,7,8,9,10 とindexに入ってきてループする

		if (index === 10) {
			//動作確認
			check('5678910', test01);
		}
		if (index === 11) {
			assert('test01');
		}
	});

	var test02 = '';
	intervalForToFunc(5, 10, 500, function(index) {

		test02 = test02 + index.toString();
		if (index === 7) { return true; }
		test02 = test02 + index.toString();
		//7のときだけcontinueしている

		if (index === 10) {
			check('5566788991010', test02);
		}
		if (index === 11) {
			assert('test02');
		}
	});

	var test03 = '';
	intervalForToFunc(5, 10, 500, function(index) {

		test03 = test03 + index.toString();
		if (index === 8) { 
			check('5566778', test03);
			return false; 
		}
		test03 = test03 + index.toString();
		//8でbreakしている

		if (index === 9) {
			assert('test03');
		}
	});

	var test04 = '';
	intervalForToFunc(15, 15, 500, function(index) {

		test04 = test04 + index.toString();

		if (index === 15) {
			check('15', test04);
		}
		if (index === 16) {
			assert('test04');
		}
	});

	intervalForToFunc(20, 19, 500, function(index) {

		alert('test05');

		//呼び出されない
	});
}

function test_intervalForToAll() {
	test_intervalForTo(intervalForTo1);
	test_intervalForTo(intervalForTo2);
	test_intervalForTo(intervalForTo3);
}


//初回は即時実行
function intervalForDownTo1(startIndex,endIndex, interval, func) {
	if (!(endIndex <= startIndex)) { return; }
	var i = startIndex;
	var loopFunc = function () {
		if ( func(i) === false) {
			//戻り値がfalseならループをbreakする
			return;
		}
		if (endIndex < i) {
			setTimeout(loopFunc, interval);
		}
		i--;
	}
	loopFunc();
}

//初回からinterval後の実行
function intervalForDownTo2(startIndex,endIndex, interval, func) {
	if (!(endIndex <= startIndex)) { return; }
	var i = startIndex;
	var timer = setInterval(function(){
	    if (func(i) === false) {
			clearInterval(timer);
			return;
		}
		if (i <= endIndex){
			clearInterval(timer);
			return;
		}
		i--;
	},interval);
}

//初回は即時実行
function intervalForDownTo3(startIndex,endIndex, interval, func) {
	if (!(endIndex <= startIndex)) { return; }
	var i = startIndex;
    if (func(i) === false) {
		return;
	}
	var timer = setInterval(function(){
		if (i <= endIndex){
			clearInterval(timer);
			return;
		}
		i--;
	    if (func(i) === false) {
			clearInterval(timer);
			return;
		}
	},interval);
}

function intervalForDonwTo(startIndex,endIndex, interval, func) {
	return intervalForDownTo1(startIndex, endIndex, interval, func);
	//return intervalForDownTo2(startIndex, endIndex, interval, func);
	//return intervalForDownTo3(startIndex, endIndex, interval, func);
}

function test_intervalForDownTo(intervalForDownToFunc) {

	var test01 = '';
	intervalForDownToFunc(10, 5, 500, function(index) {

		test01 = test01 + index.toString();

		if (index === 5) {
			//動作確認
			check('1098765', test01);
		}
		if (index === 4) {
			assert('test01');
		}
	});

	var test02 = '';
	intervalForDownToFunc(10, 5, 500, function(index) {

		test02 = test02 + index.toString();
		if (index === 7) { return true; }
		test02 = test02 + index.toString();
		//7のときだけcontinueしている

		if (index === 5) {
			check('1010998876655', test02);
		}
		if (index === 4) {
			assert('test02');
		}
	});

	var test03 = '';
	intervalForDownToFunc(10, 5, 500, function(index) {

		test03 = test03 + index.toString();
		if (index === 8) { 
			check('1010998', test03);
			return false; 
		}
		test03 = test03 + index.toString();
		//8でbreakしている

		if (index === 9) {
			assert('test03');
		}
	});

	var test04 = '';
	intervalForDownToFunc(15, 15, 500, function(index) {

		test04 = test04 + index.toString();

		if (index === 15) {
			check('15', test04);
		}
		if (index === 16) {
			assert('test04');
		}
	});

	intervalForDownToFunc(20, 21, 500, function(index) {

		alert('test05');

		//呼び出されない
	});
}

function test_intervalForDownToAll() {
	test_intervalForDownTo(intervalForDownTo1);
	test_intervalForDownTo(intervalForDownTo2);
	test_intervalForDownTo(intervalForDownTo3);
}


/*----------------------------------------
◇  ver 2014/07/18
・  作成
    setCookie
    getCookie
    encodeURIComponentArrayToString
    decodeURIComponentStringToArray
◇  ver 2015/07/02
    replaceAll
◇  ver 2015/07/31
・  st_jsとして st.js/st_web.js を作成
◇  ver 2017/03/13
・  タイトルヘッダーがなかったので追加
◇  ver 2017/04/17
・  ファイル名変更
◇	ver 2017/04/18
・	getUrlParameter追加
//----------------------------------------*/
