/*----------------------------------------
stsLib.js
Standard Software Library JavaScript
----------------------------------------
ModuleName:     Windows WSH Module
FileName:       stslib_win_wsh.js
----------------------------------------
License:        MIT License
All Right Reserved:
	Name:       Standard Software
	URL:        https://www.facebook.com/stndardsoftware/
--------------------------------------
Version:        2017/04/26
//----------------------------------------*/

//----------------------------------------
//◆標準機能
//----------------------------------------

//----------------------------------------
//・メッセージ表示
//----------------------------------------
//	・	WSH では alert が無いので関数を作成する
//----------------------------------------
function alert(messageText) {
	WScript.Echo(messageText);
}

//----------------------------------------
//・テキスト ファイル 入出力
//----------------------------------------
var encodingTypeJpCharCode = {
	NONE                :0,
	ASCII				:1,
	JIS					:2,
	EUC_JP				:3,
	UTF_7				:4,
	Shift_JIS			:5,
	UTF8_BOM			:6,
	UTF8_BOM_NO			:7,
	UTF16_LE_BOM		:8,
	UTF16_LE_BOM_NO		:9,
	UTF16_BE_BOM		:10,
	UTF16_BE_BOM_NO		:11
}

function getEncodingTypeName(encodingType) {
	switch (encodingType) {
	case encodingTypeJpCharCode.Shift_JIS: 
		return "SHIFT_JIS";

	case encodingTypeJpCharCode.UTF16_LE_BOM:
		return "UNICODEFFFE";
	case encodingTypeJpCharCode.UTF16_LE_BOM_NO:
		return "UTF-16LE";
	
	case encodingTypeJpCharCode.UTF16_BE_BOM:
		return "UNICODEFEFF";
	case encodingTypeJpCharCode.UTF16_BE_BOM_NO:
		return "UTF-16BE";
	
	case encodingTypeJpCharCode.UTF8_BOM:
		return "UTF-8";
	case encodingTypeJpCharCode.UTF8_BOM_NO:
		return "UTF-8N";
	
	case encodingTypeJpCharCode.JIS:
		return "ISO-2022-JP";
		
	case encodingTypeJpCharCode.EUC_JP:
		return "EUC-JP";
	
	case encodingTypeJpCharCode.UTF_7:
		return "UTF-7";
	}
}

function string_LoadFromFile(filePath, encodingType) {
	var result = '';
	var encordingName = getEncodingTypeName(encodingType)

	var stream = new ActiveXObject('ADODB.Stream');
	stream.Type = 2;		//(adTypeText = 2)
	switch (encodingType) {
	case encodingTypeJpCharCode.UTF8_BOM_NO: 
		stream.Charset = getEncodingTypeName(EncodingTypeJpCharCode.UTF8_BOM);
		break;
	default: 
		stream.Charset = encordingName;
		break;
	}
	stream.Open();
	stream.LoadFromFile(filePath);
	result = stream.ReadText();
	stream.Close();
	return result;
}

//----------------------------------------
//◆システム
//----------------------------------------
WshShell = new ActiveXObject( "WScript.Shell" );

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

	WshShell.Run(
		"rundll32.exe url.dll" +
		",FileProtocolHandler " + FilePath
		, Focus, false)
	//ファイル起動の場合
	//第三引数のWaitはtrueにしても無視される様子
}

/*----------------------------------------
◇  ver 2017/03/12
・  作成
◇  ver 2017/04/17
・  ファイル名変更
以降、stslib_core.js でversion管理
//----------------------------------------*/
