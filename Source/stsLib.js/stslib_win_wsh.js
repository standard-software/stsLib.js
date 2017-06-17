/*----------------------------------------
stsLib.js
Standard Software Library JavaScript
----------------------------------------
ModuleName:     Windows WSH Module
FileName:       stslib_win_wsh.js
----------------------------------------
License:        MIT License
All Right Reserved:
  Name:         Standard Software
  URL:          https://www.facebook.com/stndardsoftware/
--------------------------------------
Version:        2017/05/28
//----------------------------------------*/

//var stsLib = require('stsLib');

//----------------------------------------
//◆テスト
//----------------------------------------
var test_stslib_win_wsh = function () {
  //test_string_fileIO();
  test_string_SaveToFile();
  test_string_LoadFromFile();
}

//----------------------------------------
//◆標準機能
//----------------------------------------

//----------------------------------------
//・メッセージ表示
//----------------------------------------
//  ・  WSH では alert が無いので関数を作成する
//----------------------------------------
var alert = alert || function (message) {
  WScript.Echo(message);
};

//----------------------------------------
//◆ファイル操作
//----------------------------------------

var fso = new ActiveXObject("Scripting.FileSystemObject")

//----------------------------------------
//◆テキスト ファイル 入出力
//----------------------------------------
var encodingTypeJpCharCode = {
  NONE                :0,
  ASCII               :1,
  JIS                 :2,
  EUC_JP              :3,
  UTF_7               :4,
  Shift_JIS           :5,
  UTF8_BOM            :6,
  UTF8_BOM_NO         :7,
  UTF16_LE_BOM        :8,
  UTF16_LE_BOM_NO     :9,
  UTF16_BE_BOM        :10,
  UTF16_BE_BOM_NO     :11
}

