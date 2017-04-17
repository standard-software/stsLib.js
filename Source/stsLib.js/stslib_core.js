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
Version:        2017/04/17
//----------------------------------------*/

//----------------------------------------
//◆動作確認
//----------------------------------------
function test() {
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

    test_isUndefined();

//    check(true, false);
    alert("finish test");
}

//----------------------------------------
//・イコール演算子の挙動
//----------------------------------------
function test_equalOperator() {
    var value = true;
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

    var value = false;
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

    var s = "true"
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

    var s = "false"
    check(false, s=="true"          ,"V04-01");
    check(false, s==true            ,"V04-01");
    //↓文字列に『!!』を付属するとtrueが返されるので
    //  falseの場合でもtrueと判定してしまう
    check(true , !!s==true          ,"V04-02");

    check(false, s==false           ,"V04-03");
    //↓文字列に『!!』を付属するとtrueが返されるので
    //  falseの場合でも一致しない
    check(false, !!s==false         ,"V04-04");
};

//----------------------------------------
//◆条件判断
//----------------------------------------

//----------------------------------------
//・Check関数
//----------------------------------------
function check(a, b, message) {
    var undefined;
    if (a === b) {
        return true;
    } else {
        var messageText = "";
        if (message !== undefined) {messageText = "Test:" + message + "\n"};
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

function test_isUndefined() 
{
    var a1;
    check(true, isUndefined(a1));

    var a2 = 5;
    check(false, isUndefined(a2));
}

function isNull(value) 
{
    return (value === null);
}

function test_isUndefined() 
{
    var a1;
    check(false, isNull(a1), "01");

    var a2 = 5;
    check(false, isNull(a2), "02");

    var a3 = null;
    check(true, isNull(a3), "03");
}

function isNullOrUndefined(value) 
{
    return (idNull(value) || isUndefined(value));
}

function test_isNullOrUndefined() 
{
    var a1;
    check(false, isNull(a1));

    var a2 = 5;
    check(false, isNull(a2));

    var a3 = null;
    check(true, isNull(a3));
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
  
  return !isNaN(value)
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
//    Call Assert(IsArray(trimStrs), "Error:trimFirstStrs:trimStrs is not Array.")
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
//    Call Assert(IsArray(trimStrs), "Error:trimLastStrs:trimStrs is not Array.")
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

/*----------------------------------------
    配列と文字列の相互変換
機能：	
備考：	
履歴：	
2014/07/16(水)
・	
*/ //*-----------------------------------
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

//----------------------------------------*/

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

//----------------------------------------
//◆システム
//----------------------------------------

//----------------------------------------
//・ファイル指定したシェル起動
//----------------------------------------
//Const vbHide = 0             'ウィンドウ非表示
//Const vbNormalFocus = 1      '通常表示起動
//Const vbMinimizedFocus = 2   '最小化起動
//Const vbMaximizedFocus = 3   '最大化起動
//Const vbNormalNoFocus = 4    '通常表示起動、フォーカスなし
//Const vbMinimizedNoFocus = 6 '最小化起動、フォーカスなし

function shellFileOpen(FilePath, Focus) {
    //assert(OrValue(Focus, Array(0, 1, 2, 3, 4, 6)), "Error:ShellFileOpen")

    WshShell.Run(
        "rundll32.exe url.dll" + 
        ",FileProtocolHandler " + FilePath 
        , Focus, false)
    //ファイル起動の場合
    //第三引数のWaitはtrueにしても無視される様子
}

/*----------------------------------------
◇  ver 2014/07/18
・  作成
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
◇  ver 2015/07/02
    replaceAll
◇  ver 2015/07/31
・  firstStrFirstDelim/lastStrFirstDelim 追加
◇  ver 2015/08/02
・  追加
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
◇  ver 2015/08/12
・  追加
    WshShellを定義
◇  ver 2015/08/13
・  追加
    firstStrLastDelim/lastStrLastDelim
◇  ver 2017/03/12
・  修正
    firstStrFirstDelim/lastStrFirstDelim
    firstStrLastDelim/lastStrLastDelim
・  追加
    tagInnerText/tagOuterText
◇  ver 2017/03/16
・  isIncludeStr 追加
・  st_gas_gs.js 追加
◇  ver 2017/03/17
・  isNumber 追加
◇  ver 2017/04/13
・  getExtensionIncludePeriod 追加
◇  ver 2017/04/17
・  isUndefined/isNull/isNullOrUndefined 追加
・  st.jsからstsLib.jsにプロジェクト名変更
    ファイル名もst.jsからstslib_core.jsに変更
・  test_equalOperator stslib_test_web.htmlから
    stslib_core.jsに移動
//----------------------------------------*/
