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
Version:        2020/08/02
//----------------------------------------*/

//----------------------------------------
//���S�̂��͂������֐�
//----------------------------------------
(function() {

  //----------------------------------------
  //�Erequire���s
  //----------------------------------------
  var stsLib = require('./stslib_core.js')

  //----------------------------------------
  //��stsLib���O���
  //----------------------------------------
  var stsLib = stsLib || {};
  (function(stsLib, global) {
    'use strict';
    var _ = stsLib;

    //----------------------------------------
    //�����b�Z�[�W�o��(alert/console.log)
    //----------------------------------------
    _.alert = function(message) {
      WScript.Echo(message);
    };

    //----------------------------------------
    //��stsLib.wsh���O���
    //----------------------------------------
    _.wsh = stsLib.wsh || {};
    (function() {
      var _ = stsLib.wsh;

      //----------------------------------------
      //��DefaultObject
      //----------------------------------------

      _.fso = new ActiveXObject("Scripting.FileSystemObject");

      //----------------------------------------
      //��wshEngine
      //----------------------------------------
      _.wshEngine = stsLib.wsh.wshEngine || {};
      (function() {
        var _ = stsLib.wsh.wshEngine;

        _.filePath = function() {
          return WScript.FullName;
        };
        // 64bit���̏ꍇ
        //  32bit��GUI:  C:\Windows\SysWOW64\WScript.exe
        //  32bit��CUI:  C:\Windows\SysWOW64\cscript.exe
        //  64bit��GUI:  C:\Windows\System32\WScript.exe
        //  64bit��CUI:  C:\Windows\system32\cscript.exe
        // 32bit���̏ꍇ
        //  GUI:  C:\Windows\System32\WScript.exe
        //  CUI:  C:\Windows\System32\cscript.exe

        _.folderPath = function() {
          return WScript.Path;
        };

        _.fileName = function() {
          return 'wscript.exe';
        };

        _.engineName = function() {
          return WScript.Name;
        };
        // [Windows Script Host]
        // �Ƃ������̂��擾�ł���

        _.engineVersion = function() {
          return WScript.Version;
        };
        // [5.8]�ɂȂ�͂�

        _.test_wshEngine = function() {
          alert(_.filePath());
          alert(_.folderPath());
          alert(_.fileName());
          alert(_.engineName());
          alert(_.engineVersion());
        };

      }());   //stsLib.wsh.wshEngine

      //----------------------------------------
      //��Path
      //----------------------------------------
      _.path = stsLib.wsh.path || {};
      (function() {
        var _ = stsLib.wsh.path;

        //----------------------------------------
        //���J�����g�f�B���N�g��
        //----------------------------------------
        _.currentDirectory = function() {
          return stsLib.wsh.shell.object.CurrentDirectory;
        };

        //----------------------------------------
        //���X�N���v�g�t�@�C��(*.js/*.jse/*.wsf)
        //----------------------------------------
        _.scriptFilePath = function() {
          return WScript.ScriptFullName;
        };

        _.scriptFolderPath = function() {
          return stsLib.wsh.fso.GetParentFolderName(_.scriptFilePath());
        };

        _.scriptFileName = function() {
          return WScript.ScriptName;
        };

        _.test_path = function() {
          alert(_.currentDirectory());
          alert(_.scriptFilePath());
          alert(_.scriptFolderPath());
          alert(_.scriptFileName());
        };

      }());   //stsLib.wsh.path

      //----------------------------------------
      //��FileSystem
      //----------------------------------------

      _.fs = stsLib.wsh.fs || {};
      (function() {
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
      //��TextFile
      //----------------------------------------
      _.textfile = stsLib.wsh.textfile || {};
      (function() {
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
        // UTF16_LE_BOM�̎w��́A
        // [UNICODEFFFE]�����ł͂Ȃ�
        // [UNICODE]��[UTF-16]����������ɂȂ邪
        // UTF16_BE_BOM�Ƃ̑Δ�Ƃ��Ă킩��₷���̂�
        // [UNICODEFFFE]���̗p����

        var streamTypeEnum = {
          adTypeBinary: 1,
          adTypeText: 2
        };
        var saveOptionsEnum = {
          adSaveCreateOverWrite: 2
        };

        _.load = function(filePath, encodingType) {
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

        _.test_load = function() {

          var textTest = 'test\r\n123\r456\n����������\r\ntest\r\n';
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
          textTest = stsLib.string.replaceAll(textTest, '����������', '?????')
          c.check(textTest, _.load(folderPathTestBase + '\\ASCII_File.txt',
            _.encoding.ASCII));
        }

        _.save = function(str, filePath, encodingType) {
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

        _.test_save = function() {
          var textTest = 'test\r\n123\r456\n����������\r\ntest\r\n';
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
      //��ShortcutFile
      //----------------------------------------
      _.shortcutFile = stsLib.wsh.shortcutFile || {};
      (function() {
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

          c.assert(
            (stsLib.wsh.fso.FileExists(targetFilePath))
            || (stsLib.wsh.fso.FolderExists(targetFilePath)),
            "No Exists ShortcutTargetFile"
          );

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
      //��shell
      //----------------------------------------
      _.shell = stsLib.wsh.shell || {};
      (function() {
        var _ = stsLib.wsh.shell;

        _.object = new ActiveXObject( "WScript.Shell" );

        //----------------------------------------
        //���t�@�C���w�肵���V�F���N��
        //----------------------------------------
        stsLib.type.windowStyleEnum = {
          vbHide            : 0,  //�E�B���h�E��\��
          vbNormalFocus     : 1,  //�ʏ�\���N��
          vbMinimizedFocus  : 2,  //�ŏ����N��
          vbMaximizedFocus  : 3,  //�ő剻�N��
          vbNormalNoFocus   : 4,  //�ʏ�\���N���A�t�H�[�J�X�Ȃ�
          vbMinimizedNoFocus: 6   //�ŏ����N���A�t�H�[�J�X�Ȃ�
        };
        stsLib.type.isWindowStyleEnum = function(value) {
          if (!t.isInt(value)) {
            return false;
          }
          if (!n.inRange(value,
            t.windowStyleEnum.vbHide,
            t.windowStyleEnum.vbMinimizedNoFocus)) {
            return false;
          }
          return true;
        }

        //----------------------------------------
        //�E�t�@�C�����w�肵�Ċ���̃v���O�����ŊJ��
        //----------------------------------------
        //  �Ecalc.exe / notepad.exe �Ȃǎw�肵�Ă�����
        //----------------------------------------
        _.fileOpen = function(path, windowStyle) {

          _.object.Run(
            "rundll32.exe url.dll" +
            ",FileProtocolHandler " + path
            , windowStyle, true)
          //��O������Wait��true�ɂ��Ă����������悤��
        }

        _.test_fileOpen = function() {
          var folderPathTestBase = stsLib.wsh.path.scriptFolderPath() +
            '\\TestData\\ShellOpenTest';
          var testFilePath = folderPathTestBase + '\\ShellOpenTest.txt';
          stsLib.wsh.textfile.save('test', testFilePath, stsLib.wsh.textfile.encoding.Shift_JIS);
          _.fileOpen(testFilePath, t.windowStyleEnum.vbNormalNoFocus);

          _.fileOpen('notepad.exe', t.windowStyleEnum.vbNormalNoFocus);
        };

        //notepad.exe �Ȃǂ̎��s�t�@�C�����w�肷��ꍇ�͂�����g��
        _.run = function(commandline, windowStyle, waitFlag) {
          if (t.isUndefined(windowStyle)) {
            windowStyle = t.windowStyleEnum.vbNormalFocus;
          }
          c.assert(t.isString(commandline));
          c.assert(t.isWindowStyleEnum(windowStyle));
          _.object.Run(commandline, windowStyle, waitFlag)
        }

        //dir �Ȃǂ̃R�}���h���C�����߂��w�肷��ꍇ�͂�����g��
        //�o�͌��ʂ��擾�ł���
        _.runCommand = function(commandline) {
          return _.object.Exec('cmd /c ' + commandline).StdOut.ReadAll();
        }

      }());   //stsLib.wsh.shell

      //----------------------------------------
      //��MessageBox
      //----------------------------------------
      _.messageBox = stsLib.wsh.messageBox || {};
      (function() {
        var _ = stsLib.wsh.messageBox;

        //----------------------------------------
        //�����b�Z�[�W�\��
        //----------------------------------------
        //�E�g����
        //  var m = stsLib.wsh.messageBox;
        //  var msgResult = m.Popup(
        //    '�{��', 10,
        //    '�^�C�g��', (m.nType.BTN_YES_NO_CANCEL + m.nType.ICON_QUESTION));
        //  msgResult �� m.intButton.BTN_RESULT_YES ���ǂ����Ȃǂ𒲂ׂ�
        //----------------------------------------

        _.nType = {
          //  �{�^���̎��
          BTN_OK_ONLY             : 0,   // [OK]�{�^��
          BTN_OK_CANCEL           : 1,   // [OK][�L�����Z��]�{�^��
          BTN_ABORT_RETRY_IGNORE  : 2,   // [���~][�Ď��s][����]�{�^��
          BTN_YES_NO_CANCEL       : 3,   // [�͂�][������][�L�����Z��]�{�^��
          BTN_YES_NO              : 4,   // [�͂�][������]�{�^��
          BTN_RETRY_CANCEL        : 5,   // [�Ď��s][�L�����Z��]�{�^��

          //  �A�C�R���̎��
          ICON_STOP               :16,   // [Stop]�A�C�R��
          ICON_QUESTION           :32,   // [?]�A�C�R��
          ICON_EXCLAMATION        :48,   // [!]�A�C�R��
          ICON_INFORMATION        :64    // [i]�A�C�R��
        };

        _.intButton = {
          //  �{�^���̖߂�l
          BTN_RESULT_OK           : 1,   // [OK]�{�^��������
          BTN_RESULT_CANCEL       : 2,   // [�L�����Z��]�{�^��������
          BTN_RESULT_ABORT        : 3,   // [���~]�{�^��������
          BTN_RESULT_RETRY        : 4,   // [�Ď��s]�{�^��������
          BTN_RESULT_IGNORE       : 5,   // [����]�{�^��������
          BTN_RESULT_YES          : 6,   // [�͂�]�{�^��������
          BTN_RESULT_NO           : 7,   // [������]�{�^��������
          BTN_RESULT_NOT          :-1    // �ǂ̃{�^���������Ȃ������Ƃ�
        };

        _.popup = function(strText, nSecondsToWait, strTitle, nType) {
          return stsLib.wsh.shell.object.Popup(
            strText, nSecondsToWait, strTitle, nType);
          //���b�s���O����Ӗ��͂��܂�Ȃ��̂����B
        }

        _.test_popup = function() {
          var m = stsLib.wsh.messageBox;
          var msgResult = m.popup(
            '�{��', 10,
            '�^�C�g��', (m.nType.BTN_YES_NO_CANCEL + m.nType.ICON_QUESTION));
          if (msgResult === m.intButton.BTN_RESULT_YES) {
            alert('YES');
          } else {
            alert(msgResult.toString());
          }
        };


      }());   //stsLib.wsh.messageBox

    }());   //stsLib.wsh

    //----------------------------------------
    //���O���[�o���g��
    //----------------------------------------
    (function() {
      var _ = global;

      //alert�̏㏑���͂����ł͂Ȃ�
      //���ۂ̃O���[�o���ōs��
      // _.alert = function(message) {
      //   WScript.Echo(message);
      // };

    }()); //global

    //----------------------------------------
    //������m�F
    //----------------------------------------
    _.test = stsLib.test || {};
    (function() {
      var _ = stsLib.test;

      //----------------------------------------
      //���e�X�g
      //----------------------------------------
      _.test_stslib_wsh = function() {
        // stsLib.wsh.path.test_path();
        // stsLib.wsh.wshEngine.test_wshEngine();
        // stsLib.wsh.shell.test_fileOpen();
        // stsLib.wsh.messageBox.test_popup();

        stsLib.wsh.fs.test_forceCreateFolder();
        stsLib.wsh.textfile.test_save();
        stsLib.wsh.textfile.test_load();
        stsLib.alert('finish stslib_win_wsh_test �e�X�g�I��');
      }

    }());   //stsLib.test

    //----------------------------------------
    //���ȗ��Ăяo��
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
  //�����W���[���o�^
  //----------------------------------------
  var moduleExports = function(object, registFileName) {
    if (typeof module === 'undefined') {
      //�g���q���ȗ�����Ă���ꍇ�͒ǉ�
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

