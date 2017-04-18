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
