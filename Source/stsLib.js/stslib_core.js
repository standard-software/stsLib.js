/*----------------------------------------
stsLib.js
Standard Software Library JavaScript
----------------------------------------
ModuleName:     Core Module
FileName:       stslib_core.js
----------------------------------------
License:        MIT License
All Right Reserved:
	Name:       Standard Software
	URL:        https://www.facebook.com/stndardsoftware/
--------------------------------------
Version:        2017/04/25
//----------------------------------------*/

var stsLib = stsLib || {};
stsLib.String = {

	test: function() {
		this.test_isInclude();
		this.test_indexOfFirst();
		this.test_indexOfLast();
	},

	isInclude: function(str, value) {
		if (value === '') { return false }
		return (0 <= str.indexOf(value))
	},

	test_isInclude: function() {
		check(true, this.isInclude('abc', 'a'));
		check(true, this.isInclude('abc', 'b'));
		check(true, this.isInclude('abc', 'c'));
		check(false,this.isInclude('abc', 'd'));
		check(false,this.isInclude('abc', ''));
		check(false,this.isInclude('', 'a'));
	},

	indexOfFirst: function(str, value) {
		if (value === '') { return -1 }
		return str.indexOf(value);
	},

	test_indexOfFirst: function() {
		check(-1, this.indexOfFirst('abc', 'd'));
		check( 0, this.indexOfFirst('abc', 'a'));
		check( 1, this.indexOfFirst('abc', 'b'));
		check( 2, this.indexOfFirst('abc', 'c'));
		check(-1, this.indexOfFirst('abc', ''));
		check( 0, this.indexOfFirst('abcabc', 'a'));
		check( 1, this.indexOfFirst('abcabc', 'b'));
		check( 2, this.indexOfFirst('abcabc', 'c'));
	},

	indexOfLast: function(str, value) {
		if (value === '') { return -1 }
		return str.lastIndexOf(value);
	},

	test_indexOfLast: function() {
		check(-1, this.indexOfLast('abc', 'd'));
		check( 0, this.indexOfLast('abc', 'a'));
		check( 1, this.indexOfLast('abc', 'b'));
		check( 2, this.indexOfLast('abc', 'c'));
		check(-1, this.indexOfLast('abc', ''));
		check( 3, this.indexOfLast('abcabc', 'a'));
		check( 4, this.indexOfLast('abcabc', 'b'));
		check( 5, this.indexOfLast('abcabc', 'c'));
	},
};

stsLib.string = function(str) {
	var self = {};
	self.isInclude = function(value) {
		return stsLib.String.isInclude(str, value);
	}
	self.indexOfFirst = function(value) {
		return stsLib.String.indexOfFirst(str, value);
	}
	self.indexOfLast = function(value) {
		return stsLib.String.indexOfLast(str, value);
	}
	return self;
};

/*----------------------------------------

	//外部からの呼び出し時は2通りのやり方ができる

	//静的関数的な使い方
	check(true, stsLib.String.isInclude('abc', 'a'));

	//拡張メソッド的な使い方
	var str1 = new stsLib.string('abc');
	check(true, str1.isInclude('abc', 'b'));

	//newしなくてもよい
	var str2 = stsLib.string('abc');
	check(true, str2.isInclude('abc', 'c'));

//----------------------------------------*/



//----------------------------------------
//◆動作確認
//----------------------------------------
function test() {


	stsLib.String.test();

	test_equalOperator();

	test_check();

	test_isNumber();

	test_strCount();

	test_isFirstStr();
	test_includeFirstStr();
	test_excludeFirstStr();
	test_isLastStr();
	test_includeLastStr();
	test_excludeLastStr();

	test_firstStrFirstDelim();
	test_firstStrLastDelim();
	test_lastStrFirstDelim();
	test_lastStrLastDelim();

	test_tagInnerText();
	test_tagOuterText();

	test_trimFirstStrs();
	test_trimLastStrs();

	test_replaceAll();

	test_arrayToString();
	test_stringToArray();

	test_isNullOrUndefined();

	test_arrayValueEqual();
	test_arrayIndexOfArray();

	test_TagDelete();
	test_deleteTagInnerText();
	test_deleteTagOutterText();

	test_angleRelative();
	test_degreeToRadian();

//    assert(false, "test");

	alert("finish test");
}

