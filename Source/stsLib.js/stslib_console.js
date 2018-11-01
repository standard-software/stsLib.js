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

      _.consoleHook = stsLib.system.consoleHook || {};
      (function() {
        var _ = stsLib.system.consoleHook;

        _.originalConsoleLog = console.log;

        _.logHook = function(func = function() {}) {
          console.log = func;
        };

        _.logUnhook = function() {
          console.log = _.originalConsoleLog;
        };

        _.logTitleIncludes = function(titles, func) {
          if (t.isUndefined(func)) { func = console.log }
          c.assert(t.isFunction(func));
          
          if (Array.isArray(titles)) {
            _.logHook(function(args0) {
              if (titles.includes(args0)) {
                var args = Array.prototype.slice.call(arguments);
                func(args);
              }
            });
          } else if (t.isString(titles)) {
            // titles は文字列
            _.logHook(function(args0) {
              if (String(args0).match(new RegExp(titles)) !== null) {
                var args = Array.prototype.slice.call(arguments);
                func(args);
              }
            });
          } else {
            c.assert(false);
          }
        };

        _.logTitleExcludes = function(titles, func) {
          if (t.isUndefined(func)) { func = console.log }
          c.assert(t.isFunction(func));
          
          if (Array.isArray(titles)) {
            _.logHook(function(args0) {
              if (!titles.includes(args0)) {
                var args = Array.prototype.slice.call(arguments);
                func(args);
              }
            });
          } else if (t.isString(titles)) {
            // titles は文字列
            _.logHook(function(args0) {
              if (String(args0).match(new RegExp(titles)) === null) {
                var args = Array.prototype.slice.call(arguments);
                func(args);
              }
            });
          } else {
            c.assert(false);
          }
        };

      }()); //stsLib.system.consoleHook

      _.test_consoleHook = function() {
        var result = '';
        stsLib.system.consoleHook.logHook(function(message) {
          result += message + ';';
        });
        console.log('ABC');
        console.log('DEF');
        console.log('123');
        stsLib.system.consoleHook.logUnhook();
        c.check('ABC;DEF;123;', result);

        var result = '';
        stsLib.system.consoleHook.logHook(function(message) {
          result += message + ';';
        });
        stsLib.system.consoleHook.logTitleIncludes(['101', '203']);
        console.log('101');
        console.log('102');
        console.log('203');
        stsLib.system.consoleHook.logUnhook();
        c.check('101;203;', result);

        var result = '';
        stsLib.system.consoleHook.logTitleIncludes(
          '^1\\d\\d$',            //先頭1の3桁数値
          function(message) {
            result += message + ';';
          }
        );  
        console.log('101');
        console.log('102');
        console.log('203');
        stsLib.system.consoleHook.logUnhook();
        c.check('101;102;', result);

        var result = '';
        stsLib.system.consoleHook.logTitleExcludes(
          ['101', '203'],
          function(message) {
            result += message + ';';
          }
        );
        console.log('101');
        console.log('102');
        console.log('203');
        stsLib.system.consoleHook.logUnhook();
        c.check('102;', result);

        var result = '';
        stsLib.system.consoleHook.logHook(function(message) {
          result += message + ';';
        });
        stsLib.system.consoleHook.logTitleExcludes('^1\\d\\d$');  //先頭1の3桁数値
        console.log('101');
        console.log('102');
        console.log('203');
        stsLib.system.consoleHook.logUnhook();
        c.check('203;', result);
      };

      _.test_stslib_console = function() {
        _.test_consoleLogComment();
        _.test_consoleHook();

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
