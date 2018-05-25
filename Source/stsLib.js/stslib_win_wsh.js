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
Version:        2018/05/25
//----------------------------------------*/

//----------------------------------------
//■全体を囲う無名関数
//----------------------------------------
(function() {

  //----------------------------------------
  //・require実行
  //----------------------------------------
  var stsLib = require('./stslib_core.js')

  //----------------------------------------
  //■stsLib名前空間
  //----------------------------------------
  var stsLib = stsLib || {};
  (function (stsLib, global) {
    'use strict';
    var _ = stsLib;

    //----------------------------------------
    //◆メッセージ出力(alert/console.log)
    //----------------------------------------
    _.alert = function(message) {
      WScript.Echo(message);
    };

    //----------------------------------------
    //■stsLib.wsh名前空間
    //----------------------------------------
    _.wsh = stsLib.wsh || {};
    (function () {
      var _ = stsLib.wsh;

      //----------------------------------------
      //◆DefaultObject
      //----------------------------------------

      _.fso = new ActiveXObject("Scripting.FileSystemObject");

      //----------------------------------------
      //◆wshEngine
      //----------------------------------------
      _.wshEngine = stsLib.wsh.wshEngine || {};
      (function () {
        var _ = stsLib.wsh.wshEngine;

        _.filePath = function () {
          return WScript.FullName;
        };
        // 64bit環境の場合
        //  32bit版GUI:  C:\Windows\SysWOW64\WScript.exe
        //  32bit版CUI:  C:\Windows\SysWOW64\cscript.exe
        //  64bit版GUI:  C:\Windows\System32\WScript.exe
        //  64bit版CUI:  C:\Windows\system32\cscript.exe
        // 32bit環境の場合
        //  GUI:  C:\Windows\System32\WScript.exe
        //  CUI:  C:\Windows\System32\cscript.exe

        _.folderPath = function () {
          return WScript.Path;
        };

        _.fileName = function () {
          return 'wscript.exe';
        };

        _.engineName = function () {
          return WScript.Name;
        };
        // [Windows Script Host]
        // という名称が取得できる

        _.engineVersion = function () {
          return WScript.Version;
        };
        // [5.8]になるはず

        _.test_wshEngine = function () {
          alert(_.filePath());
          alert(_.folderPath());
          alert(_.fileName());
          alert(_.engineName());
          alert(_.engineVersion());
        };

      }());   //stsLib.wsh.wshEngine

      //----------------------------------------
      //◆Path
      //----------------------------------------
      _.path = stsLib.wsh.path || {};
      (function () {
        var _ = stsLib.wsh.path;

        //----------------------------------------
        //◇カレントディレクトリ
        //----------------------------------------
        _.currentDirectory = function () {
          return stsLib.wsh.shell.object.CurrentDirectory;
        };

        //----------------------------------------
        //◇スクリプトファイル(*.js/*.jse/*.wsf)
        //----------------------------------------
        _.scriptFilePath = function () {
          return WScript.ScriptFullName;
        };

        _.scriptFolderPath = function () {
          return stsLib.wsh.fso.GetParentFolderName(_.scriptFilePath());
        };

        _.scriptFileName = function () {
          return WScript.ScriptName;
        };

        _.test_path = function () {
          alert(_.currentDirectory());
          alert(_.scriptFilePath());
          alert(_.scriptFolderPath());
          alert(_.scriptFileName());
        };

      }());   //stsLib.wsh.path

      //----------------------------------------
      //◆FileSystem
      //----------------------------------------

      _.fs = stsLib.wsh.fs || {};
      (function () {
        var _ = stsLib.wsh.fs;

        _.forceCreateFolder = function(folderPath) {
            var parentFolderPath = stsLib.wsh.fso.GetParentFolderName(folderPath);
            if (!stsLib.wsh.fso.FolderExists(parentFolderPath)) {
              _.forceCreateFolder(parentFolderPath);
            }
            if (!stsLib.wsh.fso.FolderExists(folderPath)) {
              stsLib.wsh.fso.CreateFolder(folderPath);
            }
        };

        _.test_forceCreateFolder = function() {
          var folderPathTestBase = stsLib.wsh.path.scriptFolderPath() +
            '\\TestData\\FileIoTest';
          //alert(folderPathTestBase);
          _.forceCreateFolder(folderPathTestBase);
        };

      }());   //stsLib.wsh.fs

      //----------------------------------------
      //◆TextFile
      //----------------------------------------
      _.textfile = stsLib.wsh.textfile || {};
      (function () {
        var _ = stsLib.wsh.textfile;

        _.encoding = {
          ASCII               :0,
          JIS                 :1,
          EUC_JP              :2,
          UTF_7               :3,
          Shift_JIS           :4,
          UTF8_BOM            :5,
          UTF8_BOM_NO         :6,
          UTF16_LE_BOM        :7,
          UTF16_LE_BOM_NO     :8,
          UTF16_BE_BOM        :9,
          UTF16_BE_BOM_NO     :10
        };

        var getEncodingTypeName = function(encodingType) {
          switch (encodingType) {
          case _.encoding.Shift_JIS:        return "SHIFT_JIS";
          case _.encoding.UTF8_BOM:         return "UTF-8";
          case _.encoding.UTF8_BOM_NO:      return "UTF-8N";
          case _.encoding.UTF16_LE_BOM:     return "UNICODEFFFE";
          case _.encoding.UTF16_LE_BOM_NO:  return "UTF-16LE";
          case _.encoding.UTF16_BE_BOM:     return "UNICODEFEFF";
          case _.encoding.UTF16_BE_BOM_NO:  return "UTF-16BE";
          case _.encoding.JIS:              return "ISO-2022-JP";
          case _.encoding.EUC_JP:           return "EUC-JP";
          case _.encoding.UTF_7:            return "UTF-7";
          case _.encoding.ASCII:            return "ASCII";
          }
        }
        // UTF16_LE_BOMの指定は、
        // [UNICODEFFFE]だけではなく
        // [UNICODE]や[UTF-16]も同じ動作になるが
        // UTF16_BE_BOMとの対比としてわかりやすいので
        // [UNICODEFFFE]を採用する

        var streamTypeEnum = {
          adTypeBinary: 1,
          adTypeText: 2
        };
        var saveOptionsEnum = {
          adSaveCreateOverWrite: 2
        };

        _.load = function (filePath, encodingType) {
          var result = '';
          var stream = new ActiveXObject('ADODB.Stream');
          stream.Type = streamTypeEnum.adTypeText;
          switch (encodingType) {
          case _.encoding.UTF8_BOM_NO:
            stream.Charset = getEncodingTypeName(_.encoding.UTF8_BOM);
            break;
          default:
            stream.Charset = getEncodingTypeName(encodingType);
            break;
          }
          stream.Open();
          stream.LoadFromFile(filePath);
          result = stream.ReadText();
          stream.Close();
          stream = null;
          return result;
        }

        _.test_load = function () {

          var textTest = 'test\r\n123\r456\nあいうえお\r\ntest\r\n';
          var folderPathTestBase = stsLib.wsh.path.scriptFolderPath() +
            '\\TestData\\FileIoTest';

          c.check(textTest, _.load(folderPathTestBase + '\\SJIS_File.txt',
            _.encoding.Shift_JIS));
          c.check(textTest, _.load(folderPathTestBase + '\\UTF-8_File.txt',
            _.encoding.UTF8_BOM));
          c.check(textTest, _.load(folderPathTestBase + '\\UTF-8N_File.txt',
            _.encoding.UTF8_BOM_NO));
          c.check(textTest, _.load(folderPathTestBase + '\\UTF-16LE_BOM_ON_File.txt',
            _.encoding.UTF16_LE_BOM));
          c.check(textTest, _.load(folderPathTestBase + '\\UTF-16LE_BOM_OFF_File.txt',
            _.encoding.UTF16_LE_BOM_NO));
          c.check(textTest, _.load(folderPathTestBase + '\\UTF-16BE_BOM_OFF_File.txt',
            _.encoding.UTF16_BE_BOM_NO));
          c.check(textTest, _.load(folderPathTestBase + '\\UTF-16BE_BOM_ON_File.txt',
            _.encoding.UTF16_BE_BOM));
          c.check(textTest, _.load(folderPathTestBase + '\\JIS_File.txt',
            _.encoding.JIS));
          c.check(textTest, _.load(folderPathTestBase + '\\EUC-JP_File.txt',
            _.encoding.EUC_JP));
          c.check(textTest, _.load(folderPathTestBase + '\\UTF-7_File.txt',
            _.encoding.UTF_7));
          textTest = stsLib.string.replaceAll(textTest, 'あいうえお', '?????')
          c.check(textTest, _.load(folderPathTestBase + '\\ASCII_File.txt',
            _.encoding.ASCII));
        }

        _.save = function (str, filePath, encodingType) {
          var stream = new ActiveXObject('ADODB.Stream');
          stream.Type = streamTypeEnum.adTypeText;
          switch (encodingType) {
          case _.encoding.UTF8_BOM_NO:
            stream.Charset = getEncodingTypeName(_.encoding.UTF8_BOM);
            break;
          case _.encoding.UTF16_BE_BOM:
            stream.Charset = getEncodingTypeName(_.encoding.UTF16_BE_BOM_NO);
            break;
          default:
            stream.Charset = getEncodingTypeName(encodingType);
            break;
          }
          stream.Open();

          var byteData;
          switch (encodingType) {
          case _.encoding.UTF16_LE_BOM_NO:
            stream.WriteText(str);
            stream.Position = 0;
            stream.Type = streamTypeEnum.adTypeBinary;
            stream.Position = 2;
            byteData = stream.Read;
            stream.Position = 0;
            stream.Write(byteData);
            stream.SetEOS;
            break;
          case _.encoding.UTF8_BOM_NO:
            stream.WriteText(str);
            stream.Position = 0;
            stream.Type = streamTypeEnum.adTypeBinary;
            stream.Position = 3;
            byteData = stream.Read;
            stream.Position = 0;
            stream.Write(byteData);
            stream.SetEOS;
            break;
          case _.encoding.UTF16_BE_BOM:
            str = String.fromCharCode(0xFEFF) + str;
            stream.WriteText(str);
            break;
          default:
            stream.WriteText(str);
            break;
          }
          stream.SaveToFile(filePath, saveOptionsEnum.adSaveCreateOverWrite);

          stream.Close();
          stream = null;

        }

        _.test_save = function () {
          var textTest = 'test\r\n123\r456\nあいうえお\r\ntest\r\n';
          var folderPathTestBase = stsLib.wsh.path.scriptFolderPath() +
            '\\TestData\\FileIoTest';

          _.save(textTest, folderPathTestBase + '\\SJIS_File.txt',
            _.encoding.Shift_JIS);
          _.save(textTest, folderPathTestBase + '\\UTF-8_File.txt',
            _.encoding.UTF8_BOM);
          _.save(textTest, folderPathTestBase + '\\UTF-8N_File.txt',
            _.encoding.UTF8_BOM_NO);
          _.save(textTest, folderPathTestBase + '\\UTF-16LE_BOM_ON_File.txt',
            _.encoding.UTF16_LE_BOM);
          _.save(textTest, folderPathTestBase + '\\UTF-16LE_BOM_OFF_File.txt',
            _.encoding.UTF16_LE_BOM_NO);
          _.save(textTest, folderPathTestBase + '\\UTF-16BE_BOM_OFF_File.txt',
            _.encoding.UTF16_BE_BOM_NO);
          _.save(textTest, folderPathTestBase + '\\UTF-16BE_BOM_ON_File.txt',
            _.encoding.UTF16_BE_BOM);
          _.save(textTest, folderPathTestBase + '\\JIS_File.txt',
            _.encoding.JIS);
          _.save(textTest, folderPathTestBase + '\\EUC-JP_File.txt',
            _.encoding.EUC_JP);
          _.save(textTest, folderPathTestBase + '\\UTF-7_File.txt',
            _.encoding.UTF_7);
          _.save(textTest, folderPathTestBase + '\\ASCII_File.txt',
            _.encoding.ASCII);
        }

      }());   //stsLib.wsh.textfile

      //----------------------------------------
      //◆ShortcutFile
      //----------------------------------------
      _.shortcutFile = stsLib.wsh.shortcutFile || {};
      (function () {
        var _ = stsLib.wsh.shortcutFile;

        _.create = function(shortcutFilePath, targetFilePath,
          iconFilePath, iconIndex, description) {

          if (t.isUndefined(iconFilePath)) {
            iconFilePath = '';
          }
          if (t.isUndefined(iconIndex)) {
            iconIndex = -1;
          }
          if (t.isUndefined(description)) {
            description = '';
          }
          c.assert(t.isString(shortcutFilePath));
          c.assert(t.isString(targetFilePath));
          c.assert(t.isString(iconFilePath));
          c.assert(t.isInt(iconIndex));
          c.assert(t.isString(description));

          c.assert(stsLib.wsh.fso.FolderExists(
              stsLib.wsh.fso.GetParentFolderName(shortcutFilePath)),
              "No Exists ShortcutFileFolder");

          c.assert(stsLib.wsh.fso.FileExists(
              targetFilePath),
              "No Exists ShortcutTargetFile");

          var iconLocation = "";
          if (!stsLib.wsh.fso.FileExists(iconFilePath)) {
            iconLocation = -1;
          } else {
            if (0 <= iconIndex) {
              iconLocation = iconFilePath + ',' + iconIndex.toString();
            } else {
              iconLocation = iconFilePath + ',0';
            }
          }

          var shortcutFile = stsLib.wsh.shell.object.CreateShortcut(shortcutFilePath);

          shortcutFile.TargetPath = targetFilePath;
          shortcutFile.Description = description;
          shortcutFile.IconLocation = iconLocation;
          shortcutFile.RelativePath = '';
          shortcutFile.WorkingDirectory = '';
          shortcutFile.Hotkey = '';
          shortcutFile.Save();

        }

      }());   //stsLib.wsh.shortcutFile

      //----------------------------------------
      //◆shell
      //----------------------------------------
      _.shell = stsLib.wsh.shell || {};
      (function () {
        var _ = stsLib.wsh.shell;

        _.object = new ActiveXObject( "WScript.Shell" );

        //----------------------------------------
        //◇ファイル指定したシェル起動
        //----------------------------------------
        _.windowStyleEnum = {
          vbHide            : 0,  //ウィンドウ非表示
          vbNormalFocus     : 1,  //通常表示起動
          vbMinimizedFocus  : 2,  //最小化起動
          vbMaximizedFocus  : 3,  //最大化起動
          vbNormalNoFocus   : 4,  //通常表示起動、フォーカスなし
          vbMinimizedNoFocus: 6   //最小化起動、フォーカスなし
        };

        //----------------------------------------
        //・ファイルを指定して既定のプログラムで開く
        //----------------------------------------
        //  ・calc.exe / notepad.exe など指定しても動く
        //----------------------------------------
        _.fileOpen = function (path, windowStyle) {

          _.object.Run(
            "rundll32.exe url.dll" +
            ",FileProtocolHandler " + path
            , windowStyle, true)
          //第三引数のWaitはtrueにしても無視されるようだ
        }

        _.test_fileOpen = function () {
          var folderPathTestBase = stsLib.wsh.path.scriptFolderPath() +
            '\\TestData\\ShellOpenTest';
          var testFilePath = folderPathTestBase + '\\ShellOpenTest.txt';
          stsLib.wsh.textfile.save('test', testFilePath, stsLib.wsh.textfile.encoding.Shift_JIS);
          _.fileOpen(testFilePath, _.windowStyleEnum.vbNormalNoFocus);

          _.fileOpen('notepad.exe', _.windowStyleEnum.vbNormalNoFocus);

        };


      }());   //stsLib.wsh.shell

      //----------------------------------------
      //◆MessageBox
      //----------------------------------------
      _.messageBox = stsLib.wsh.messageBox || {};
      (function () {
        var _ = stsLib.wsh.messageBox;

        //----------------------------------------
        //◇メッセージ表示
        //----------------------------------------
        //・使い方
        //  var m = stsLib.wsh.messageBox;
        //  var msgResult = m.Popup(
        //    '本文', 10,
        //    'タイトル', (m.nType.BTN_YES_NO_CANCEL + m.nType.ICON_QUESTION));
        //  msgResult が m.intButton.BTN_RESULT_YES かどうかなどを調べる
        //----------------------------------------

        _.nType = {
          //  ボタンの種類
          BTN_OK_ONLY             : 0,   // [OK]ボタン
          BTN_OK_CANCEL           : 1,   // [OK][キャンセル]ボタン
          BTN_ABORT_RETRY_IGNORE  : 2,   // [中止][再試行][無視]ボタン
          BTN_YES_NO_CANCEL       : 3,   // [はい][いいえ][キャンセル]ボタン
          BTN_YES_NO              : 4,   // [はい][いいえ]ボタン
          BTN_RETRY_CANCEL        : 5,   // [再試行][キャンセル]ボタン

          //  アイコンの種類
          ICON_STOP               :16,   // [Stop]アイコン
          ICON_QUESTION           :32,   // [?]アイコン
          ICON_EXCLAMATION        :48,   // [!]アイコン
          ICON_INFORMATION        :64    // [i]アイコン
        };

        _.intButton = {
          //  ボタンの戻り値
          BTN_RESULT_OK           : 1,   // [OK]ボタン押下時
          BTN_RESULT_CANCEL       : 2,   // [キャンセル]ボタン押下時
          BTN_RESULT_ABORT        : 3,   // [中止]ボタン押下時
          BTN_RESULT_RETRY        : 4,   // [再試行]ボタン押下時
          BTN_RESULT_IGNORE       : 5,   // [無視]ボタン押下時
          BTN_RESULT_YES          : 6,   // [はい]ボタン押下時
          BTN_RESULT_NO           : 7,   // [いいえ]ボタン押下時
          BTN_RESULT_NOT          :-1    // どのボタンも押さなかったとき
        };

        _.popup = function (strText, nSecondsToWait, strTitle, nType) {
          return stsLib.wsh.shell.object.Popup(
            strText, nSecondsToWait, strTitle, nType);
        }

        _.test_popup = function () {
          var m = stsLib.wsh.messageBox;
          var msgResult = m.popup(
            '本文', 10,
            'タイトル', (m.nType.BTN_YES_NO_CANCEL + m.nType.ICON_QUESTION));
          if (msgResult === m.intButton.BTN_RESULT_YES) {
            alert('YES');
          } else {
            alert(msgResult.toString());
          }
        };


      }());   //stsLib.wsh.messageBox

    }());   //stsLib.wsh

    //----------------------------------------
    //◆グローバル拡張
    //----------------------------------------
    (function () {
      var _ = global;

      //alertの上書きはここではなく
      //実際のグローバルで行う
      // _.alert = function (message) {
      //   WScript.Echo(message);
      // };

    }()); //global

    //----------------------------------------
    //◆動作確認
    //----------------------------------------
    _.test = stsLib.test || {};
    (function () {
      var _ = stsLib.test;

      //----------------------------------------
      //◆テスト
      //----------------------------------------
      _.test_stslib_wsh = function () {
        // stsLib.wsh.path.test_path();
        // stsLib.wsh.wshEngine.test_wshEngine();
        // stsLib.wsh.shell.test_fileOpen();
        // stsLib.wsh.messageBox.test_popup();

        stsLib.wsh.fs.test_forceCreateFolder();
        stsLib.wsh.textfile.test_save();
        stsLib.wsh.textfile.test_load();
        stsLib.alert('finish stslib_win_wsh_test テスト終了');
      }

    }());   //stsLib.test

    //----------------------------------------
    //◆省略呼び出し
    //----------------------------------------
    var x = stsLib.syntax;
    var t = stsLib.type;
    var c = stsLib.compare;
    var a = stsLib.array;
    var n = stsLib.number;
    var s = stsLib.string;
    var d = stsLib.date;
    var p = stsLib.point;
    var v = stsLib.vector;
    var r = stsLib.rect;

  }(stsLib, this));   //stsLib

  //----------------------------------------
  //◆モジュール登録
  //----------------------------------------
  var moduleExports = function(object, registFileName) {
    if (typeof module === 'undefined') {
      //拡張子が省略されている場合は追加
      if (registFileName.indexOf('.') === -1) {
        registFileName += '.js';
      }
      requireList[registFileName] = stsLib;
    } else {
      module.exports = object;
    }
  };

  moduleExports(stsLib, 'stslib_win_wsh.js');

}()); //(function() {