//----------------------------------------
//・イコール演算子の挙動
//----------------------------------------
function test_equalOperator() {
	var value;
	value = true;
	check(true , value==true        ,"v01-01");
	//↓boolean型とstring型は比較一致不可能
	check(false, value=="true"      ,"v01-02");
	//↓『+""』を付属して文字列化すれば一致確認OK
	check(true , value+""=="true"   ,"v01-03");
	//↓文字列に『!!』を付属するとtrueが返される
	check(true , value==!!"true"    ,"v01-04");
	check(true , !!value==!!"true"  ,"v01-05");
	//↓boolean型側に『!!』を付属させてもNG
	check(false, !!value=="true"    ,"v01-06");
	check(true , !!value==true      ,"v01-06-02");

	check(false, value==false       ,"v01-07");
	check(false, value=="false"     ,"v01-08");
	check(false, value+""=="false"  ,"v01-09");
	//↓文字列に『!!』を付属するとtrueが返されるので
	//  判定はできない
	check(true , value==!!"false"   ,"v01-10");
	check(true , !!value==!!"false" ,"v01-11");
	check(false, !!value=="false"   ,"v01-12");
	check(false, !!value==false     ,"v01-13");

	value = false;
	check(false , value==true       ,"v02-01");
	check(false, value=="true"      ,"v02-02");
	check(false, value+""=="true"   ,"v02-03");
	check(false, value==!!"true"    ,"v02-04");
	check(false, !!value==!!"true"  ,"v02-05");
	check(false, !!value=="true"    ,"v02-06");
	check(false, !!value==true      ,"v02-06-02");

	check(true , value==false       ,"v02-07");
	//↓boolean型とstring型は比較一致不可能
	check(false, value=="false"     ,"v02-08");
	//↓『+""』を付属して文字列化すれば一致確認OK
	check(true , value+""=="false"  ,"v02-09");
	//↓文字列に『!!』を付属するとtrueが返されるので
	//  判定はできない
	check(false, value==!!"false"   ,"v02-10");
	check(false, !!value==!!"false" ,"v02-11");
	check(false, !!value=="false"   ,"v02-12");
	check(true , !!value==false     ,"v02-13");

	//というわけで
	//falseの場合は[!!値]では判定できないので
	//!!でキャストできるという噂は嘘

	var s;
	s = "true";
	check(true , s=="true"          ,"V03-01");
	//↓boolean型とstring型は比較一致不可能
	check(false, s==true            ,"V03-01");
	//↓文字列に『!!』を付属するとtrueが返されるので
	//  合っているようにみえるが
	check(true , !!s==true          ,"V03-02");

	check(false, s==false           ,"V03-03");
	//↓文字列に『!!』を付属するとtrueが返されるので
	//  合っているようにみえるが
	check(false, !!s==false         ,"V03-04");

	s = "false";
	check(false, s=="true"          ,"V04-01");
	check(false, s==true            ,"V04-01");
	//↓文字列に『!!』を付属するとtrueが返されるので
	//  falseの場合でもtrueと判定してしまう
	check(true , !!s==true          ,"V04-02");

	check(false, s==false           ,"V04-03");
	//↓文字列に『!!』を付属するとtrueが返されるので
	//  falseの場合でも一致しない
	check(false, !!s==false         ,"V04-04");
}

//----------------------------------------
//◆条件判断
//----------------------------------------

//----------------------------------------
//・Assert関数
//----------------------------------------
function assert(valueTrue, message)
{
	if (isUndefined(message)) {message = "";}
	if (!valueTrue)
	{
		throw new Error("Error:" + message);
	}
}

//----------------------------------------
//・Check関数
//----------------------------------------

function check(a, b, message) {
	var undefined;
	if (a === b) {
		return true;
	} else {
		var messageText = "";
		if (message !== undefined) {
			messageText = "Test:" + message + "\n";
		}
		messageText = messageText +
				"A != B" + "\n" +
				"A = " + a + "\n" +
				"B = " + b;
		alert(messageText);
		return false;
	}
}


function test_check() {
	check(true, "123" === "123");
	check(true, " 123" == 123);
	check(false, " 123" === 123);
}

//----------------------------------------
//◇isUndefined / isNull / isNullOrUndefined
//----------------------------------------
function isUndefined(value)
{
	var undefined;
	return (value === undefined);
}

function isNull(value)
{
	return (value === null);
}

function isNullOrUndefined(value)
{
	return (isNull(value) || isUndefined(value));
}

function test_isNullOrUndefined()
{
	var a1;
	check(true, isUndefined(a1));
	check(false, isNull(a1));
	check(true, isNullOrUndefined(a1));

	var a2 = null;
	check(false, isUndefined(a2));
	check(true, isNull(a2));
	check(true, isNullOrUndefined(a2));

	var a3 = 10;
	check(false, isUndefined(a3));
	check(false, isNull(a3));
	check(false, isNullOrUndefined(a3));
}

//----------------------------------------
//◆型、型変換
//----------------------------------------

function isNumber(value)
{
	if (value === null) return false;
	if (value === "") return false;
	if (value === true) return false;
	if (value === false) return false;

	return !isNaN(value);
}

function test_isNumber() {
	check(true, isNumber(12345), "12345");
	check(true, isNumber(0), "0");
	check(true, isNumber(1), "1");
	check(true, isNumber("12345"), "12345");
	check(true, isNumber("0"), "0");
	check(true, isNumber("1"), "1");
	check(false, isNumber(""), "空文字");
	check(false, isNumber("a1"), "a1");
	check(false, isNumber(true), "true");
	check(false, isNumber(false), "false");
}

