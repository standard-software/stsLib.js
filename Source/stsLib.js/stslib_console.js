/*----------------------------------------
stsLib.js
Standard Software Library JavaScript
----------------------------------------
ModuleName:     Console Module
FileName:       stslib_console.js
----------------------------------------
License:        MIT License
All Right Reserved:
    Name:       Standard Software
    URL:        https://www.facebook.com/stndardsoftware/
--------------------------------------
version:        2018/02/05
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
  (function () {
    'use strict';
    var _ = stsLib;

    //----------------------------------------
    //◆システム
    //----------------------------------------
    _.system = stsLib.system || {};
    (function() {
      var _ = stsLib.system;

      _.consoleLogComment = function(formula, comment) {
        return 'console.log(' + formula + ');  //' + comment;
      };

      _.consoleLogCommentOutput = function(formula, comment) {
        console.log(_.consoleLogComment(formula, comment));
      };

      _.test_consoleLogComment = function() {
        var testFunc = function(value) {
          return value + value;
        };

        var formula = 'testFunc(1)';
        var result = eval(formula);
        c.check('console.log(testFunc(1));  //2',
          _.consoleLogComment(formula, result));
      };

      _.consoleExt = stsLib.system.consoleExt || {};
      (function() {

        var _ = stsLib.system.consoleExt;

        _.originalConsoleLog = console.log;
        _.result = '';
        _.delimiter = ';';
        _.logOutput = true;

        _.log = function(message) {
          if (_.logOutput) {
            _.originalConsoleLog(message);
          }
          _.result += message + _.delimiter;
        };

        _.hook = function() {
          if (_.originalConsoleLog === console.log) {
            console.log = _.log;
          }
        };

        _.unhook = function() {
          if (_.originalConsoleLog !== console.log) {
            console.log = _.originalConsoleLog;
          }
        };

      }()); //stsLib.system.consoleExt


      _.test_consoleExt = function() {
        stsLib.system.consoleExt.hook();
        stsLib.system.consoleExt.result = '';
        stsLib.system.consoleExt.delimiter = ';';
        stsLib.system.consoleExt.logOutput = false;
        console.log('ABC');
        console.log('DEF');
        console.log('123');
        c.check('ABC;DEF;123;', stsLib.system.consoleExt.result);
        stsLib.system.consoleExt.unhook();
      };

      _.test_stslib_console = function() {
        _.test_consoleLogComment();
        _. test_consoleExt();

        stsLib.alert('finish stslib_console_test テスト終了');
      };

    }());

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

  }());   //stsLib

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

  moduleExports(stsLib, 'stslib_console.js');

}()); //(function() {