function getEncodingTypeName(encodingType) {
  switch (encodingType) {
  case encodingTypeJpCharCode.Shift_JIS: 
    return "SHIFT_JIS";

  case encodingTypeJpCharCode.UTF16_LE_BOM:
    return "UNICODEFFFE";
    //  UNICODE 
    //  または
    //  UTF-16
    //  を指定してもいいが、
    //  UTF16_BE_BOMとの対なのでこの文字を返す
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
  stream.Type = 2;        //(adTypeText = 2)
  switch (encodingType) {
  case encodingTypeJpCharCode.UTF8_BOM_NO: 
    stream.Charset = getEncodingTypeName(encodingTypeJpCharCode.UTF8_BOM);
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

function test_string_LoadFromFile() {
  var d = stsLib.debug;

  var textTest = 'test\r\n123\r456\nあいうえお\r\ntest\r\n';
  var folderPathTestBase = scriptFolderPath() + '\\TestData\\FileIoTest';
  //alert(folderPathTestBase);

  d.check(textTest, string_LoadFromFile(folderPathTestBase + '\\SJIS_File.txt',
    encodingTypeJpCharCode.Shift_JIS));
  d.check(textTest, string_LoadFromFile(folderPathTestBase + '\\UTF-7_File.txt',
    encodingTypeJpCharCode.UTF_7));
  d.check(textTest, string_LoadFromFile(folderPathTestBase + '\\UTF-8_File.txt',
    encodingTypeJpCharCode.UTF8_BOM));
  d.check(textTest, string_LoadFromFile(folderPathTestBase + '\\UTF-8N_File.txt',
    encodingTypeJpCharCode.UTF8_BOM_NO));
  d.check(textTest, string_LoadFromFile(folderPathTestBase + '\\UTF-16LE_BOM_ON_File.txt',
    encodingTypeJpCharCode.UTF16_LE_BOM));
  d.check(textTest, string_LoadFromFile(folderPathTestBase + '\\UTF-16LE_BOM_OFF_File.txt',
    encodingTypeJpCharCode.UTF16_LE_BOM_NO));
  d.check(textTest, string_LoadFromFile(folderPathTestBase + '\\UTF-16BE_BOM_OFF_File.txt',
    encodingTypeJpCharCode.UTF16_BE_BOM_NO));
  d.check(textTest, string_LoadFromFile(folderPathTestBase + '\\UTF-16BE_BOM_ON_File.txt',
    encodingTypeJpCharCode.UTF16_BE_BOM));

}

function string_SaveToFile(str, filePath, encodingType) {
  var encordingName = getEncodingTypeName(encodingType)

  var stream = new ActiveXObject('ADODB.Stream');
  stream.Type = 2;        //(adTypeText = 2)
  switch (encodingType) {
  case encodingTypeJpCharCode.UTF8_BOM_NO: 
    stream.Charset = getEncodingTypeName(
      encodingTypeJpCharCode.UTF8_BOM);
    break;
  default: 
    //alert(encordingName);
    stream.Charset = encordingName;
    break;
  }
  stream.Open();
  stream.WriteText(str);

  var byteData;
  switch (encodingType) {
  case encodingTypeJpCharCode.UTF16_LE_BOM_NO:
    stream.Position = 0;
    stream.Type = 1;    //adTypeBinary = 1
    stream.Position = 2;
    byteData = stream.Read;
    stream.Position = 0;
    stream.Write(byteData);
    stream.SetEOS;
    break;
  case encodingTypeJpCharCode.UTF8_BOM_NO:
    stream.Position = 0;
    stream.Type = 1;    //adTypeBinary = 1
    stream.Position = 3;
    byteData = stream.Read;
    stream.Position = 0;
    stream.Write(byteData);
    stream.SetEOS;
    break;
  }
  stream.SaveToFile(filePath, 2);
    //adSaveCreateOverWrite = 2
  stream.Close();
  stream = null;

  //alert(encordingName + '\n' + filePath);

}

function test_string_SaveToFile() {
  var textTest = 'test\r\n123\r456\nあいうえお\r\ntest\r\n';
  var folderPathTestBase = scriptFolderPath() + '\\TestData\\FileIoTest';
  alert(folderPathTestBase);

  string_SaveToFile(textTest, folderPathTestBase + '\\SJIS_File.txt',
    encodingTypeJpCharCode.Shift_JIS);
  string_SaveToFile(textTest, folderPathTestBase + '\\UTF-7_File.txt',
    encodingTypeJpCharCode.UTF_7);
  string_SaveToFile(textTest, folderPathTestBase + '\\UTF-8_File.txt',
    encodingTypeJpCharCode.UTF8_BOM);
  string_SaveToFile(textTest, folderPathTestBase + '\\UTF-8N_File.txt',
    encodingTypeJpCharCode.UTF8_BOM_NO);
  string_SaveToFile(textTest, folderPathTestBase + '\\UTF-16LE_BOM_ON_File.txt',
    encodingTypeJpCharCode.UTF16_LE_BOM);
  string_SaveToFile(textTest, folderPathTestBase + '\\UTF-16LE_BOM_OFF_File.txt',
    encodingTypeJpCharCode.UTF16_LE_BOM_NO);
  string_SaveToFile(textTest, folderPathTestBase + '\\UTF-16BE_BOM_OFF_File.txt',
    encodingTypeJpCharCode.UTF16_BE_BOM_NO);
  // string_SaveToFile(textTest, folderPathTestBase + '\\UTF-16BE_BOM_ON_File.txt',
  //   encodingTypeJpCharCode.UTF16_BE_BOM);
    //よくわからないが、[UTF16_BE_BOM]を指定するとそれ以降の
    //保存も読込もファイルエンコードが化けるようだ
    //WSHのバグかな
}

//----------------------------------------
//◆Windows特殊フォルダパス取得
//----------------------------------------

//----------------------------------------
//・実行しているスクリプトファイルパスの取得
//----------------------------------------
function scriptFilePath() {
  return WScript.ScriptFullName;
}

//----------------------------------------
//・スクリプトフォルダパスの取得
//----------------------------------------
function scriptFolderPath() {
  return fso.GetParentFolderName(WScript.ScriptFullName);
}

//----------------------------------------
//◆Shell/プログラム起動
//----------------------------------------
wshShell = new ActiveXObject( "WScript.Shell" );

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

  wshShell.Run(
    "rundll32.exe url.dll" +
    ",FileProtocolHandler " + FilePath
    , Focus, false)
  //ファイル起動の場合
  //第三引数のWaitはtrueにしても無視される様子
}

//----------------------------------------
//◆メッセージ表示
//----------------------------------------

  //  ボタンの種類
  var BTN_OK                 = 0;    // [ＯＫ]ボタン
  var BTN_OK_CANCL           = 1;    // [ＯＫ][キャンセル]ボタン
  var BTN_STOP_RETRI_DISRGRD = 2;    // [中止][再試行][無視]ボタン
  var BTN_YES_NO_CANCL       = 3;    // [はい][いいえ][キャンセル]ボタン
  var BTN_YES_NO             = 4;    // [はい][いいえ]ボタン
  var BTN_RETRI_CANCL        = 5;    // [再試行][キャンセル]ボタン

  //  アイコンの種類
  var ICON_STOP              = 16;   // [Stop]アイコン
  var ICON_QUESTN            = 32;   // [?]アイコン
  var ICON_EXCLA             = 48;   // [!]アイコン
  var ICON_I                 = 64;   // [i]アイコン

  //  押されたボタンごとの戻り値
  var BTNR_OK                =  1;   // [ＯＫ]ボタン押下時
  var BTNR_CANCL             =  2;   // [キャンセル]ボタン押下時
  var BTNR_STOP              =  3;   // [中止]ボタン押下時
  var BTNR_RETRI             =  4;   // [再試行]ボタン押下時
  var BTNR_DISRGRD           =  5;   // [無視]ボタン押下時
  var BTNR_YES               =  6;   // [はい]ボタン押下時
  var BTNR_NO                =  7;   // [いいえ]ボタン押下時
  var BTNR_NOT               = -1;   // どのボタンも押さなかったとき

  //使い方
//  var msgResult = wshShell.Popup(
//    '本文', 10,
//    'タイトル', (BTN_YES_NO_CANCL + ICON_QUESTN));