//----------------------------------------
//◆数値
//----------------------------------------

//----------------------------------------
//◆角度
//----------------------------------------

//----------------------------------------
//・ラジアンと角度相互変換
//----------------------------------------
function degreeToRadian(value) {
	return value * Math.PI / 180;
}

function radianToDegree(value) {
	return value * 180 / Math.PI;
}

function test_degreeToRadian() {
	check(0, degreeToRadian(0));
	check(Math.PI / 6, degreeToRadian(30));
	check(0, radianToDegree(0));
	check(30, Math.round(radianToDegree(Math.PI / 6)));
}


//----------------------------------------
//・絶対角度から相対角度を求める
//----------------------------------------
//	・	base と target は角度の絶対座標で
//		0度から360度とする。
//		それ以上それ以下でも0-360に丸め込まれる
//	・	戻り値は -180～+180 になる
//----------------------------------------
function angleRelative(base, target) {
	base = base % 360;
	target = target % 360;
	var result = target - base;
	//result は -360～+360になる
	if (180 < result) {
		result = result -360;
	} else if (result < -180) {
		result = result + 360;
	}
	return result;
}

function test_angleRelative() {
	check(10, angleRelative(5, 15));
	check(-10, angleRelative(15, 5));

	check(90, angleRelative(90, 180));
	check(180, angleRelative(90, 270));
	check(180, angleRelative(0, 180));

	check(-179, angleRelative(0, 181));
	check(179, angleRelative(181, 0));
	check(-179, angleRelative(179, 0));
}

//----------------------------------------
//◆配列処理
//----------------------------------------

//----------------------------------------
//・配列の値で比較する関数
//----------------------------------------

function arrayEqualArray(value1, value2)
{
	assert(Array.isArray(value1));
	assert(Array.isArray(value2));

	return value1.toString() === value2.toString();
}

function test_arrayValueEqual()
{
	var a1 = [1, 2, 3];
	var a2 = [1, 2, 3];

	check(false, a1 == a2);
	check(false, a1 === a2);

	check(true, arrayEqualArray(a1, a2));
}

//----------------------------------------
//・配列の値で比較して出力するindexOf
//----------------------------------------
function arrayIndexOfArray(arrayList, arrayValue)
{
	assert(Array.isArray(arrayList));
	assert(Array.isArray(arrayValue));

	for (var i = 0; i <= arrayList.length - 1; i++)
	{
		if (arrayEqualArray(arrayList[i], arrayValue))
		{
			return i;
		}
	}
	return -1;
}

function test_arrayIndexOfArray()
{
	var arrayList = [];
	arrayList.push([1,1,1]);
	arrayList.push([2,2,2]);
	arrayList.push([3,3,3]);

	var a1 = [1, 2, 3];
	check(-1, arrayIndexOfArray(arrayList, a1));

	a1 = [1, 1, 1];
	check(0, arrayIndexOfArray(arrayList, a1));
	a1 = [2, 2, 2];
	check(1, arrayIndexOfArray(arrayList, a1));
	a1 = [3, 3, 3];
	check(2, arrayIndexOfArray(arrayList, a1));
}

//----------------------------------------
//◇配列文字列変換
//----------------------------------------

function arrayToString(arrayValue, delimiter) {
	var undefined;
	if (arrayValue[0] === undefined) { return ""; };
	if (delimiter === undefined) {delimiter = ""};
	var result = arrayValue[0];
	var i = 1;
	while(arrayValue[i] !== undefined) {
		result += delimiter + arrayValue[i];
		i++;
	}
	return result;
}
function test_arrayToString(){
	var array01 = new Array();
	array01[0] = "abc";
	array01[1] = "def";
	check("abc-def", arrayToString(array01, "-"));

	var array02 = new Array("123", "456");
	check("123_456", arrayToString(array02, "_"));
}

function stringToArray(value, delimiter) {
	return value.split(delimiter);
}
function test_stringToArray(){
	var array03 = stringToArray("ABC/DEF", "/");
	check("ABC", array03[0]);
	check("DEF", array03[1]);
}



//----------------------------------------
//◆文字列処理
//----------------------------------------

//----------------------------------------
//・IsIncludeStr
//----------------------------------------
function isIncludeStr(str, subStr)
{
	return (0 <= str.indexOf(subStr))
}

//----------------------------------------
//・値が空文字の場合だけ別の値を返す関数
//----------------------------------------
function ifEmptyStr(value , EmptyStrCaseValue) {
	var result = ""
	if (value == "") {
		result = EmptyStrCaseValue
	} else {
		result = value
	}
	return result
}

//----------------------------------------
//・StrCount
//----------------------------------------
function strCount(str, subStr) {
	var result = 0;
	var index = 0;
	do {
		index = str.indexOf(subStr, index)
		if (index === -1) break;
		index = index + subStr.length;
		result++
	} while (true)
	return result;
}

function test_strCount() {
	check(3, strCount("123123123", "1"),    "A");
	check(3, strCount("123123123", "2"),    "B");
	check(3, strCount("123123123", "3"),    "C");
	check(3, strCount("123123123", "12"),   "D");
	check(2, strCount("123123123", "31"),   "E");
	check(6, strCount("AAAAAA", "A"),       "F");
	check(3, strCount("AAAAAA", "AA"),      "G");
}

//----------------------------------------
//◇First / Last
//----------------------------------------

//----------------------------------------
//・FirstStr
//----------------------------------------
function isFirstStr(str , subStr) {
	if (subStr === "") return false;
	if (str === "") return false;
	if (str.length < subStr.length) return false;

	if (str.indexOf(subStr) === 0) {
		return true;
	} else {
		return false;
	}
}

function test_isFirstStr() {
	check(true, isFirstStr("12345", "1"), "A");
	check(true, isFirstStr("12345", "12"), "B");
	check(true, isFirstStr("12345", "123"), "C");
	check(false, isFirstStr("12345", "23"), "D");
	check(false, isFirstStr("", "34"), "E");
	check(false, isFirstStr("12345", ""), "F");
	check(false, isFirstStr("123", "1234"), "G");
}

function includeFirstStr(str, subStr) {
	if (isFirstStr(str, subStr)) {
		return str;
	} else {
		return subStr + str;
	};
}

function test_includeFirstStr() {
	check("12345", includeFirstStr("12345", "1"));
	check("12345", includeFirstStr("12345", "12"));
	check("12345", includeFirstStr("12345", "123"));
	check("2312345", includeFirstStr("12345", "23"));
}

function excludeFirstStr(str, subStr) {
	if (isFirstStr(str, subStr)) {
		return str.substring(subStr.length);
	} else {
		return str;
	};
}

function test_excludeFirstStr() {
	check("2345", excludeFirstStr("12345", "1"));
	check("345", excludeFirstStr("12345", "12"));
	check("45", excludeFirstStr("12345", "123"));
	check("12345", excludeFirstStr("12345", "23"));
}

//----------------------------------------
//・FirstText
//----------------------------------------
//   ・  大小文字を区別せずに比較する
//----------------------------------------
function isFirstText(str , subStr) {
	return isFirstStr(str.toLowerCase(), subStr.toLowerCase())
}

function includeFirstText(str , subStr) {
	if (isFirstText(str, subStr)) {
		return str;
	} else {
		return subStr + str;
	}
}

function excludeFirstText(str, subStr) {
	if (isFirstText(str, subStr)) {
		return str.substring(subStr.length);
	} else {
		return str;
	}
}

//----------------------------------------
//・LastStr
//----------------------------------------
function isLastStr(str, subStr) {
	if (subStr === "") return false;
	if (str === "") return false;
	if (str.length < subStr.length) return false;

	if (str.substring(str.length - subStr.length) === subStr) {
		return true;
	} else {
		return false;
	}
}

function test_isLastStr() {
	check(true, isLastStr("12345", "5"));
	check(true, isLastStr("12345", "45"));
	check(true, isLastStr("12345", "345"));
	check(false, isLastStr("12345", "34"));
	check(false, isLastStr("", "34"));
	check(false, isLastStr("12345", ""));
	check(false, isLastStr("123", "1234"));
}

function includeLastStr(str, subStr) {
	if (isLastStr(str, subStr)) {
		return str;
	} else {
		return str + subStr;
	}
}

function test_includeLastStr() {
	check("12345", includeLastStr("12345", "5"));
	check("12345", includeLastStr("12345", "45"));
	check("12345", includeLastStr("12345", "345"));
	check("1234534", includeLastStr("12345", "34"));
}

function excludeLastStr(str, subStr) {
	if (isLastStr(str, subStr)) {
		return str.substring(0, str.length - subStr.length);
	} else {
		return str;
	}
}

function test_excludeLastStr() {
	check("1234", excludeLastStr("12345", "5"));
	check("123", excludeLastStr("12345", "45"));
	check("12", excludeLastStr("12345", "345"));
	check("12345", excludeLastStr("12345", "34"));
}

//----------------------------------------
//・LastText
//----------------------------------------
//   ・  大小文字を区別せずに比較する
//----------------------------------------
function isLastText(str, subStr) {
	return isLastStr(str.toLowerCase(), subStr.toLowerCase());
}

function includeLastText(str, subStr) {
	if (isLastText(str, subStr)) {
		return str;
	} else {
		return str + subStr;
	}
}

function excludeLastText(str, subStr) {
	if (isLastText(str, subStr)) {
		return str.substring(0, str.length - subStr.length);
	} else {
		return str;
	}
}

//----------------------------------------
//・BothStr
//----------------------------------------
function includeBothEndsStr(str, subStr) {
	return includeFirstStr(includeLastStr(str, subStr), subStr);
}

function excludeBothEndsStr(str, subStr) {
	return excludeFirstStr(excludeLastStr(str, subStr), subStr);
}

//----------------------------------------
//・BothText
//----------------------------------------
//   ・  大小文字を区別せずに比較する
//----------------------------------------
function includeBothEndsText(str, subStr) {
	return includeFirstText(includeLastText(str, subStr), subStr);
}

function ExcludeBothEndsText(str, subStr) {
	return excludeFirstText(excludeLastText(str, subStr), subStr);
}

//----------------------------------------
//◇First / Last Delim
//----------------------------------------

//--------------------------------------
//firstStrFirstDelim
//--------------------------------------
function firstStrFirstDelim(value, delimiter) {
	var result = "";
	var index = value.indexOf(delimiter);
	if (index !== -1) {
		result = value.substring(0, index);
	} else {
		result = value;
	}
	return result;
}

function test_firstStrFirstDelim() {
	check("123", firstStrFirstDelim("123,456", ","));
	check("123", firstStrFirstDelim("123,456,789", ","));
	check("123", firstStrFirstDelim("123ttt456", "ttt"));
	check("123", firstStrFirstDelim("123ttt456", "tt"));
	check("123", firstStrFirstDelim("123ttt456", "t"));
	check("123ttt456", firstStrFirstDelim("123ttt456", ","))
	check("", firstStrFirstDelim(",123,", ","))

	//alert("finish test_firstStrFirstDelim");
}

//----------------------------------------
//・FirstStrLastDelim
//----------------------------------------
function firstStrLastDelim(value, delimiter) {
	var result = "";
	var index = value.lastIndexOf(delimiter);
	if (index !== -1) {
		result = value.substring(0, index);
	} else {
		result = value;
	}
	return result;
}

function test_firstStrLastDelim() {
	check("123", firstStrLastDelim("123,456", ","));
	check("123,456", firstStrLastDelim("123,456,789", ","));
	check("123", firstStrLastDelim("123ttt456", "ttt"));
	check("123t", firstStrLastDelim("123ttt456", "tt"));
	check("123tt", firstStrLastDelim("123ttt456", "t"));
	check("123ttt456", firstStrLastDelim("123ttt456", ","))
	check(",123", firstStrLastDelim(",123,", ","))
	//alert("finish test_firstStrLastDelim");
}

//---------------------------------------s-
//・LastStrFirstDelim
//----------------------------------------
function lastStrFirstDelim(value, delimiter) {
	var result = "";
	var index = value.indexOf(delimiter);
	if (index !== -1) {
		result = value.slice(index + delimiter.length);
	} else {
		result = value;
	}
	return result;
}

function test_lastStrFirstDelim() {
	check("456", lastStrFirstDelim("123,456", ","));
	check("456,789", lastStrFirstDelim("123,456,789", ","));
	check("456", lastStrFirstDelim("123ttt456", "ttt"));
	check("t456", lastStrFirstDelim("123ttt456", "tt"));
	check("tt456", lastStrFirstDelim("123ttt456", "t"));
	check("123ttt456", lastStrFirstDelim("123ttt456", ","))
	check("123,", lastStrFirstDelim(",123,", ","))
	//alert("finish test_lastStrFirstDelim");
}

//----------------------------------------
//・LastStrLastDelim
//----------------------------------------
function lastStrLastDelim(value, delimiter) {
	var result = "";
	var index = value.lastIndexOf(delimiter);
	if (index !== -1) {
		result = value.slice(index + delimiter.length);
	} else {
		result = value;
	}
	return result;
}

function test_lastStrLastDelim() {
	check("456", lastStrLastDelim("123,456", ","));
	check("789", lastStrLastDelim("123,456,789", ","));
	check("456", lastStrLastDelim("123ttt456", "ttt"));
	check("456", lastStrLastDelim("123ttt456", "tt"));
	check("456", lastStrLastDelim("123ttt456", "t"));
	check("123ttt456", lastStrLastDelim("123ttt456", ","))
	check("", lastStrLastDelim(",123,", ","))
	//alert("finish test_lastStrLastDelim");
}

//--------------------------------------
//Tag処理
//--------------------------------------

//----------------------------------------
//・タグの内部文字列
//----------------------------------------
function tagInnerText(text, startTag, endTag) {

	var result
	result = lastStrFirstDelim(text, startTag)
	result = firstStrFirstDelim(result, endTag)
	return result
}

function test_tagInnerText() {
	check("456", tagInnerText("000<123>456<789>000", "<123>", "<789>"), "test01");
	check("456", tagInnerText("<123>456<789>", "<123>", "<789>"), "test02");
	check("456", tagInnerText("000<123>456", "<123>", "<789>"), "test03");
	check("456", tagInnerText("456<789>000", "<123>", "<789>"), "test04");
	check("456", tagInnerText("456", "<123>", "<789>"), "test05");
	check("", tagInnerText("000<123><789>000", "<123>", "<789>"), "test06");

	check("123", tagInnerText("<123>123<789> <123>456<789> <123>789<789>", "<123>", "<789>"));
	var Text = "<123>123<789> <123>456<789> <123>789<789>";
	check("<123>123", tagInnerText(Text, "<456>", "<789>"));
	check("", tagInnerText(Text, "<456>", "<123>"));
	check(Text, tagInnerText(Text, "<321>", "<456>"));
}

//----------------------------------------
//・タグを含んだ内部文字列
//----------------------------------------
function tagOuterText(text, startTag, endTag) {

	var result1;
	var result2;
	result1 = lastStrFirstDelim(text, startTag)
	if (result1 != text) {
		result1 = startTag + result1
	}

	result2 = firstStrFirstDelim(result1, endTag)
	if (result2 != result1) {
		result2 = result2 + endTag
	}
	return result2
}

function test_tagOuterText() {
	check("<123>456<789>", tagOuterText("000<123>456<789>000", "<123>", "<789>"), "test01")
	check("<123>456<789>", tagOuterText("<123>456<789>", "<123>", "<789>"), "test02")
	check("<123>456", tagOuterText("000<123>456", "<123>", "<789>"), "test03")
	check("456<789>", tagOuterText("456<789>000", "<123>", "<789>"), "test04")
	check("456", tagOuterText("456", "<123>", "<789>"), "test05")
}

//--------------------------------------
//◇Trim
//--------------------------------------
function trimFirstStrs(str, trimStrArray) {
	var result = str
	do {
		str = result;
		for (var i = 0; i <= trimStrArray.length - 1; i++) {
			result = excludeFirstStr(result, trimStrArray[i]);
		}
	} while (result !== str)
	return result
}

function test_trimFirstStrs() {
	check("123 ",       trimFirstStrs("   123 ", [" "]))
	check("\t  123 ",   trimFirstStrs("   \t  123 ", [" "]))
	check("123 ",       trimFirstStrs("   \t  123 ", [" ", "\t"]))
}

function trimLastStrs(str, trimStrArray) {
	var result = str
	do {
		str = result;
		for (var i = 0; i <= trimStrArray.length - 1; i++) {
			result = excludeLastStr(result, trimStrArray[i]);
		}
	} while (result !== str)
	return result
}

function test_trimLastStrs() {
	check(" 123",       trimLastStrs(" 123   ", [" "]))
	check(" 456  \t",   trimLastStrs(" 456  \t   ", [" "]))
	check(" 789",       trimLastStrs(" 789  \t   ", [" ", "\t"]))
}

function trimBothEndsStrs(str, trimStrArray) {
	return trimFirstStrs(trimLastStrs(str, trimStrArray), trimStrArray)
}

//--------------------------------------
//◇置き換え処理
//--------------------------------------

//----------------------------------------
//・replaceAll
//----------------------------------------
//  ・  文字列の繰り返し置換
//----------------------------------------
function replaceAll(strBuffer, strBefore, strAfter) {
	var result = strBuffer
	do {
		strBuffer = result;
		result = strBuffer.replace(strBefore, strAfter);
	} while (strBuffer !== result);
		return result;
}

function test_replaceAll() {
		check("AAABBBAAA", replaceAll("123BBB123", "123", "AAA"));
		check("ABBBBBBBA", replaceAll("AAAAAAABBBBBBBAAAAAAA", "AA", "A"));
}

//----------------------------------------
//◇タグ処理
//----------------------------------------

function startTagDelete(value, tag) {
	if (value.indexOf(tag) !== -1) {
		return firstStrFirstDelim(value, tag) + 
			lastStrFirstDelim(value, tag);
	}
	return value;
}

function endTagDelete(value, tag) {
	if (value.lastIndexOf(tag) !== -1) {
		return firstStrLastDelim(value, tag) + 
			lastStrLastDelim(value, tag);
	}
	return value;
}

function test_TagDelete() {
	check("abcdefghi", startTagDelete(endTagDelete("abc<def>ghi", ">"), "<"));
	check("abc><def><ghi", startTagDelete(endTagDelete("a<bc><def><gh>i", ">"), "<"));
	check("abcdefghi", startTagDelete(endTagDelete("abc>def<ghi", ">"), "<"));
	check("abc>def<ghi", startTagDelete(endTagDelete("a<bc>def<gh>i", ">"), "<"));
}

function deleteTagInnerText(text, startTag, endTag) {
	assert((!isNullOrUndefined(text)) );
	assert((!isNullOrUndefined(startTag)) && (startTag !=='') );
	assert((!isNullOrUndefined(endTag)) && (endTag !=='') );
	if (text === '') { return ''; }

	var indexStartTag = text.indexOf(startTag);
	var indexEndTag = text.indexOf(endTag);
	if ((indexStartTag !== -1) 
	&& (indexEndTag !== -1)
	&& (indexStartTag < indexEndTag)) {
		text = 
			firstStrFirstDelim(text, startTag) + startTag + 
			endTag + lastStrFirstDelim(text, endTag) 
	}
	return text;
}

function test_deleteTagInnerText() {
	check('abc<>ghi', deleteTagInnerText('abc<def>ghi', '<', '>'));
}

function deleteTagOutterText(text, startTag, endTag) {
	assert((!isNullOrUndefined(text)) );
	assert((!isNullOrUndefined(startTag)) && (startTag !=='') );
	assert((!isNullOrUndefined(endTag)) && (endTag !=='') );
	if (text === '') { return ''; }

	var indexStartTag = text.indexOf(startTag);
	var indexEndTag = text.indexOf(endTag);
	if ((indexStartTag !== -1) 
	&& (indexEndTag !== -1)
	&& (indexStartTag < indexEndTag)) {
		text = 
			firstStrFirstDelim(text, startTag) +  
			lastStrFirstDelim(text, endTag) 
	}
	return text;
}

function test_deleteTagOutterText() {
	check('abcghi', deleteTagOutterText('abc<def>ghi', '<', '>'));
}

//----------------------------------------
//◆日付時刻処理
//----------------------------------------
//文字列を後方から文字数指定で取得する
function lastStringCount(value, count) {
	return value.substr(value.length - count, count)
}

function format_yyyy_mm_dd(value, delimiter){
	return value.getFullYear() + delimiter +
		lastStringCount("0" + (value.getMonth()+1), 2) + delimiter +
		lastStringCount("0" + value.getDate(), 2);
	//return "123";
}

function format_hh_mm_dd(value, delimiter){
	return value.getHours() + delimiter +
		lastStringCount("0" + value.getMinutes(), 2) + delimiter +
		lastStringCount("0" + value.getSeconds(), 2);
	//return "123";
}

//年齢
function getAgeYearMonthDay(todayDate, birthDate) {

	var birthYear = birthDate.getFullYear();
	var birthMonth = birthDate.getMonth() + 1;
	var birthDay = birthDate.getDate();
	var todayYear = todayDate.getFullYear();
	var todayMonth = todayDate.getMonth() + 1;
	var todayDay = todayDate.getDate();

	//年齢計算
	var diffYear = todayYear - birthYear;
	//過去と同一日を過ぎていなければ１引く
	if (todayMonth < birthMonth) {
		diffYear = diffYear - 1;
	} else {
		if ((todayMonth === birthMonth) && (todayDay < birthDay)) {
			diffYear = diffYear - 1;
		}
	}
	//年齢の月計算
	var diffMonth = ((todayYear * 12) + todayMonth)
		- ((birthYear * 12) + birthMonth);
	if (todayDay < birthDay) {
		diffMonth = diffMonth - 1;
	};
	//年齢の日計算
	var diffDay = todayDate.getDate() - birthDate.getDate();
	if (diffDay < 0) {
		//前月の過去日と同一日からの経過日数を計算している
		diffDay =
			getMonthEndDay(todayDate.getYear(), todayDate.getMonth())
			- birthDate.getDate()
			+ todayDate.getDate();
	}
	return {"year": diffYear,
			"month": diffMonth - (diffYear * 12),
			"day": diffDay};
}

//年齢
function getAgeMonthDay(todayDate, birthDate) {

	var birthYear = birthDate.getFullYear();
	var birthMonth = birthDate.getMonth() + 1;
	var birthDay = birthDate.getDate();
	var todayYear = todayDate.getFullYear();
	var todayMonth = todayDate.getMonth() + 1;
	var todayDay = todayDate.getDate();

	//年齢の月計算
	var diffMonth = ((todayYear * 12) + todayMonth)
		- ((birthYear * 12) + birthMonth);
	if (todayDay < birthDay) {
		diffMonth = diffMonth - 1;
	};
	//年齢の日計算
	var diffDay = todayDate.getDate() - birthDate.getDate();
	if (diffDay < 0) {
		//前月の過去日と同一日からの経過日数を計算している
		diffDay =
			getMonthEndDay(todayDate.getYear(), todayDate.getMonth())
			- birthDate.getDate()
			+ todayDate.getDate();
	}
	return {"month": diffMonth,
			"day": diffDay};
}

function getAgeDay(todayDate, birthDate) {

	var birthYear = birthDate.getFullYear();
	var birthMonth = birthDate.getMonth() + 1;
	var birthDay = birthDate.getDate();
	var todayYear = todayDate.getFullYear();
	var todayMonth = todayDate.getMonth() + 1;
	var todayDay = todayDate.getDate();

	//年齢の日計算
	var date1 = new Date(birthYear, birthMonth - 1, birthDay);
	var date2 = new Date(todayYear, todayMonth - 1, todayDay);

	var diffDay = date2 - date1;
	diffDay = diffDay / ( 24 * 60 * 60 * 1000);
	return {"day": diffDay};
}

function dayCount(todayDate, birthDate) {
	var diff = todayDate - birthDate;
	diff = diff / ( 24 * 60 * 60 * 1000);
	return Math.floor(diff);
}

function hoursCount(todayDate, birthDate) {
	var diff = todayDate - birthDate;
	var diff = diff / ( 60 * 60 * 1000);
	return Math.floor(diff);
}

function minutesCount(todayDate, birthDate) {
	var diff = todayDate - birthDate;
	var diff = diff / ( 60 * 1000);
	return Math.floor(diff);
}

function secondsCount(todayDate, birthDate) {
	var diff = todayDate - birthDate;
	var diff = diff / (1000);
	return Math.floor(diff);
}

/*  --------------
年月を指定して月末日を求める関数
引数：  year 年
		month 月
備考：  指定月の翌月の0日を取得して末日を求める
		monthに11(月)を指定すると
		Dateは0～11で月を表すためDate(year, 11, 0)は
		12月の0日を表すので11月末日を示すことになる
参考：
	JavaScript による日付・時刻・時間の計算・演算のまとめ - hoge256ブログ
	http://www.hoge256.net/2007/08/64.html
--------------  */
function getMonthEndDay(year, month) {
	var dt = new Date(year, month, 0);
	return dt.getDate();
}


//----------------------------------------
//◆ファイルフォルダパス処理
//----------------------------------------
function getFileName(fileName) {
	return fileName.substring(fileName.lastIndexOf("/")+1,fileName.length);
}
function test_getFileName() {
	check("a.txt", getFileName("file://test/test/a.txt"));
}

//----------------------------------------
//・終端にパス区切りを追加する関数
//----------------------------------------
function includeLastPathDelim(path) {
	var result = "";
	if (path != "") {
		result = includeLastStr(path, "\\");
	};
	return result;
}

//----------------------------------------
//・ピリオドを含んだ拡張子を取得する
//----------------------------------------
function getExtensionIncludePeriod(path) {
	var result = "";
	result = lastStrLastDelim(path, ".");
	if (result == path) {
		result = ""
	} else {
		result = includeFirstStr(result, ".")
		};
	return result;
}



/*----------------------------------------
◇	ver	2014/07/18
・	作成
	lastStringCount
	format_yyyy_mm_dd
	format_hh_mm_dd(
	getAgeYearMonthDay
	getAgeMonthDay
	getAgeDay
	dayCount
	hoursCount
	minutesCount
	secondsCount
	getMonthEndDay
	arrayToString
	encodeURIComponentArrayToString
	stringToArray
	decodeURIComponentStringToArray
	getFileName
◇	ver	2015/07/02
	replaceAll
◇	ver	2015/07/31
・	firstStrFirstDelim/lastStrFirstDelim 追加
◇	ver	2015/08/02
・	追加
	isFirstStr
	includeFirstStr
	excludeFirstStr
	isFirstText
	includeFirstText
	excludeFirstText
	isLastStr
	includeLastStr
	excludeLastStr
	isLastText
	includeLastText
	excludeLastText
	includeBothEndsStr
	excludeBothEndsStr
	includeBothEndsText
	ExcludeBothEndsText
	trimFirstStrs
	trimLastStrs
	trimBothEndsStrs
	strCount
	shellFileOpen
◇	ver	2015/08/12
・	追加
	WshShellを定義
◇	ver	2015/08/13
・	追加
	firstStrLastDelim/lastStrLastDelim
◇	ver	2017/03/12
・	修正
	firstStrFirstDelim/lastStrFirstDelim
	firstStrLastDelim/lastStrLastDelim
・	追加
	tagInnerText/tagOuterText
◇	ver	2017/03/16
・	isIncludeStr 追加
・	st_gas_gs.js 追加
◇	ver	2017/03/17
・	isNumber 追加
◇	ver	2017/04/13
・	getExtensionIncludePeriod 追加
◇	ver	2017/04/17
・	isUndefined/isNull/isNullOrUndefined 追加
・	st.jsからstsLib.jsにプロジェクト名変更
	ファイル名もst.jsからstslib_core.jsに変更
・	test_equalOperator stslib_test_web.htmlから
	stslib_core.jsに移動
・	assert 追加
・	arrayEqualArray/arrayIndexOfArray 追加
◇	ver	2017/04/18
・	startTagDelete/endTagDelete	追加
◇	ver	2017/04/19
・	deleteTagInnerText/deleteTagOutterText 追加
◇	ver	2017/04/20
・	stslib_win_wsh.js に shellFileOpen 移動
◇	ver	2017/04/22
・	degreeToRadian/radianToDegree 追加
・	angleRelative 追加
・	stslib_web.js に intervalLoop処理を追加
◇	ver 2017/04/25
・	名前空間を導入。関数群の名前がグローバル汚染を引き起こさないようにした。

//----------------------------------------*/
