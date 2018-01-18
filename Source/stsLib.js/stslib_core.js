/*----------------------------------------
stsLib.js
Standard Software Library JavaScript
----------------------------------------
ModuleName:     Core Module
FileName:       stslib_core.js
----------------------------------------
License:        MIT License
All Right Reserved:
  Name:         Standard Software
  URL:          https://www.facebook.com/stndardsoftware/
--------------------------------------
Version:        2018/01/16
//----------------------------------------*/

//----------------------------------------
//◆モジュール呼び出し
//----------------------------------------

//----------------------------------------
//・require関数
//----------------------------------------
//  ・require/moduleの無い環境に対応するために
//    require と requireList をグローバルに追加。
//----------------------------------------
if (typeof module === 'undefined') {

  var requireList = requireList || {};
  var require = function(funcName) {
    if (typeof funcName !== 'string') {
      throw new Error('Error:stslib_core.js require');
    }
    //パス区切り以降のみ動作に採用する
    var index = funcName.lastIndexOf('/');
    if (index !== -1) {
      funcName = funcName.substring(index+1);
    }
    if (funcName === '') {
      throw new Error('Error:stslib_core.js require');
    }

    //拡張子が省略されている場合は追加
    if (funcName.indexOf('.') === -1) {
      funcName += '.js';
    }

    for ( var item in requireList) {
      if (funcName === item) {
        if (requireList.hasOwnProperty(item)) {
          return requireList[item];
        }
      }
    }
    throw new Error('Error:stslib_core.js require');
  };
}

//----------------------------------------
//■全体を囲う無名関数
//----------------------------------------
(function() {

  //----------------------------------------
  //・require実行
  //----------------------------------------
  //  ・requireが必要な場合は次のようにする
  //----------------------------------------
  // var stsLib = require('./stsLib_core.js')
  //----------------------------------------

  //----------------------------------------
  //■stsLib名前空間
  //----------------------------------------
  //  ・名前空間は同じ書き方で別ファイルで
  //    定義し直しても別関数を定義していくことができる
  //----------------------------------------
  var stsLib = stsLib || {};
  (function(stsLib, global) {
    'use strict';
    var _ = stsLib;

    //----------------------------------------
    //◆メッセージ出力(alert/console.log)
    //----------------------------------------
    _.alert = function(message) {
      global.alert(message);
    };

    //----------------------------------------
    //◆継承
    //----------------------------------------

    //----------------------------------------
    //・クラス継承関数
    //----------------------------------------
    _.inherits = function(child, parent) {
      function temp() {}
      // ES6
      if (Object.setPrototypeOf) {
        Object.setPrototypeOf(child.prototype, parent.prototype);
      }
      // ES5
      else if (Object.create) {
        child.prototype = Object.create(parent.prototype);
      }
      // legacy platform
      else {
        temp.prototype = parent.prototype;
        child.superClass_ = parent.prototype;
        child.prototype = new temp();
        child.prototype.constructor = child;
      }
    };

    //----------------------------------------
    //・プロトタイプ継承のためのObject.create代替処理
    //----------------------------------------
    _.objectCreate = function(parent) {
      function F() {}
      F.prototype = parent;
      return new F();
    };

    //----------------------------------------
    //◆制御構文
    //----------------------------------------
    _.syntax = stsLib.syntax || {};
    (function() {
      var _ = stsLib.syntax;

      _.forLoop = function(start, end,
        funcAll, funcFirst, funcMiddle, funcLast) {

        c.assert(t.isInts(start, end));
        var funcEmpty = function() { return; };
        funcAll = t.ifNullOrUndefinedValue(funcAll, funcEmpty);
        funcFirst = t.ifNullOrUndefinedValue(funcFirst, funcEmpty);
        funcMiddle = t.ifNullOrUndefinedValue(funcMiddle, funcEmpty);
        funcLast = t.ifNullOrUndefinedValue(funcLast, funcEmpty);
        for (var i = start; i <= end; i += 1) {
          funcAll(i);
          if (i === start) {
            funcFirst(i);
          } else if (i !== end) {
            funcMiddle(i);
          }
          if (i === end) {
            funcLast(i);
          }
        }
      };

      _.test_forLoop = function() {
        var forLoopTestFunc = function() {
          return _.forLoop(0, array.length - 1,
            function(index) { str += 'all:' + array[index] + ' '; },
            function(index) { str += 'first:' + array[index] + ' '; },
            function(index) { str += 'middle:' + array[index] + ' '; },
            function(index) { str += 'last:' + array[index] + ' '; }
          );
        };
        var str;
        var array;
        str = '';
        array = [];
        forLoopTestFunc();
        c.check('', str);

        str = '';
        array = ['a'];
        forLoopTestFunc();
        c.check('all:a first:a last:a ', str);

        str = '';
        array = ['a', 'b'];
        forLoopTestFunc();
        c.check('all:a first:a all:b last:b ', str);

        str = '';
        array = ['a', 'b', 'c'];
        forLoopTestFunc();
        c.check('all:a first:a all:b middle:b all:c last:c ', str);

        str = '';
        array = ['a', 'b', 'c', 'd'];
        forLoopTestFunc();
        c.check('all:a first:a all:b middle:b all:c middle:c all:d last:d ', str);

      };

    }()); //syntax

    //----------------------------------------
    //◆条件判断
    //----------------------------------------
    _.compare = stsLib.compare || {};
    (function() {
      var _ = stsLib.compare;

      //----------------------------------------
      //・assert関数
      //----------------------------------------
      //  ・value が true でなければ
      //      例外を出力する関数
      //  ・他言語でよく使う
      //----------------------------------------
      _.assert = function(value, message) {

        if ((typeof message === 'undefined')
        || (message === null)) {
          message = '';
        }
        if (typeof value !== 'boolean') {
          throw new Error('Error:' + message);
        }
        if (!value) {
          throw new Error('Error:' + message);
        }
      };

      //----------------------------------------
      //・check関数
      //----------------------------------------
      //  ・2値が一致するかどうか確認する関数
      //----------------------------------------
      _.check = function(a, b, message) {
        if (a === b) {
          return true;
        }
        if ((typeof message === 'undefined')
        || (message === null)) {
          message = '';
        } else {
          message = 'Test:' + message + '\n';
        }
        message = message +
            'A != B' + '\n' +
            'A = ' + a + '\n' +
            'B = ' + b;
        alert(message);
        return false;
      };

      _.test_check = function() {

        c.check(true, '123' === '123');
        c.check(true, ' 123' == 123);
        c.check(false, ' 123' === 123);
      };

      //----------------------------------------
      //・例外チェック関数
      //----------------------------------------
      //  ・関数と結果が、=か!=か例外発生かを
      //      判定することができる関数
      //----------------------------------------
      _.checkException = function(funcResult, func) {
        try {
          var args = [].slice.call(arguments,2);
          if (funcResult !== func.apply(null, args)) {
            return 'NG';
          } else {
            return 'OK';
          }
        } catch(e) {
          return 'ER';
        }
      };

      _.test_checkException = function() {

        var testFunc1 = function(a, b) {
          return a / b;
        };
        var testFunc2 = function(a, b) {
          if (b === 0) {
            throw new Error('error');
          }
          return a / b;
        };

        c.check('OK', _.checkException(5, testFunc1, 5, 1));
        c.check('NG', _.checkException(1, testFunc1, 5, 1));
        c.check('OK', _.checkException(2.5, testFunc1, 5, 2));
        c.check('OK', _.checkException(Infinity, testFunc1, 5, 0));
        c.check('OK', _.checkException(5, testFunc2, 5, 1));
        c.check('NG', _.checkException(1, testFunc2, 5, 1));
        c.check('OK', _.checkException(2.5, testFunc2, 5, 2));
        c.check('ER', _.checkException(Infinity, testFunc2, 5, 0));
      };

      //----------------------------------------
      //・例外を含めた結果チェック関数
      //----------------------------------------
      //  ・returnResultに 'OK'/'NG'/'ER'の
      //      どれかを指定して
      //      funcResultとfuncの戻り値の、一致/不一致/例外発生
      //      をテストすることができる
      //  ・check関数とcheckException関数の組み合わせで
      //      下記のように実装もできるが
      //      メッセージなど作り込みたかったり
      //      何より単独でコピペできないので
      //      コード行数は長いが、現在の実装を採用する
      //        var checkResult = function(returnResult, funcResult, func) {
      //          var args = [].slice.call(arguments, 1);
      //          check(returnResult, checkException.apply(null, args));
      //        };
      //----------------------------------------
      _.checkResult = function(returnResult, funcResult, func) {
        var args, message, a, b;
        message = '';
        args = [].slice.call(arguments, 3);
        a = funcResult;
        try {
          b = func.apply(null, args);
          if (a === b) {
            if (returnResult !== 'OK') {
              message = returnResult + '!=OK\n' +
                'A == B' + '\n' +
                'A = ' + a.toString() + '\n' +
                'B = ' + b.toString();
            }
          } else {
            if (returnResult !== 'NG') {
              message = returnResult + '!=NG\n' +
                'A != B' + '\n' +
                'A = ' + a.toString() + '\n' +
                'B = ' + b.toString();
            }
          }
        } catch(e) {
          if (returnResult !== 'ER') {
            message = returnResult + '!=ER\n' +
              'A = ' + a.toString() + '\n' +
              'B = undefined';
          }
        }
        if (message !== '') {
          alert(message);
        }
      };

      _.test_checkResult = function() {

        var sampleDiv1 = function(a, b) {
          return a / b;
        };
        var sampleDiv2 = function(a, b) {
          if (b === 0) {
            throw new Error('error');
          }
          return a / b;
        };

        c.checkResult('OK', 5,       sampleDiv1, 5, 1);
        c.checkResult('NG', 1,       sampleDiv1, 5, 1);
        c.checkResult('OK', 2.5,     sampleDiv1, 5, 2);
        c.checkResult('OK', Infinity,sampleDiv1, 5, 0);
        c.checkResult('OK', 5,       sampleDiv2, 5, 1);
        c.checkResult('NG', 1,       sampleDiv2, 5, 1);
        c.checkResult('OK', 2.5,     sampleDiv2, 5, 2);
        c.checkResult('ER', Infinity,sampleDiv2, 5, 0);
      };

      _.benchMark = function(loopCount, func) {
        var startTime = new Date();

        var args = [].slice.call(arguments,2);

        for (var i = 0, max = loopCount - 1;
          i <= max - 1; i++) {
          func.apply(null, args);
        }

        var endTime = new Date();
        return endTime - startTime;
      };


      //----------------------------------------
      //・orValue関数
      //----------------------------------------
      //  ・値が引数と一致しているかどうかを確認する関数
      //  ・orValue(a, 0, 1); として
      //      aが0か1かならtrueを返す
      //----------------------------------------
      _.orValue = function(value, compares) {

        c.assert(2 <= arguments.length);
        var count = arguments.length;
        for (var i = 1; i < count; i += 1) {
          if (value === arguments[i]) {
            return true;
          }
        }
        return false;
      };

      _.test_orValue = function() {

        var a = 1;
        c.check(true, _.orValue(a, 1));
        c.check(true, _.orValue(a, 1, 2));
        c.check(true, _.orValue(a, 1, 2, 3));
        c.check(false,_.orValue(a, 2, 3, 4));
        c.checkResult('ER', 0, _.orValue, a);
      };

    }()); //compare

    //----------------------------------------
    //◆型 確認/変換 処理
    //----------------------------------------
    _.type = stsLib.type || {};
    (function() {
      var _ = stsLib.type;

      //----------------------------------------
      //◇typeof
      //----------------------------------------
      //  ・通常の typeof が object を返す判定できない
      //    null/array/date を判定して返す関数
      //----------------------------------------
      _.typeof = function(value) {
        var result = typeof value;
        if (result === 'object') {
          if (t.isNull(value)) {
            result = 'null';
          } else if (t.isArray(value)){
            result = 'array';
          } else if (t.isDate(value)) {
            result = 'date';
          }
        }
        return result;
      };

      //----------------------------------------
      //◇引数すべてに型をチェックする
      //----------------------------------------

      _.isTypeCheck = function(checkFunc, argsArray) {
        c.assert(1 <= arguments.length);
        c.assert(typeof checkFunc == 'function');
        c.assert(Array.isArray(argsArray));

        var l = argsArray.length;
        if (l === 0) {
          return false;
        } else if (l === 1) {
          return checkFunc(argsArray[0]);
        } else {
          for (var i = 0; i < l; i += 1) {
            if (!checkFunc(argsArray[i])) {
              return false;
            }
          }
          return true;
        }
      };

      //----------------------------------------
      //◇Undefined/null チェック
      //----------------------------------------

      _.isUndefined = function(value) {
        return (typeof value === 'undefined');
      };

      _.isNotUndefined = function(value) {
        return !_.isUndefined(value);
      };

      _.isUndefineds = function(value) {
        return _.isTypeCheck(_.isUndefined,
          a.fromArgs(arguments));
      };

      _.isNotUndefineds = function(value) {
        return _.isTypeCheck(_.isNotUndefined,
          a.fromArgs(arguments));
      };

      _.isUndefinedArray = function(value) {
        return _.isTypeCheck(_.isUndefined, value);
      };

      _.isNotUndefinedArray = function(value) {
        return _.isTypeCheck(_.isNotUndefined, value);
      };

      _.test_isUndefined = function () {
        var u1;
        var n1 = null;
        var v1 = 1;

        c.check(true,   _.isUndefined(u1));
        c.check(false,  _.isUndefined(n1));
        c.check(false,  _.isUndefined(v1));
        c.check(true,   _.isUndefineds(u1));
        c.check(false,  _.isUndefineds(n1));
        c.check(false,  _.isUndefineds(v1));
        c.check(true,   _.isUndefinedArray([u1]));
        c.check(false,  _.isUndefinedArray([n1]));
        c.check(false,  _.isUndefinedArray([v1]));

        c.check(true,   _.isUndefineds(u1, u1));
        c.check(false,  _.isUndefineds(u1, n1));
        c.check(false,  _.isUndefineds(u1, v1));
        c.check(true,   _.isUndefinedArray([u1, u1]));
        c.check(false,  _.isUndefinedArray([u1, n1]));
        c.check(false,  _.isUndefinedArray([u1, v1]));

        c.check(false,  _.isNotUndefineds(u1));
        c.check(true,   _.isNotUndefineds(n1));
        c.check(true,   _.isNotUndefineds(v1));
        c.check(false,  _.isNotUndefinedArray([u1]));
        c.check(true,   _.isNotUndefinedArray([n1]));
        c.check(true,   _.isNotUndefinedArray([v1]));

        c.check(false,  _.isNotUndefineds(u1, u1));
        c.check(false,  _.isNotUndefineds(u1, n1));
        c.check(true,   _.isNotUndefineds(n1, n1));
        c.check(false,  _.isNotUndefineds(n1, u1));
        c.check(true,   _.isNotUndefineds(v1, v1));
        c.check(true,   _.isNotUndefineds(v1, n1));
        c.check(false,  _.isNotUndefineds(v1, u1));
        c.check(false,  _.isNotUndefinedArray([u1, u1]));
        c.check(false,  _.isNotUndefinedArray([u1, n1]));
        c.check(true,   _.isNotUndefinedArray([n1, n1]));
        c.check(false,  _.isNotUndefinedArray([n1, u1]));
        c.check(true,   _.isNotUndefinedArray([v1, v1]));
        c.check(true,   _.isNotUndefinedArray([v1, n1]));
        c.check(false,  _.isNotUndefinedArray([v1, u1]));

        //配列の中身ではなく配列自体を判定する
        //配列はundefinedではない
        c.check(false,  _.isUndefineds([v1, v1]));
        c.check(false,  _.isUndefineds([u1, u1]));
        c.check(true,   _.isNotUndefineds([v1, v1]));
        c.check(true,   _.isNotUndefineds([u1, u1]));
      };

      _.isNull = function(value) {
        return (value === null);
      };

      _.isNotNull = function(value) {
        return !_.isNull(value);
      };

      _.isNulls = function(value) {
        return _.isTypeCheck(_.isNull,
          a.fromArgs(arguments));
      };

      _.isNotNulls = function(value) {
        return _.isTypeCheck(_.isNotNull,
          a.fromArgs(arguments));
      };

      _.isNullArray = function(value) {
        return _.isTypeCheck(_.isNull, value);
      };

      _.isNotNullArray = function(value) {
        return _.isTypeCheck(_.isNotNull, value);
      };

      _.test_isNull = function () {
        var u1;
        var n1 = null;
        var v1 = 1;

        c.check(false,  _.isNull(u1));
        c.check(true ,  _.isNull(n1));
        c.check(false,  _.isNull(v1));
        c.check(false,  _.isNulls(u1));
        c.check(true ,  _.isNulls(n1));
        c.check(false,  _.isNulls(v1));
        c.check(false,  _.isNullArray([u1]));
        c.check(true ,  _.isNullArray([n1]));
        c.check(false,  _.isNullArray([v1]));

        c.check(true,   _.isNulls(n1, n1));
        c.check(false,  _.isNulls(n1, u1));
        c.check(false,  _.isNulls(n1, v1));
        c.check(true,   _.isNullArray([n1, n1]));
        c.check(false,  _.isNullArray([n1, u1]));
        c.check(false,  _.isNullArray([n1, v1]));

        c.check(true,   _.isNotNulls(u1));
        c.check(false,  _.isNotNulls(n1));
        c.check(true,   _.isNotNulls(v1));
        c.check(true,   _.isNotNullArray([u1]));
        c.check(false,  _.isNotNullArray([n1]));
        c.check(true,   _.isNotNullArray([v1]));

        c.check(true,   _.isNotNulls(u1, u1));
        c.check(false,  _.isNotNulls(u1, n1));
        c.check(false,  _.isNotNulls(n1, n1));
        c.check(false,  _.isNotNulls(n1, u1));
        c.check(true,   _.isNotNulls(v1, v1));
        c.check(false,  _.isNotNulls(v1, n1));
        c.check(true,   _.isNotNulls(v1, u1));
        c.check(true,   _.isNotNullArray([u1, u1]));
        c.check(false,  _.isNotNullArray([u1, n1]));
        c.check(false,  _.isNotNullArray([n1, n1]));
        c.check(false,  _.isNotNullArray([n1, u1]));
        c.check(true,   _.isNotNullArray([v1, v1]));
        c.check(false,  _.isNotNullArray([v1, n1]));
        c.check(true,   _.isNotNullArray([v1, u1]));
      };

      _.isNullOrUndefined = function(value) {
        return (_.isNull(value) || _.isUndefined(value));
      };

      _.isNotNullOrUndefined = function(value) {
        return !_.isNullOrUndefined(value);
      };

      _.isNullOrUndefineds = function(value) {
        return _.isTypeCheck(_.isNullOrUndefined,
          a.fromArgs(arguments));
      };

      _.isNotNullOrUndefineds = function(value) {
        return _.isTypeCheck(_.isNotNullOrUndefined,
          a.fromArgs(arguments));
      };

      _.isNullOrUndefinedArray = function(value) {
        return _.isTypeCheck(_.isNullOrUndefined, value);
      };

      _.isNotNullOrUndefinedArray = function(value) {
        return _.isTypeCheck(_.isNotNullOrUndefined, value);
      };

      _.test_isNullOrUndefined = function() {

        var u1;
        var n1 = null;
        var v1 = 1;

        c.check(true,   _.isNullOrUndefined(u1));
        c.check(true,   _.isNullOrUndefined(n1));
        c.check(false,  _.isNullOrUndefined(v1));
        c.check(true,   _.isNullOrUndefineds(u1));
        c.check(true,   _.isNullOrUndefineds(n1));
        c.check(false,  _.isNullOrUndefineds(v1));
        c.check(true,   _.isNullOrUndefinedArray([u1]));
        c.check(true,   _.isNullOrUndefinedArray([n1]));
        c.check(false,  _.isNullOrUndefinedArray([v1]));

        c.check(true,   _.isNullOrUndefineds(u1, u1));
        c.check(true,   _.isNullOrUndefineds(u1, n1));
        c.check(false,  _.isNullOrUndefineds(u1, v1));
        c.check(true,   _.isNullOrUndefinedArray([u1, u1]));
        c.check(true,   _.isNullOrUndefinedArray([u1, n1]));
        c.check(false,  _.isNullOrUndefinedArray([u1, v1]));

        c.check(false,  _.isNotNullOrUndefineds(u1));
        c.check(false,  _.isNotNullOrUndefineds(n1));
        c.check(true,   _.isNotNullOrUndefineds(v1));
        c.check(false,  _.isNotNullOrUndefinedArray([u1]));
        c.check(false,  _.isNotNullOrUndefinedArray([n1]));
        c.check(true,   _.isNotNullOrUndefinedArray([v1]));

        c.check(false,  _.isNotNullOrUndefineds(u1, u1));
        c.check(false,  _.isNotNullOrUndefineds(u1, n1));
        c.check(false,  _.isNotNullOrUndefineds(n1, n1));
        c.check(false,  _.isNotNullOrUndefineds(n1, u1));
        c.check(true,   _.isNotNullOrUndefineds(v1, v1));
        c.check(false,  _.isNotNullOrUndefineds(v1, n1));
        c.check(false,  _.isNotNullOrUndefineds(v1, u1));
        c.check(false,  _.isNotNullOrUndefinedArray([u1, u1]));
        c.check(false,  _.isNotNullOrUndefinedArray([u1, n1]));
        c.check(false,  _.isNotNullOrUndefinedArray([n1, n1]));
        c.check(false,  _.isNotNullOrUndefinedArray([n1, u1]));
        c.check(true,   _.isNotNullOrUndefinedArray([v1, v1]));
        c.check(false,  _.isNotNullOrUndefinedArray([v1, n1]));
        c.check(false,  _.isNotNullOrUndefinedArray([v1, u1]));

      };

      //----------------------------------------
      //◇Null Undefined 処理
      //----------------------------------------

      //----------------------------------------
      //・値が NullOrUndefined なら特定の値を返す
      //----------------------------------------
      //  ・引数のデフォルト値として使える
      //----------------------------------------
      _.ifNullOrUndefinedValue = function(value, defaultValue) {
        if (_.isNullOrUndefined(value)) {
          return defaultValue;
        } else {
          return value;
        }
      };

      _.test_ifNullOrUndefinedValue = function() {
        c.check(1,  _.ifNullOrUndefinedValue(1, 5));
        c.check(5,  _.ifNullOrUndefinedValue(null, 5));
        c.check(5,  _.ifNullOrUndefinedValue(undefined, 5));
        c.check('', _.ifNullOrUndefinedValue('', 5));
      };

      //----------------------------------------
      //◇isBoolean
      //----------------------------------------
      //  ・isBooleansは
      //    可変引数の全てがBooleanかどうかを確認する
      //----------------------------------------
      _.isBoolean = function(value) {
        return (typeof value === 'boolean');
      };

      _.isBooleans = function(value) {
        return _.isTypeCheck(_.isBoolean,
          a.expand2Dimension(a.fromArgs(arguments)));
      };

      _.isNotBooleans = function(value) {
        return _.isTypeCheck(function(v) {
          return !(_.isBoolean(v));
        }, a.expand2Dimension(a.fromArgs(arguments)));
      };

      _.test_isBoolean = function() {

        c.check(true, _.isBooleans(true));
        c.check(true, _.isBooleans(false));
        c.check(false,_.isBooleans(undefined));
        c.check(false,_.isBooleans(null));
        c.check(false,_.isBooleans(''));
        c.check(false,_.isBooleans('true'));
        c.check(false,_.isBooleans('false'));
        c.check(false,_.isBooleans(123));
        c.check(false,_.isBooleans(0));
        c.check(false,_.isBooleans(-1));

        c.check(true, _.isBooleans(true, true));
        c.check(true, _.isBooleans(true, true, true));
        c.check(true, _.isBooleans(true, false, true));
        c.check(false, _.isBooleans(true, 1, true));
      };

      //----------------------------------------
      //◇isNumber
      //----------------------------------------
      //  ・isFiniteで判断しているように
      //    NaNやInfinityは有効数値ではないとしておく
      //  ・isNumbersは
      //    可変引数の全てが有効数値かどうかを確認する
      //----------------------------------------
      _.isNumber = function(value) {
        return ((typeof value === 'number') && (isFinite(value)));
      };

      _.isNumbers = function(value) {
        return _.isTypeCheck(_.isNumber,
          a.expand2Dimension(a.fromArgs(arguments)));
      };

      _.isNotNumbers = function(value) {
        return _.isTypeCheck(function(v) {
          return !(_.isNumber(v));
        }, a.expand2Dimension(a.fromArgs(arguments)));
      };

      _.test_isNumber = function() {

        c.check(true, _.isNumbers(123));
        c.check(true, _.isNumbers(0));
        c.check(true, _.isNumbers(-1));
        c.check(true ,_.isNumbers(123.4));
        c.check(true, _.isNumbers(123.0));
        c.check(false,_.isNumbers(true));
        c.check(false,_.isNumbers(false));
        c.check(false,_.isNumbers(null));
        c.check(false,_.isNumbers(undefined));
        c.check(false,_.isNumbers(Infinity));  //InfinityもNumberとして許可しないことにする
        c.check(false,_.isNumbers(NaN));
        c.check(false,_.isNumbers(''));
        c.check(false,_.isNumbers('ABC'));
        c.check(false,_.isNumbers('ABC10'));
        c.check(false,_.isNumbers('10ABC'));
        c.check(false,_.isNumbers('0ABC'));
        c.check(false,_.isNumbers('0'));
        c.check(false,_.isNumbers('5'));
        c.check(false,_.isNumbers('-5'));
        c.check(false,_.isNumbers('100'));
        c.check(false,_.isNumbers('-100'));
        c.check(false,_.isNumbers([]));
        c.check(false,_.isNumbers({}));

        c.check(false,  _.isNotNumbers(123));
        c.check(false,  _.isNotNumbers(0));
        c.check(true,   _.isNotNumbers(true));
        c.check(true,   _.isNotNumbers(null));
        c.check(true,   _.isNotNumbers(undefined));
        c.check(true,   _.isNotNumbers(Infinity));
        c.check(true,   _.isNotNumbers(NaN));
        c.check(true,   _.isNotNumbers(''));

        c.check(true,   _.isNumbers(1, 2));
        c.check(true,   _.isNumbers(3, 4, 5));
        c.check(true,   _.isNumbers(10.5, 20.5, 30.5));
        c.check(false,  _.isNumbers(1, 2, true));

        c.check(false,  _.isNotNumbers(1, 2));
        c.check(false,  _.isNotNumbers(3, 4, 5));
        c.check(false,  _.isNotNumbers(10.5, 20.5, 30.5));
        c.check(false,  _.isNotNumbers(1, 2, true));
        c.check(true,   _.isNotNumbers(false, true));
        c.check(true,   _.isNotNumbers('a', 'b'));
      };

      //----------------------------------------
      //◇isInt
      //----------------------------------------
      //  ・isIntsは
      //    可変引数の全てが整数かどうかを確認する
      //----------------------------------------

      _.isInt = function(value) {
        if (!_.isNumber(value)) {
          return false;
        }
        return Math.round(value) === value;
      };

      _.isInts = function(value) {
        return _.isTypeCheck(_.isInt,
          a.expand2Dimension(a.fromArgs(arguments)));
      };

      _.isNotInts = function(value) {
        return _.isTypeCheck(function(v) {
          return !(_.isInt(v));
        }, a.expand2Dimension(a.fromArgs(arguments)));
      };

      _.test_isInt = function() {

        c.check(true, _.isInts(123));
        c.check(true, _.isInts(0));
        c.check(true, _.isInts(-1));
        c.check(false,_.isInts(123.4));
        c.check(true, _.isInts(123.0));
        //.0の場合は整数か小数かは判断できない

        c.check(false,_.isInts(true));
        c.check(false,_.isInts(false));
        c.check(false,_.isInts(null));
        c.check(false,_.isInts(undefined));
        c.check(false,_.isInts(''));
        c.check(false,_.isInts('ABC'));
        c.check(false,_.isInts('0'));
        c.check(false,_.isInts('5'));
        c.check(false,_.isInts('-5'));
        c.check(false,_.isInts('100'));
        c.check(false,_.isInts('-100'));
        c.check(false,_.isInts([]));
        c.check(false,_.isInts({}));

        c.check(true,   _.isInts(1, 2));
        c.check(true,   _.isInts(3, 4, 5));
        c.check(true,   _.isInts(10, 20, 30));
        c.check(false,  _.isInts(1, 2, 3.5));

        c.check(false,  _.isNotInts(1, 2));
        c.check(false,  _.isNotInts(3, 4, 5));
        c.check(false,  _.isNotInts(10, 20, 30));
        c.check(false,  _.isNotInts(1, 2, 3.5));
        c.check(false,  _.isNotInts(1, 2.1, 3.5));
        c.check(true,   _.isNotInts(1.1, 2.2, 3.5));

        c.check(false,  _.isInts([]));
        c.check(true,   _.isInts([1]));
        c.check(true,   _.isInts([1, 2, 3]));
        c.check(true,   _.isInts([1, 2, 0]));
        c.check(false,  _.isInts([1, 2, NaN]));
        c.check(false,  _.isInts([1, 2, null]));
        c.check(false,  _.isInts(['a', 'b', 1]));
      };

      //----------------------------------------
      //◇isString
      //----------------------------------------
      //  ・isStringsは
      //    可変引数の全てが文字列かどうかを確認する
      //----------------------------------------
      _.isString = function(value) {
        return (typeof value === 'string');
      };

      _.isStrings = function(value) {
        return _.isTypeCheck(_.isString,
          a.expand2Dimension(a.fromArgs(arguments)));
      };

      _.isNotStrings = function(value) {
        return _.isTypeCheck(function(v) {
          return !(_.isString(v));
        }, a.expand2Dimension(a.fromArgs(arguments)));
      };

      _.test_isString = function() {
        c.check(false,  _.isStrings([]));
        c.check(true,   _.isStrings(['']));
        c.check(true,   _.isStrings(['a']));
        c.check(true,   _.isStrings(['a', 'b', 'c']));
        c.check(true,   _.isStrings(['a', 'b', '']));
        c.check(false,  _.isStrings(['a', 'b', 0]));
        c.check(false,  _.isStrings(['a', 'b', 1]));
        c.check(false,  _.isStrings(['a', 'b', null]));
        c.check(false,  _.isStrings(['a', 'b', undefined]));
      };

      //----------------------------------------
      //◇isFunction
      //----------------------------------------
      //  ・isFunctionsは
      //    可変引数の全てが関数かどうかを確認する
      //----------------------------------------
      _.isFunction = function(value) {
        return (typeof value === 'function');
      };

      _.isFunctions = function(value) {
        return _.isTypeCheck(_.isFunction,
          a.expand2Dimension(a.fromArgs(arguments)));
      };

      _.isNotFunctions = function(value) {
        return _.isTypeCheck(function(v) {
          return !(_.isFunction(v));
        }, a.expand2Dimension(a.fromArgs(arguments)));
      };

      _.test_isFunction = function() {
        c.check(true,   _.isFunction( function(){} ) );
        c.check(false,  _.isFunction( {} ) );
      };

      //----------------------------------------
      //◇isObject
      //----------------------------------------
      //  ・WSH JScript の場合のみ
      //    Object.prototype.toString.call(v) === '[object Object]'
      //    だけで判断できないので
      //    isArray / isNull / isUndefined を確認する
      //  ・isObjectsは
      //    可変引数の全てがオブジェクトかどうかを確認する
      //----------------------------------------

      _.isObject = function(value) {
        if (
          (Object.prototype.toString.call(value) === '[object Object]')
          && (!Array.isArray(value))
          && (value !== null)
          && (typeof value !== 'undefined')
        ) {
          return true;
        }
        return false;
      };

      _.isObjects = function(value) {
        return _.isTypeCheck(_.isObject,
          a.expand2Dimension(a.fromArgs(arguments)));
      };

      _.isNotObjects = function(value) {
        return _.isTypeCheck(function(v) {
          return !(_.isObject(v));
        }, a.expand2Dimension(a.fromArgs(arguments)));
      };

      _.test_isObject = function() {
        c.check(true,   _.isObjects({}));
        c.check(true,   _.isObjects({a:0}));
        c.check(true,   _.isObjects({a:0, b:1}));
        c.check(true,   _.isObjects([{}, {a:0, b:1}]));
        c.check(false,  _.isObjects([[], {a:0, b:1}]));
        c.check(false,  _.isObjects([[{}], {a:0, b:1}]));

        c.check(true,   _.isObjects({a:0, b:1}, {c:0, d:1}));

        c.check(false,  _.isObjects([]));
        c.check(false,  _.isObjects(null));
        c.check(false,  _.isObjects(undefined));
        c.check(false,  _.isObjects(function(){})); //関数はオブジェクトにならない
      };

      //----------------------------------------
      //◇isArray
      //----------------------------------------
      //  ・isArraysは
      //    可変引数の全てがオブジェクトかどうかを確認する
      //----------------------------------------

      _.isArray = function(value) {
        return Object.prototype.toString.call(value) === '[object Array]';
      };

      _.isArrays = function(value) {
        return _.isTypeCheck(_.isArray,
          a.expand2Dimension(a.fromArgs(arguments)));
      };

      _.isNotArrays = function(value) {
        return _.isTypeCheck(function(v) {
          return !(_.isArray(v));
        }, a.expand2Dimension(a.fromArgs(arguments)));
      };

      _.test_isArray = function() {

        c.check(true, _.isArrays([123]));
        c.check(true, _.isArrays([]));
        c.check(true, _.isArrays([1,2,3]));
        c.check(false,_.isArrays(123));
        c.check(false,_.isArrays('1,2,3'));

        c.check(true,   _.isArrays([1], [2]));
        c.check(true,   _.isArrays([3], [4], [5]));
        c.check(true,   _.isArrays([10, 20], [30]));
        c.check(false,  _.isArrays([1, 2], 3));

        c.check(true,   _.isNotArrays(1, 2));
        c.check(false,  _.isNotArrays([3], [4], 5));
        c.check(true,   _.isNotArrays(10, 20, 30));
        c.check(false,  _.isNotArrays(10, 20, [30]));
      };

      //----------------------------------------
      //◇isDate
      //----------------------------------------
      _.isDate = function(value) {
        return Object.prototype.toString.call(value) === '[object Date]';
      };

      _.isDates = function(value) {
        return _.isTypeCheck(_.isDate,
          a.expand2Dimension(a.fromArgs(arguments)));
      };

      _.isNotDates = function(value) {
        return _.isTypeCheck(function(v) {
          return !(_.isDate(v));
        }, a.expand2Dimension(a.fromArgs(arguments)));
      };

      _.test_isDate = function() {
        c.check(true,   _.isDate(new Date(2017,1,1)));
        c.check(true,   _.isDate(new Date('2017/01')));
        c.check(true,   _.isDate(new Date(2017,1)));
        c.check(true,   _.isDate(new Date(2017,1)));
      };

      //----------------------------------------
      //◇isPoint
      //----------------------------------------
      //  ・Pointを継承しているかどうかで判断する
      //  ・isPointsは
      //    可変引数の全てが関数かどうかを確認する
      //----------------------------------------
      _.isPoint = function(point) {
        return (point instanceof p.Point);
      };

      _.isPoints = function(value) {
        return _.isTypeCheck(_.isPoint,
          a.expand2Dimension(a.fromArgs(arguments)));
      };

      _.isNotPoints = function(value) {
        return _.isTypeCheck(function(v) {
          return !(_.isPoint(v));
        }, a.expand2Dimension(a.fromArgs(arguments)));
      };

      _.test_isPoint = function() {
        c.check(true,   _.isPoint(p.Point(1,2)));
        c.check(false,  _.isPoint({x:1, y:2}));
        c.check(true,   _.isPoints(p.Point(1,2),p.Point(3,4)));
        c.check(false,  _.isPoints(p.Point(1,2), {x:3, y:4}, {}));
      };

      //----------------------------------------
      //◇isVector
      //----------------------------------------
      //  ・プロパティ start / end が存在するかどうか
      //    それぞれが point かどうかで判断する
      //  ・isVectorsは
      //    可変引数の全てが関数かどうかを確認する
      //----------------------------------------
      _.isVector = function(vector) {
        return (vector instanceof v.Vector);
      };

      _.isVectors = function(value) {
        return _.isTypeCheck(_.isVector,
          a.expand2Dimension(a.fromArgs(arguments)));
      };

      _.isNotVectors = function(value) {
        return _.isTypeCheck(function(v) {
          return !(_.isVector(v));
        }, a.expand2Dimension(a.fromArgs(arguments)));
      };

      _.test_isVector = function() {
        c.check(true, _.isVector(
          v.Vector(p.Point(0,0), p.Point(1,1))));
      };

      //----------------------------------------
      //◇isRect
      //----------------------------------------
      //  ・Rectから継承されているかどうかで判断する
      //  ・isRectsは
      //    可変引数の全てが関数かどうかを確認する
      //----------------------------------------
      _.isRect = function(rect) {
        return (rect instanceof r.Rect);
      };

      _.isRects = function(value) {
        return _.isTypeCheck(_.isRect,
          a.expand2Dimension(a.fromArgs(arguments)));
      };

      _.isNotRects = function(value) {
        return _.isTypeCheck(function(v) {
          return !(_.isRects(v));
        }, a.expand2Dimension(a.fromArgs(arguments)));
      };

      _.test_isRect = function() {
        var r1 = r.Rect(p.Point(2,2), p.Point(4,6));
        var r2 = r.Rect(p.Point(1,1), p.Point(4,6));
        c.check(true,   _.isRect(r1));
        c.check(false,  _.isRect({top:1, left:2, bottom:3, right:4}));
        c.check(true,   _.isRects(r1,r2));
        c.check(false,  _.isRects(r1, {top:1, left:2, bottom:3, right:4}));
        c.check(false,  _.isRects(r1, r2, {}));
      };

      //----------------------------------------
      //◇変換
      //----------------------------------------

      //----------------------------------------
      //・数値(小数点値)
      //----------------------------------------
      //  ・変換できない場合はnullを返す
      //  ・10進数のみ
      //----------------------------------------
      _.convertToNumber = function(str) {
        c.assert(t.isString(str));

        var result;
        if (!s.checkFormat(str, 'float')) { return null; }
        result = Number(str);
        return t.isNumber(result) ? result : null;
      };

      _.test_convertToNumber = function() {
        c.check('ER', c.checkException(123, _.convertToNumber, 123));

        c.check('OK', c.checkException(123, _.convertToNumber, '123'));
        c.check('OK', c.checkException(123, _.convertToNumber, '0123'));
        c.check('OK', c.checkException(123, _.convertToNumber, '+123'));
        c.check('OK', c.checkException(-123, _.convertToNumber, '-0123'));
        c.check('NG', c.checkException(123, _.convertToNumber, ' 123'));
        c.check('NG', c.checkException(123, _.convertToNumber, '123 '));
        c.check('NG', c.checkException(123, _.convertToNumber, ' 123 '));
        c.check('NG', c.checkException(123, _.convertToNumber, '123 0'));
        c.check('NG', c.checkException(123, _.convertToNumber, '0 123'));
        c.check('NG', c.checkException(123, _.convertToNumber, '1 123'));

        c.check('NG', c.checkException(123, _.convertToNumber, '123a'));
        c.check('NG', c.checkException(123, _.convertToNumber, 'a123'));

        c.check('OK', c.checkException(123.4, _.convertToNumber, '123.4'));
        c.check('OK', c.checkException(123.4, _.convertToNumber, '0123.4'));
        c.check('OK', c.checkException(123.4, _.convertToNumber, '+123.4'));
        c.check('OK', c.checkException(-123.4, _.convertToNumber, '-0123.4'));
        c.check('NG', c.checkException(123.4, _.convertToNumber, ' 123.4'));
        c.check('NG', c.checkException(123.4, _.convertToNumber, '123.4 '));
        c.check('NG', c.checkException(123.4, _.convertToNumber, ' 123.4 '));
        c.check('NG', c.checkException(123.4, _.convertToNumber, '123.4 0'));
        c.check('NG', c.checkException(123.4, _.convertToNumber, '0 123.4'));
        c.check('NG', c.checkException(123.4, _.convertToNumber, '1 123.4'));
        c.check('NG', c.checkException(123.4, _.convertToNumber, '123 .4'));
        c.check('NG', c.checkException(123.4, _.convertToNumber, '123. 4'));

        c.check('NG', c.checkException(123.4, _.convertToNumber, '123.4a'));
        c.check('NG', c.checkException(123.4, _.convertToNumber, 'a123.4'));

        c.check('OK', c.checkException(123.45, _.convertToNumber, '123.45'));
        c.check('NG', c.checkException(123.45, _.convertToNumber, '123.4.5'));
      };

      //----------------------------------------
      //・整数値
      //----------------------------------------
      //  ・変換できない場合はnullを返す
      //  ・radixで進数指定、省略時は10進数
      //  ・2進数/8進数/16進数は負の値なし
      //----------------------------------------
      _.convertToInt = function(str, radix) {
        c.assert(t.isString(str));
        radix = t.ifNullOrUndefinedValue(radix, 10);
        c.assert(c.orValue(radix, 10, 2, 8, 16));

        var result;
        switch (radix) {
        case 10:
          if (!s.checkFormat(str, 'integer')) { return null; }
          result = Number(str);
          return t.isInt(result) ? result : null;
        case 2:
          if (!s.checkFormat(str, 'binary')) { return null; }
          result = parseInt(str, 2);
          return t.isInt(result) ? result : null;
        case 8:
          if (!s.checkFormat(str, 'octal')) { return null; }
          result = parseInt(str, 8);
          return t.isInt(result) ? result : null;
        case 16:
          if (!s.checkFormat(str, 'hex')) { return null; }
          result = parseInt(str, 16);
          return t.isInt(result) ? result : null;
        }
      };

      _.test_convertToInt = function() {
        c.check('ER', c.checkException(123, _.convertToInt, 123));

        c.check('OK', c.checkException(123,   _.convertToInt, '123'));
        c.check('OK', c.checkException(123,   _.convertToInt, '0123'));
        c.check('OK', c.checkException(123,   _.convertToInt, '+123'));
        c.check('OK', c.checkException(-123,  _.convertToInt, '-0123'));
        c.check('NG', c.checkException(123,   _.convertToInt, ' 123'));
        c.check('NG', c.checkException(123,   _.convertToInt, '123 '));
        c.check('NG', c.checkException(123,   _.convertToInt, ' 123 '));
        c.check('NG', c.checkException(123,   _.convertToInt, '123 0'));
        c.check('NG', c.checkException(123,   _.convertToInt, '0 123'));
        c.check('NG', c.checkException(123,   _.convertToInt, '1 123'));

        c.check('NG', c.checkException(123, _.convertToInt, '123a'));
        c.check('NG', c.checkException(123, _.convertToInt, 'a123'));

        c.check('OK', c.checkException(null, _.convertToInt, '123.4'));
        c.check('OK', c.checkException(null, _.convertToInt, '0123.4'));
        c.check('NG', c.checkException(123.4, _.convertToInt, '+123.4'));
        c.check('NG', c.checkException(-123.4, _.convertToInt, '-0123.4'));
        c.check('OK', c.checkException(null, _.convertToInt, ' 123.4'));
        c.check('OK', c.checkException(null, _.convertToInt, '123.4 '));
        c.check('OK', c.checkException(null, _.convertToInt, ' 123.4 '));
        c.check('OK', c.checkException(null, _.convertToInt, '123.4 0'));
        c.check('OK', c.checkException(null, _.convertToInt, '0 123.4'));
        c.check('OK', c.checkException(null, _.convertToInt, '1 123.4'));
        c.check('OK', c.checkException(null, _.convertToInt, '123 .4'));
        c.check('OK', c.checkException(null, _.convertToInt, '123. 4'));

        c.check('OK', c.checkException(null, _.convertToInt, '123.4a'));
        c.check('OK', c.checkException(null, _.convertToInt, 'a123.4'));

        c.check('NG', c.checkException(123.45, _.convertToInt, '123.4.5'));

        c.check('OK', c.checkException(5, _.convertToInt, '0101', 2));
        c.check('OK', c.checkException(7, _.convertToInt, '0111', 2));
        c.check('OK', c.checkException(15, _.convertToInt, '1111', 2));
        c.check('NG', c.checkException(15, _.convertToInt, '1 111', 2));

        c.check('OK', c.checkException(16, _.convertToInt, '020', 8));
        c.check('NG', c.checkException(15, _.convertToInt, '0 20', 8));

        c.check('OK', c.checkException(255, _.convertToInt, 'FF', 16));
        c.check('OK', c.checkException(0, _.convertToInt, '00', 16));
        c.check('NG', c.checkException(255, _.convertToInt, 'FF FF', 16));
      };

      //----------------------------------------
      //・数値から文字列
      //----------------------------------------
      _.convertToString = function(number, radix) {
        c.assert(t.isNumber(number));
        radix = t.ifNullOrUndefinedValue(radix, 10);
        c.assert(c.orValue(radix, 10, 2, 8, 16));
        return number.toString(radix);
      };

      _.test_convertToString = function() {
        c.check('255', _.convertToString(255));
        c.check('11', _.convertToString(11));
        c.check('255', _.convertToString(0xFF));
        //c.check('16', _.convertToString(0o20)); //node.js chrome などのみ

        c.check('ff', _.convertToString(255, 16));
        c.check('b', _.convertToString(11, 16));

        c.check('177', _.convertToString(127, 8));
        c.check('12', _.convertToString(10, 8));

        c.check('11', _.convertToString(3, 2));
        c.check('1111', _.convertToString(15, 2));
      };

      //----------------------------------------
      //◇日付変換
      //----------------------------------------

      //----------------------------------------
      //・日付型の文字列からの変換
      //----------------------------------------
      //  ・y/m/d
      //    y/m/d h:n
      //    y/m/d h:n:s
      //    y/m/d h:n:s.ms
      //    これらの形式の文字列の場合のみ変換する
      //----------------------------------------

      _.convertToDate = function(str) {
        c.assert(t.isString(str));
        var result = d.Date();
        var strs;
        var dateSplitToDate = function(date, str) {
          var strs = str.split('/');
          date.setFullYear(_.convertToInt(strs[0]));
          date.setMonth(_.convertToInt(strs[1]) - 1);
          date.setDate(_.convertToInt(strs[2]));
        };
        var dateSplitToTime = function(date, str) {
          var strs = str.split(':');
          date.setHours(_.convertToInt(strs[0]));
          date.setMinutes(_.convertToInt(strs[1]));
          if (3 === strs.length) {
            var sec = _.convertToNumber(strs[2]);
            if (t.isInt(sec)) {
              date.setSeconds(sec);
            } else {
              date.setSeconds(Math.floor(sec));
              date.setMilliseconds(
                n.round((sec - Math.floor(sec)) * 1000, 1));
            }
          }
        };
        if (s.checkFormat(str, 'date')) {
          dateSplitToDate(result, str);
          return result;
        } else if (s.checkFormat(str, 'date-minutes')) {
          strs = str.split(' ');
          dateSplitToDate(result, strs[0]);
          dateSplitToTime(result, strs[1]);
          return result;
        } else if (s.checkFormat(str, 'date-seconds')) {
          strs = str.split(' ');
          dateSplitToDate(result, strs[0]);
          dateSplitToTime(result, strs[1]);
          return result;
        } else if (s.checkFormat(str, 'date-milliseconds')) {
          strs = str.split(' ');
          dateSplitToDate(result, strs[0]);
          dateSplitToTime(result, strs[1]);
          return result;
        }
        return null;
      };

      _.test_convertToDate = function() {
        var str;
        str = '2017/10/04';
        c.check('2017/10/04', d.formatYYYYMMDD(_.convertToDate(str), '/'));
        c.check('00:00:00', d.formatHHMMSS(_.convertToDate(str), ':'));

        str = '2017/9/4';
        c.check('2017/09/04', d.formatYYYYMMDD(_.convertToDate(str), '/'));
        c.check('00:00:00', d.formatHHMMSS(_.convertToDate(str), ':'));

        c.check(null, _.convertToDate('2017/10/041'));
        c.check(null, _.convertToDate('2017//04'));
        c.check(null, _.convertToDate('2017/10/04 '));

        str = '2017/10/04 12:34';
        c.check('2017/10/04', d.formatYYYYMMDD(_.convertToDate(str), '/'));
        c.check('12:34:00', d.formatHHMMSS(_.convertToDate(str), ':'));

        c.check(null, _.convertToDate('2017/10/04 12:341'));
        c.check(null, _.convertToDate('2017/10/04 12:'));
        c.check(null, _.convertToDate('2017/10/04 12:34 '));

        str = '2017/10/4 14:3:6';
        c.check('2017/10/04', d.formatYYYYMMDD(_.convertToDate(str), '/'));
        c.check('14:03:06', d.formatHHMMSS(_.convertToDate(str), ':'));

        c.check(null, _.convertToDate('2017/10/4 14:3:061'));
        c.check(null, _.convertToDate('2017/10/4 14::6'));
        c.check(null, _.convertToDate('2017/10/4 14:3:6 '));

        str = '2017/10/4 14:3:6.123';
        c.check('2017/10/04', d.formatYYYYMMDD(_.convertToDate(str), '/'));
        c.check('14:03:06', d.formatHHMMSS(_.convertToDate(str), ':'));
        c.check(123, _.convertToDate(str).getMilliseconds());

        c.check(null, _.convertToDate('2017/10/4 14:3:6.0201'));
        c.check(null, _.convertToDate('2017/10/4 14:3:.020'));
        c.check(null, _.convertToDate('2017/10/4 14::6.020'));
        c.check(null, _.convertToDate('2017/10/4 14:3:6.02 '));
      };


      //----------------------------------------
      //・日付型から文字列への標準的な変換 dateToString
      //----------------------------------------
      _.dateToString = function(date) {
        c.assert(t.isDate(date));
        return date.toString();
      };

      _.test_dateToString = function() {
        var str;
        str = '2018/01/10 23:41:10.001';

        c.check(true, c.orValue(t.dateToString(_.convertToDate(str)),
          'Wed Jan 10 2018 23:41:10 GMT+0900 (東京 (標準時))',
          'Wed Jan 10 23:41:10 UTC+0900 2018'));
        //上はchrome/node.js
        //下はWSH JScript
      };

      //----------------------------------------
      //・文字列から日付型への標準的な変換 stringToDate
      //----------------------------------------
      //  ・変換できない文字列の場合は
      //    Invalid Date 値が返る
      //----------------------------------------
      _.stringToDate = function(str) {
        c.assert(t.isString(str));
        return new Date(str);
      };

      _.test_stringToDate = function() {
        var str;

        c.check('2018/01/10 23:41:10',
          d.formatToString(
            t.stringToDate('Wed Jan 10 2018 23:41:10 GMT+0900 (東京 (標準時))'),
            'yyyy/MM/dd HH:mm:ss'));

        c.check('2018/01/10 23:41:10',
          d.formatToString(
            t.stringToDate('Wed Jan 10 23:41:10 UTC+0900 2018'),
            'yyyy/MM/dd HH:mm:ss'));

        //chrome/node.js
        //WSH JScript
        //どの環境でも上記文字列形式を認識して日付に変換してくれる

        str = t.dateToString(
            t.stringToDate('Wed Feb 50 2018 23:41:10 GMT+0900 (東京 (標準時))'));
        c.check(true,
          c.orValue(str, 'Invalid Date',
            'Thu Mar 22 23:41:10 UTC+0900 2018'));
        str = t.dateToString(
            t.stringToDate('Wed Feb 50 23:41:10 UTC+0900 2018'));
        c.check(true,
          c.orValue(str, 'Invalid Date',
            'Thu Mar 22 23:41:10 UTC+0900 2018'));
        //chrome/node.js はInvalid Date を返すけど
        //WSH JScript は無理やり日時を解釈する
      };


      //----------------------------------------
      //・日付型からミリ秒数値変換
      //----------------------------------------
      _.dateToMilliseconds = function(date) {
        c.assert(t.isDate(date));
        c.assert(!d.isInvalidDate(date));
        return date.getTime();
      };

      _.test_dateToMilliseconds = function() {
        var str;
        str = '2018/01/10 23:41:10.001';
        c.check(1515595270001,
          t.dateToMilliseconds(_.convertToDate(str)));

        str = '2018/01/10 23:41:10.004';
        c.check(1515595270004,
          t.dateToMilliseconds(_.convertToDate(str)));

        str = '2018/01/10 23:41:10.005';
        c.check(1515595270005,
          t.dateToMilliseconds(_.convertToDate(str)));

        str = '2018/01/10 23:41:10.010';
        c.check(1515595270010,
          t.dateToMilliseconds(_.convertToDate(str)));
      };

      //----------------------------------------
      //・文字列から日付型への標準的な変換 stringToDate
      //----------------------------------------
      //  ・変換できない文字列の場合は
      //    Invalid Date 値が返る
      //----------------------------------------
      _.millisecondsToDate = function(milliseconds) {
        c.assert(t.isInt(milliseconds));
        return new Date(milliseconds);
      };

      _.test_millisecondsToDate = function() {
        var str;
        str = '2018/01/10 23:41:10.001';
        c.check(true, d.equalDateMilliseconds(
          _.convertToDate(str),
          t.millisecondsToDate(1515595270001)));
      };

    }()); //type

    //----------------------------------------
    //◆数値
    //----------------------------------------
    _.number = stsLib.number || {};
    (function() {
      var _ = stsLib.number;


      //----------------------------------------
      //・倍数チェック
      //----------------------------------------
      //  ・数値(number)が基数(radix)の倍数かどうか
      //    調べる関数
      //  ・2の倍数は偶数、isMultiples(A, 2) === true;
      //----------------------------------------
      _.isMultiples = function(number, radix) {
        c.assert(t.isInts(number, radix));
        return ((number % radix) === 0);
      };

      _.isEven = function(number) {
        c.assert(t.isInt(number));
        return _.isMultiples(number, 2);
      };

      _.isOdd = function(number) {
        c.assert(t.isInt(number));
        return !_.isMultiples(number, 2);
      };

      //----------------------------------------
      //・四捨五入する
      //----------------------------------------
      //  ・digitは桁数
      //    四捨五入して、その位までの値になる
      //      0なら1の位
      //      1なら小数点1位
      //      2なら小数点2位
      //      -1なら10の位
      //      -2なら100の位
      //----------------------------------------
      _.round = function(value, digit) {

        var powResult;
        if (t.isNullOrUndefined(digit)) {
          digit = 0;
        }
        c.assert(t.isInt(digit));
        var minusFlag = value < 0 ? true: false;
        powResult = Math.pow(10, digit);
        if (minusFlag !== true) {
          return Math.round(value * powResult) / powResult;
        } else {
          return -1 * Math.round(-1 * value * powResult) / powResult;
        }
      };

      _.test_round = function() {

        c.check(5,    _.round(5));
        c.check(5,    _.round(5.4));
        c.check(6,    _.round(5.5));
        c.check(5,    _.round(5,    0));
        c.check(5,    _.round(5.4,  0));
        c.check(6,    _.round(5.5,  0));
        c.check(5.4,  _.round(5.44, 1));
        c.check(5.5,  _.round(5.45, 1));
        c.check(5.5,  _.round(5.54, 1));
        c.check(5.6,  _.round(5.55, 1));
        c.check(5.04, _.round(5.044, 2));
        c.check(5.05, _.round(5.045, 2));
        c.check(5.05, _.round(5.054, 2));
        c.check(5.06, _.round(5.055, 2));
        c.check(540,  _.round(544, -1));
        c.check(550,  _.round(545, -1));
        c.check(550,  _.round(554, -1));
        c.check(560,  _.round(555, -1));
        c.check(5400, _.round(5440, -2));
        c.check(5500, _.round(5450, -2));
        c.check(5500, _.round(5540, -2));
        c.check(5600, _.round(5550, -2));

        c.check(-5,    _.round(-5));
        c.check(-5,    _.round(-5.4));
        c.check(-6,    _.round(-5.5));
        c.check(-5,    _.round(-5,    0));
        c.check(-5,    _.round(-5.4,  0));
        c.check(-6,    _.round(-5.5,  0));
        c.check(-5.4,  _.round(-5.44, 1));
        c.check(-5.5,  _.round(-5.45, 1));
        c.check(-5.5,  _.round(-5.54, 1));
        c.check(-5.6,  _.round(-5.55, 1));
        c.check(-5.04, _.round(-5.044, 2));
        c.check(-5.05, _.round(-5.045, 2));
        c.check(-5.05, _.round(-5.054, 2));
        c.check(-5.06, _.round(-5.055, 2));
        c.check(-540,  _.round(-544, -1));
        c.check(-550,  _.round(-545, -1));
        c.check(-550,  _.round(-554, -1));
        c.check(-560,  _.round(-555, -1));
        c.check(-5400, _.round(-5440, -2));
        c.check(-5500, _.round(-5450, -2));
        c.check(-5500, _.round(-5540, -2));
        c.check(-5600, _.round(-5550, -2));
      };

      //----------------------------------------
      //・ニアイコールを判定する
      //----------------------------------------
      _.nearEqual = function(a, b, diff) {

        c.assert(t.isNumber(a));
        c.assert(t.isNumber(b));
        c.assert(t.isNumber(diff));
        c.assert(0 <= diff);
        if ( Math.abs(a - b) <= diff ) {
          return true;
        } else {
          return false;
        }
      };

      _.test_nearEqual = function() {

        c.check(true, _.nearEqual(0.049999,   0.050011,     0.001));
        c.check(true, _.nearEqual(0.050,      0.051,        0.001));
        c.check(true, _.nearEqual(0.050,      0.0509,       0.001));
        c.check(true, _.nearEqual(0.050,      0.0510,       0.001));
        c.check(false,_.nearEqual(0.050,      0.051000001,  0.001));
        c.check(true, _.nearEqual(0.050011,   0.049999,     0.001));
        c.check(true, _.nearEqual(0.051,      0.050,        0.001));
        c.check(true, _.nearEqual(0.0509,     0.050,        0.001));
        c.check(true, _.nearEqual(0.0510,     0.050,        0.001));
        c.check(false,_.nearEqual(0.051000001,0.050,        0.001));

        c.checkResult('ER', null, _.nearEqual, '0.50', 0.51, 0.001);
        c.checkResult('ER', null, _.nearEqual, 0.50, '0.51', 0.001);
        c.checkResult('ER', null, _.nearEqual, 0.50, 0.51, '0.001');
        c.checkResult('ER', null, _.nearEqual, 0.50, 0.51, -0.001);
      };

      //----------------------------------------
      //・範囲内に値が含まれるかどうか確認
      //----------------------------------------
      _.inRange = function(value, from, to) {

        c.assert(t.isNumber(from));
        c.assert(t.isNumber(to));
        c.assert(from <= to);

        if ((from <= value) && (value <= to)) {
          return true;
        } else {
          return false;
        }
      };

      //----------------------------------------
      //・数値を3桁カンマ区切りなどにする
      //----------------------------------------
      //  ・整数部分は右から
      //    小数部分は左から桁区切りする
      //----------------------------------------
      _.formatDigitComma = function(value,
        delimiterInt, digitInt, delimiterFloat, digitFloat) {

        c.assert(t.isNumber(value));
        c.assert(t.isInt(digitInt, digitFloat));
        c.assert(t.isString(delimiterInt, delimiterFloat));

        var valueStr = value.toString();
        if (t.isInt(value)) {
          return s.formatInsertLast(valueStr, delimiterInt, digitInt);
        } else {
          return (
            s.formatInsertLast(
              s.startFirstDelim(valueStr, '.'),
              delimiterInt, digitInt) +
            '.' +
            s.formatInsertFirst(
              s.endFirstDelim(valueStr, '.'),
              delimiterFloat, digitFloat));
        }
      };

      _.test_formatDigitComma = function() {

        c.check('123,456,789.123 456 7',
          _.formatDigitComma(123456789.1234567, ',', 3, ' ', 3));
        c.check('123,456,789',
          _.formatDigitComma(123456789, ',', 3, ' ', 3));
        c.check('1,234,567,890',
          _.formatDigitComma(1234567890, ',', 3, ' ', 3));
        c.check('0.123 456 789 012',
          _.formatDigitComma(.123456789012, ',', 3, ' ', 3));
        c.check('0.012 345 678 901 2',
          _.formatDigitComma(.0123456789012, ',', 3, ' ', 3));
      };

    }()); //number

    //----------------------------------------
    //◆角度
    //----------------------------------------
    _.angle = stsLib.angle || {};
    (function() {
      var _ = stsLib.angle;

      //----------------------------------------
      //・ラジアンと角度相互変換
      //----------------------------------------
      _.degToRad = function(degree) {
        return degree * Math.PI / 180;
      };

      _.radToDeg = function(radian) {
        return radian * 180 / Math.PI;
      };

      _.test_degToRad = function() {

        c.check(0, _.degToRad(0));
        c.check(Math.PI / 6, _.degToRad(30));
        c.check(0, _.radToDeg(0));
        c.check(30, Math.round(_.radToDeg(Math.PI / 6)));
      };

      //----------------------------------------
      //・絶対角度から相対角度を求める
      //----------------------------------------
      //  ・base と target は角度の絶対座標で
      //      0度から360度とする。
      //      それ以上それ以下でも0-360に丸め込まれる
      //  ・戻り値は -180～+180 になる
      //----------------------------------------
      _.relative = function(base, target) {
        base = base % 360;
        target = target % 360;
        var result = target - base;
        //result は -360～+360になる
        if (180 < result) {
          result = result - 360;
        } else if (result < -180) {
          result = result + 360;
        }
        return result;
      };

      _.test_relative = function() {

        c.check(10, _.relative(5, 15));
        c.check(-10, _.relative(15, 5));

        c.check(90, _.relative(90, 180));
        c.check(180, _.relative(90, 270));
        c.check(180, _.relative(0, 180));

        c.check(-179, _.relative(0, 181));
        c.check(179, _.relative(181, 0));
        c.check(-179, _.relative(179, 0));
      };

      //----------------------------------------
      //◇角度(degree)ベースのsin/cos/tan
      //----------------------------------------

      _.sin = function(degree) {
        return Math.sin(_.degToRad(degree));
      };

      _.cos = function(degree) {
        return Math.cos(_.degToRad(degree));
      };

      _.tan = function(degree) {
        return Math.tan(_.degToRad(degree));
      };

      _.asin = function(x) {
        return _.radToDeg(Math.asin(x));
      };

      _.acos = function(x) {
        return _.radToDeg(Math.acos(x));
      };

      _.atan = function(x) {
        return _.radToDeg(Math.atan(x));
      };

    }()); //angle

    //----------------------------------------
    //◆配列処理
    //----------------------------------------

    _.array = stsLib.array || {};
    (function() {
      var _ = stsLib.array;

      //----------------------------------------
      //・配列のコピー
      //----------------------------------------
      _.clone = function(array) {
        return array.concat();
      };

      //----------------------------------------
      //・配列同士を値で比較する関数
      //----------------------------------------
      _.equal = function(value1, value2) {

        c.assert(t.isArray(value1));
        c.assert(t.isArray(value2));

        if (value1.length !== value2.length) {
          return false;
        }

        for (var i = 0, il = value1.length; i < il; i += 1) {
          if (t.typeof(value1[i]) !== t.typeof(value2[i])) {
            return false;
          } else if ( t.isArray(value1[i]) ) {
            if (!_.equal(value1[i], value2[i])) {
              return false;
            }
          } else if ( t.isFunction( value1[i] ) ) {
            if (value1[i].toString() !== value2[i].toString()) {
              return false;
            }
          } else if ( t.isDate( value1[i] ) ) {
            if (value1[i].toString() !== value2[i].toString()) {
              return false;
            }
          } else if ( t.isObject( value1[i] ) ) {
            if (value1[i] !== value2[i]) {
              return false;
            }
            //中身がオブジェクトの場合は
            //別オブジェクトなら不一致判定する
          } else {
            if (value1[i] !== value2[i]) {
              return false;
            }
          }
        }

        return true;
      };

      _.test_equal = function()
      {
        var a1 = [1, 2, 3];
        var a2 = [1, 2, 3];
        c.check(false, a1 == a2);
        c.check(false, a1 === a2);

        var a1 = [[1, 2], 3];
        var a2 = [1, [2, 3]];
        c.check(true, a1.toString() === a2.toString() );
        //Array.toString() の場合は誤判定する

        c.check(false, _.equal(a1, a2));
      };

      //----------------------------------------
      //・argumentsのような arraylike なものを配列にする
      //----------------------------------------
      //  ・ES6だと args = Array.from(arguments) とできる
      //----------------------------------------
      _.fromArgs = function(argsObj) {
        return Array.prototype.slice.call(argsObj);
      };

      //----------------------------------------
      //◇min max
      //----------------------------------------
      //  ・apply(null するのは妙だったので
      //    Math.min/max をラッピングしただけ
      //  ・return Math.max.apply(null, array);
      //    あるいは
      //    return Math.min.apply(null, array);
      //    この記述だとarrayに飛び飛びの値が入っている時に
      //    動かない様子
      //----------------------------------------
      _.min = function(array) {
        c.assert(t.isArray(array));

        if (array.length === 0) { return null; }
        var result = Infinity;
        for (var i = 0, l = array.length; i < l; i += 1) {
          if (array[i] < result) {
            result = array[i];
          }
        }
        return result;
      };

      _.max = function(array) {
        c.assert(t.isArray(array));

        if (array.length === 0) { return null; }
        var result = -1 * Infinity;
        for (var i = 0, l = array.length; i < l; i += 1) {
          if (result < array[i]) {
            result = array[i];
          }
        }
        return result;
      };

      //----------------------------------------
      //◇sum average
      //----------------------------------------

      _.sum =  function(array) {
        c.assert(t.isArray(array));
        var result = 0;
        var value;
        for (var i = 0, l = array.length; i < l; i += 1) {
          value = array[i];
          c.assert(t.isNumber(value));
          result += value;
        }
        return result;
      };

      _.average =  function(array) {
        return _.sum(array) / array.length;
      };

      _.test_average = function() {
        c.check(71, _.average([52,52,70,72,80,100]));
        c.check(22, _.average([6,9,9,10,10,10,100]));
      };

      //・中央値
      _.median = function(array) {
        var arrayValue = _.clone(array);
        arrayValue.sort(function(a, b) {
          return a - b;
        });
        if (arrayValue.length % 2 === 0) {
          //偶数個
          return (
            arrayValue[arrayValue.length/2 - 1] +
            arrayValue[arrayValue.length/2]
          ) / 2;
        } else {
          //奇数個
          return arrayValue[(arrayValue.length-1)/2];
        }
      };

      _.test_median = function() {
        c.check(71, _.median([52,70,72,80,100,52]));
        c.check(10, _.median([6,9,9,10,10,10,100]));
      };

      //・最頻値
      _.mode = function(array) {
        var countArray = [];
        var i, l;
        for (i = 0, l = array.length; i < l; i += 1) {
          if (t.isUndefined(countArray[array[i]])) {
            countArray[array[i]] = 1;
          } else {
            countArray[array[i]] += 1;
          }
        }
        var maxValue = _.max(countArray);
        if (maxValue === 1) {
          //重複無し
          return null;
        }
        for (i = 0, l = countArray.length; i < l; i += 1) {
          if (countArray[i] === maxValue) {
            return i;
          }
        }
      };

      _.test_mode = function() {
        c.check(52, _.mode([70,72,52,80,100,52]));
        c.check(10, _.mode([6,9,9,10,10,10,100]));
      };

      //・MinMax差分
      _.diffMinMax = function(array) {
        return (_.max(array) - _.min(array));
      };

      _.test_diffMinMax = function() {
        c.check(48, _.diffMinMax([52,52,70,72,80,100]));
      };

      //----------------------------------------
      //◇insert add
      //----------------------------------------

      //----------------------------------------
      //・insert
      //----------------------------------------
      //  ・元の配列の内容を変更するinsert
      //  ・戻り値も同じ配列の参照を返す
      //  ・indexはarray.lengthと同じ値の場合は
      //    配列に追加することになる
      //  ・indexを省略すると先頭に挿入する
      //  ・unshiftやpushはspliceを使えば使わなくてよい
      //----------------------------------------
      _.insert = function(array, value, index) {
        c.assert(Array.isArray(array));
        index = t.ifNullOrUndefinedValue(index, 0);
        c.assert(t.isInt(index));
        c.assert(n.inRange(index, 0, array.length));

        array.splice(index, 0, value);
        return array;
      };

      _.test_insert = function() {
        var a1 = [1,2,3];
        var a2 = _.insert(a1, 0);
        c.check(true, _.equal([0,1,2,3], a1));
        c.check(true, _.equal([0,1,2,3], a2));

        a1[0] = 4;
        c.check(true, _.equal([4,1,2,3], a1));
        c.check(true, _.equal([4,1,2,3], a2));

        c.check(true, _.equal([4,0,1,2,3], _.insert(a1, 0, 1)));
        c.check(true, _.equal([4,0,1,2,3,4], _.insert(a1, 4, 5)));
      };

      //----------------------------------------
      //・insertAdd
      //----------------------------------------
      //  ・指定した項目の下の位置にinsertする関数
      //----------------------------------------
      _.insertAdd = function(array, value, index) {
        c.assert(t.isInt(index));
        return _.insert(array, value, index + 1);
      };

      _.test_insertAdd = function() {
        var a1 = [1,2,3];
        var a2 = _.insertAdd(a1, 0, 0);
        c.check(true, _.equal([1,0,2,3], a1));
        c.check(true, _.equal([1,0,2,3], a2));

        a1[0] = 4;
        c.check(true, _.equal([4,0,2,3], a1));
        c.check(true, _.equal([4,0,2,3], a2));

        c.check(true, _.equal([4,0,0,2,3], _.insertAdd(a1, 0, 1)));
        c.check(true, _.equal([4,0,0,2,3,4], _.insertAdd(a1, 4, 4)));
      };

      //----------------------------------------
      //・add
      //----------------------------------------
      //  ・Array.prototype.push と同等の機能。
      //----------------------------------------

      _.add = function(array, value) {
        _.insert(array, value, array.length);
        return array;
      };

      _.test_add = function() {
        var a1 = [1,2,3];
        var a2 = _.add(a1, 0);
        c.check(true, _.equal([1,2,3,0], a1));
        c.check(true, _.equal([1,2,3,0], a2));

        a1[0] = 4;
        c.check(true, _.equal([4,2,3,0], a1));
        c.check(true, _.equal([4,2,3,0], a2));

        c.check(true, _.equal([4,2,3,0,0], _.add(a1, 0)));
        c.check(true, _.equal([4,2,3,0,0,4], _.add(a1, 4)));
      };

      //----------------------------------------
      //◇delete
      //----------------------------------------

      //----------------------------------------
      //・Index指定のdelete
      //----------------------------------------
      //  ・indexは負の値などには対応しない
      //  ・endIndexを省略するとstartIndexのところの1項目だけ削除になる
      //----------------------------------------
      _.deleteIndex = function(array, startIndex, endIndex) {
        c.assert(Array.isArray(array));
        endIndex = t.ifNullOrUndefinedValue(endIndex, startIndex);
        c.assert(t.isInt(startIndex, endIndex));
        c.assert((0 <= startIndex) && (startIndex <= array.length - 1));
        c.assert((0 <= endIndex));
        c.assert(startIndex <= endIndex);

        array.splice(startIndex, endIndex - startIndex + 1);
        return array;
      };

      _.test_deleteIndex = function() {
        c.check(true, _.equal([1,3],      _.deleteIndex([1,2,3], 1, 1)));
        c.check(true, _.equal([1],        _.deleteIndex([1,2,3], 1, 2)));
        c.check(true, _.equal([],         _.deleteIndex([1,2,3], 0, 3)));
        c.check(true, _.equal([1,5],      _.deleteIndex([1,2,3,4,5], 1, 3)));
        c.check(true, _.equal([1,2,4,5],  _.deleteIndex([1,2,3,4,5], 2)));
      };

      //----------------------------------------
      //・Length指定のdelete
      //----------------------------------------
      //  ・indexは負の値などには対応しない
      //  ・lengthを省略すると最後まで削除する
      //----------------------------------------
      _.deleteLength = function(array, startIndex, length) {
        c.assert(Array.isArray(array));
        length = t.ifNullOrUndefinedValue(length, array.length - startIndex);
        c.assert(t.isInt(startIndex, length));
        c.assert((0 <= startIndex) && (startIndex <= array.length - 1));
        c.assert((1 <= length));

        array.splice(startIndex, length);
        return array;
      };

      _.test_deleteLength = function() {
        c.check(true, _.equal([1,3],_.deleteLength([1,2,3], 1, 1)));
        c.check(true, _.equal([3],  _.deleteLength([1,2,3], 0, 2)));
        c.check(true, _.equal([],   _.deleteLength([1,2,3], 0, 3)));
        c.check(true, _.equal([1,5],   _.deleteLength([1,2,3,4,5], 1, 3)));
        c.check(true, _.equal([1],   _.deleteLength([1,2,3,4,5], 1)));
      };

      //----------------------------------------
      //◇項目削除
      //----------------------------------------

      //----------------------------------------
      //・項目削除
      //----------------------------------------
      //  ・deleteはWSHでは予約語なのでdeleteFindにした
      //----------------------------------------
      _.deleteFind = function(array, search) {
        c.assert(Array.isArray(array));

        var index = _.indexOfFirst(array, search);
        if (index !== -1) {
          array.splice(index, 1);
        }
        return array;
      };

      _.test_deleteFind = function() {
        c.check(true, _.equal([1,3],  _.deleteFind([1,2,3], 2)));
        c.check(true, _.equal([2,3],  _.deleteFind([1,2,3], 1)));
        c.check(true, _.equal([1,2,3],_.deleteFind([1,2,3], 0)));
        c.check(true, _.equal([1,2,4,5],  _.deleteFind([1,2,3,4,5], 3)));
        c.check(true, _.equal([1,3,1,2,3],  _.deleteFind([1,2,3,1,2,3], 2)));
        c.check(true, _.equal([2,3,1,2,3],  _.deleteFind([1,2,3,1,2,3], 1)));
        c.check(true, _.equal([1,2,3,1,2,3],_.deleteFind([1,2,3,1,2,3], 0)));
        c.check(true, _.equal([1,2,4,5],  _.deleteFind([1,2,3,4,5], 3)));
      };

      //----------------------------------------
      //・指定項目全削除
      //----------------------------------------
      _.deleteFindAll = function(array, search) {

        var index;
        do {
          index = _.indexOfFirst(array, search);
          if (index !== -1) {
            array.splice(index, 1);
          } else {
            break;
          }
        } while (true);
        return array;
      };

      _.test_deleteFindAll = function() {
        c.check(true, _.equal([1,3],  _.deleteFindAll([1,2,3], 2)));
        c.check(true, _.equal([2,3],  _.deleteFindAll([1,2,3], 1)));
        c.check(true, _.equal([1,2,3],_.deleteFindAll([1,2,3], 0)));
        c.check(true, _.equal([1,2,4,5],  _.deleteFindAll([1,2,3,4,5], 3)));
        c.check(true, _.equal([1,3,1,3],  _.deleteFindAll([1,2,3,1,2,3], 2)));
        c.check(true, _.equal([2,3,2,3],  _.deleteFindAll([1,2,3,1,2,3], 1)));
        c.check(true, _.equal([1,2,3,1,2,3],_.deleteFindAll([1,2,3,1,2,3], 0)));
        c.check(true, _.equal([1,2,4,5],  _.deleteFindAll([1,2,3,4,5], 3)));
      };

      //----------------------------------------
      //・先頭から削除
      //----------------------------------------
      //  ・lenは0以上にすること
      //----------------------------------------

      _.deleteStart = function(array, len) {
        c.assert(Array.isArray(array));
        c.assert(t.isInt(len) && (0 <= len));

        if (len === 0) {
          return array;
        }
        return _.deleteLength(array, 0, len);
      };

      _.test_deleteStart = function() {

        c.check('2345', _.deleteStart('12345'.split(''), 1).join(''));
        c.check('345',  _.deleteStart('12345'.split(''), 2).join(''));
        c.check('45',   _.deleteStart('12345'.split(''), 3).join(''));
        c.check('12345',_.deleteStart('12345'.split(''), 0).join(''));
        c.check('',     _.deleteStart('12345'.split(''), 5).join(''));
        c.check('',     _.deleteStart('12345'.split(''), 6).join(''));
      };

      //----------------------------------------
      //・終端から削除
      //----------------------------------------
      //  ・lenは0以上にすること
      //----------------------------------------
      _.deleteEnd = function(array, len) {
        c.assert(Array.isArray(array));
        c.assert(t.isInt(len) && (0 <= len));

        if (len === 0) {
          return array;
        }
        return _.deleteLength(array, Math.max(array.length - len, 0));
      };

      _.test_deleteEnd = function() {

        c.check('1234', _.deleteEnd('12345'.split(''), 1).join(''));
        c.check('123',  _.deleteEnd('12345'.split(''), 2).join(''));
        c.check('12',   _.deleteEnd('12345'.split(''), 3).join(''));
        c.check('12345',_.deleteEnd('12345'.split(''), 0).join(''));
        c.check('',     _.deleteEnd('12345'.split(''), 5).join(''));
        c.check('',     _.deleteEnd('12345'.split(''), 6).join(''));
      };

      //----------------------------------------
      //◇Include
      //----------------------------------------

      //----------------------------------------
      //・含まれているかどうか
      //----------------------------------------
      //  ・isInclude/includes/contains
      //    別名の同一機能
      //----------------------------------------
      _.isInclude = function(array, value) {
        return (_.indexOfFirst(array, value) !== -1);
      };

      _.includes = function(array, value) {
        return _.isInclude(array, value);
      };

      _.contains = function(array, value) {
        return _.isInclude(array, value);
      };

      //----------------------------------------
      //・配列で指定したものがいずれかが含まれている
      //----------------------------------------
      _.isIncludeAny = function(array, searchArray) {
        return (_.indexOfAnyFirst(array, searchArray).index !== -1);
      };

      _.test_isIncludeAny = function() {
        c.checkResult('ER', null, _.isIncludeAny, [1,2,3], []);
        c.check(false,  _.isIncludeAny([1,2,3], [4,5]));
        c.check(true,   _.isIncludeAny([1,2,3], [1,3]));
        c.check(true,   _.isIncludeAny([1,2,3], [2,3]));
        c.check(true,   _.isIncludeAny([1,2,3], [null,3]));
        c.check(false,  _.isIncludeAny([1,2,3], [null,null]));
      };

      //----------------------------------------
      //・関数で指定した条件のものが含まれている
      //----------------------------------------
      _.isIncludeFunc = function(array, func) {
        return (_.indexOfFuncFirst(array, func) !== -1);
      };

      _.test_isIncludeFunc = function() {

        c.check(false,  _.isIncludeFunc('abc def ghi abc'.split(''),
          function() {
            return false;
          }));

        c.check(false,  _.isIncludeFunc('abc def ghi abc'.split(''),
          function(element, index, array) {
            return c.orValue(element, 'x', 'y', 'z');
          }));

        c.check(true,   _.isIncludeFunc('abc def ghi abc'.split(''),
          function(element, index, array) {
            return c.orValue(element, 'd', 'g', 'i');
          }));

        c.check(true,   _.isIncludeFunc('abc def ghi abc'.split(''),
          function(element, index, array) {
            return c.orValue(element, 'd', 'y', 'z');
          }));

        c.check(true,   _.isIncludeFunc('abc def ghi abc'.split(''),
          function(element, index, array) {
            return c.orValue(element, 'x', 'y', 'i');
          }));

      };

      //----------------------------------------
      //◇集合型として使う setInclude/setExclude
      //----------------------------------------

      //----------------------------------------
      //・ユニークな値として配列にvalueを含ませる
      //----------------------------------------
      //  ・配列を集合型として使う場合に使える
      //----------------------------------------
      _.setInclude = function(array, value) {
        _.setExclude(array, value);
        _.add(array, value);
        return array;
      };

      _.test_setInclude = function() {
        var a1 = [1,2,3];
        var a2 = _.setInclude(a1, 0);
        c.check(true, _.equal([1,2,3,0], a1));
        c.check(true, _.equal([1,2,3,0], a2));

        a1[0] = 0;
        c.check(true, _.equal([0,2,3,0], a1));
        c.check(true, _.equal([0,2,3,0], a2));

        a2 = _.setInclude(a1, 0);
        c.check(true, _.equal([2,3,0], a1));
        c.check(true, _.equal([2,3,0], a2));

        a2 = _.setInclude(a1, 3);
        c.check(true, _.equal([2,0,3], a1));
        c.check(true, _.equal([2,0,3], a2));
      };

      //----------------------------------------
      //・ユニークな値として配列からvalueを取り除く
      //----------------------------------------
      _.setExclude = function(array, value) {
        while (true) {
          var index = _.indexOfFirst(array, value);
          if (index === -1) {
            break;
          }
          _.deleteLength(array, index, 1);
        }
        return array;
      };

      //----------------------------------------
      //◇indexOf
      //----------------------------------------

      _.indexOfFirst = function(array, search, startIndex) {

        c.assert(Array.isArray(array));
        startIndex = t.ifNullOrUndefinedValue(startIndex, 0);
        c.assert(t.isInt(startIndex));

        {
          if (array.length === 0) {
            return -1;
          }
          if (startIndex < 0) {
            startIndex += array.length;
          }

          for (var i = startIndex, max = array.length; i < max; i += 1) {
            if (array[i] === search) {
              return i;
            }
          }
          return -1;
        }
        //上記ブロックはWSH以外なら下記で書ける
        //return array.indexOf(search, startIndex);
      };

      _.test_indexOfFirst = function() {

        c.check(-1, _.indexOfFirst(['a','b','c'], 'd'));
        c.check( 0, _.indexOfFirst(['a','b','c'], 'a'));
        c.check( 1, _.indexOfFirst(['a','b','c'], 'b'));
        c.check( 2, _.indexOfFirst(['a','b','c'], 'c'));
        c.check(-1, _.indexOfFirst(['a','b','c'], ''));
        c.check( 0, _.indexOfFirst(['a','b','c','a','b','c'], 'a'));
        c.check( 1, _.indexOfFirst(['a','b','c','a','b','c'], 'b'));
        c.check( 2, _.indexOfFirst(['a','b','c','a','b','c'], 'c'));

        c.check( 0, _.indexOfFirst(['a','b','c','a','b','c'], 'a', 0));
        c.check( 3, _.indexOfFirst(['a','b','c','a','b','c'], 'a', 1));
        c.check( 1, _.indexOfFirst(['a','b','c','a','b','c'], 'b', 1));
        c.check( 4, _.indexOfFirst(['a','b','c','a','b','c'], 'b', 2));
        c.check( 2, _.indexOfFirst(['a','b','c','a','b','c'], 'c', 2));
        c.check( 5, _.indexOfFirst(['a','b','c','a','b','c'], 'c', 3));

        c.check(-1, _.indexOfFirst(['a','b','c','a','b','c'], 'a', -1));
        c.check( 3, _.indexOfFirst(['a','b','c','a','b','c'], 'a', -3));
        c.check(-1, _.indexOfFirst(['a','b','c','a','b','c'], 'b', -1));
        c.check( 4, _.indexOfFirst(['a','b','c','a','b','c'], 'b', -2));
        c.check( 5, _.indexOfFirst(['a','b','c','a','b','c'], 'c', -1));
        c.check( 2, _.indexOfFirst(['a','b','c','a','b','c'], 'c', -4));
      };


      _.indexOfLast = function(array, search, startIndex) {

        c.assert(Array.isArray(array));
        startIndex = t.ifNullOrUndefinedValue(startIndex, array.length - 1);
        c.assert(t.isInt(startIndex));

        {
          if (array.length === 0) {
            return -1;
          }
          if (startIndex < 0) {
            startIndex += array.length;
          }

          for (var i = startIndex; 0 <= i; i -= 1) {
            if (array[i] === search) {
              return i;
            }
          }
          return -1;
        }
        //上記ブロックはWSH以外なら下記で書ける
        //return array.lastIndexOf(search, startIndex);
      };

      _.test_indexOfLast = function() {

        c.check(-1, _.indexOfLast(['a','b','c'], 'd'));
        c.check( 0, _.indexOfLast(['a','b','c'], 'a'));
        c.check( 1, _.indexOfLast(['a','b','c'], 'b'), '03');
        c.check( 2, _.indexOfLast(['a','b','c'], 'c'));
        c.check(-1, _.indexOfLast(['a','b','c'], ''));
        c.check( 3, _.indexOfLast(['a','b','c','a','b','c'], 'a'));
        c.check( 4, _.indexOfLast(['a','b','c','a','b','c'], 'b'));
        c.check( 5, _.indexOfLast(['a','b','c','a','b','c'], 'c'));

        c.check( 0, _.indexOfLast(['a','b','c','a','b','c'], 'a', 1));
        c.check( 3, _.indexOfLast(['a','b','c','a','b','c'], 'a', 3));
        c.check( 1, _.indexOfLast(['a','b','c','a','b','c'], 'b', 1));
        c.check( 4, _.indexOfLast(['a','b','c','a','b','c'], 'b', 4));
        c.check( 2, _.indexOfLast(['a','b','c','a','b','c'], 'c', 2));
        c.check( 5, _.indexOfLast(['a','b','c','a','b','c'], 'c', 5));

        c.check( 3, _.indexOfLast(['a','b','c','a','b','c'], 'a', -1));
        c.check( 0, _.indexOfLast(['a','b','c','a','b','c'], 'a', -4));
        c.check( 0, _.indexOfLast(['a','b','c','a','b','c'], 'a', -6));
        c.check(-1, _.indexOfLast(['a','b','c','a','b','c'], 'a', -7));
        c.check( 4, _.indexOfLast(['a','b','c','a','b','c'], 'b', -1));
        c.check( 1, _.indexOfLast(['a','b','c','a','b','c'], 'b', -3));
        c.check( 1, _.indexOfLast(['a','b','c','a','b','c'], 'b', -5));
        c.check(-1, _.indexOfLast(['a','b','c','a','b','c'], 'b', -6));
        c.check( 5, _.indexOfLast(['a','b','c','a','b','c'], 'c', -1));
        c.check( 2, _.indexOfLast(['a','b','c','a','b','c'], 'c', -2));
        c.check( 2, _.indexOfLast(['a','b','c','a','b','c'], 'c', -4));
        c.check(-1, _.indexOfLast(['a','b','c','a','b','c'], 'c', -5));
      };

      //----------------------------------------
      //◇indexOfArray 配列内配列で値の内容で見つけるためのindexOf
      //----------------------------------------
      _.indexOfArrayFirst = function(array, search, startIndex) {

        c.assert(Array.isArray(array));
        c.assert(Array.isArray(search));
        startIndex = t.ifNullOrUndefinedValue(startIndex, 0);
        c.assert(t.isInt(startIndex));

        {
          if (array.length === 0) {
            return -1;
          }
          if (startIndex < 0) {
            startIndex += array.length;
          }

          for (var i = startIndex, max = array.length; i < max; i += 1) {
            if (_.equal(array[i], search)) {
              return i;
            }
          }
          return -1;
        }
      };

      _.test_indexOfArrayFirst = function() {

        var arrayList = [];
        arrayList.push([1,1,1]);
        arrayList.push([2,2,2]);
        arrayList.push([3,3,3]);
        arrayList.push([1,1,1]);
        arrayList.push([2,2,2]);
        arrayList.push([3,3,3]);

        var a1 = [1, 2, 3];
        c.check(-1, _.indexOfArrayFirst(arrayList, a1));

        c.check(0, _.indexOfArrayFirst(arrayList, [1, 1, 1]));
        c.check(1, _.indexOfArrayFirst(arrayList, [2, 2, 2]));
        c.check(2, _.indexOfArrayFirst(arrayList, [3, 3, 3]));
        c.check(3, _.indexOfArrayFirst(arrayList, [1, 1, 1], 1));
        c.check(4, _.indexOfArrayFirst(arrayList, [2, 2, 2], 2));
        c.check(5, _.indexOfArrayFirst(arrayList, [3, 3, 3], 3));
      };

      _.indexOfArrayLast = function(array, search, startIndex) {

        c.assert(Array.isArray(array));
        c.assert(Array.isArray(search));
        startIndex = t.ifNullOrUndefinedValue(startIndex, array.length - 1);
        c.assert(t.isInt(startIndex));

        {
          if (array.length === 0) {
            return -1;
          }
          if (startIndex < 0) {
            startIndex += array.length;
          }

          for (var i = startIndex; 0 <= i; i -= 1) {
            if (_.equal(array[i], search)) {
              return i;
            }
          }
          return -1;
        }
      };

      _.test_indexOfArrayLast = function() {

        var arrayList = [];
        arrayList.push([1,1,1]);
        arrayList.push([2,2,2]);
        arrayList.push([3,3,3]);
        arrayList.push([1,1,1]);
        arrayList.push([2,2,2]);
        arrayList.push([3,3,3]);

        var a1 = [1, 2, 3];
        c.check(-1, _.indexOfArrayLast(arrayList, a1));

        c.check( 3, _.indexOfArrayLast(arrayList, [1, 1, 1]));
        c.check( 4, _.indexOfArrayLast(arrayList, [2, 2, 2]));
        c.check( 5, _.indexOfArrayLast(arrayList, [3, 3, 3]));
        c.check( 3, _.indexOfArrayLast(arrayList, [1, 1, 1], -1));
        c.check( 3, _.indexOfArrayLast(arrayList, [1, 1, 1], -3));
        c.check( 0, _.indexOfArrayLast(arrayList, [1, 1, 1], -4));
        c.check( 0, _.indexOfArrayLast(arrayList, [1, 1, 1], -6));
        c.check(-1, _.indexOfArrayLast(arrayList, [1, 1, 1], -7));
        c.check( 4, _.indexOfArrayLast(arrayList, [2, 2, 2], -1));
        c.check( 4, _.indexOfArrayLast(arrayList, [2, 2, 2], -2));
        c.check( 1, _.indexOfArrayLast(arrayList, [2, 2, 2], -3));
        c.check( 1, _.indexOfArrayLast(arrayList, [2, 2, 2], -5));
        c.check(-1, _.indexOfArrayLast(arrayList, [2, 2, 2], -6));
        c.check( 5, _.indexOfArrayLast(arrayList, [3, 3, 3], -1));
        c.check( 2, _.indexOfArrayLast(arrayList, [3, 3, 3], -2));
        c.check( 2, _.indexOfArrayLast(arrayList, [3, 3, 3], -4));
        c.check(-1, _.indexOfArrayLast(arrayList, [3, 3, 3], -5));
      };

      //----------------------------------------
      //◇indexOfAny
      //----------------------------------------
      //  ・戻り値はオブジェクトで
      //    indexが見つかった位置
      //    indexAnyがsearchArrayの中の該当したものの位置
      //----------------------------------------

      _.indexOfAnyFirst = function(array, searchArray, startIndex) {
        c.assert(Array.isArray(array));
        c.assert(Array.isArray(searchArray));
        startIndex = t.ifNullOrUndefinedValue(startIndex, 0);
        c.assert(t.isInt(startIndex));

        var result = Infinity;
        var findIndex;
        var indexAny = -1;
        for (var i = 0, l = searchArray.length; i < l; i += 1) {
          findIndex = _.indexOfFirst(array, searchArray[i], startIndex);
          if (findIndex !== -1) {
            if (findIndex < result) {
              result = findIndex;
              indexAny = i;
            }
          }
        }
        return {
          index: result === Infinity ? -1 : result,
          indexAny: indexAny
        };
      };

      _.indexOfAnyLast = function(array, searchArray, startIndex) {
        c.assert(Array.isArray(array));
        c.assert(Array.isArray(searchArray));
        startIndex = t.ifNullOrUndefinedValue(startIndex, array.length - 1);
        c.assert(t.isInt(startIndex));

        var result = -1;
        var findIndex;
        var indexAny = -1;
        for (var i = 0, l = searchArray.length; i < l; i += 1) {
          findIndex = _.indexOfLast(array, searchArray[i], startIndex);
          if (findIndex !== -1) {
            if (result < findIndex) {
              result = findIndex;
              indexAny = i;
            }
          }
        }
        return {
          index: result,
          indexAny: indexAny
        };
      };

      //----------------------------------------
      //◇indexOfFunc
      //----------------------------------------
      //  ・funcには function(item, index, array) を渡すようにする
      //  ・string.indexOfFunc でテストしている
      //----------------------------------------

      _.indexOfFuncFirst = function(array, func, startIndex) {
        c.assert(Array.isArray(array));
        c.assert(t.isFunction(func));
        startIndex = t.ifNullOrUndefinedValue(startIndex, 0);
        c.assert(t.isInt(startIndex));

        for (var i = startIndex, l = array.length; i < l; i += 1) {
          //func(item, index, array)に対してtrueが返れば
          //その時のindexを戻り値にする
          if (func(array[i], i, array)) {
            return i;
          }
        }
        return -1;
      };

      _.indexOfFuncLast = function(array, func, startIndex) {
        c.assert(Array.isArray(array));
        c.assert(t.isFunction(func));
        startIndex = t.ifNullOrUndefinedValue(startIndex, array.length - 1);
        c.assert(t.isInt(startIndex));

        for (var i = startIndex; 0 <= i; i -= 1) {
          //func(item, index, array)に対してtrueが返れば
          //その時のindexを戻り値にする
          if (func(array[i], i, array)) {
            return i;
          }
        }
        return -1;
      };

      //----------------------------------------
      //◇inputStart/End outputStart/End
      //----------------------------------------
      //  ・Que,Stack,FIFO,LIFO として使用できる
      //  ・push/pop/shift/unshiftでは直感的な名前ではないので
      //    メソッド名として上書きする感じ
      //----------------------------------------

      _.inputStart = function(array, value) {
        c.assert(Array.isArray(array));
        array.unshift(value);
        return array;
      };

      _.inputEnd = function(array, value) {
        c.assert(Array.isArray(array));
        array.push(value);
        return array;
      };

      _.outputStart = function(array) {
        c.assert(Array.isArray(array));
        return array.shift();
      };

      _.outputEnd = function(array) {
        c.assert(Array.isArray(array));
        return array.pop();
      };

      //----------------------------------------
      //◇inputStart/EndArray outputStart/EndArray
      //----------------------------------------
      //  ・Que,Stack,FIFO,LIFO として使用できる
      //  ・引数配列を展開してそれぞれをInやOutする
      //----------------------------------------

      _.inputStartArray = function(array, values) {
        c.assert(Array.isArray(array));
        c.assert(Array.isArray(values));
        for (var i = 0, l = values.length; i < l; i += 1) {
          array.unshift(values[i]);
        }
        return array;
      };

      _.inputEndArray = function(array, values) {
        c.assert(Array.isArray(array));
        c.assert(Array.isArray(values));
        for (var i = 0, l = values.length; i < l; i += 1) {
          array.push(values[i]);
        }
        return array;
      };

      _.outputStartArray = function(array, count) {
        c.assert(Array.isArray(array));
        c.assert(t.isInt(count));
        var result = [];
        for (var i = 0; i < count; i += 1) {
          _.inputEnd(result, _.outputStart(array));
        }
        return result;
      };

      _.test_outputStartArray = function() {
        c.check(true, _.equal([1],      _.outputStartArray([1,2,3,4,5], 1)));
        c.check(true, _.equal([1,2,3],  _.outputStartArray([1,2,3,4,5], 3)));
        c.check(true, _.equal([1,2,3,4,5],  _.outputStartArray([1,2,3,4,5], 5)));
        c.check(true, _.equal([1,2,3,4,5,undefined],  _.outputStartArray([1,2,3,4,5], 6)));
      };

      _.outputEndArray = function(array, count) {
        c.assert(Array.isArray(array));
        c.assert(t.isInt(count));
        var result = [];
        for (var i = 0; i < count; i += 1) {
          _.inputStart(result, _.outputEnd(array));
        }
        return result;
      };

      _.test_outputEndArray = function() {
        c.check(true, _.equal([5],      _.outputEndArray([1,2,3,4,5], 1)));
        c.check(true, _.equal([3,4,5],  _.outputEndArray([1,2,3,4,5], 3)));
        c.check(true, _.equal([1,2,3,4,5],  _.outputEndArray([1,2,3,4,5], 5)));
        c.check(true, _.equal([undefined,1,2,3,4,5],  _.outputEndArray([1,2,3,4,5], 6)));
      };

      //----------------------------------------
      //◇remainStart/End
      //----------------------------------------
      //  ・Que,Stack,FIFO,LIFO として使用する場合に
      //    いくつのバッファを残すか指定できる関数
      //  ・戻り値も渡された引数自体も値が変更される
      //----------------------------------------

      _.remainStart = function(array, count) {
        c.assert(Array.isArray(array));
        c.assert(t.isInt(count));
        c.assert(0 <= count);

        if (count < array.length) {
          _.deleteLength(array, count);
        }
        return array;
      };

      _.test_remainStart = function() {
        c.check(true, _.equal([1,2,3], _.remainStart([1,2,3,4,5], 3)));
        c.check(true, _.equal([], _.remainStart([1,2,3,4,5], 0)));
        c.check(true, _.equal([1,2,3,4,5], _.remainStart([1,2,3,4,5], 5)));
        c.check(true, _.equal([1,2,3,4,5], _.remainStart([1,2,3,4,5], 6)));
      };

      _.remainEnd = function(array, count) {
        c.assert(Array.isArray(array));
        c.assert(t.isInt(count));
        c.assert(0 <= count);

        if (count < array.length) {
          _.deleteLength(array, 0, array.length - count);
        }
        return array;
      };

      _.test_remainEnd = function() {
        c.check(true, _.equal([3,4,5], _.remainEnd([1,2,3,4,5], 3)));
        c.check(true, _.equal([], _.remainEnd([1,2,3,4,5], 0)));
        c.check(true, _.equal([1,2,3,4,5], _.remainEnd([1,2,3,4,5], 5)));
        c.check(true, _.equal([1,2,3,4,5], _.remainEnd([1,2,3,4,5], 6)));
      };

      //----------------------------------------
      //◇ソート
      //----------------------------------------
      //  ・ascending:  昇順
      //    descending: 降順
      //  ・指定できるパターン
      //    number:     数値として扱う
      //    length:     文字列や配列に使用してlengthでソート
      //  ・dictionary: 文字列や数値の場合にtoStringした値で判定する
      //----------------------------------------

      _.sortPattern = function(array, patternName, ordering) {
        c.assert(t.isArray(array));
        c.assert(c.orValue(ordering, 'ascending', 'descending'));
        var orderAscending = ordering === 'ascending';
        switch (patternName) {
        case 'number':
          if (orderAscending) {
            array.sort(function(a,b) { return (a - b); });
          } else {
            array.sort(function(a,b) { return (b - a); });
          }
          break;
        case 'length':
          if (orderAscending) {
            array.sort(function(a,b) { return (a.length - b.length); });
          } else {
            array.sort(function(a,b) { return (b.length - a.length); });
          }
          break;
        case 'dictionary':
          if (orderAscending) {
            array.sort(function(a,b) {
              return (a.toString().toLowerCase() - b.toString().toLowerCase());
            });
          } else {
            array.sort(function(a,b) {
              return (b.toString().toLowerCase() - a.toString().toLowerCase());
            });
          }
          break;
        default:
          c.assert(false,
            'Error:stsLib.array.sortPattern:It is not exist pattern ' +
            patternName + '.');
          break;
        }
      };

      //----------------------------------------
      //◇多次元配列
      //----------------------------------------

      //----------------------------------------
      //・2次元配列を1次元配列に展開する
      //----------------------------------------
      _.expand2Dimension = function(array) {
        c.assert(Array.isArray(array));
        var result = [];
        for (var i1 = 0, l1 = array.length; i1 < l1; i1 += 1) {
          var arrayItem = array[i1];
          if (Array.isArray(arrayItem)) {
            if (arrayItem.length === 0) {
              result.push(undefined);
            } else {
              for (var i2 = 0, l2 = arrayItem.length; i2 < l2; i2 += 1) {
                result.push(arrayItem[i2]);
              }
            }
          } else {
            result.push(arrayItem);
          }
        }
        return result;
      };

      _.test_expand2Dimension = function() {
        c.check('1,2,3,4',          _.expand2Dimension([1,2,3,4]).join());
        c.check('1,2,3,4',          _.expand2Dimension([[1,2],3,4]).join());
        c.check('1,2,3,4',          _.expand2Dimension([[1,2],[3,4]]).join());
        c.check('1,2,3,4,5,6',      _.expand2Dimension([1,2,3,4,5,6]).join());
        c.check('1,2,3,4,5,6',      _.expand2Dimension([[1,2],[3,4], 5, 6]).join());
        c.check('1,2,3,4,5,6',      _.expand2Dimension([[1,2,3,4], 5, 6]).join());
        c.check('1,2,3,4,5,6',      _.expand2Dimension([[1,[2,3],4], 5, 6]).join());
        c.check('1,2,3,4,5,6',      _.expand2Dimension([[[1,[2,3]],4], [5, 6]]).join());
        c.check('1,2,3,4,5,6',      _.expand2Dimension([[[[[[1],2],3],4],5],6]).join());
        c.check('1,2,3,4,5,6,7,8',  _.expand2Dimension([[1,[2,3],4], [5, [6, 7], 8]]).join());
        c.check('', [].join());
        c.check('', [].join(','));
        c.check('1', [1].join(','));
        c.check('1,2', [1,2].join(','));
        c.check('1,2,3,4,5,6,7,8',  [[1,[2,3],4], [5, [6, 7], 8]].join());
        c.check('1,,4,5,6,7,8',  [[1,'',4], [5, [6, 7], 8]].join());

        c.check(0, [].length);
        c.check(1, [undefined].length);
        c.check(2, [undefined, undefined].length);
        c.check(0,      _.expand2Dimension([]).length);
        c.check(1,      _.expand2Dimension([undefined]).length);
        c.check(2,      _.expand2Dimension([undefined, undefined]).length);
        c.check(2,      _.expand2Dimension([[undefined, undefined]]).length);

        c.check(1,      _.expand2Dimension([[]]).length);
        c.check(2,      _.expand2Dimension([[], []]).length);
        c.check(3,      _.expand2Dimension([[[], []], []]).length);

        c.check(2,      _.expand2Dimension([[1, 2]]).length);

        c.check('',     _.expand2Dimension([]).join());
        c.check(0,      _.expand2Dimension([]).length);    //[undefined]を返すので長さが1になる
        c.check(',3,',    _.expand2Dimension([[], [3], []]).join());
        c.check(',3,4,',  _.expand2Dimension([[], [3,4], []]).join());
        c.check(',3,4,',  _.expand2Dimension([[], [3],[4], []]).join());
        c.check(',3,4,',    _.expand2Dimension([[], [[3],[4]], []]).join());
        c.check(',3,4,',  [[], [[3],[4]], []].join());
        c.check('1,,2,,3',  _.expand2Dimension([1, [], 2, [[], 3]]).join());
        c.check(5,        _.expand2Dimension([1, [], 2, [[], 3]]).length);
        c.check('1,,2,,3',  _.expand2Dimension(['1', [], '2', [[], '3']]).join());
        c.check(5,        _.expand2Dimension(['1', [], '2', [[], '3']]).length);
        c.check('1,,2,,3',_.expand2Dimension(['1', [''], '2', [[''], '3']]).join());
        c.check(5,        _.expand2Dimension(['1', [''], '2', [[''], '3']]).length);
        c.check('1,,2,,3',_.expand2Dimension([['1', [[''], '2']], [[''], '3']]).join());
        c.check(4,_.expand2Dimension([['1', [[''], '2']], [[''], '3']]).length);
      };

      //----------------------------------------
      //・多次元配列を1次元配列に展開する
      //----------------------------------------
      //  ・[]は、展開しても、[]になるようにしている。
      //  ・空配列はundefinedを代入するので
      //    [[]]は、[undefined]になる。
      //    [1, [], 2, [[], 3]]は
      //    [1, undefined, 2, undefined, 3]になる
      //  ・空文字に対しては展開するので
      //    ['1', [], '2', [[], '3']]は
      //    ['1',undefined, '2',undefined, '3']になり
      //    ['1', [''], '2', [[''], '3']]は
      //    ['1','','2','','3']になる
      //----------------------------------------
      _.expandMultiDimension = function(array) {
        c.assert(Array.isArray(array));
        var result = [];
        var f = function(value) {
          if (value.length === 0) {
            result.push(undefined);
          } else {
            for (var i = 0, l = value.length; i < l; i += 1) {
              var arrayItem = value[i];
              if (Array.isArray(arrayItem)) {
                f(arrayItem);
              } else {
                result.push(arrayItem);
              }
            }
          }
        };
        if (array.length !== 0) {
          f(array);
        }
        return result;
      };

      _.test_expandMultiDimension = function() {
        c.check('1,2,3,4',          _.expandMultiDimension([1,2,3,4]).join());
        c.check('1,2,3,4',          _.expandMultiDimension([[1,2],3,4]).join());
        c.check('1,2,3,4',          _.expandMultiDimension([[1,2],[3,4]]).join());
        c.check('1,2,3,4,5,6',      _.expandMultiDimension([1,2,3,4,5,6]).join());
        c.check('1,2,3,4,5,6',      _.expandMultiDimension([[1,2],[3,4], 5, 6]).join());
        c.check('1,2,3,4,5,6',      _.expandMultiDimension([[1,2,3,4], 5, 6]).join());
        c.check('1,2,3,4,5,6',      _.expandMultiDimension([[1,[2,3],4], 5, 6]).join());
        c.check('1,2,3,4,5,6',      _.expandMultiDimension([[[1,[2,3]],4], [5, 6]]).join());
        c.check('1,2,3,4,5,6',      _.expandMultiDimension([[[[[[1],2],3],4],5],6]).join());
        c.check('1,2,3,4,5,6,7,8',  _.expandMultiDimension([[1,[2,3],4], [5, [6, 7], 8]]).join());
        c.check('', [].join());
        c.check('', [].join(','));
        c.check('1', [1].join(','));
        c.check('1,2', [1,2].join(','));
        c.check('1,2,3,4,5,6,7,8',  [[1,[2,3],4], [5, [6, 7], 8]].join());
        c.check('1,,4,5,6,7,8',  [[1,'',4], [5, [6, 7], 8]].join());

        //node.js/chromeの場合、最後のカンマは無視されるので
        //下記のテストは通過するが、
        //wshの場合はテスト通過しない
        // c.check(1, [,].length);
        // c.check(1, [1,].length);
        // c.check(2, [1,2].length);
        // c.check(2, [,,].length);
        // c.check(2, [1,,].length);
        // c.check(2, [1,2,].length);
        // c.check(3, [1,,3].length);
        // c.check(3, [,,3].length);
        // c.check(1,        _.expandMultiDimension([,]).length);
        // c.check(',3',     _.expandMultiDimension([, 3,]).join());
        // c.check(2,        _.expandMultiDimension([, 3,]).length);
        // c.check(',3,',    _.expandMultiDimension([, 3,,]).join());
        // c.check(3,        _.expandMultiDimension([, 3,,]).length);

        c.check(0, [].length);
        c.check(1, [undefined].length);
        c.check(2, [undefined, undefined].length);
        c.check(0,      _.expandMultiDimension([]).length);
        c.check(1,      _.expandMultiDimension([undefined]).length);
        c.check(2,      _.expandMultiDimension([undefined, undefined]).length);
        c.check(2,      _.expandMultiDimension([[undefined, undefined]]).length);

        c.check(1,      _.expandMultiDimension([[]]).length);
        c.check(2,      _.expandMultiDimension([[], []]).length);
        c.check(3,      _.expandMultiDimension([[[], []], []]).length);

        c.check('',     _.expandMultiDimension([]).join());
        c.check(0,      _.expandMultiDimension([]).length);    //[undefined]を返すので長さが1になる
        c.check(',3,',    _.expandMultiDimension([[], [3], []]).join());
        c.check(',3,4,',  _.expandMultiDimension([[], [3,4], []]).join());
        c.check(',3,4,',  _.expandMultiDimension([[], [3],[4], []]).join());
        c.check(',3,4,',    _.expandMultiDimension([[], [[3],[4]], []]).join());
        c.check(',3,4,',  [[], [[3],[4]], []].join());
        c.check('1,,2,,3',  _.expandMultiDimension([1, [], 2, [[], 3]]).join());
        c.check(5,        _.expandMultiDimension([1, [], 2, [[], 3]]).length);
        c.check('1,,2,,3',  _.expandMultiDimension(['1', [], '2', [[], '3']]).join());
        c.check(5,        _.expandMultiDimension(['1', [], '2', [[], '3']]).length);
        c.check('1,,2,,3',_.expandMultiDimension(['1', [''], '2', [[''], '3']]).join());
        c.check(5,        _.expandMultiDimension(['1', [''], '2', [[''], '3']]).length);
      };


    }()); //array

    //----------------------------------------
    //◆文字列処理
    //----------------------------------------

    //文字列処理、名前空間
    _.string = stsLib.string || {};
    (function() {
      var _ = stsLib.string;

      /*----------------------------------------
      //・外部からの呼び出し時は
      //  静的関数的な使い方と拡張メソッドのような使い方ができる

        var d = stsLib.debug;

        //・静的関数的な使い方
        //  先頭小文字の string を使う
        c.check(true, stsLib.string.isInclude('abc', 'a'));

        //・拡張メソッド的な使い方
        //  先頭大文字の String を使う
        var str1 = new stsLib.String('abc');
        c.check(true, str1.isInclude('a'));

        //・拡張メソッド的な使い方
        //  newしなくても使用できる
        var str2 = stsLib.String('abc');
        c.check(true, str2.isInclude('a'));

      //・名前空間は何度宣言してもよいので、
      //  別ファイルに同名の名前空間コードをコピペして
      //  作成し、同じ書き方でメソッドを追加していくことができる

      var lib = lib || {};

        stsLib.string = stsLib.string || {};

        stsLib.String = stsLib.String || function(value) {
          var self = function() {};
          self.prototype = stsLib.String.prototype;
          self.prototype.value = value;
          return new self;
        }

      //----------------------------------------*/

      //----------------------------------------
      //◇空文字・空行
      //----------------------------------------

      //----------------------------------------
      //・NullかUndefinedか空文字('')ならTrueを返す
      //----------------------------------------
      _.isEmpty = function(str) {

        if (t.isNullOrUndefined(str) || str ===  '') {
          return true;
        } else {
          return false;
        }
      };

      //----------------------------------------
      //・値が空文字/null/Undefinedの場合だけ別の値を返す関数
      //----------------------------------------
      _.ifEmptyValue = function(str, emptyValue) {
        if (_.isEmpty(str)) {
          return emptyValue;
        } else {
          return str;
        }
      };

      //----------------------------------------
      //・空行かどうか判断する
      //----------------------------------------
      _.isEmptyLine = function(line) {
        return _.isIncludeAll(line, [' ', '\t', '\r', '\n', '　']);
      };

      //----------------------------------------
      //・終端の改行コードを削除する
      //----------------------------------------
      //  ・\nを取り除き\rを取り除けば、
      //    \r\n/\r/\n すべてのタイプの改行コードを
      //    終端から取り除ける
      //----------------------------------------
      _.excludeEndLineBreak = function(line) {
        return _.excludeEnd(
          _.excludeEnd(line, ['\n']), ['\r']);
      };

      //----------------------------------------
      //◇Delete
      //----------------------------------------

      _.deleteIndex = function(str, startIndex, endIndex) {
        return a.deleteIndex(str.split(''), startIndex, endIndex).join('');
      };

      _.test_deleteIndex = function() {
        c.check('abde',   _.deleteIndex('abcde', 2, 2));
        c.check('abe',    _.deleteIndex('abcde', 2, 3));
        c.check('de',     _.deleteIndex('abcde', 0, 2));
        c.check('ae',     _.deleteIndex('abcde', 1, 3));
        c.check('abde',   _.deleteIndex('abcde', 2));
      };

      _.deleteLength = function(str, startIndex, length) {
        return a.deleteLength(str.split(''), startIndex, length).join('');
      };

      _.test_deleteLength = function() {
        c.check('abde',   _.deleteLength('abcde', 2, 1));
        c.check('abe',    _.deleteLength('abcde', 2, 2));
        c.check('de',     _.deleteLength('abcde', 0, 3));
        c.check('ae',     _.deleteLength('abcde', 1, 3));
        c.check('ab',     _.deleteLength('abcde', 2));
      };


      //----------------------------------------
      //◇Include
      //----------------------------------------

      //----------------------------------------
      //・含まれているかどうか
      //----------------------------------------
      //  ・isInclude/includes/contains
      //    別名の同一機能
      //----------------------------------------
      _.isInclude = function(str, search) {
        return (0 <= _.indexOfFirst(str, search));
      };

      _.includes = function(str, search) {
        return _.isInclude(str, search);
      };

      _.contains = function(str, search) {
        return _.isInclude(str, search);
      };

      _.test_isInclude = function() {

        c.check(true, _.isInclude('abc', 'a'));
        c.check(true, _.isInclude('abc', 'b'));
        c.check(true, _.isInclude('abc', 'c'));
        c.check(false,_.isInclude('abc', 'd'));
        c.check(false,_.isInclude('abc', ''));
        c.check(false,_.isInclude('', 'a'));
      };

      //----------------------------------------
      //・配列で指定したものがいずれかが含まれている
      //----------------------------------------
      _.isIncludeAny = function(str, searchArray) {
        return (_.indexOfAnyFirst(str, searchArray).index !== -1);
      };

      _.test_isIncludeAny = function() {
        c.checkResult('ER', null, _.isIncludeAny, 'abc', []);
        c.check(false,  _.isIncludeAny('abc', ['d', 'e']));
        c.check(true,   _.isIncludeAny('abc', ['a', 'c']));
        c.check(true,   _.isIncludeAny('abc', ['b', 'c']));
        c.check(true,   _.isIncludeAny('abc', ['', 'c']));
        c.check(false,  _.isIncludeAny('abc', ['', '']));
      };

      //----------------------------------------
      //・関数で指定した条件のものが含まれている
      //----------------------------------------
      _.isIncludeFunc = function(str, func) {
        return (_.indexOfFuncFirst(str, func) !== -1);
      };

      _.test_isIncludeFunc = function() {

        c.check(false,  _.isIncludeFunc('abc def ghi abc',
          function(s, index, str) {
            return false;
          }));

        c.check(false,  _.isIncludeFunc('abc def ghi abc',
          function(s, index, str) {
            return c.orValue(s, 'x', 'y', 'z');
          }));

        c.check(true,   _.isIncludeFunc('abc def ghi abc',
          function(s, index, str) {
            return c.orValue(s, 'd', 'g', 'i');
          }));

      };


      //----------------------------------------
      //・全てが含まれているかどうか確認する
      //----------------------------------------
      //  ・指定した配列の中身の内容で
      //      文字列が全て成り立っているかどうか確認する関数
      //  ・isIncludeAll('abc', ['a', 'b', 'c'])
      //      とすると、true が戻る
      //----------------------------------------
      _.isIncludeAll = function(str, searchArray) {

        c.assert(Array.isArray(searchArray));
        for (var i = 0; i < searchArray.length; i += 1) {
          str = s.replaceAll(str, searchArray[i], '');
        }
        return s.isEmpty(str);
      };

      _.test_isIncludeAll = function() {
        c.check(true, _.isIncludeAll('abc', ['a', 'b', 'c']));
        c.check(true, _.isIncludeAll('abc', ['a', 'b', 'c', 'd']));
        c.check(false,_.isIncludeAll('abc', ['a', 'b']));
      };

      //----------------------------------------
      //・含まれている個数
      //----------------------------------------
      _.includeCount = function(str, search) {
        var result = 0;
        var index = 0;
        do {
          index = _.indexOfFirst(str, search, index);
          if (index === -1) { break; }
          index = index + search.length;
          result++;
        } while (true);
        return result;
      };

      _.strCount = function(str, search) {
        return _.includeCount(str, search);
      };

      _.test_includeCount = function() {

        c.check(3, _.includeCount('123123123', '1'),    'A');
        c.check(3, _.includeCount('123123123', '2'),    'B');
        c.check(3, _.includeCount('123123123', '3'),    'C');
        c.check(3, _.includeCount('123123123', '12'),   'D');
        c.check(2, _.includeCount('123123123', '31'),   'E');
        c.check(6, _.includeCount('AAAAAA', 'A'),       'F');
        c.check(3, _.includeCount('AAAAAA', 'AA'),      'G');
      };

      //----------------------------------------
      //◇indexOf
      //----------------------------------------

      _.indexOfFirst = function(str, search, startIndex) {
        c.assert(t.isStrings(str, search));
        startIndex = t.ifNullOrUndefinedValue(startIndex, 0);
        c.assert(t.isInt(startIndex));

        if (search === '') { return -1; }
        return str.indexOf(search, startIndex);
      };

      _.test_indexOfFirst = function() {

        c.check(-1, _.indexOfFirst('abc', 'd'));
        c.check( 0, _.indexOfFirst('abc', 'a'));
        c.check( 1, _.indexOfFirst('abc', 'b'));
        c.check( 2, _.indexOfFirst('abc', 'c'));
        c.check(-1, _.indexOfFirst('abc', ''));
        c.check( 0, _.indexOfFirst('abcabc', 'a'));
        c.check( 1, _.indexOfFirst('abcabc', 'b'));
        c.check( 2, _.indexOfFirst('abcabc', 'c'));

        c.check( 0, _.indexOfFirst('abcabc', 'a', 0));
        c.check( 3, _.indexOfFirst('abcabc', 'a', 1));
        c.check( 1, _.indexOfFirst('abcabc', 'b', 1));
        c.check( 4, _.indexOfFirst('abcabc', 'b', 2));
        c.check( 2, _.indexOfFirst('abcabc', 'c', 2));
        c.check( 5, _.indexOfFirst('abcabc', 'c', 3));
      };

      _.indexOfLast = function(str, search, startIndex) {
        c.assert(t.isStrings(str, search));
        startIndex = t.ifNullOrUndefinedValue(startIndex, str.length - 1);
        c.assert(t.isInt(startIndex));

        if (search === '') { return -1; }
        return str.lastIndexOf(search, startIndex);
      };

      _.test_indexOfLast = function() {

        c.check(-1, _.indexOfLast('abc', 'd'));
        c.check( 0, _.indexOfLast('abc', 'a'));
        c.check( 1, _.indexOfLast('abc', 'b'));
        c.check( 2, _.indexOfLast('abc', 'c'));
        c.check(-1, _.indexOfLast('abc', ''));
        c.check( 3, _.indexOfLast('abcabc', 'a'));
        c.check( 4, _.indexOfLast('abcabc', 'b'));
        c.check( 5, _.indexOfLast('abcabc', 'c'));

        c.check( 3, _.indexOfLast('abcabc', 'a', 3));
        c.check( 0, _.indexOfLast('abcabc', 'a', 2));
        c.check( 4, _.indexOfLast('abcabc', 'b', 4));
        c.check( 1, _.indexOfLast('abcabc', 'b', 3));
        c.check( 5, _.indexOfLast('abcabc', 'c', 5));
        c.check( 2, _.indexOfLast('abcabc', 'c', 4));
      };


      //----------------------------------------
      //◇indexOfAny
      //----------------------------------------

      _.indexOfAnyFirst = function(str, searchArray, startIndex) {
        c.assert(t.isString(str));
        c.assert(t.isArray(searchArray));
        c.assert(t.isStrings(searchArray));
        startIndex = t.ifNullOrUndefinedValue(startIndex, 0);
        c.assert(t.isInt(startIndex));

        var result = Infinity;
        var findIndex;
        var indexAny = -1;
        for (var i = 0, l = searchArray.length; i < l; i += 1) {
          findIndex = _.indexOfFirst(str, searchArray[i], startIndex);
          if (findIndex !== -1) {
            if (findIndex < result) {
              result = findIndex;
              indexAny = i;
            }
          }
        }
        return {
          index: result === Infinity ? -1 : result,
          indexAny: indexAny
        };
      };

      _.test_indexOfAnyFirst = function() {

        c.checkResult('ER', null, _.indexOfAnyFirst, 'abc', 'ab');
        c.checkResult('ER', null, _.indexOfAnyFirst, 'abc', []);
        c.checkResult('ER', null, _.indexOfAnyFirst, 'abc', [123]);

        c.check(-1, _.indexOfAnyFirst('abc', ['d', 'e']).index);
        c.check( 0, _.indexOfAnyFirst('abc', ['a', 'c']).index);
        c.check( 1, _.indexOfAnyFirst('abc', ['b', 'c']).index);
        c.check( 2, _.indexOfAnyFirst('abc', ['', 'c']).index);
        c.check(-1, _.indexOfAnyFirst('abc', ['', '']).index);

        c.check( 0, _.indexOfAnyFirst('abcabc', ['a', 'c'], 0).index);
        c.check( 2, _.indexOfAnyFirst('abcabc', ['a', 'c'], 1).index);
        c.check( 2, _.indexOfAnyFirst('abcabc', ['a', 'c'], 2).index);
        c.check( 3, _.indexOfAnyFirst('abcabc', ['a', 'c'], 3).index);
        c.check( 1, _.indexOfAnyFirst('abcabc', ['b'], 1).index);
        c.check( 4, _.indexOfAnyFirst('abcabc', ['b'], 2).index);
      };

      _.indexOfAnyLast = function(str, searchArray, startIndex) {
        c.assert(t.isString(str));
        c.assert(t.isArray(searchArray));
        c.assert(t.isStrings(searchArray));
        startIndex = t.ifNullOrUndefinedValue(startIndex, str.length - 1);
        c.assert(t.isInt(startIndex));

        var result = -1;
        var findIndex;
        var indexAny = -1;
        for (var i = 0, l = searchArray.length; i < l; i += 1) {
          findIndex = s.indexOfLast(str, searchArray[i], startIndex);
          if (findIndex !== -1) {
            if (result < findIndex) {
              result = findIndex;
              indexAny = i;
            }
          }
        }
        return {
          index: result,
          indexAny: indexAny
        };
      };

      _.test_indexOfAnyLast = function() {

        c.checkResult('ER', null, _.indexOfAnyLast, 'abc', 'ab');
        c.checkResult('ER', null, _.indexOfAnyLast, 'abc', []);
        c.checkResult('ER', null, _.indexOfAnyLast, 'abc', [123]);

        c.check(-1, _.indexOfAnyLast('abc', ['d', 'e']).index);
        c.check( 2, _.indexOfAnyLast('abc', ['a', 'c']).index);
        c.check( 1, _.indexOfAnyLast('abc', ['b', 'a']).index);
        c.check( 2, _.indexOfAnyLast('abc', ['', 'c']).index);
        c.check(-1, _.indexOfAnyLast('abc', ['', '']).index);

        c.check( 5, _.indexOfAnyLast('abcabc', ['a', 'c']).index);
        c.check( 5, _.indexOfAnyLast('abcabc', ['a', 'c'], 5).index);
        c.check( 3, _.indexOfAnyLast('abcabc', ['a', 'c'], 4).index);
        c.check( 3, _.indexOfAnyLast('abcabc', ['a', 'c'], 3).index);
        c.check( 2, _.indexOfAnyLast('abcabc', ['a', 'c'], 2).index);
      };

      //----------------------------------------
      //◇indexOfFunc
      //----------------------------------------

      _.indexOfFuncFirst = function(str, func, startIndex) {
        c.assert(t.isString(str));

        return a.indexOfFuncFirst(str.split(''),
          function(item, i, array) {
            return func(item, i, array.join(''));
          }, startIndex);
      };

      _.test_indexOfFuncFirst = function() {

        c.check(-1, _.indexOfFuncFirst('abc def ghi abc',
          function(s, index, str) {
            return false;
          }));

        c.check( 4, _.indexOfFuncFirst('abc def ghi abc',
          function(s, index, str) {
            return c.orValue(s, 'd', 'g', 'i');
          }));

        c.check( 8, _.indexOfFuncFirst('abc def ghi abc',
          function(s, index, str) {
            return c.orValue(s, 'd', 'g', 'i');
          }, 5));

        c.check(10, _.indexOfFuncFirst('abc def ghi abc',
          function(s, index, str) {
            return c.orValue(s, 'd', 'g', 'i');
          }, 9));

        c.check( 6, _.indexOfFuncFirst('abcdefGhiAbc',
          function(s, index, str) {
            return (s === s.toUpperCase());
          }));
      };

      _.indexOfFuncLast = function(str, func, startIndex) {
        c.assert(t.isString(str));

        return a.indexOfFuncLast(str.split(''),
          function(item, i, array) {
            return func(item, i, array.join(''));
          }, startIndex);
      };

      _.test_indexOfFuncLast = function() {

        c.check(-1, _.indexOfFuncLast('abc def ghi abc',
          function(s, index, str) {
            return false;
          }));

        c.check(10, _.indexOfFuncLast('abc def ghi abc',
          function(s, index, str) {
            return c.orValue(s, 'd', 'g', 'i');
          }));

        c.check( 4, _.indexOfFuncLast('abc def ghi abc',
          function(s, index, str) {
            return c.orValue(s, 'd', 'g', 'i');
          }, 7));

        c.check( 9, _.indexOfFuncLast('abcdefGhiAbc',
          function(s, index, str) {
            return (s === s.toUpperCase());
          }));
      };

      //----------------------------------------
      //◇Substring系
      //----------------------------------------

      //----------------------------------------
      //・Index指定のSubstring
      //----------------------------------------
      //  ・JavaScript標準のsubtring/sliceと似ているが
      //    Indexの不自然さを排除
      //    endIndexの位置で切り取り
      //  ・負の値のIndexに対応
      //    -1は最後の文字になる
      //  ・endIndex未指定なら、文字列の最後まで切り取り
      //----------------------------------------
      _.substrIndex = function(str, startIndex, endIndex) {

        c.assert(t.isString(str));
        c.assert(t.isInt(startIndex));
        if (t.isNullOrUndefined(endIndex)) {
          if (str.length <= startIndex) {
            return '';
          }
          endIndex = str.length - 1;
        }
        c.assert(t.isInt(endIndex));

        if (startIndex < 0) {
          startIndex = str.length + startIndex;
        }
        if (endIndex < 0) {
          endIndex = str.length + endIndex;
        }

        if (startIndex <= endIndex) {
          return str.substring(startIndex, endIndex + 1);
        } else {
          return str.substring(endIndex, startIndex + 1);
        }
      };

      _.test_substrIndex = function() {

        c.check('45',     _.substrIndex('012345', 4));
        c.check('2345',   _.substrIndex('012345', -4));
        c.check('1',      _.substrIndex('012345', 1, 1));
        c.check('1234',   _.substrIndex('012345', 1, 4));
        c.check('345',    _.substrIndex('012345', 3, 10));
        c.check('1234',   _.substrIndex('012345', 4, 1));
        c.check('345',    _.substrIndex('012345', 10, 3));

        c.check('5',      _.substrIndex('012345', -1, -1));
        c.check('2345',   _.substrIndex('012345', -1, -4));
        c.check('0123',   _.substrIndex('012345', -3, -10));
        c.check('2345',   _.substrIndex('012345', -4, -1));
        c.check('0123',   _.substrIndex('012345', -10, -3));

        c.check('0',      _.substrIndex('012345', 0, 0));
        c.check('5',      _.substrIndex('012345', 5, 5));
        c.check('45',     _.substrIndex('012345', -1, 4));
        c.check('45',     _.substrIndex('012345', 4, -1));
        c.check('12',   _.substrIndex('012345', -4, 1));
        c.check('12',   _.substrIndex('012345', 1, -4));
        c.check('0123',   _.substrIndex('012345', -10, 3));
        c.check('0123',   _.substrIndex('012345', 3, -10));
        c.check('345',   _.substrIndex('012345', 10, -3));
        c.check('345',   _.substrIndex('012345', -3, 10));

        c.check('',     _.substrIndex(' ', 1));
        c.check('',     _.substrIndex(' ', 1, 1));
      };

      //----------------------------------------
      //・Length指定のSubstring
      //----------------------------------------
      //  ・JavaScript標準のsubstrと似ているが
      //    負のlengthに対応
      //  ・負の値のIndexに対応
      //    -1は最後の文字になる
      //  ・lengthは1を指定しても-1を指定しても同じ
      //    -2を指定すると前方文字を取得する
      //  ・length未指定なら、文字列の最後まで切り取り
      //----------------------------------------
      _.substrLength = function(str, startIndex, length) {
        if (length === 0) { return ''; }
        if ((startIndex < (-1 * str.length))
        || ((str.length) < startIndex)) { return '';}
        if (startIndex < 0) {
          startIndex = str.length + startIndex;
        }

        if (t.isNullOrUndefined(length)) {
          length = str.length;
        }
        var endIndex;
        if (length < 0) {
          endIndex = startIndex + length + 1;
        } else {
          endIndex = startIndex + length - 1;
        }

        return _.substrIndex(str, startIndex, endIndex);
      };

      _.test_substrLength = function() {

        c.check('45',   _.substrLength('012345', 4));
        c.check('2345', _.substrLength('012345', -4));
        c.check('23',   _.substrLength('012345', 2, 2));
        c.check('234',  _.substrLength('012345', 2, 3));
        c.check('345',  _.substrLength('012345', 3, 10));
        c.check('4',    _.substrLength('012345', 4, 1));
        c.check('',     _.substrLength('012345', 10, 3));

        c.check('5',    _.substrLength('012345', -1, -1));
        c.check('45',   _.substrLength('012345', -1, -2));
        c.check('0123', _.substrLength('012345', -3, -10));
        c.check('34',   _.substrLength('012345', -3, 2));
        c.check('2',    _.substrLength('012345', -4, -1));
        c.check('2',    _.substrLength('012345', -4, 1));
        c.check('12',   _.substrLength('012345', -4, -2));
        c.check('23',   _.substrLength('012345', -4, 2));
        c.check('',     _.substrLength('012345', -10, -3));

        c.check('',     _.substrLength('012345', 0, 0));
        c.check('',     _.substrLength('012345', 3, 0));
      };

      //----------------------------------------
      //◇Start
      //----------------------------------------

      //----------------------------------------
      //・先頭を切り取るメソッド
      //----------------------------------------
      _.start = function(str, length) {
        c.assert(t.isString(str));
        c.assert(t.isInt(length));
        if (str === '') { return ''; }
        if (length <= 0) { return ''; }
        return _.substrLength(str, 0, length);
      };

      _.test_start = function() {

        c.check('0123',   _.start('012345', 4));
        c.check('',       _.start('012345', 0));
        c.check('',       _.start('012345', -3));
        c.check('01',     _.start('012345', 2));
        c.check('012',    _.start('012345', 3));
        c.check('012345', _.start('012345', 6));
        c.check('012345', _.start('012345', 10));
      };

      //----------------------------------------
      //・先頭の一致を調べる
      //----------------------------------------
      _.isStart = function(str, search) {
        c.assert(t.isStrings(str, search));
        if (search === '') { return false; }
        if (str === '') { return false; }
        if (str.length < search.length) { return false; }

        if (_.indexOfFirst(str, search) === 0) {
          return true;
        } else {
          return false;
        }
      };

      _.startsWith = function(str, search) {
        return _.isStart(str, search);
      };

      _.hasPrefix = function(str, search) {
        return _.isStart(str, search);
      };

      _.test_isStart = function() {

        c.check(true,  _.isStart('12345', '1'), 'A');
        c.check(true,  _.isStart('12345', '12'), 'B');
        c.check(true,  _.isStart('12345', '123'), 'C');
        c.check(false, _.isStart('12345', '23'), 'D');
        c.check(false, _.isStart('', '34'), 'E');
        c.check(false, _.isStart('12345', ''), 'F');
        c.check(false, _.isStart('123', '1234'), 'G');
      };

      //----------------------------------------
      //・先頭に含む
      //----------------------------------------
      _.includeStart = function(str, search) {
        if (_.isStart(str, search)) {
          return str;
        } else {
          return search + str;
        }
      };

      _.test_includeStart = function() {

        c.check('12345',  _.includeStart('12345', '1'));
        c.check('12345',  _.includeStart('12345', '12'));
        c.check('12345',  _.includeStart('12345', '123'));
        c.check('2312345',_.includeStart('12345', '23'));
      };

      //----------------------------------------
      //・先頭から取り除く
      //----------------------------------------
      _.excludeStart = function(str, search) {
        if (_.isStart(str, search)) {
          return _.substrIndex(str, search.length);
        } else {
          return str;
        }
      };

      _.test_excludeStart = function() {

        c.check('2345', _.excludeStart('12345', '1'));
        c.check('345',  _.excludeStart('12345', '12'));
        c.check('45',   _.excludeStart('12345', '123'));
        c.check('12345',_.excludeStart('12345', '23'));
        c.check('',     _.excludeStart(' ', ' '));
      };

      //----------------------------------------
      //・先頭から削除
      //----------------------------------------
      //  ・lengthは0以上にすること
      //----------------------------------------

      _.deleteStart = function(str, length) {
        c.assert(t.isString(str));
        c.assert(t.isInt(length) && (0 <= length));

        if (length === 0) {
          return str;
        }
        // return _.substrIndex(str, length);
        return str.slice(length);
      };

      _.test_deleteStart = function() {

        c.check('2345', _.deleteStart('12345', 1));
        c.check('345',  _.deleteStart('12345', 2));
        c.check('45',   _.deleteStart('12345', 3));
        c.check('12345',_.deleteStart('12345', 0));
        c.check('',     _.deleteStart('12345', 5));
        c.check('',     _.deleteStart('12345', 6));
      };

      //----------------------------------------
      //・先頭をゼロやスペースで埋める
      //----------------------------------------
      //  ・fillCharのデフォルト値はスペース
      //  ・digitは0以上
      //----------------------------------------

      _.fillStart = function(str, digit, fillChar) {
        fillChar = t.ifNullOrUndefinedValue(fillChar, ' ');
        c.assert(t.isStrings(str, fillChar));
        c.assert(1 <= fillChar.length);
        c.assert(t.isInt(digit) && (0 <= digit));

        if (digit === 0) {
          return str;
        }
        if (digit <= str.length) {
          return str;
        }
        return s.end(s.repeat(fillChar, digit) + str, digit);
      };

      _.test_fillStart = function() {
        c.check('123',    _.fillStart('123', 1));
        c.check('123',    _.fillStart('123', 2));
        c.check('123',    _.fillStart('123', 3));
        c.check(' 123',   _.fillStart('123', 4));
        c.check('  123',  _.fillStart('123', 5));
        c.check('0123',   _.fillStart('123', 4, '0'));
        c.check('00123',  _.fillStart('123', 5, '0'));
      };


      //----------------------------------------
      //◇End
      //----------------------------------------

      //----------------------------------------
      //・終端を切り取るメソッド
      //----------------------------------------
      _.end = function(str, length) {
        c.assert(t.isString(str));
        c.assert(t.isInt(length));
        if (str === '') { return ''; }
        if (length <= 0) { return ''; }
        return _.substrLength(str,
          Math.max(0, str.length - length));
      };

      _.test_end = function() {

        c.check('2345',   _.end('012345', 4));
        c.check('',       _.end('012345', 0));
        c.check('',       _.end('012345', -3));
        c.check('45',     _.end('012345', 2));
        c.check('345',    _.end('012345', 3));
        c.check('012345', _.end('012345', 6));
        c.check('012345', _.end('012345', 10));
      };

      //----------------------------------------
      //・終端の一致を調べる
      //----------------------------------------
      _.isEnd = function(str, search) {
        c.assert(t.isStrings(str, search));
        if (search === '') { return false; }
        if (str === '') { return false; }
        if (str.length < search.length) { return false; }

        if (_.indexOfLast(str, search) ===
          str.length - search.length) {
          return true;
        } else {
          return false;
        }
      };

      _.endsWith = function(str, search) {
        return _.isEnd(str, search);
      };

      _.hasSuffix = function(str, search) {
        return _.isEnd(str, search);
      };

      _.test_isEnd = function() {

        c.check(true,  _.isEnd('12345', '5'));
        c.check(true,  _.isEnd('12345', '45'));
        c.check(true,  _.isEnd('12345', '345'));
        c.check(false, _.isEnd('12345', '34'));
        c.check(false, _.isEnd('', '34'));
        c.check(false, _.isEnd('12345', ''));
        c.check(false, _.isEnd('123', '1234'));
      };

      //----------------------------------------
      //・終端に含む
      //----------------------------------------
      _.includeEnd = function(str, search) {
        if (_.isEnd(str, search)) {
          return str;
        } else {
          return str + search;
        }
      };

      _.test_includeEnd = function() {

        c.check('12345',   _.includeEnd('12345', '5'));
        c.check('12345',   _.includeEnd('12345', '45'));
        c.check('12345',   _.includeEnd('12345', '345'));
        c.check('1234534', _.includeEnd('12345', '34'));
      };

      //----------------------------------------
      //・終端から取り除く
      //----------------------------------------
      _.excludeEnd = function(str, search) {
        if (_.isEnd(str, search)) {
          if (str.length === search.length) {
            return '';
          } else {
            return _.substrIndex(str, 0,
              str.length - search.length - 1);
          }
        } else {
          return str;
        }
      };

      _.test_excludeEnd = function() {

        c.check('1234',   _.excludeEnd('12345', '5'));
        c.check('123',    _.excludeEnd('12345', '45'));
        c.check('12',     _.excludeEnd('12345', '345'));
        c.check('12345',  _.excludeEnd('12345', '34'));
        c.check('  ',     _.excludeEnd('   ', ' '));
        c.check('',       _.excludeEnd(' ', ' '));
      };

      //----------------------------------------
      //・終端から削除
      //----------------------------------------
      //  ・lenは0以上にすること
      //----------------------------------------
      _.deleteEnd = function(str, len) {
        c.assert(t.isString(str));
        c.assert(t.isInt(len) && (0 <= len));

        if (len === 0) {
          return str;
        }
        // var deleteIndex = str.length - len - 1;
        // if (deleteIndex <= 0) {
        //   return '';
        // }
        // return _.substrIndex(str, 0, deleteIndex);
        return str.slice(0, -1 * len);
      };

      _.test_deleteEnd = function() {

        c.check('1234', _.deleteEnd('12345', 1));
        c.check('123',  _.deleteEnd('12345', 2));
        c.check('12',   _.deleteEnd('12345', 3));
        c.check('12345',_.deleteEnd('12345', 0));
        c.check('',     _.deleteEnd('12345', 5));
        c.check('',     _.deleteEnd('12345', 6));
      };

      //----------------------------------------
      //・終端をゼロやスペースで埋める
      //----------------------------------------
      //  ・fillCharのデフォルト値はスペース
      //  ・digitは0以上
      //----------------------------------------

      _.fillEnd = function(str, digit, fillChar) {
        fillChar = t.ifNullOrUndefinedValue(fillChar, ' ');
        c.assert(t.isStrings(str, fillChar));
        c.assert(1 <= fillChar.length);
        c.assert(t.isInt(digit) && (0 <= digit));

        if (digit === 0) {
          return str;
        }
        if (digit <= str.length) {
          return str;
        }
        return s.start(str + s.repeat(fillChar, digit), digit);
      };

      _.test_fillEnd = function() {
        c.check('123',    _.fillEnd('123', 1));
        c.check('123',    _.fillEnd('123', 2));
        c.check('123',    _.fillEnd('123', 3));
        c.check('123 ',   _.fillEnd('123', 4));
        c.check('123  ',  _.fillEnd('123', 5));
        c.check('1230',   _.fillEnd('123', 4, '0'));
        c.check('12300',  _.fillEnd('123', 5, '0'));
      };

      //----------------------------------------
      //◇両端 BothEnds
      //----------------------------------------
      _.bothEndsWith = function(str, search) {
        return _.isStart(str, search) &&
          _.isEnd(str, search);
      };

      _.includeBothEnds = function(str, search) {
        return _.includeStart(
          _.includeEnd(str, search), search);
      };

      _.excludeBothEnds = function(str, search) {
        return _.excludeStart(
          _.excludeEnd(str, search), search);
      };

      //----------------------------------------
      //◇delimiter
      //----------------------------------------

      //----------------------------------------
      //・startFirstDelim
      //----------------------------------------
      _.startFirstDelim = function(str, delimiter) {
        var index = _.indexOfFirst(str, delimiter);
        if (index === -1) {
          return str;
        } else if (index === 0) {
          return '';
        } else {
          return _.substrIndex(str, 0, index - 1);
        }
      };

      _.test_startFirstDelim = function() {

        c.check('123', _.startFirstDelim('123,456', ','));
        c.check('123', _.startFirstDelim('123,456,789', ','));
        c.check('123', _.startFirstDelim('123ttt456', 'ttt'));
        c.check('123', _.startFirstDelim('123ttt456', 'tt'));
        c.check('123', _.startFirstDelim('123ttt456', 't'));
        c.check('123ttt456', _.startFirstDelim('123ttt456', ','));
        c.check('123', _.startFirstDelim('123,', ','));
        c.check('', _.startFirstDelim(',123', ','));
        c.check('', _.startFirstDelim(',123,', ','));
      };

      //----------------------------------------
      //・startLastDelim
      //----------------------------------------
      _.startLastDelim = function(str, delimiter) {
        var index = _.indexOfLast(str, delimiter);
        if (index === -1) {
          return str;
        } else if (index === 0) {
          return '';
        } else {
          return _.substrIndex(str, 0, index -1);
        }
      };

      _.test_startLastDelim = function() {

        c.check('123', _.startLastDelim('123,456', ','));
        c.check('123,456', _.startLastDelim('123,456,789', ','));
        c.check('123', _.startLastDelim('123ttt456', 'ttt'));
        c.check('123t', _.startLastDelim('123ttt456', 'tt'));
        c.check('123tt', _.startLastDelim('123ttt456', 't'));
        c.check('123ttt456', _.startLastDelim('123ttt456', ','));
        c.check('123', _.startLastDelim('123,', ','));
        c.check('', _.startLastDelim(',123', ','));
        c.check(',123', _.startLastDelim(',123,', ','));
      };

      //----------------------------------------
      //・endFirstDelim
      //----------------------------------------
      _.endFirstDelim = function(str, delimiter) {
        var index = _.indexOfFirst(str, delimiter);
        if (index === -1) {
          return str;
        } else if (index === str.length - 1) {
          return '';
        } else {
          return _.substrIndex(str, index + delimiter.length);
        }
      };

      _.test_endFirstDelim = function() {

        c.check('456', _.endFirstDelim('123,456', ','));
        c.check('456,789', _.endFirstDelim('123,456,789', ','));
        c.check('456', _.endFirstDelim('123ttt456', 'ttt'));
        c.check('t456', _.endFirstDelim('123ttt456', 'tt'));
        c.check('tt456', _.endFirstDelim('123ttt456', 't'));
        c.check('123ttt456', _.endFirstDelim('123ttt456', ','));
        c.check('', _.endFirstDelim('123,', ','));
        c.check('123', _.endFirstDelim(',123', ','));
        c.check('123,', _.endFirstDelim(',123,', ','));
      };

      //----------------------------------------
      //・endLastDelim
      //----------------------------------------
      _.endLastDelim = function(str, delimiter) {
        var index = _.indexOfLast(str, delimiter);
        if (index === -1) {
          return str;
        } else if (index === str.length - delimiter.length) {
          return '';
        } else {
          return _.substrIndex(str, index + delimiter.length);
        }
      };

      _.test_endLastDelim = function() {

        c.check('456', _.endLastDelim('123,456', ','));
        c.check('789', _.endLastDelim('123,456,789', ','));
        c.check('456', _.endLastDelim('123ttt456', 'ttt'));
        c.check('456', _.endLastDelim('123ttt456', 'tt'));
        c.check('456', _.endLastDelim('123ttt456', 't'));
        c.check('123ttt456', _.endLastDelim('123ttt456', ','));
        c.check('', _.endLastDelim('123,', ','));
        c.check('123', _.endLastDelim(',123', ','));
        c.check('', _.endLastDelim(',123,', ','));

        var Text = '<123>123<789> <123>456<789> <123>789<789>';
        c.check('', _.endLastDelim(Text, '<789>'));

      };

      //--------------------------------------
      //◇Trim
      //--------------------------------------
      _.trimStart = function(str, trimStrArray) {
        var result = str;
        do {
          str = result;
          for (var i = 0; i <= trimStrArray.length - 1; i++) {
            result = _.excludeStart(result, trimStrArray[i]);
          }
        } while (result !== str);
        return result;
      };

      _.trimLeft = function(str, trimStrArray) {
        return _.trimStart(str, trimStrArray);
      };

      _.test_trimStart = function() {

        c.check('123 ',           _.trimStart('   123 ', [' ']));
        c.check('\t  123 ',       _.trimStart('   \t  123 ', [' ']));
        c.check('123 ',           _.trimStart('   \t  123 ', [' ', '\t']));
        c.check('\t 456  \t   ',  _.trimStart('  \t 456  \t   ', [' ']));
        c.check('456  \t   ',     _.trimStart('  \t 456  \t   ', [' ', '\t']));
        c.check('\t   \t   ',     _.trimStart('  \t   \t   ', [' ']));
        c.check('',               _.trimStart('  \t   \t   ', [' ', '\t']));
      };

      _.trimEnd = function(str, trimStrArray) {
        var result = str;
        do {
          str = result;
          for (var i = 0; i <= trimStrArray.length - 1; i++) {
            result = _.excludeEnd(result, trimStrArray[i]);
          }
        } while (result !== str);
        return result;
      };

      _.trimRight = function(str, trimStrArray) {
        return _.trimEnd(str, trimStrArray);
      };

      _.test_trimEnd = function() {

        c.check(' 123',       _.trimEnd(' 123   ', [' ']));
        c.check(' 456  \t',   _.trimEnd(' 456  \t   ', [' ']));
        c.check(' 789',       _.trimEnd(' 789  \t   ', [' ', '\t']));
        c.check('  \t   \t',  _.trimEnd('  \t   \t   ', [' ']));
        c.check('',           _.trimEnd('  \t   \t   ', [' ', '\t']));
      };

      _.trimBothEnds = function(str, trimStrArray) {
        return _.trimStart(
          _.trimEnd(str, trimStrArray), trimStrArray);
      };

      _.trim = function(str) {
        return _.trimBothEnds(str, [' ', '\t', '\r', '\n']);
      };

      _.trimSpaceOnly = function(str) {
        return _.trimBothEnds(str, [' ']);
      };

      //----------------------------------------
      //・TrimでCutする方の文字列を取得する
      //----------------------------------------
      _.trimCutStart = function(str, trimStrArray) {
        return _.start(str,
          str.length - _.trimStart(str, trimStrArray).length);
      };

      _.trimCutEnd = function(str, trimStrArray) {
        return _.end(str,
          str.length - _.trimEnd(str, trimStrArray).length);
      };

      //--------------------------------------
      //◇deleteFirst/Last
      //--------------------------------------
      //  ・検索して見つかった値を削除する
      //--------------------------------------

      _.deleteFirst = function(str, search) {
        if (_.indexOfFirst(str, search) === -1) {
          return str;
        } else {
          return _.startFirstDelim(str, search) +
            _.endFirstDelim(str, search);
        }
      };

      _.deleteLast = function(str, search) {
        if (_.indexOfLast(str, search) === -1) {
          return str;
        } else {
          return _.startLastDelim(str, search) +
            _.endLastDelim(str, search);
        }
      };

      _.test_deleteFirstLast = function() {

        c.check('abcdefghi', _.deleteFirst(
          _.deleteLast('abc<def>ghi', '>'), '<'));
        c.check('abc><def><ghi', _.deleteFirst(
          _.deleteLast('a<bc><def><gh>i', '>'), '<'));
        c.check('abcdefghi', _.deleteFirst(
          _.deleteLast('abc>def<ghi', '>'), '<'));
        c.check('abc>def<ghi', _.deleteFirst(
          _.deleteLast('a<bc>def<gh>i', '>'), '<'));
      };

      //--------------------------------------
      //◇deleteFirstTagInner/Outer
      //--------------------------------------
      _.deleteFirstTagInner = function(str, startTag, endTag) {

        c.assert((!t.isNullOrUndefined(str)) );
        c.assert(!_.isEmpty(startTag));
        c.assert(!_.isEmpty(endTag));
        if (str === '') { return ''; }

        var indexStartTag = _.indexOfFirst(str, startTag);
        if (indexStartTag !== -1) {
          //startTagはある
          var indexEndTag = _.indexOfFirst(str, endTag,
            indexStartTag + startTag.length);
          if (indexEndTag !== -1) {
            //endTagはある
            return _.deleteIndex(str,
              indexStartTag + startTag.length,
              indexEndTag - 1);
          } else {
            //endTagはない
            //タグで囲まれていないので削除は行わない
            return str;
          }
        } else {
          //startTagはない
          //タグで囲まれていないので削除は行わない
          return str;
        }
      };

      _.test_deleteFirstTagInner = function() {

        c.check('abc<>ghi', _.deleteFirstTagInner('abc<def>ghi', '<', '>'));
        c.check('abc<>ghi<jkl>mn', _.deleteFirstTagInner('abc<def>ghi<jkl>mn', '<', '>'));
        c.check('abc<def>ghi<j>mn', _.deleteFirstTagInner('abc<def>ghi<jkl>mn', '<j', '>'));

        c.check('Date: abc\r\nTo: \r\nFrom: ghi\r\n',
          _.deleteFirstTagInner('Date: abc\r\nTo: def\r\nFrom: ghi\r\n', 'To: ', '\r\n'));
      };

      _.deleteFirstTagOuter = function(str, startTag, endTag) {

        c.assert((!t.isNullOrUndefined(str)) );
        c.assert(!_.isEmpty(startTag));
        c.assert(!_.isEmpty(endTag));
        if (str === '') { return ''; }

        var indexStartTag = str.indexOf(startTag);
        if (indexStartTag !== -1) {
          //startTagはある
          var indexEndTag = _.indexOfFirst(str, endTag,
            indexStartTag + startTag.length);
          if (indexEndTag !== -1) {
            //endTagはある
            return _.deleteIndex(str,
              indexStartTag,
              indexEndTag + endTag.length - 1);
          } else {
            //endTagはない
            //タグで囲まれていないので削除は行わない
            return str;
          }
        } else {
          //startTagはない
          //タグで囲まれていないので削除は行わない
          return str;
        }
      };

      _.test_deleteFirstTagOuter = function() {

        c.check('abcghi', _.deleteFirstTagOuter('abc<def>ghi', '<', '>'));
        c.check('abcghi<jkl>mn', _.deleteFirstTagOuter('abc<def>ghi<jkl>mn', '<', '>'));
        c.check('abc<def>ghimn', _.deleteFirstTagOuter('abc<def>ghi<jkl>mn', '<j', '>'));

        c.check('Date: abc\r\nFrom: ghi\r\n',
          _.deleteFirstTagOuter('Date: abc\r\nTo: def\r\nFrom: ghi\r\n', 'To: ', '\r\n'));
      };

      //--------------------------------------
      //◇deleteLastTagInner/Outer
      //--------------------------------------
      _.deleteLastTagInner = function(str, startTag, endTag) {

        c.assert((!t.isNullOrUndefined(str)) );
        c.assert(!_.isEmpty(startTag));
        c.assert(!_.isEmpty(endTag));
        if (str === '') { return ''; }

        var indexEndTag = _.indexOfLast(str, endTag);
        if (indexEndTag !== -1) {
          //endTagはある
          var indexStartTag = _.indexOfLast(str, startTag,
            indexEndTag - 1);
          if (indexStartTag !== -1) {
            //startTagはある
            return _.deleteIndex(str,
              indexStartTag + startTag.length,
              indexEndTag - 1);
          } else {
            //startTagはない
            //タグで囲まれていないので削除は行わない
            return str;
          }
        } else {
          //endTagはない
          //タグで囲まれていないので削除は行わない
          return str;
        }
      };

      _.test_deleteLastTagInner = function() {

        c.check('abc<>ghi', _.deleteLastTagInner('abc<def>ghi', '<', '>'));
        c.check('abc<def>ghi<>mn', _.deleteLastTagInner('abc<def>ghi<jkl>mn', '<', '>'));
        c.check('abc<f>ghi<jkl>mn', _.deleteLastTagInner('abc<def>ghi<jkl>mn', '<', 'f>'));

        c.check('Date: abc\r\nTo: \r\n',
          _.deleteLastTagInner('Date: abc\r\nTo: def\r\nFrom: ghi\r\n', 'To: ', '\r\n'));
      };

      _.deleteLastTagOuter = function(str, startTag, endTag) {

        c.assert((!t.isNullOrUndefined(str)) );
        c.assert(!_.isEmpty(startTag));
        c.assert(!_.isEmpty(endTag));
        if (str === '') { return ''; }

        var indexEndTag = _.indexOfLast(str, endTag);
        if (indexEndTag !== -1) {
          //endTagはある
          var indexStartTag = _.indexOfLast(str, startTag,
            indexEndTag - 1);
          if (indexStartTag !== -1) {
            //startTagはある
            return _.deleteIndex(str,
              indexStartTag,
              indexEndTag + endTag.length - 1);
          } else {
            //startTagはない
            //タグで囲まれていないので削除は行わない
            return str;
          }
        } else {
          //endTagはない
          //タグで囲まれていないので削除は行わない
          return str;
        }
      };

      _.test_deleteLastTagOuter = function() {

        c.check('abcghi', _.deleteLastTagOuter('abc<def>ghi', '<', '>'));
        c.check('abc<def>ghimn', _.deleteLastTagOuter('abc<def>ghi<jkl>mn', '<', '>'));
        c.check('abcghi<jkl>mn', _.deleteLastTagOuter('abc<def>ghi<jkl>mn', '<', 'f>'));

        c.check('Date: abc\r\n',
          _.deleteLastTagOuter('Date: abc\r\nTo: def\r\nFrom: ghi\r\n', 'To: ', '\r\n'));
      };

      //--------------------------------------
      //◇deleteAllTag
      //--------------------------------------
      _.deleteAllTag = function(str, startTag, endTag) {
        var result = str;
        do {
          str = result;
          result = _.deleteFirstTagOuter(str, startTag, endTag);
        } while (str !== result);
        return result;
      };

      _.test_deleteAllTag = function() {

        c.check('abcghi', _.deleteAllTag('abc<def>ghi', '<', '>'));
        c.check('abcghimn', _.deleteAllTag('abc<def>ghi<jkl>mn', '<', '>'));
      };

      //--------------------------------------
      //◇Tag Inner/Outer
      //--------------------------------------

      //----------------------------------------
      //・最初の start,end の組み合わせのタグを含まない文字
      //----------------------------------------
      _.tagInnerFirst = function(str, startTag, endTag) {
        c.assert((!t.isNullOrUndefined(str)) );
        c.assert(!_.isEmpty(startTag, endTag));
        if (str === '') { return ''; }

        var indexStartTag = _.indexOfFirst(str, startTag);
        if (indexStartTag !== -1) {
          //startTagはある
          var indexEndTag = _.indexOfFirst(str, endTag,
            indexStartTag + startTag.length);
          if (indexEndTag !== -1) {
            //endTagはある
            return _.startFirstDelim(
              _.endFirstDelim(str, startTag), endTag);
          } else {
            //endTagはない
            return '';
          }
        } else {
          //startTagはない
          return '';
        }
      };

      _.test_tagInnerFirst = function() {

        c.check('456',  _.tagInnerFirst('000<123>456<789>000', '<123>', '<789>'), 'test01');
        c.check('456',  _.tagInnerFirst('<123>456<789>', '<123>', '<789>'), 'test02');
        c.check('',     _.tagInnerFirst('000<123>456', '<123>', '<789>'), 'test03');
        c.check('',     _.tagInnerFirst('456<789>000', '<123>', '<789>'), 'test04');
        c.check('',     _.tagInnerFirst('456', '<123>', '<789>'), 'test05');
        c.check('',     _.tagInnerFirst('000<123><789>000', '<123>', '<789>'), 'test06');
        c.check('',     _.tagInnerFirst('000<123>456<789>000', '<789>', '<123>'), 'test07');

        var Text = '<123>123<789> <123>456<789> <123>789<789>';
        c.check('123',
          _.tagInnerFirst(Text, '<123>', '<789>'), 'test01');
        c.check('',
          _.tagInnerFirst(Text, '<123>', '<456>'), 'test02');
        c.check('',
          _.tagInnerFirst(Text, '<456>', '<789>'), 'test03');
        c.check('',
          _.tagInnerFirst(Text, '<456>', '<123>'), 'test04');
        c.check('',
          _.tagInnerFirst(Text, '<789>', '<456>'), 'test05');
        c.check('',
          _.tagInnerFirst(Text, '<321>', '<456>'), 'test06');
        c.check('123<789> <123>45',
          _.tagInnerFirst(Text, '<123>', '6<789>'), 'test07');
      };

      //----------------------------------------
      //・最初の start,end の組み合わせのタグを含む文字
      //----------------------------------------
      _.tagOuterFirst = function(str, startTag, endTag) {
        c.assert((!t.isNullOrUndefined(str)) );
        c.assert(!_.isEmpty(startTag, endTag));
        if (str === '') { return ''; }

        var indexStartTag = _.indexOfFirst(str, startTag);
        if (indexStartTag !== -1) {
          //startTagはある
          var indexEndTag = _.indexOfFirst(str, endTag,
            indexStartTag + startTag.length);
          if (indexEndTag !== -1) {
            //endTagはある
            return startTag + _.startFirstDelim(
              _.endFirstDelim(str, startTag), endTag) + endTag;
          } else {
            //endTagはない
            return '';
          }
        } else {
          //startTagはない
          return '';
        }
      };

      _.test_tagOuterFirst = function() {

        c.check('<123>456<789>',  _.tagOuterFirst(
          '000<123>456<789>000', '<123>', '<789>'), 'test01');
        c.check('<123>456<789>',  _.tagOuterFirst(
          '<123>456<789>', '<123>', '<789>'), 'test02');
        c.check('',       _.tagOuterFirst(
          '000<123>456', '<123>', '<789>'), 'test03');
        c.check('',       _.tagOuterFirst(
          '456<789>000', '<123>', '<789>'), 'test04');
        c.check('',            _.tagOuterFirst(
          '456', '<123>', '<789>'), 'test05');
        c.check('<123><789>',     _.tagOuterFirst(
          '000<123><789>000', '<123>', '<789>'), 'test06');
        c.check('',  _.tagOuterFirst(
          '000<123>456<789>000', '<789>', '<123>'), 'test07');

        var Text = '<123>123<789> <123>456<789> <123>789<789>';
        c.check('<123>123<789>',
          _.tagOuterFirst(Text, '<123>', '<789>'), 'test01');
        c.check('',
          _.tagOuterFirst(Text, '<123>', '<456>'), 'test02');
        c.check('',
          _.tagOuterFirst(Text, '<456>', '<789>'), 'test03');
        c.check('',
          _.tagOuterFirst(Text, '<456>', '<123>'), 'test04');
        c.check('',
          _.tagOuterFirst(Text, '<789>', '<456>'), 'test05');
        c.check('',
          _.tagOuterFirst(Text, '<321>', '<456>'), 'test06');
        c.check('<123>123<789> <123>456<789>',
          _.tagOuterFirst(Text, '<123>', '6<789>'), 'test07');
      };

      //----------------------------------------
      //・最後の start,end の組み合わせのタグを含まない文字
      //----------------------------------------
      _.tagInnerLast = function(str, startTag, endTag) {
        c.assert((!t.isNullOrUndefined(str)) );
        c.assert(!_.isEmpty(startTag, endTag));
        if (str === '') { return ''; }

        var indexEndTag = _.indexOfLast(str, endTag);
        if (indexEndTag !== -1) {
          //endTagはある
          var indexStartTag = _.indexOfLast(str, startTag,
            indexEndTag - 1);
          if (indexStartTag !== -1) {
            //startTagはある
            return _.endLastDelim(
              _.startLastDelim(str, endTag), startTag);
          } else {
            //startTagはない
            return '';
          }
        } else {
          //endTagはない
          return '';
        }
      };

      _.test_tagInnerLast = function() {
        c.check('456',  _.tagInnerLast('000<123>456<789>000', '<123>', '<789>'), 'test01');
        c.check('456',  _.tagInnerLast('<123>456<789>', '<123>', '<789>'), 'test02');
        c.check('',     _.tagInnerLast('000<123>456', '<123>', '<789>'), 'test03');
        c.check('',     _.tagInnerLast('456<789>000', '<123>', '<789>'), 'test04');
        c.check('',     _.tagInnerLast('456', '<123>', '<789>'), 'test05');
        c.check('',     _.tagInnerLast('000<123><789>000', '<123>', '<789>'), 'test06');
        c.check('',     _.tagInnerLast('000<123>456<789>000', '<789>', '<123>'), 'test07');

        var Text = '<123>ABC<789> <123>DEF<789> <123>GHI<789>';
        c.check('GHI',
          _.tagInnerLast(Text, '<123>', '<789>'), 'test01');
        c.check('',
          _.tagInnerLast(Text, '<123>', '<456>'), 'test02');
        c.check('',
          _.tagInnerLast(Text, '<456>', '<789>'), 'test03');
        c.check('',
          _.tagInnerLast(Text, '<456>', '<123>'), 'test04');
        c.check('',
          _.tagInnerLast(Text, '<789>', '<456>'), 'test05');
        c.check('',
          _.tagInnerLast(Text, '<321>', '<456>'), 'test06');
        c.check('DE',
          _.tagInnerLast(Text, '<123>', 'F<789>'), 'test07');
      };

      //----------------------------------------
      //・最後の start,end の組み合わせのタグを含む文字
      //----------------------------------------
      _.tagOuterLast = function(str, startTag, endTag) {
        c.assert((!t.isNullOrUndefined(str)) );
        c.assert(!_.isEmpty(startTag, endTag));
        if (str === '') { return ''; }

        var indexEndTag = _.indexOfLast(str, endTag);
        if (indexEndTag !== -1) {
          //endTagはある
          var indexStartTag = _.indexOfLast(str, startTag,
            indexEndTag - 1);
          if (indexStartTag !== -1) {
            //startTagはある
            return startTag + _.endLastDelim(
              _.startLastDelim(str, endTag), startTag) + endTag;
          } else {
            //startTagはない
            return '';
          }
        } else {
          //endTagはない
          return '';
        }
      };

      _.test_tagOuterLast = function() {

        c.check('<123>456<789>',  _.tagOuterLast(
          '000<123>456<789>000', '<123>', '<789>'), 'test01');
        c.check('<123>456<789>',  _.tagOuterLast(
          '<123>456<789>', '<123>', '<789>'), 'test02');
        c.check('',       _.tagOuterLast(
          '000<123>456', '<123>', '<789>'), 'test03');
        c.check('',       _.tagOuterLast(
          '456<789>000', '<123>', '<789>'), 'test04');
        c.check('',            _.tagOuterLast(
          '456', '<123>', '<789>'), 'test05');
        c.check('<123><789>',     _.tagOuterLast(
          '000<123><789>000', '<123>', '<789>'), 'test06');
        c.check('',            _.tagOuterLast(
          '000<123>456<789>000', '<789>', '<123>'), 'test07');

        var Text = '<123>123<789> <123>456<789> <123>789<789>';
        c.check('<123>789<789>',
          _.tagOuterLast(Text, '<123>', '<789>'), 'test01');
        c.check('',
          _.tagOuterLast(Text, '<123>', '<456>'), 'test02');
        c.check('',
          _.tagOuterLast(Text, '<456>', '<789>'), 'test03');
        c.check('',
          _.tagOuterLast(Text, '<456>', '<123>'), 'test04');
        c.check('',
          _.tagOuterLast(Text, '<789>', '<456>'), 'test05');
        c.check('',
          _.tagOuterLast(Text, '<321>', '<456>'), 'test06');
        c.check('<123>456<789>',
          _.tagOuterLast(Text, '<123>', '6<789>'), 'test06');
      };

      //----------------------------------------
      //・タグで囲まれた文字を全て抽出する
      //----------------------------------------
      _.tagOuterAll = function(str, startTag, endTag) {
        return _.tagOuterAllArray(str, startTag, endTag).join('');
      };

      _.test_tagOuterAll = function() {

        c.check('<def>', _.tagOuterAll('abc<def>ghi', '<', '>'));
        c.check('<def><jkl>', _.tagOuterAll('abc<def>ghi<jkl>mn', '<', '>'));
      };

      //----------------------------------------
      //・タグで囲まれた文字を全て抽出して配列に出力する
      //----------------------------------------
      _.tagOuterAllArray = function(str, startTag, endTag) {
        c.assert((!t.isNullOrUndefined(str)) );
        c.assert(!_.isEmpty(startTag, endTag));
        if (str === '') { return ''; }

        var indexStartTag, indexEndTag;
        var result = [];

        while (true) {
          indexStartTag = _.indexOfFirst(str, startTag);
          if (indexStartTag !== -1) {
            //startTagはある
            indexEndTag = _.indexOfFirst(str, endTag,
              indexStartTag + startTag.length);
            if (indexEndTag !== -1) {
              //endTagはある
              a.add(result, startTag + _.startFirstDelim(
                _.endFirstDelim(str, startTag), endTag) + endTag);
            } else {
              //endTagはない
              return result;
            }
          } else {
            //startTagはない
            return result;
          }

          str = _.substrIndex(str, indexEndTag + endTag.length);
        }
      };


      //----------------------------------------
      //◇文字列生成
      //----------------------------------------
      _.repeat = function(str, count) {
        var result = '';
        for (var i = 0; i < count; i += 1) {
          result += str;
        }
        return result;
      };

      _.test_repeat = function() {

        c.check('AAAAA',  _.repeat('A', 5));
        c.check('ABABAB', _.repeat('AB', 3));
        c.check('AB',     _.repeat('AB', 1));
        c.check('',       _.repeat('AB', 0));
        c.check('',       _.repeat('', 0));
        c.check('',       _.repeat('', 5));
      };

      //----------------------------------------
      //◇置き換え
      //----------------------------------------

      //----------------------------------------
      //・replaceAll
      //----------------------------------------
      //  ・文字列の繰り返し置換
      //----------------------------------------
      _.replaceAll = function(str, before, after) {
        c.assert(t.isStrings(str, before, after));
        return str.split(before).join(after);
      };

      _.test_replaceAll = function() {

        c.check('AAABBBAAA', _.replaceAll('123BBB123', '123', 'AAA'));
        c.check('AAAABBBBBBBAAAA',
          _.replaceAll('AAAAAAABBBBBBBAAAAAAA', 'AA', 'A'));

        c.check('',
          _.replaceAll('', 'AA', 'A'));
      };

      //----------------------------------------
      //・replaceAllArray
      //----------------------------------------
      //  ・配列内容に従って一斉に置き換え
      //  ・ab の文字を aをb に bをa に同時置き換えできる
      //  ・一致して置き換えを行うため
      //    AAA >> B | AA >> C のように検索文字を長いもの順に
      //    しておかないと誤動作する
      //----------------------------------------
      _.replaceAllArray = function(str, replaceArray) {
        c.assert(t.isString(str));
        c.assert(t.isArray(replaceArray));

        var keys = [];
        for (var i = 0, l = replaceArray.length; i < l; i += 1) {
          c.assert(replaceArray[i].length === 2);
          c.assert(t.isStrings(replaceArray[i][0], replaceArray[i][1]));
          keys.push(replaceArray[i][0]);
        }
        var start = 0;
        var result = '';
        var searchResult = null;
        while (true) {
          searchResult = s.indexOfAnyFirst(str, keys, start);
          if (searchResult.index === -1) {
            //検索文字が見つからなかった場合
            //ループから抜ける
            result += s.substrIndex(str, start);
            break;
          }

          if (start < searchResult.index) {
            result += s.substrIndex(str, start, searchResult.index - 1);
            start = searchResult.index;
          }
          result += replaceArray[searchResult.indexAny][1];
          start += keys[searchResult.indexAny].length;
        }
        return result;
      };

      _.test_replaceAllArray = function() {
        c.check('ba', _.replaceAllArray('ab', [
          ['a', 'b'],
          ['b', 'a']
        ]));
        c.check('bababa', _.replaceAllArray('ababab', [
          ['ab', 'ba']
        ]));
        c.check('baabb', _.replaceAllArray('abbab', [
          ['ab', 'ba'],
          ['ba', 'ab']
        ]));
        c.check('cd', _.replaceAllArray('cd', [
          ['a', 'b'],
          ['b', 'a']
        ]));
      };

      //----------------------------------------
      //◇変換
      //----------------------------------------

      //----------------------------------------
      //・逆順
      //----------------------------------------
      _.reverse = function(str) {
        return str.split('').reverse().join('');
      };

      _.test_reverse = function() {

        c.check('54321', _.reverse('12345'));
        c.check('321', _.reverse('123'));
        c.check('21', _.reverse('12'));
        c.check('2', _.reverse('2'));
        c.check('', _.reverse(''));
      };

      //----------------------------------------
      //◇カンマ区切り/スペース区切り
      //----------------------------------------

      //----------------------------------------
      //・先頭から区切る
      //----------------------------------------
      _.formatInsertFirst = function(str, delimiter, count) {

        c.assert(t.isString(str));
        c.assert(t.isString(delimiter));
        c.assert(t.isInt(count));

        if (s.isEmpty(str)) {
          return '';
        }

        //WSHは文字列をstr[i]の形で扱えないので
        //その対策を行う
        str = str.split('');

        var result = str[0];
        for (var i = 1; i <= str.length - 1; i += 1) {
          if (i % count === 0) {
            result += delimiter + str[i];
          } else {
            result += str[i];
          }
        }
        return result;
      };

      _.test_formatInsertFirst = function() {

        c.check('123 456 789 012 3',_.formatInsertFirst('1234567890123', ' ', 3));
        c.check('123 456 789 123',  _.formatInsertFirst('123456789123', ' ', 3));
        c.check('123,4',            _.formatInsertFirst('1234', ',', 3));
        c.check('123',              _.formatInsertFirst('123', ',', 3));
        c.check('12',               _.formatInsertFirst('12', ',', 3));
        c.check('0',                _.formatInsertFirst('0', ',', 3));
        c.check('',                 _.formatInsertFirst('', ',', 3));
      };

      //----------------------------------------
      //・後方から区切る
      //----------------------------------------
      _.formatInsertLast = function(str, delimiter, count) {

        c.assert(t.isString(str));
        c.assert(t.isString(delimiter));
        c.assert(t.isInt(count));

        if (s.isEmpty(str)) {
          return '';
        }

        //WSHは文字列をstr[i]の形で扱えないので
        //その対策を行う
        str = str.split('');

        var result = str[str.length - 1];
        for (var i = 1; i <= str.length - 1; i += 1) {
          if (i % count === 0) {
            result += delimiter + str[str.length - 1 - i];
          } else {
            result += str[str.length - 1 - i];
          }
        }
        return s.reverse(result);
      };

      _.test_formatInsertLast = function() {

        c.check('1 234 567 890 123',_.formatInsertLast('1234567890123', ' ', 3));
        c.check('123 456 789 123',  _.formatInsertLast('123456789123', ' ', 3));
        c.check('1,234',            _.formatInsertLast('1234', ',', 3));
        c.check('123',              _.formatInsertLast('123', ',', 3));
        c.check('12',               _.formatInsertLast('12', ',', 3));
        c.check('0',                _.formatInsertLast('0', ',', 3));
        c.check('',                 _.formatInsertLast('', ',', 3));
      };

      //----------------------------------------
      //◇文字列の形式チェック
      //----------------------------------------
      _.checkFormat = function(str, formatName) {
        switch (formatName) {
        case 'zenkaku':
          // 全角文字
          return (str.match(/^[^\x01-\x7E\xA1-\xDF]+$/)) ? true : false;
        case 'hiragana':
          // 全角ひらがな
          return (str.match(/^[\u3041-\u3096]+$/)) ? true : false;
        case 'katakana':
          // 全角カタカナ
          return (str.match(/^[\u30a1-\u30f6]+$/)) ? true : false;
        case 'alphabet-number':
          // 半角英数字（大文字・小文字）
          return (str.match(/^[0-9a-zA-Z]+$/)) ? true : false;
        case 'number':
          // 半角数字
          return (str.match(/^[0-9]+$/)) ? true : false;
        case 'alphabet':
          // 半角英字（大文字・小文字）
          return (str.match(/^[a-zA-Z]+$/)) ? true : false;
        case 'upper-alphabet':
          // 半角英字（大文字のみ）
          return (str.match(/^[A-Z]+$/)) ? true : false;
        case 'lower-alphabet':
          // 半角英字（小文字のみ）
          return (str.match(/^[a-z]+$/)) ? true : false;
        case 'integer':
          // 整数値
          return (str.match(/^[+|-]?[0-9]+$/)) ? true : false;
        case 'float-only':
          // 小数点を含むあ値
          return (str.match(/^[-|+]?[0-9]*\.[0-9]+$/)) ? true : false;
        case 'float':
          // 整数値か小数値
          return (str.match(/^[-|+]?[0-9]*\.[0-9]+$|^[+|-]?[0-9]+$/)) ? true : false;
        case 'binary':
          // 2進数
          return (str.match(/^[01]+$/)) ? true : false;
        case 'octal':
          // 8進数
          return (str.match(/^[0-7]+$/)) ? true : false;
        case 'hex':
          // 16進数
          return (str.match(/^[0-9A-F]+$|^[0-9a-f]+$/)) ? true : false;
        case 'date':
          // y/m/d
          return (str.match(/^\d{1,4}\/\d{1,2}\/\d{1,2}$/)) ? true : false;
        case 'date-minutes':
          // y/m/d h:n
          return (str.match(
            /^\d{1,4}\/\d{1,2}\/\d{1,2}\s\d{1,2}:\d{1,2}$/)) ? true : false;
        case 'date-seconds':
          // y/m/d h:n:s
          return (str.match(
            /^\d{1,4}\/\d{1,2}\/\d{1,2}\s\d{1,2}:\d{1,2}:\d{1,2}$/))
            ? true : false;
        case 'date-milliseconds':
          // y/m/d h:n:s.ms
          return (str.match(
            /^\d{1,4}\/\d{1,2}\/\d{1,2}\s\d{1,2}:\d{1,2}:\d{1,2}\.\d{1,3}$/))
            ? true : false;
        default:
          c.assert(false);
          break;
        }
      };

      //----------------------------------------
      //◇文字列拡張メソッド
      //----------------------------------------
      //  ・拡張メソッドのように後方にメソッドを接続して
      //    動作させることができる
      //      var str = new stsLib.String('abc');
      //      str.isInclude('a');  //true
      //  ・new 無しでも動作するようにする仕組みも組み込んでいる
      //  ・lib.String の名前空間部分だけ記述が下記のように長い
      //----------------------------------------

      _.String = stsLib.string.String || function(value) {
        if (!(this instanceof stsLib.string.String)) {
          return new stsLib.string.String(value);
        }
        this.value = value;
      };
      (function() {
        var _ = stsLib.string.String;

        _.prototype.isEmpty = function() {
          return stsLib.string.isEmpty(this.value);
        };

        _.prototype.ifEmptyValue = function(emptyValue) {
          return stsLib.string.ifEmptyValue(this.value, emptyValue);
        };

        _.prototype.isInclude = function(search) {
          return stsLib.string.isInclude(this.value, search);
        };

        _.prototype.includeCount = function(search) {
          return stsLib.string.includeCount(this.value, search);
        };

        _.prototype.indexOfFirst = function(search, startIndex) {
          return stsLib.string.indexOfFirst(this.value, search, startIndex);
        };

        _.prototype.indexOfLast = function(search, startIndex) {
          return stsLib.string.indexOfLast(this.value, search, startIndex);
        };

        _.prototype.indexOfAnyFirst = function(searchArray, startIndex) {
          return stsLib.string.indexOfAnyFirst(this.value, searchArray, startIndex);
        };

        _.prototype.indexOfAnyLast = function(searchArray, startIndex) {
          return stsLib.string.indexOfAnyLast(this.value, searchArray, startIndex);
        };

        _.prototype.indexOfFuncFirst = function(func, startIndex) {
          return stsLib.string.indexOfFuncFirst(this.value, func, startIndex);
        };

        _.prototype.indexOfFuncLast = function(func, startIndex) {
          return stsLib.string.indexOfFuncLast(this.value, func, startIndex);
        };

        _.prototype.substrIndex = function(startIndex, endIndex) {
          return stsLib.string.substrIndex(this.value, startIndex, endIndex);
        };

        _.prototype.substrLength = function(startIndex, length) {
          return stsLib.string.substrLength(this.value, startIndex, length);
        };

        _.prototype.start = function(length) {
          return stsLib.string.start(this.value, length);
        };

        _.prototype.isStart = function(search) {
          return stsLib.string.isStart(this.value, search);
        };

        _.prototype.includeStart = function(search) {
          return stsLib.string.includeStart(this.value, search);
        };

        _.prototype.excludeStart = function(search) {
          return stsLib.string.excludeStart(this.value, search);
        };

        _.prototype.deleteStart = function(len) {
          return stsLib.string.deleteStart(this.value, len);
        };

        _.prototype.end = function(length) {
          return stsLib.string.end(this.value, length);
        };

        _.prototype.isEnd = function(search) {
          return stsLib.string.isEnd(this.value, search);
        };

        _.prototype.includeEnd = function(search) {
          return stsLib.string.includeEnd(this.value, search);
        };

        _.prototype.excludeEnd = function(search) {
          return stsLib.string.excludeEnd(this.value, search);
        };

        _.prototype.deleteEnd = function(len) {
          return stsLib.string.deleteEnd(this.value, len);
        };

        _.prototype.bothEndsWith = function(search) {
          return stsLib.string.bothEndsWith(this.value, search);
        };

        _.prototype.includeBothEnds = function(search) {
          return stsLib.string.includeBothEnds(this.value, search);
        };

        _.prototype.excludeBothEnds = function(search) {
          return stsLib.string.excludeBothEnds(this.value, search);
        };

        _.prototype.startFirstDelim = function(delimiter) {
          return stsLib.string.startFirstDelim(this.value, delimiter);
        };

        _.prototype.startLastDelim = function(delimiter) {
          return stsLib.string.startLastDelim(this.value, delimiter);
        };

        _.prototype.endFirstDelim = function(delimiter) {
          return stsLib.string.endFirstDelim(this.value, delimiter);
        };

        _.prototype.endLastDelim = function(delimiter) {
          return stsLib.string.endLastDelim(this.value, delimiter);
        };

        _.prototype.trimStart = function(trimStrArray) {
          return stsLib.string.trimStart(this.value, trimStrArray);
        };

        _.prototype.trimEnd = function(trimStrArray) {
          return stsLib.string.trimEnd(this.value, trimStrArray);
        };

        _.prototype.trimBothEnds = function(trimStrArray) {
          return stsLib.string.trimBothEnds(this.value, trimStrArray);
        };

        _.prototype.trim = function() {
          return stsLib.string.trim(this.value);
        };

        _.prototype.deleteFirst = function(search) {
          return stsLib.string.deleteFirst(this.value, search);
        };

        _.prototype.deleteLast = function(search) {
          return stsLib.string.deleteLast(this.value, search);
        };

        _.prototype.deleteFirstTagInner = function(startTag, endTag) {
          return stsLib.string.deleteFirstTagInner(this.value, startTag, endTag);
        };

        _.prototype.deleteFirstTagOuter = function(startTag, endTag) {
          return stsLib.string.deleteFirstTagOuter(this.value, startTag, endTag);
        };

        _.prototype.deleteLastTagInner = function(startTag, endTag) {
          return stsLib.string.deleteLastTagInner(this.value, startTag, endTag);
        };

        _.prototype.deleteLastTagOuter = function(startTag, endTag) {
          return stsLib.string.deleteLastTagOuter(this.value, startTag, endTag);
        };

        _.prototype.deleteAllTag = function(startTag, endTag) {
          return stsLib.string.deleteAllTag(this.value, startTag, endTag);
        };

        _.prototype.tagInnerFirst = function(startTag, endTag) {
          return stsLib.string.tagInnerFirst(this.value, startTag, endTag);
        };

        _.prototype.tagOuterFirst = function(startTag, endTag) {
          return stsLib.string.tagOuterFirst(this.value, startTag, endTag);
        };

        _.prototype.tagInnerLast = function(startTag, endTag) {
          return stsLib.string.tagInnerLast(this.value, startTag, endTag);
        };

        _.prototype.tagOuterLast = function(startTag, endTag) {
          return stsLib.string.tagOuterLast(this.value, startTag, endTag);
        };

        _.prototype.tagOuterAll = function(startTag, endTag) {
          return stsLib.string.tagOuterAll(this.value, startTag, endTag);
        };

        _.prototype.replaceAll = function(before, after) {
          return stsLib.string.replaceAll(this.value, before, after);
        };

        _.prototype.test = function() {

          //拡張メソッド的な使い方
          var str1 = new stsLib.string.String('abc');
          c.check(true, str1.isInclude('a'));
          c.check(true, str1.isInclude('b'));
          c.check(true, str1.isInclude('c'));
          c.check(false,str1.isInclude('d'));

          //newしなくてもよい
          var str2 = stsLib.string.String('abc');
          c.check(true, str2.isInclude('a'));
          c.check(true, str2.isInclude('b'));
          c.check(true, str2.isInclude('c'));
          c.check(false,str2.isInclude('d'));
        };
      }());

      //----------------------------------------
      //◇オブジェクト拡張メソッド継承
      //----------------------------------------
      //  ・拡張メソッドの方のオブジェクトは継承して
      //    次のようなものを作ることができる
      //  ・StringEx は継承の実装例なので
      //    ライブラリとして使うためのものではない
      //----------------------------------------

      _.StringEx = stsLib.string.StringEx || function(value) {
        if (!(this instanceof stsLib.string.StringEx)) {
          return new stsLib.string.StringEx(value);
        }
        _.String.call(this, value);
      };
      stsLib.inherits(_.StringEx, _.String);

      (function() {
        var _ = stsLib.string.StringEx;

        _.prototype.isNotInclude = function(search) {
          return !s.isInclude(this.value, search);
        };

        _.prototype.test = function() {

          //継承しているので継承元のメソッドが使える
          var str3 = new stsLib.string.StringEx('abc');
          c.check(false,str3.isNotInclude('a'));
          c.check(false,str3.isNotInclude('b'));
          c.check(false,str3.isNotInclude('c'));
          c.check(true, str3.isNotInclude('d'));
          c.check(true, str3.isInclude('a'));
          c.check(true, str3.isInclude('b'));
          c.check(true, str3.isInclude('c'));
          c.check(false,str3.isInclude('d'));

          //継承しても new しなくてもよい
          var str4 = stsLib.string.StringEx('abc');
          c.check(false,str4.isNotInclude('a'));
          c.check(false,str4.isNotInclude('b'));
          c.check(false,str4.isNotInclude('c'));
          c.check(true, str4.isNotInclude('d'));
          c.check(true, str4.isInclude('a'));
          c.check(true, str4.isInclude('b'));
          c.check(true, str4.isInclude('c'));
          c.check(false,str4.isInclude('d'));

          var str5 = new stsLib.string.String('abc');
          //c.check(false,str5.isNotInclude('a'));
          //str5にはisNotIncludeメソッドはないために
          //これはエラーになる

          c.check(true,  str3 instanceof stsLib.string.String);
          c.check(true,  str3 instanceof stsLib.string.StringEx);
          c.check(false, str3.constructor === stsLib.string.String);
          c.check(true,  str3.constructor === stsLib.string.StringEx);

          c.check(true,  str4 instanceof stsLib.string.String);
          c.check(true,  str4 instanceof stsLib.string.StringEx);
          c.check(false, str4.constructor === stsLib.string.String);
          c.check(true,  str4.constructor === stsLib.string.StringEx);

          c.check(true,  str5 instanceof stsLib.string.String);
          c.check(false, str5 instanceof stsLib.string.StringEx);
          c.check(true,  str5.constructor === stsLib.string.String);
          c.check(false, str5.constructor === stsLib.string.StringEx);

        };

      }());

    }()); //string

    //----------------------------------------
    //◆ドキュメント
    //----------------------------------------

    _.Document = stsLib.Document || function(value) {
      if (!(this instanceof stsLib.Document)) {
        return new stsLib.Document(value);
      }
      this._textArray = [];
      this.setText(value);
    };
    (function() {
      var _ = stsLib.Document;

      _.prototype.getLine = function(index) {
        c.assert(t.isInt(index));
        c.assert(n.inRange(index, 0, this._textArray.length - 1));
        return this._textArray[index];
      };

      _.prototype.setLine = function(index, line) {
        c.assert(t.isInt(index));
        c.assert(n.inRange(index, 0, this._textArray.length));
        if (n.inRange(index, 0, this._textArray.length - 1)) {
          this._textArray[index] = line;
        } else {
          this._textArray.push(line);
        }
        this.setText(this.getText());
        //改行コードなしのlineをセットした時にでも
        //配列がリフレッシュされる
      };

      _.prototype.getText = function() {
        return this._textArray.join('');
      };

      _.prototype.setText = function(value) {
        this._textArray = value.match(/[^\r\n]*(\r\n|\r|\n|$)/g);
      };

    }());
    (function() {
      var _ = stsLib.Document;

      _.prototype.test = function() {

        var originalText = '0123\r456\n789\r\n0123\r\r456\n\n789\r\n\r\n0123\n\r\n\r456';
        var doc = stsLib.Document(originalText);

        c.check('0123\r',   doc.getLine(0));
        c.check('456\n',    doc.getLine(1));
        c.check('789\r\n',  doc.getLine(2));
        c.check('0123\r',   doc.getLine(3));
        c.check('\r',       doc.getLine(4));
        c.check('456\n',    doc.getLine(5));
        c.check('\n',       doc.getLine(6));
        c.check('789\r\n',  doc.getLine(7));
        c.check('\r\n',     doc.getLine(8));
        c.check('0123\n',   doc.getLine(9));
        c.check('\r\n',     doc.getLine(10));
        c.check('\r',       doc.getLine(11));
        c.check('456',      doc.getLine(12));

        //getTextのテスト
        c.check(originalText, doc.getText());

        //setLineのテスト
        doc.setLine(0, 'ABC\r\n');
        doc.setLine(1, 'DEF\r');
        c.check('ABC\r\n',  doc.getLine(0));
        c.check('DEF\r',    doc.getLine(1));
        c.check('789\r\n',  doc.getLine(2));

        //setLine 最終行追加のテスト
        doc.setLine(0, '0123\r');
        doc.setLine(1, '456\n');
        doc.setLine(13, 'GHI\r\n');
        c.check(originalText + 'GHI\r\n', doc.getText());

        //setLine 改行コード無しのテスト
        doc.setLine(0, 'A');
        doc.setLine(0, 'B');
        c.check('B789\r\n',  doc.getLine(0));
        c.check('0123\r',   doc.getLine(1));
      };

    }());

    //----------------------------------------
    //◆日付時刻処理
    //----------------------------------------
    _.date = stsLib.date || {};
    (function() {
      var _ = stsLib.date;

      //----------------------------------------
      //・Dateコンストラクタ
      //----------------------------------------
      //  ・new stsLib.date.Date でも
      //    newなしの stsLib.date.Date でも同じくDate型を返す
      //  ・引数なしなら
      //    現地時間の1970 年 1 月 1 日 00:00:00 を返す
      //  ・それぞれの引数は省略できる
      //----------------------------------------
      _.Date = function(year, month, date,
        hours, minutes, seconds, milliseconds) {

        if (!(this instanceof _.Date)) {
          return new _.Date(year, month, date,
            hours, minutes, seconds, milliseconds);
        }

        var self = new Date(0);
        self.setMinutes(self.getTimezoneOffset());
        //現地時間の1970 年 1 月 1 日 00:00:00

        if (t.isUndefined(year)) { return self; }
        self.setFullYear(year);
        if (t.isUndefined(month)) { return self; }
        self.setMonth(month - 1);
        if (t.isUndefined(date)) { return self; }
        self.setDate(date);
        if (t.isUndefined(hours)) { return self; }
        self.setHours(hours);
        if (t.isUndefined(minutes)) { return self; }
        self.setMinutes(minutes);
        if (t.isUndefined(seconds)) { return self; }
        self.setSeconds(seconds);
        if (t.isUndefined(milliseconds)) { return self; }
        self.setMilliseconds(milliseconds);
        return self;
      };

      _.test_Date = function() {
        var dt;
        dt = _.Date(2017, 9, 30, 23, 51, 0, 0);
        c.check('2017/09/30 23:51:00',
          _.formatYYYYMMDD(dt, '/') + ' ' +
          _.formatHHMMSS(dt, ':') );

        dt = new _.Date(2017, 9, 30, 23, 51, 0, 0);
        c.check('2017/09/30 23:51:00',
          _.formatYYYYMMDD(dt, '/') + ' ' +
          _.formatHHMMSS(dt, ':') );

        dt = new _.Date(2017);
        c.check('2017/01/01 00:00:00',
          _.formatYYYYMMDD(dt, '/') + ' ' +
          _.formatHHMMSS(dt, ':') );

        dt = new _.Date(2017, 9);
        c.check('2017/09/01 00:00:00',
          _.formatYYYYMMDD(dt, '/') + ' ' +
          _.formatHHMMSS(dt, ':') );

        dt = new _.Date(2017, 9, 30);
        c.check('2017/09/30 00:00:00',
          _.formatYYYYMMDD(dt, '/') + ' ' +
          _.formatHHMMSS(dt, ':') );

        dt = new _.Date(2017, 9, 30, 5);
        c.check('2017/09/30 05:00:00',
          _.formatYYYYMMDD(dt, '/') + ' ' +
          _.formatHHMMSS(dt, ':') );

        dt = new _.Date(2017, 9, 30, 5, 20);
        c.check('2017/09/30 05:20:00',
          _.formatYYYYMMDD(dt, '/') + ' ' +
          _.formatHHMMSS(dt, ':') );

        dt = new _.Date(2017, 9, 30, 5, 20, 35);
        c.check('2017/09/30 05:20:35',
          _.formatYYYYMMDD(dt, '/') + ' ' +
          _.formatHHMMSS(dt, ':') );
      };

      //----------------------------------------
      //◇無効値 判定
      //----------------------------------------

      _.isInvalidDate = function(value) {
        return (t.isDate(value)
          && (isNaN(value.getTime())));
        // value.toString() === 'Invalid Date' は
        // WSH環境では動作しなかったので上記実装になる
      };

      _.test_isInvalidDate = function() {
        c.check(false,  _.isInvalidDate(new Date(2017,1,1)));
        c.check(true,   _.isInvalidDate(new Date('abc')));
      };

      //----------------------------------------
      //◇日付時刻フォーマット
      //----------------------------------------

      _.formatYYYYMMDD = function(date, delimiter){
        c.assert(t.isDate(date));
        delimiter = t.ifNullOrUndefinedValue(delimiter, '');
        c.assert(t.isString(delimiter));
        return date.getFullYear() +
          delimiter +
          s.fillStart((date.getMonth() + 1).toString(), 2, '0') +
          delimiter +
          s.fillStart(date.getDate().toString(), 2, '0');
        //下記のようにも記載できるが
        //コピペのために上記を採用する
        // return _.formatToString(date,
        //   'yyyy' + delimiter + 'MM' + delimiter + 'dd');
      };

      _.formatHHMMSS = function(date, delimiter){
        c.assert(t.isDate(date));
        delimiter = t.ifNullOrUndefinedValue(delimiter, '');
        c.assert(t.isString(delimiter));
        return s.fillStart(date.getHours().toString(), 2, '0') +
          delimiter +
          s.fillStart(date.getMinutes().toString(), 2, '0') +
          delimiter +
          s.fillStart(date.getSeconds().toString(), 2, '0');
        //下記のようにも記載できるが
        //コピペのために上記を採用する
        // return _.formatToString(date,
        //   'HH' + delimiter + 'mm' + delimiter + 'ss');
      };

      _.formatToString = function(date, format, rule) {
        c.assert(t.isDate(date));
        c.assert(t.isString(format));
        rule = t.ifNullOrUndefinedValue(rule, _.formatRuleDefault());
        c.assert(t.isObject(rule));
        var singleQuoteIndex = s.indexOfFirst(format, "'");
        var doubleQuoteIndex = s.indexOfFirst(format, '"');
        c.assert(!(
          (singleQuoteIndex !== -1) && (doubleQuoteIndex !== -1)
          //書式には[']と["]の混在は許可しない
        ), 'Error:stsLib.date.formatToString:Quote Exists ["]and[\'].');


        //置き換え配列を作成する。長いもの順にする。
        var keys = stsLib.object.property.names(rule);
        a.sortPattern(keys, 'length', 'descending');
        var replaceArray = [];
        for (var i = 0, l = keys.length; i < l; i += 1) {
          replaceArray.push([
            keys[i], rule[keys[i]](date)
          ]);
        }

        var quoteChar;
        if ((singleQuoteIndex === -1) && (doubleQuoteIndex === -1)) {

          //クウォート記号がないのならば
          //通常通り要素に変換をかける
          return s.replaceAllArray(format, replaceArray);
        } else if (singleQuoteIndex === -1) {
          quoteChar = '"';
        } else if (doubleQuoteIndex === -1) {
          quoteChar = "'";
        }
        c.assert(n.isEven(s.includeCount(format, quoteChar)),
          'Error:stsLib.date.formatToString:Quote Count is not Even.');
        //クウォートの個数は偶数であること

        var formatStrs = format.split(quoteChar);
        for (var i2 = 0, l2 = formatStrs.length; i2 < l2; i2 += 2) {
          formatStrs[i2] = s.replaceAllArray(formatStrs[i2], replaceArray);
        }
        return formatStrs.join('');
      };

      _.formatRuleDefault = function() {
        var formatRule = {};
        formatRule.yyyy = function(date) {
          //西暦4桁以下、4桁に先頭ゼロ埋め
          return s.fillStart(date.getFullYear().toString(), 4, '0');
        };
        formatRule.yyy = function(date) {
          //西暦数値
          return date.getFullYear().toString();
        };
        formatRule.yy = function(date) {
          //西暦下2桁固定、先頭ゼロ埋め
          return s.end(s.fillStart(date.getFullYear().toString(), 4, '0'), 2);
        };
        formatRule.y = function(date) {
          //西暦下2桁切取、1桁か2桁
          return t.convertToInt(
            s.end(s.fillStart(date.getFullYear().toString(), 4, '0'), 2)
          ).toString();
        };
        formatRule.MM = function(date) {
          return s.fillStart((date.getMonth() + 1).toString(), 2, '0');
        };
        formatRule.M = function(date) {
          return (date.getMonth() + 1).toString();
        };
        formatRule.dd = function(date) {
          return s.fillStart(date.getDate().toString(), 2, '0');
        };
        formatRule.d = function(date) {
          return date.getDate().toString();
        };
        formatRule.hh = function(date) {
          //00～12
          return s.fillStart((date.getHours() % 12).toString(), 2, '0');
        };
        formatRule.h = function(date) {
          //0～12
          return (date.getHours() % 12).toString();
        };
        formatRule.HH = function(date) {
          //00～23
          return s.fillStart(date.getHours().toString(), 2, '0');
        };
        formatRule.H = function(date) {
          //0～23
          return date.getHours().toString();
        };
        formatRule.mm = function(date) {
          return s.fillStart(date.getMinutes().toString(), 2, '0');
        };
        formatRule.m = function(date) {
          return date.getMinutes().toString();
        };
        formatRule.ss = function(date) {
          return s.fillStart(date.getSeconds().toString(), 2, '0');
        };
        formatRule.s = function(date) {
          return date.getSeconds().toString();
        };
        formatRule.fff = function(date) {
          //  1/1000秒
          return s.fillStart(date.getMilliseconds().toString(), 3, '0');
        };
        formatRule.ff = function(date) {
          //  1/100秒
          return s.start(
            s.fillStart(date.getMilliseconds().toString(), 3, '0'), 2);
        };
        formatRule.f = function(date) {
          //  1/10秒
          return s.start(
            s.fillStart(date.getMilliseconds().toString(), 3, '0'), 1);
        };
        formatRule.tt = function(date) {
          return date.getHours() < 12 ? 'AM' : 'PM';
        };
        formatRule.t = function(date) {
          return date.getHours() < 12 ? 'A' : 'P';
        };
        formatRule.ddd = function(date) {
          return d.dayOfWeekEn(date);
        };
        formatRule.dddd = function(date) {
          return d.dayOfWeekEnglish(date);
        };
        formatRule.MMM = function(date) {
          return d.nameOfMonthEn3Char(date);
        };
        formatRule.MMMM = function(date) {
          return d.nameOfMonthEn4Char(date);
        };
        formatRule.MMMMM = function(date) {
          return d.nameOfMonthEnglish(date);
        };
        return formatRule;
      };

      _.formatRuleDefaultJp = function() {
        var formatRule = _.formatRuleDefault();
        formatRule.DDD = function(date) {
          return d.dayOfWeekJp(date);
        };
        formatRule.DDDD = function(date) {
          return d.dayOfWeekJapanese(date);
        };
        formatRule.TTTT = function(date) {
          return date.getHours() < 12 ? '午前' : '午後';
        };

        var japaneseCalenderYear = function(date) {
          var result = {};
          var heiseiStart = _.Date(1989,  1,  8);
          var shouwaStart = _.Date(1926, 12, 25);
          var taishoStart = _.Date(1912,  7, 30);
          var meijiStart  = _.Date(1868,  9,  8);
          if (heiseiStart <= date) {
            result.gengo = '平成';
            result.year = (formatRule.yyyy(date) - heiseiStart.getFullYear() + 1);
          } else if (shouwaStart <= date) {
            result.gengo = '昭和';
            result.year = (formatRule.yyyy(date) - shouwaStart.getFullYear() + 1);
          } else if (taishoStart <= date) {
            result.gengo = '大正';
            result.year = (formatRule.yyyy(date) - taishoStart.getFullYear() + 1);
          } else if (meijiStart <= date) {
            result.gengo = '明治';
            result.year = (formatRule.yyyy(date) - meijiStart.getFullYear() + 1);
          } else {
            result.gengo = '';
            result.year = formatRule.yyyy(date);
          }
          return result;
        };

        formatRule.gggg = function(date) {
          //平成
          return japaneseCalenderYear(date).gengo;
        };
        formatRule.gg = function(date) {
          //平
          return s.start(japaneseCalenderYear(date).gengo, 1);
        };
        formatRule.Y = function(date) {
          //和暦年数値
          return japaneseCalenderYear(date).year.toString();
        };
        formatRule.YY = function(date) {
          //和暦年2桁固定
          return s.end(s.fillStart(formatRule.Y(date), 2, '0'), 2);
        };
        return formatRule;
      };

      _.test_formatToString = function() {
        var d1 = d.Date(2007,1,6,21,5,3,123);
        var s1;
        s1 = d.formatToString(d1, 'yyyy/MM/dd ddd HH:mm:ss.fff');
        c.check('2007/01/06 Sat 21:05:03.123', s1);
        s1 = d.formatToString(d1, 'yy/M/d dddd tt h:m:s.ff');
        c.check('07/1/6 Saturday PM 9:5:3.12', s1);
        s1 = d.formatToString(d1, 'y-MMMMM-d h:m:s.f');
        c.check('7-January-6 9:5:3.1', s1);

        s1 = d.formatToString(d1, 'y-MMM-d "yyyy" h:m:s.f');
        c.check('7-Jan-6 yyyy 9:5:3.1', s1);
        s1 = d.formatToString(d1, 'y-MMMM-d "yyyy" h:m:"s"s.f');
        c.check('7-Jan.-6 yyyy 9:5:s3.1', s1);

        var d2 = d.Date(101,1,1,13,1,1,1);
        s1 = d.formatToString(d2, 'yyyy-MM-dd HH:mm:ss.fff tt');
        c.check('0101-01-01 13:01:01.001 PM', s1);
        s1 = d.formatToString(d2, 'yyy-M-d H:m:s.ff t');
        c.check('101-1-1 13:1:1.00 P', s1);
        s1 = d.formatToString(d2, 'yy-M-d hh:m:s.f');
        c.check('01-1-1 01:1:1.0', s1);
        s1 = d.formatToString(d2, 'y-M-d h:m:s');
        c.check('1-1-1 1:1:1', s1);

        var rule = _.formatRuleDefaultJp();
        s1 = d.formatToString(d1, 'yyyy"-"MM-dd DDD TTTT', rule);
        c.check('2007-01-06 土 午後', s1);
        s1 = d.formatToString(d1, 'yy-M-d DDDD gg', rule);
        c.check('07-1-6 土曜日 平', s1);

        d2 = d.Date(1995,1,6,21,5,3,123);
        s1 = d.formatToString(d2, 'ggY ggggYY yyyy', rule);
        c.check('平7 平成07 1995', s1);

        var d3 = d.Date(1989,  1,  8);
        c.check('平成1年1月8日', d.formatToString(d3, 'ggggY年M月d日', rule));
        var d4 = d.Date(1989,  1,  7);
        c.check('昭和64年1月7日', d.formatToString(d4, 'ggggY年M月d日', rule));
        var d5 = d.Date(1926, 12, 25);
        c.check('昭01/12/25', d.formatToString(d5, 'ggYY/MM/dd', rule));
        var d6 = d.Date(1926, 12, 24);
        c.check('大15/12/24', d.formatToString(d6, 'ggYY/MM/dd', rule));
        var d7 = d.Date(1912,  7, 30);
        c.check('大正01/07/30', d.formatToString(d7, 'ggggYY/MM/dd', rule));
        var d8 = d.Date(1912,  7, 29);
        c.check('明治45/07/29', d.formatToString(d8, 'ggggYY/MM/dd', rule));
        var d10 = d.Date(1868, 9, 8);
        c.check('明治1/9/8', d.formatToString(d10, 'ggggY/M/d', rule));
        c.check('明治01/09/08', d.formatToString(d10, 'ggggYY/MM/dd', rule));
        var d11 = d.Date(1868, 9, 7);
        c.check('1868/9/7', d.formatToString(d11, 'ggggY/M/d', rule));
        c.check('68/09/07', d.formatToString(d11, 'ggggYY/MM/dd', rule));

      };


      //----------------------------------------
      //◇月の名前
      //----------------------------------------

      _.nameOfMonth = function(date, monthNames) {
        c.assert(t.isDate(date));
        c.assert(t.isArray(monthNames));
        c.assert(monthNames.length === 12);
        return monthNames[date.getMonth()];
      };

      _.nameOfMonthEn3Char = function(date) {
        return _.nameOfMonth(date, _.monthNamesEn3Char());
      };

      _.nameOfMonthEn4Char = function(date) {
        return _.nameOfMonth(date, _.monthNamesEn4Char());
      };

      _.nameOfMonthEnglish = function(date) {
        return _.nameOfMonth(date, _.monthNamesEnglish());
      };

      _.monthNamesEn3Char = function() {
        return [
          'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
          'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
        ];
      };

      _.monthNamesEn4Char = function() {
        return [
          'Jan.', 'Feb.', 'Mar.', 'Apr.', 'May' , 'June',
          'July', 'Aug.', 'Sep.', 'Oct.', 'Nov.', 'Dec.'
        ];
      };

      _.monthNamesEnglish = function() {
        return [
          'January', 'February', 'March', 'April', 'May' , 'June',
          'July', 'August', 'September', 'October', 'November', 'December'
        ];
      };

      //----------------------------------------
      //◇曜日
      //----------------------------------------

      //----------------------------------------
      //・配列を指定して曜日文字列を出力する
      //----------------------------------------
      //  ・配列指定ない場合は date.getDay() (日=0～土=6)を返す
      //----------------------------------------
      _.dayOfWeek = function(date, dayOfWeekNames) {
        c.assert(t.isDate(date));
        if (t.isNullOrUndefined(dayOfWeekNames)) {
          return date.getDay();
        }
        c.assert(t.isArray(dayOfWeekNames));
        c.assert(dayOfWeekNames.length === 7);
        return dayOfWeekNames[date.getDay()];
      };

      _.dayOfWeekEn = function(date) {
        return _.dayOfWeek(date, _.dayOfWeekNamesEn());
      };

      _.dayOfWeekEnglish = function(date) {
        return _.dayOfWeek(date, _.dayOfWeekNamesEnglish());
      };

      _.dayOfWeekJp = function(date) {
        return _.dayOfWeek(date, _.dayOfWeekNamesJp());
      };

      _.dayOfWeekJapanese = function(date) {
        return _.dayOfWeek(date, _.dayOfWeekNamesJapanese());
      };

      _.dayOfWeekNamesEn = function() {
        return [
          'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'
        ];
      };

      _.dayOfWeekNamesEnglish = function() {
        return [
          'Sunday', 'Monday', 'Tuesday', 'Wednesday',
          'Thursday', 'Friday', 'Saturday'
        ];
      };

      _.dayOfWeekNamesJp = function() {
        return [
          '日', '月', '火', '水', '木', '金', '土'
        ];
      };

      _.dayOfWeekNamesJapanese = function() {
        var result = _.dayOfWeekNamesJp();
        for (var i = 0, iMax = result.length; i < iMax; i += 1) {
          result[i] = result[i] + '曜日';
        }
        return result;
      };

      _.test_dayOfWeek = function() {
        c.check('日曜日', _.dayOfWeekJapanese(
          _.Date(2017, 10, 1)));
        c.check('Mon', _.dayOfWeekEn(
          _.Date(2017, 10, 2)));
      };

      //----------------------------------------
      //◇比較
      //----------------------------------------

      //----------------------------------------
      //・年
      //----------------------------------------
      _.equalYear = function(date1, date2) {
        c.assert(t.isDates(date1, date2));
        return (date1.getFullYear() === date2.getFullYear());
      };

      //----------------------------------------
      //・年月
      //----------------------------------------
      _.equalMonth = function(date1, date2) {
        if ((_.equalYear(date1, date2))
        && (date1.getMonth() === date2.getMonth())) {
          return true;
        } else {
          return false;
        }
      };

      //----------------------------------------
      //・年月日
      //----------------------------------------
      _.equalDate = function(date1, date2) {
        if ((_.equalMonth(date1, date2))
        && (date1.getDate() === date2.getDate())) {
          return true;
        } else {
          return false;
        }
      };

      //----------------------------------------
      //・年月日時間
      //----------------------------------------
      _.equalDateHours = function(date1, date2) {
        if ((_.equalDate(date1, date2))
        && (date1.getHours() === date2.getHours())) {
          return true;
        } else {
          return false;
        }
      };

      //----------------------------------------
      //・年月日時分
      //----------------------------------------
      _.equalDateMinutes = function(date1, date2) {
        if ((_.equalDateHours(date1, date2))
        && (date1.getMinutes() === date2.getMinutes())) {
          return true;
        } else {
          return false;
        }
      };

      //----------------------------------------
      //・年月日時分秒
      //----------------------------------------
      _.equalDateSeconds = function(date1, date2) {
        if ((_.equalDateMinutes(date1, date2))
        && (date1.getSeconds() === date2.getSeconds())) {
          return true;
        } else {
          return false;
        }
      };

      //----------------------------------------
      //・年月日時分秒ミリ秒
      //----------------------------------------
      _.equalDateMilliseconds = function(date1, date2) {
        return (date1.getTime() === date2.getTime());
      };

      _.test_equalDate = function() {
        var dt1 = new _.Date(2017, 9, 30, 5, 20, 35);
        var dt2 = new _.Date(2017, 9, 30, 5, 20, 35);
        c.check(true, _.equalDateSeconds(dt1, dt2));

        var dt3 = new _.Date(2017, 9, 30, 5, 20, 30);
        var dt4 = new _.Date(2017, 9, 30, 5, 20, 35);
        c.check(false,_.equalDateSeconds(dt3, dt4));
        c.check(true, _.equalDateMinutes(dt3, dt4));
      };

      //----------------------------------------
      //◇定数 ミリ秒
      //----------------------------------------
      _.SECOND_MILLISECONDS = 1000;
      _.MINUTE_MILLISECONDS =  60 * _.SECOND_MILLISECONDS;
      _.HOUR_MILLISECONDS   =  60 * _.MINUTE_MILLISECONDS;
      _.DAY_MILLISECONDS    =  24 * _.HOUR_MILLISECONDS;
      _.WEEK_MILLISECONDS   =   7 * _.DAY_MILLISECONDS;
      _.YEAR_MILLISECONDS   = 365 * _.DAY_MILLISECONDS;


      //----------------------------------------
      //◇時間の差
      //----------------------------------------
      //  ・戻り値は小数点値で取得できる
      //----------------------------------------

      _.millisecondsInterval = function(date1, date2) {
        c.assert(t.isDates(date1, date2));
        return date2.getTime() - date1.getTime();
      };

      _.secondsInterval = function(date1, date2) {
        return _.millisecondsInterval(date1, date2)
          / _.SECOND_MILLISECONDS;
      };

      _.minutesInterval = function(date1, date2) {
        return _.millisecondsInterval(date1, date2)
          / _.MINUTE_MILLISECONDS;
      };

      _.hoursInterval = function(date1, date2) {
        return _.millisecondsInterval(date1, date2)
          / _.HOUR_MILLISECONDS;
      };

      _.daysInterval = function(date1, date2) {
        return _.millisecondsInterval(date1, date2)
          / _.DAY_MILLISECONDS;
      };

      _.weeksInterval = function(date1, date2) {
        return _.millisecondsInterval(date1, date2)
          / _.WEEK_MILLISECONDS;
      };

      _.yearsInterval = function(date1, date2) {
        return _.millisecondsInterval(date1, date2)
          / _.YEAR_MILLISECONDS;
      };

      //----------------------------------------
      //◇年齢計算
      //----------------------------------------

      //年齢
      _.getAgeYearMonthDay = function(todayDate, birthDate) {

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
        }
        //年齢の日計算
        var diffDay = todayDate.getDate() - birthDate.getDate();
        if (diffDay < 0) {
          //前月の過去日と同一日からの経過日数を計算している
          diffDay =
            _.getMonthEndDay(todayDate.getYear(), todayDate.getMonth())
            - birthDate.getDate()
            + todayDate.getDate();
        }
        return {'year': diffYear,
          'month': diffMonth - (diffYear * 12),
          'day': diffDay};
      };

      //年齢
      _.getAgeMonthDay = function(todayDate, birthDate) {

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
        }
        //年齢の日計算
        var diffDay = todayDate.getDate() - birthDate.getDate();
        if (diffDay < 0) {
          //前月の過去日と同一日からの経過日数を計算している
          diffDay =
            _.getMonthEndDay(todayDate.getYear(), todayDate.getMonth())
            - birthDate.getDate()
            + todayDate.getDate();
        }
        return {'month': diffMonth,
          'day': diffDay};
      };

      _.getAgeDay = function(todayDate, birthDate) {

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
        return {'day': diffDay};
      };

      //----------------------------------------
      //◇月末日取得
      //----------------------------------------
      //  ・年月を指定して月末日を取得
      //  ・2017/12/0 = 2017年11月末日を指す
      //----------------------------------------
      _.getMonthEndDay = function(year, month) {
        var dt = new Date(year, month, 0);
        return dt.getDate();
      };

    }());

    //----------------------------------------
    //◆ファイルフォルダパス処理
    //----------------------------------------
    _.path = stsLib.path || {};
    (function() {
      var _ = stsLib.path;

      _.getFileName = function(fileName) {
        return fileName.substring(fileName.lastIndexOf('/')+1,fileName.length);
      };

      _.test_getFileName = function() {

        c.check('a.txt', _.getFileName('file://test/test/a.txt'));
      };

      //----------------------------------------
      //・ピリオドを含んだ拡張子を取得する
      //----------------------------------------
      _.getExtensionIncludePeriod = function(path) {

        var result = '';
        result = s.endLastDelim(path, '.');
        if (result == path) {
          result = '';
        } else {
          result = s.includeStart(result, '.');
        }
        return result;
      };

    }()); //path

    //----------------------------------------
    //◆オブジェクト
    //----------------------------------------
    _.object = stsLib.object || {};
    (function() {
      var _ = stsLib.object;

      //----------------------------------------
      //◆object.property
      //----------------------------------------
      _.property = stsLib.object.property || {};
      (function() {
        var _ = stsLib.object.property;

        //----------------------------------------
        //◇object.property列挙
        //----------------------------------------
        //  ・object.keys や object.getOwnProperyt は
        //    wsh jscript にはない
        //----------------------------------------

        //----------------------------------------
        //・プロパティの個数を返す
        //----------------------------------------
        _.count = function(obj) {
          c.assert(t.isObject(obj));
          var result = 0;
          for (var prop in obj) {
            if (obj.hasOwnProperty(prop)) {
              result += 1;
            }
          }
          return result;
        };

        _.test_count = function() {
          c.check(3, _.count({a:0, b:1, c:2}));
        };

        //----------------------------------------
        //・プロパティの名前を配列で返す
        //----------------------------------------
        _.names = function(obj) {
          c.assert(t.isObject(obj));
          var result = [];
          for (var prop in obj) {
            if (obj.hasOwnProperty(prop)) {
              result.push(prop);
            }
          }
          return result;
        };

        _.test_names = function() {
          c.check('a,b,c', _.names({a:0, b:1, c:2}).join());
        };

        //----------------------------------------
        //・プロパティの値を配列で返す
        //----------------------------------------
        _.values = function(obj) {
          c.assert(t.isObject(obj));
          var result = [];
          for (var prop in obj) {
            if (obj.hasOwnProperty(prop)) {
              result.push(obj[prop]);
            }
          }
          return result;
        };

        _.test_values = function() {
          c.check('0,1,2', _.values({a:0, b:1, c:2}).join());
        };

        //----------------------------------------
        //・プロパティ名の有無を返す
        //----------------------------------------
        //  ・in演算子でOKだった
        //----------------------------------------
        _.nameExists = function(obj, name) {
          c.assert(t.isString(name));
          var names = _.names(obj);
          return (a.isInclude(names, name));
        };

        _.test_nameExists = function() {
          c.check(true,   _.nameExists({a:0, b:1, c:2}, 'a'));
          c.check(false,  _.nameExists({a:0, b:1, c:2}, 'd'));

          c.check(true,   'a' in {a:0, b:1, c:2});
          c.check(false,  'd' in {a:0, b:1, c:2});
        };

        //----------------------------------------
        //・プロパティ値の有無を返す
        //----------------------------------------
        _.valueExists = function(obj, value) {
          var values = _.values(obj);
          return (a.isInclude(values, value));
        };

        _.test_valueExists = function() {
          c.check(true,   _.valueExists({a:0, b:1, c:2}, 0));
          c.check(false,  _.valueExists({a:0, b:1, c:2}, 3));
        };

        //----------------------------------------
        //・プロパティ名を値から求める
        //----------------------------------------
        _.getNameFromValue = function(obj, value) {
          var values = _.values(obj);
          var index = a.indexOfFirst(values, value);
          if (index === -1) {
            return '';
          } else {
            return _.names(obj)[index];
          }
        };

        _.test_getNameFromValue = function() {
          c.check('a',  _.getNameFromValue({a:0, b:1, c:2}, 0));
          c.check('',   _.getNameFromValue({a:0, b:1, c:2}, 3));
        };

      }());

    }()); //object

    //----------------------------------------
    //◆列挙型
    //----------------------------------------
    //  ・enumがWSHで予約語だったのでenumTypeにした
    //----------------------------------------
    _.enumType = stsLib.enumType || {};
    (function() {
      var _ = stsLib.enumType;

      //----------------------------------------
      //・値が連番のEnumオブジェクトを作成する
      //----------------------------------------
      //  ・enum1 = {a: 0, b: 1, c: 2};
      //    と宣言しても作れるが
      //    enum1 = EnumNumber(a, b, c); や EnumNumber([a, b, c]);
      //    と呼び出しても作成できる。
      //----------------------------------------
      _.EnumNumber = function(values) {
        if (!(this instanceof stsLib.enumType.EnumNumber)) {
          return new stsLib.enumType.EnumNumber(a.fromArgs(arguments));
        }
        values = a.expandMultiDimension(a.fromArgs(arguments));

        for (var i = 0, l = values.length; i < l; i += 1) {
          this[values[i]] = i;
        }
      };

      _.test_Enum = function() {
        var e1;
        e1 = _.EnumNumber('a');
        c.check(1,    stsLib.object.property.count(e1));
        c.check('a',  stsLib.object.property.getNameFromValue(e1, 0));
        c.check('',   stsLib.object.property.getNameFromValue(e1, 1));

        e1 = new _.EnumNumber('a');
        c.check(1,    stsLib.object.property.count(e1));
        c.check('a',  stsLib.object.property.getNameFromValue(e1, 0));
        c.check('',   stsLib.object.property.getNameFromValue(e1, 1));

        e1 = _.EnumNumber(['a']);
        c.check(1,    stsLib.object.property.count(e1));
        c.check('a',  stsLib.object.property.getNameFromValue(e1, 0));
        c.check('',   stsLib.object.property.getNameFromValue(e1, 1));

        e1 = new _.EnumNumber(['a']);
        c.check(1,    stsLib.object.property.count(e1));
        c.check('a',  stsLib.object.property.getNameFromValue(e1, 0));
        c.check('',   stsLib.object.property.getNameFromValue(e1, 1));

        e1 = _.EnumNumber(['a', 'b']);
        c.check(2,    stsLib.object.property.count(e1));
        c.check('a',  stsLib.object.property.getNameFromValue(e1, 0));
        c.check('b',  stsLib.object.property.getNameFromValue(e1, 1));

        e1 = new _.EnumNumber(['a', 'b']);
        c.check(2,    stsLib.object.property.count(e1));
        c.check('a',  stsLib.object.property.getNameFromValue(e1, 0));
        c.check('b',  stsLib.object.property.getNameFromValue(e1, 1));

        e1 = _.EnumNumber('a', 'b');
        c.check(2,    stsLib.object.property.count(e1));
        c.check('a',  stsLib.object.property.getNameFromValue(e1, 0));
        c.check('b',  stsLib.object.property.getNameFromValue(e1, 1));

        e1 = new _.EnumNumber('a', 'b');
        c.check(2,    stsLib.object.property.count(e1));
        c.check('a',  stsLib.object.property.getNameFromValue(e1, 0));
        c.check('b',  stsLib.object.property.getNameFromValue(e1, 1));

      };

      //----------------------------------------
      //・値が名前文字列のEnumオブジェクトを作成する
      //----------------------------------------
      //  ・enum1 = {a: 'a', b: 'b', c: 'c'};
      //    の代わりに
      //    enum1 = EnumNameValue('a', 'b', 'c'); や
      //    enum1 = EnumNameValue(['a', 'b', 'c']);
      //    と呼び出しても作成できる。
      //----------------------------------------
      _.EnumNameValue = function(values) {
        if (!(this instanceof stsLib.enumType.EnumNameValue)) {
          return new stsLib.enumType.EnumNameValue(a.fromArgs(arguments));
        }
        values = a.expandMultiDimension(a.fromArgs(arguments));

        for (var i = 0, l = values.length; i < l; i += 1) {
          this[values[i]] = values[i];
        }
      };

      _.test_EnumNameValue = function() {
        var e1;
        e1 = _.EnumNameValue('a');
        c.check(1,    stsLib.object.property.count(e1));
        c.check('a',  stsLib.object.property.getNameFromValue(e1, 'a'));
        c.check('',   stsLib.object.property.getNameFromValue(e1, 'b'));

        e1 = new _.EnumNameValue('a');
        c.check(1,    stsLib.object.property.count(e1));
        c.check('a',  stsLib.object.property.getNameFromValue(e1, 'a'));
        c.check('',   stsLib.object.property.getNameFromValue(e1, 'b'));

        e1 = _.EnumNameValue(['a']);
        c.check(1,    stsLib.object.property.count(e1));
        c.check('a',  stsLib.object.property.getNameFromValue(e1, 'a'));
        c.check('',   stsLib.object.property.getNameFromValue(e1, 'b'));

        e1 = new _.EnumNameValue(['a']);
        c.check(1,    stsLib.object.property.count(e1));
        c.check('a',  stsLib.object.property.getNameFromValue(e1, 'a'));
        c.check('',   stsLib.object.property.getNameFromValue(e1, 'b'));

        e1 = _.EnumNameValue(['a', 'b']);
        c.check(2,    stsLib.object.property.count(e1));
        c.check('a',  stsLib.object.property.getNameFromValue(e1, 'a'));
        c.check('b',  stsLib.object.property.getNameFromValue(e1, 'b'));

        e1 = new _.EnumNameValue(['a', 'b']);
        c.check(2,    stsLib.object.property.count(e1));
        c.check('a',  stsLib.object.property.getNameFromValue(e1, 'a'));
        c.check('b',  stsLib.object.property.getNameFromValue(e1, 'b'));

        e1 = _.EnumNameValue('a', 'b');
        c.check(2,    stsLib.object.property.count(e1));
        c.check('a',  stsLib.object.property.getNameFromValue(e1, 'a'));
        c.check('b',  stsLib.object.property.getNameFromValue(e1, 'b'));

        e1 = new _.EnumNameValue('a', 'b');
        c.check(2,    stsLib.object.property.count(e1));
        c.check('a',  stsLib.object.property.getNameFromValue(e1, 'a'));
        c.check('b',  stsLib.object.property.getNameFromValue(e1, 'b'));

      };

    }()); //enumType

    //----------------------------------------
    //◆Point
    //----------------------------------------

    _.point = stsLib.point || {};
    (function() {
      var _ = stsLib.point;

      //----------------------------------------
      //・Pointコンストラクタ
      //----------------------------------------
      _.Point = function(x, y) {
        if (!(this instanceof stsLib.point.Point)) {
          return new stsLib.point.Point(x, y);
        }
        c.assert(t.isNumbers(x,y));
        this.x = x;
        this.y = y;
      };
      (function() {

        //----------------------------------------
        //・コピー
        //----------------------------------------
        _.Point.prototype.clone = function() {
          return _.Point(this.x, this.y);
        };

        _.test_point_clone = function() {
          var p1 = _.Point(1,2);
          p1.x = 3;
          var p2 = p1.clone();
          p1.y = 3;
          c.check(3, p1.x);
          c.check(3, p1.y);
          c.check(3, p2.x);
          c.check(2, p2.y);
        };

        //----------------------------------------
        //・移動
        //----------------------------------------
        _.Point.prototype.move = function(moveX, moveY) {
          c.assert(t.isInts(moveX, moveY));
          this.x += moveX;
          this.y += moveY;
          return this;
        };

        _.test_point_move = function() {
          var p1 = _.Point(5,5);
          p1.move(2,3);
          c.check(7, p1.x);
          c.check(8, p1.y);
        };

        //----------------------------------------
        //◇範囲チェック
        //----------------------------------------
        //  ・parentRectも正規化される
        //----------------------------------------

        _.Point.prototype.inRect = function(parentRect) {
          c.assert(t.isRect(parentRect));

          parentRect.normalize();
          return (
            n.inRange(this.x, parentRect.left, parentRect.right)
            && n.inRange(this.y, parentRect.top, parentRect.bottom)
          );
        };

        _.test_point_inRect = function() {
          var r1 = r.Rect(p.Point(2,2), p.Point(4,6));
          var p1 = _.Point(5,5);
          c.check(false, p1.inRect(r1));
          p1.move(-2,-2);
          c.check(true, p1.inRect(r1));
        };

        //----------------------------------------
        //・距離
        //----------------------------------------
        //  ・他のポイントとの距離を求める
        //----------------------------------------
        _.Point.prototype.distance = function(point) {
          return Math.sqrt(
            Math.pow(point.x - this.x, 2) +
            Math.pow(point.y - this.y, 2) );
        };

      }()); //point.prototype
    }()); //point

    //----------------------------------------
    //◆Vector
    //----------------------------------------

    _.vector = stsLib.vector || {};
    (function() {
      var _ = stsLib.vector;

      //----------------------------------------
      //・Vectorコンストラクタ
      //----------------------------------------
      //  ・1つの引数の場合は始点(0,0)からのベクトル
      //  ・2つの引数の場合は始点,終点の順番に指定する
      //----------------------------------------
      _.Vector = function(point) {
        if (!(this instanceof stsLib.vector.Vector)) {
          return new stsLib.vector.Vector(arguments[0], arguments[1]);
        }
        c.assert(t.isPoint(arguments[0]));
        if (t.isNullOrUndefined(arguments[1])) {
          this.from = p.Point(0, 0);
          this.to = p.Point(point.x, point.y);
        } else {
          c.assert(t.isPoint(arguments[1]));
          this.from = p.Point(point.x, point.y);
          this.to = p.Point(arguments[1].x, arguments[1].y);
        }
      };
      (function() {

        //----------------------------------------
        //・コピー
        //----------------------------------------
        _.Vector.prototype.clone = function() {
          return _.Vector(this.from, this.to);
        };

        _.test_vector_clone = function() {
          var v1 = _.Vector(p.Point(1,1), p.Point(4,5));
          var v2 = v1.clone();
          c.check(true, t.isVector(v2));
          v1.setFrom(p.Point(0,0));
          c.check(3, v1.to.x);
          c.check(4, v1.to.y);
          c.check(4, v2.to.x);
          c.check(5, v2.to.y);
        };

        //----------------------------------------
        //・方向ベクトル
        //----------------------------------------
        _.Vector.prototype.dx = function() {
          return this.to.x - this.from.x;
        };

        _.Vector.prototype.dy = function() {
          return this.to.y - this.from.y;
        };

        //----------------------------------------
        //・Vector 長さ
        //----------------------------------------
        _.Vector.prototype.length = function() {
          return this.from.distance(this.to);
        };

        stsLib.vector.test_vector_length = function() {
          var v1 = v.Vector(p.Point(0,0), p.Point(1,1));
          c.check(Math.pow(2, 0.5), v1.length());
          var v2 = v.Vector(p.Point(0,0), p.Point(3,4));
          c.check(5, v2.length());

          v1 = v.Vector(p.Point(1,1));
          c.check(Math.pow(2, 0.5), v1.length());
          v2 = v.Vector(p.Point(3,4));
          c.check(5, v2.length());
        };

        //----------------------------------------
        //・開始位置移動
        //----------------------------------------
        //  ・vectorの原点が移動して、終点も移動する
        //    vectorの方向は変わらない
        //----------------------------------------
        _.Vector.prototype.setFrom = function(point) {
          c.assert(t.isPoint(point));
          var dx = this.dx();
          var dy = this.dy();
          this.from.x = point.x;
          this.from.y = point.y;
          this.to.x = this.from.x + dx;
          this.to.y = this.from.y + dy;
          return this;
        };

        _.test_vector_setFrom = function() {
          var v1 = v.Vector(p.Point(1,1), p.Point(3,4));
          v1.setFrom(p.Point(0,0));
          c.check(0, v1.from.x);
          c.check(0, v1.from.y);
          c.check(2, v1.to.x);
          c.check(3, v1.to.y);
        };

        //----------------------------------------
        //・Vector加算
        //----------------------------------------
        //  ・vectorの終点が加算された結果になる
        //----------------------------------------
        _.Vector.prototype.add = function(vector) {
          c.assert(t.isVector(vector));
          var dx = vector.to.x - vector.from.x;
          var dy = vector.to.y - vector.from.y;
          this.to.x = this.to.x + dx;
          this.to.y = this.to.y + dy;
          return this;
        };

        _.test_vector_add = function() {
          var v1 = v.Vector(p.Point(1,1), p.Point(3,4));
          var v2 = v.Vector(p.Point(2,2), p.Point(5,6));
          v1.add(v2);
          c.check(1, v1.from.x);
          c.check(1, v1.from.y);
          c.check(6, v1.to.x);
          c.check(8, v1.to.y);

          c.check(2, v2.from.x);
          c.check(2, v2.from.y);
          c.check(5, v2.to.x);
          c.check(6, v2.to.y); //v2には影響なし
        };

        //----------------------------------------
        //・Vector 正規化 (長さを設定する)
        //----------------------------------------
        _.Vector.prototype.normalize = function(len) {
          len = t.ifNullOrUndefinedValue(len, 1);
          var originalLength = this.length();
          if (originalLength === 0) {
            return this;
          }
          this.to.x = this.from.x + (this.dx() * len / originalLength);
          this.to.y = this.from.y + (this.dy() * len / originalLength);
          return this;
        };

        _.test_vector_normalize = function() {
          var v1 = v.Vector(p.Point(0,0), p.Point(3,4));
          v1.normalize(10);
          c.check(0, v1.from.x);
          c.check(0, v1.from.y);
          c.check(6, v1.to.x);
          c.check(8, v1.to.y);
        };


        //----------------------------------------
        //・逆ベクトル
        //----------------------------------------
        _.Vector.prototype.inverse = function() {
          var xBuff = this.from.x;
          var yBuff = this.from.y;
          this.from.x = this.to.x;
          this.from.y = this.to.y;
          this.to.x = xBuff;
          this.to.y = yBuff;
          return this;
        };

        _.test_vector_inverse = function() {
          var v1 = v.Vector(p.Point(0,0), p.Point(3,4));
          v1.inverse();
          c.check(3, v1.from.x);
          c.check(4, v1.from.y);
          c.check(0, v1.to.x);
          c.check(0, v1.to.y);
        };

        //----------------------------------------
        //・法線ベクトル
        //----------------------------------------
        //  ・右に90度傾いた方向のベクトルになる
        //----------------------------------------
        _.Vector.prototype.normalRight = function() {
          var dx = this.dx();
          var dy = this.dy();
          this.to.x = this.from.x + dy;
          this.to.y = this.from.y - dx;
          return this;
        };

        _.test_vector_normalRight = function() {
          var v1 = v.Vector(p.Point(0,0), p.Point(3,4));
          v1.normalRight();
          c.check(0, v1.from.x);
          c.check(0, v1.from.y);
          c.check(4, v1.to.x);
          c.check(-3, v1.to.y);
        };

        //----------------------------------------
        //・法線ベクトル
        //----------------------------------------
        //  ・左に90度傾いた方向のベクトルになる
        //----------------------------------------
        _.Vector.prototype.normalLeft = function() {
          var dx = this.dx();
          var dy = this.dy();
          this.to.x = this.from.x - dy;
          this.to.y = this.from.y + dx;
          return this;
        };

        _.test_vector_normalLeft = function() {
          var v1 = v.Vector(p.Point(0,0), p.Point(3,4));
          v1.normalLeft();
          c.check(0, v1.from.x);
          c.check(0, v1.from.y);
          c.check(-4, v1.to.x);
          c.check( 3, v1.to.y);
        };

        //----------------------------------------
        //・回転
        //----------------------------------------
        //  ・fromを中心にして回転する
        //  ・時計周りの場合はプラス
        //    反時計周りはマイナスを指定する
        //----------------------------------------
        _.Vector.prototype.rotate = function(degree) {
          var angle = stsLib.angle;
          var dx = this.dx();
          var dy = this.dy();
          this.to.x = this.from.x +
            angle.cos(degree) * dx + angle.sin(degree) * dy;
          this.to.y = this.from.y +
            - angle.sin(degree) * dx + angle.cos(degree) * dy;
          return this;
        };

        //----------------------------------------
        //・角度
        //----------------------------------------
        //  ・他のベクトルとの角度を求める
        //----------------------------------------
        _.Vector.prototype.angle = function(vector) {
          var angle = stsLib.angle;

          var selfDxDy = _.Vector(
            p.Point(this.dx(), this.dy())
          ).normalize();
          var vectorDxDy = _.Vector(
            p.Point(vector.dx(), vector.dy())
          ).normalize();
          //方向ベクトルにして長さ1で正規化する

          return angle.acos(
            selfDxDy.to.x * vectorDxDy.to.x +
            selfDxDy.to.y * vectorDxDy.to.y);
        };

        //----------------------------------------
        //・平行移動
        //----------------------------------------
        //  ・正の値なら法線ベクトル方向(右90度)に
        //    負の値なら逆法線ベクトル方向に移動
        //----------------------------------------
        _.Vector.prototype.moveParallel = function(value) {
          if (t.isNullOrUndefined(value) || (value === 0)) {
            return this;
          }
          var endBuff = stsLib.point.Point(this.to.x, this.to.y);
          this.normalRight().normalize(value);
          var newStart = stsLib.point.Point(this.to.x, this.to.y);
          this.setFrom(endBuff);
          var newEnd = stsLib.point.Point(this.to.x, this.to.y);
          this.from = newStart;
          this.to = newEnd;
          return this;
        };

        _.test_vector_moveParallels = function() {
          var v1 = v.Vector(p.Point(1,1), p.Point(4,5));
          v1.moveParallel(5);
          c.check(5,  v1.from.x);
          c.check(-2, v1.from.y);
          c.check(8,  v1.to.x);
          c.check(2,  v1.to.y);
        };

        //----------------------------------------
        //・媒介変数取得
        //----------------------------------------
        //  ・ベクトル交点を求めるための媒介変数を取得する
        //  ・x = (v1ToX - v1FromX) * T + v1FromX
        //    y = (v1ToY - v1FromY) * T + v1FromY
        //    この媒介変数[T]についての直線の方程式を
        //    別のベクトルとの組み合わせから求める
        //----------------------------------------
        _.Vector.prototype.parameterForVector = function(vector) {
          return (
            (vector.from.y - this.from.y) * (vector.from.x - vector.to.x)
            - (vector.from.x - this.from.x) * (vector.from.y - vector.to.y)
          ) / (
            (this.from.x - this.to.x) * (vector.from.y - vector.to.y)
            - (this.from.y - this.to.y) * (vector.from.x - vector.to.x)
          );
        };

        //----------------------------------------
        //・媒介変数取得
        //----------------------------------------
        //  ・任意の点との最寄り点を求めるための
        //    媒介変数を取得する
        //  ・点を通る元ベクトルの法線ベクトルとの交点になる
        //----------------------------------------
        _.Vector.prototype.parameterForPoint = function(point) {
          var normalVector = stsLib.vector.Vector(
            p.Point(this.from.x + this.dy(), this.from.y - this.dx()));
          normalVector.setFrom(point);
          return this.parameterForVector(normalVector);
        };

        //----------------------------------------
        //・媒介変数から点を求める
        //----------------------------------------
        _.Vector.prototype.pointFromParameter = function(parameter) {
          return p.Point(
            parameter * (this.dx()) + this.from.x,
            parameter * (this.dy()) + this.from.y
          );
        };

        //----------------------------------------
        //・他のベクトルとの交点を求める
        //----------------------------------------
        //  ・tが0～1なら交点はthisの線分に含まれている
        //----------------------------------------
        _.Vector.prototype.intersectionPoint = function(vector) {
          var t = this.parameterForVector(vector);
          return this.pointFromParameter(t);
        };

        //----------------------------------------
        //・直線と点との距離
        //----------------------------------------
        //  ・直線から点に対する垂線の距離
        //----------------------------------------
        _.Vector.prototype.lineDistance = function(point) {
          var t = this.parameterForPoint(point);
          return this.pointFromParameter(t).distance(point);
        };

        //----------------------------------------
        //・線分と点との距離
        //----------------------------------------
        //  ・線分の範囲にあればlineDistanceと同じで
        //    範囲外ならば始点か終点との距離
        //----------------------------------------
        _.Vector.prototype.segmentDistance = function(point) {
          var t = this.parameterForPoint(point);
          if (t <= 0) {
            return this.from.distance(point);
          } else if (1 <= t) {
            return this.to.distance(point);
          } else {
            return this.pointFromParameter(t).distance(point);
          }
        };

        //----------------------------------------
        //・矢印ベクトル
        //----------------------------------------
        //  ・ベクトルto から、斜辺、垂直法線、先頭線に向かう
        //    方向のベクトルを返す
        //----------------------------------------
        _.Vector.prototype.arrowHeadVectors = function(
          arrowHeadHeight, arrowWidthRatio) {
          var arrowHead = this.clone();
          arrowHead.inverse().normalize(arrowHeadHeight).inverse();
          var arrowNormalRight = arrowHead.clone();
          arrowNormalRight.normalRight();
          arrowNormalRight.normalize(arrowHeadHeight * arrowWidthRatio);
          var arrowEdgeRight = _.Vector(arrowHead.to, arrowNormalRight.to);
          var arrowNormalLeft = arrowHead.clone();
          arrowNormalLeft.normalLeft();
          arrowNormalLeft.normalize(arrowHeadHeight * arrowWidthRatio);
          var arrowEdgeLeft = _.Vector(arrowHead.to, arrowNormalLeft.to);
          return {
            arrowHead: arrowHead,               //矢印高さベクトル
            arrowEdgeRight: arrowEdgeRight,     //矢印右斜辺
            arrowNormalRight: arrowNormalRight, //矢印右法線
            arrowEdgeLeft: arrowEdgeLeft,       //矢印右斜辺
            arrowNormalLeft: arrowNormalLeft    //矢印右法線
          };
        };

      }()); //vector.prototype
    }()); //vector

    //----------------------------------------
    //◆Rect
    //----------------------------------------

    _.rect = stsLib.rect || {};
    (function() {
      var _ = stsLib.rect;

      //----------------------------------------
      //・Rectコンストラクタ
      //----------------------------------------
      _.Rect = function(point1, point2) {
        if (!(this instanceof stsLib.rect.Rect)) {
          return new stsLib.rect.Rect(point1, point2);
        }
        c.assert(t.isPoints(point1, point2));
        this.top    = Math.min(point1.y, point2.y);
        this.left   = Math.min(point1.x, point2.x);
        this.bottom = Math.max(point1.y, point2.y);
        this.right  = Math.max(point1.x, point2.x);
      };

      _.test_Rect = function() {
        var r1 = r.Rect(p.Point(2,2), p.Point(4,6));
        c.check(2,  r1.top);
        c.check(2,  r1.left);
        c.check(6,  r1.bottom);
        c.check(4,  r1.right);
      };

      (function() {

        //----------------------------------------
        //・コピー
        //----------------------------------------
        _.Rect.prototype.clone = function() {
          return _.Rect(
            p.Point(this.left, this.top),
            p.Point(this.right, this.bottom)
          );
        };

        _.test_rect_clone = function() {
          var r1 = _.Rect(p.Point(1,1), p.Point(4,5));
          var r2 = r1.clone();
          c.check(true, t.isRect(r2));
          r2.top = 0;
          r2.left = 0;
          c.check(1, r1.top);
          c.check(1, r1.left);
          c.check(0, r2.top);
          c.check(0, r2.left);
          c.check(5, r2.bottom);
          c.check(4, r2.right);
        };

        //----------------------------------------
        //・正規化
        //----------------------------------------
        //  ・left < right と top < bottom を正しくする
        //----------------------------------------
        _.Rect.prototype.normalize = function() {
          var val;
          if (this.bottom < this.top) {
            val = this.top;
            this.top = this.bottom;
            this.bottom = val;
          }
          if (this.right < this.left) {
            val = this.left;
            this.left = this.right;
            this.right = val;
          }
          return this;
        };

        //----------------------------------------
        //◇幅/高さ
        //----------------------------------------
        _.Rect.prototype.width = function() {
          return Math.abs(this.right - this.left);
        };

        _.Rect.prototype.setWidth = function(value) {
          c.assert(t.isNumber(value));
          this.normalize();
          if (0 <= value) {
            this.right = this.left + value;
          } else {
            this.right = this.left;
            this.left = this.right + value;
          }
          c.assert(this.left <= this.right);
          return this;
        };

        _.Rect.prototype.height = function() {
          return Math.abs(this.bottom - this.top);
        };

        _.Rect.prototype.setHeight = function(value) {
          c.assert(t.isNumber(value));
          this.normalize();
          if (0 <= value) {
            this.bottom = this.top + value;
          } else {
            this.bottom = this.top;
            this.top = this.bottom + value;
          }
          c.assert(this.top <= this.bottom);
          return this;
        };

        _.test_rect_width_height = function() {
          var r1 = r.Rect(p.Point(2,2), p.Point(4,6));
          c.check(2,  r1.width());
          c.check(4,  r1.height());

          r1.setWidth(10);
          r1.setHeight(10);
          c.check(10,  r1.width());
          c.check(10,  r1.height());

          r1.setWidth(-5);
          r1.setHeight(-5);
          c.check(5,  r1.width());
          c.check(5,  r1.height());

          c.check(-3, r1.top);
          c.check(-3, r1.left);
          c.check(2, r1.bottom);
          c.check(2, r1.right);
        };

        //----------------------------------------
        //◇中心
        //----------------------------------------
        _.Rect.prototype.center = function() {
          return p.Point(
            (this.left + this.right) / 2,
            (this.top + this.bottom) / 2);
        };

        _.test_rect_center = function() {
          var r1 = r.Rect(p.Point(2,2), p.Point(4,6));
          var p1 = r1.center();
          c.check(3,  p1.x);
          c.check(4, p1.y);
        };

        //----------------------------------------
        //◇移動
        //----------------------------------------

        //----------------------------------------
        //・setTopLeft
        //----------------------------------------
        _.Rect.prototype.move = function(moveX, moveY) {
          c.assert(t.isNumbers(moveX, moveY));
          this.top    += moveY;
          this.left   += moveX;
          this.bottom += moveY;
          this.right  += moveX;
          return this.normalize();
        };

        _.test_rect_move = function() {
          var r1 = r.Rect(p.Point(2,2), p.Point(4,6));
          r1.move(10, 10);
          c.check(12, r1.top);
          c.check(12, r1.left);
          c.check(16, r1.bottom);
          c.check(14, r1.right);
        };

        //----------------------------------------
        //・setTopLeft
        //----------------------------------------
        //  ・引数2つの場合はtop/left指定
        //    引数1つの場合は、topleft の Point 指定
        //----------------------------------------
        _.Rect.prototype.setTopLeft = function(topValue, leftValue) {
          if (arguments.length === 1) {
            c.assert(t.isPoint(topValue));
            leftValue = topValue.x;
            topValue = topValue.y;
          } else {
            c.assert(t.isNumbers(topValue, leftValue));
          }

          return this.normalize().move(
            leftValue - this.left,
            topValue - this.top
          );
        };

        _.test_rect_setTopLeft = function() {
          var r1 = r.Rect(p.Point(2,2), p.Point(4,6));
          r1.setTopLeft(10, 10);
          c.check(10, r1.top);
          c.check(10, r1.left);
          c.check(14, r1.bottom);
          c.check(12, r1.right);

          r1 = r.Rect(p.Point(2,2), p.Point(4,6));
          r1.setTopLeft(p.Point(0,0));
          c.check(0, r1.top);
          c.check(0, r1.left);
          c.check(4, r1.bottom);
          c.check(2, r1.right);
        };

        //----------------------------------------
        //◇範囲チェック
        //----------------------------------------
        //  ・parentRectも正規化される
        //----------------------------------------
        _.Rect.prototype.inRect = function(parentRect) {
          c.assert(t.isRect(parentRect));

          parentRect.normalize();
          return (
            n.inRange(this.left, parentRect.left, parentRect.right)
            && n.inRange(this.right, parentRect.left, parentRect.right)
            && n.inRange(this.top, parentRect.top, parentRect.bottom)
            && n.inRange(this.bottom, parentRect.top, parentRect.bottom)
          );
        };

      }()); //vector.prototype
    }()); //rect

    //----------------------------------------
    //◆システム
    //----------------------------------------
    _.system = stsLib.system || {};
    (function() {
      var _ = stsLib.system;

      _.test_consoleLogComment = function() {
        var testFunc = function(value) {
          return value + value;
        };

        var formula = 'testFunc(1)';
        var result = eval(formula);
        c.check('console.log(testFunc(1));  //2',
          _.consoleLogComment(formula, result));
      };

      _.consoleLogComment = function(formula, comment) {
        return 'console.log(' + formula + ');  //' + comment;
      };

      _.consoleLogCommentOutput = function(formula, comment) {
        console.log(_.consoleLogComment(formula, comment));
      };

    }());

    //----------------------------------------
    //◆グローバル拡張
    //----------------------------------------

    //----------------------------------------
    //◇Array
    //----------------------------------------

    //----------------------------------------
    //・Array.isArray
    //----------------------------------------
    //  ・Array.isArray が存在しない環境(WSHなど)
    //    のために実装
    //  ・参考:書籍:JavaScriptパターン P51
    //----------------------------------------
    Array.isArray = Array.isArray || function(arg) {
      return t.isArray(arg);
    };

    //----------------------------------------
    //・Array.every
    //----------------------------------------
    //  ・配列がすべてfuncで指定した条件を満たしているか
    //    を調べるメソッド
    //  ・thisObjを指定すると、funcで呼び出される時にthisを指定できる
    //----------------------------------------
    Array.prototype.every = Array.prototype.every || function(func, thisObj) {
      for (var i = 0, max = this.length; i < max; i += 1) {
        if (!func.call(thisObj, this[i], i, this)) {
          return false;
        }
      }
      return true;
    };

    //----------------------------------------
    //・Array.some
    //----------------------------------------
    //  ・配列のどれかがfuncで指定した条件を満たしているか
    //    を調べるメソッド
    //  ・thisObjを指定すると、funcで呼び出される時にthisを指定できる
    //----------------------------------------
    Array.prototype.some = Array.prototype.some || function(func, thisObj) {
      for (var i = 0, max = this.length; i < max; i += 1) {
        if (func.call(thisObj, this[i], i, this)) {
          return true;
        }
      }
      return false;
    };

    //----------------------------------------
    //・Array.forEach
    //----------------------------------------
    //  ・すべての要素に対してfuncを実行する
    //  ・thisObjを指定すると、funcで呼び出される時にthisを指定できる
    //----------------------------------------
    Array.prototype.forEach = Array.prototype.forEach || function(func, thisObj) {
      for (var i = 0, max = this.length; i < max; i += 1) {
        func.call(thisObj, this[i], i, this);
      }
    };

    //----------------------------------------
    //◆動作確認
    //----------------------------------------
    _.test = stsLib.test || {};
    (function() {
      var _ = stsLib.test;

      _.test_stslib_core = function() {

        x.test_forLoop();

        c.test_check();
        c.test_checkException();
        c.test_checkResult();

        c.test_orValue();

        t.test_isUndefined();
        t.test_isNull();
        t.test_isNullOrUndefined();
        t.test_ifNullOrUndefinedValue();
        t.test_isBoolean();
        t.test_isNumber();
        t.test_isInt();
        // t.test_isIntArray();
        t.test_isString();
        t.test_isFunction();
        t.test_isObject();
        // t.test_isArray()

        t.test_convertToNumber();
        t.test_convertToInt();
        t.test_convertToString();
        t.test_convertToDate();

        t.test_dateToString();
        t.test_stringToDate();
        t.test_dateToMilliseconds();
        t.test_millisecondsToDate();

        n.test_round();
        n.test_nearEqual();
        n.test_formatDigitComma();

        s.test_deleteIndex();
        s.test_deleteLength();
        s.test_isInclude();
        s.test_isIncludeAny();
        s.test_isIncludeAll();
        s.test_isIncludeFunc();
        s.test_includeCount();
        s.test_indexOfFirst();
        s.test_indexOfLast();
        s.test_indexOfAnyFirst();
        s.test_indexOfAnyLast();
        s.test_indexOfFuncFirst();
        s.test_indexOfFuncLast();
        s.test_substrIndex();
        s.test_substrLength();
        s.test_start();
        s.test_isStart();
        s.test_includeStart();
        s.test_excludeStart();
        s.test_deleteStart();
        s.test_fillStart();
        s.test_end();
        s.test_isEnd();
        s.test_includeEnd();
        s.test_excludeEnd();
        s.test_deleteEnd();
        s.test_fillEnd();

        s.test_startFirstDelim();
        s.test_startLastDelim();
        s.test_endFirstDelim();
        s.test_endLastDelim();

        var str = new stsLib.string.String('abc');
        str.test();
        var strEx = new stsLib.string.StringEx('123');
        strEx.test();

        stsLib.test.test_equalOperator();

        s.test_trimStart();
        s.test_trimEnd();

        s.test_deleteFirstLast();
        s.test_deleteFirstTagInner();
        s.test_deleteFirstTagOuter();
        s.test_deleteLastTagInner();
        s.test_deleteLastTagOuter();
        s.test_deleteAllTag();

        s.test_tagInnerFirst();
        s.test_tagOuterFirst();
        s.test_tagInnerLast();
        s.test_tagOuterLast();
        s.test_tagOuterAll();

        s.test_repeat();
        s.test_replaceAll();
        s.test_replaceAllArray();
        s.test_reverse();

        s.test_formatInsertFirst();
        s.test_formatInsertLast();

        a.test_equal();
        a.test_average();
        a.test_median();
        a.test_mode();
        a.test_diffMinMax();
        a.test_insert();
        a.test_insertAdd();
        a.test_add();
        a.test_deleteIndex();
        a.test_deleteLength();
        a.test_deleteFind();
        a.test_deleteFindAll();
        a.test_deleteStart();
        a.test_deleteEnd();
        a.test_isIncludeAny();
        a.test_isIncludeFunc();
        a.test_setInclude();
        a.test_indexOfFirst();
        a.test_indexOfLast();
        a.test_indexOfArrayFirst();
        a.test_indexOfArrayLast();
        a.test_outputStartArray();
        a.test_outputEndArray();
        a.test_remainStart();
        a.test_remainEnd();
        a.test_expand2Dimension();
        a.test_expandMultiDimension();

        var angle = stsLib.angle;
        angle.test_relative();
        angle.test_degToRad();

        var path = stsLib.path;
        path.test_getFileName();

        var doc = stsLib.Document('');
        doc.test();

        var o = stsLib.object;
        o.property.test_count();
        o.property.test_names();
        o.property.test_values();
        o.property.test_nameExists();
        o.property.test_valueExists();
        o.property.test_getNameFromValue();

        var e = stsLib.enumType;
        e.test_Enum();
        e.test_EnumNameValue();

        t.test_isDate();
        d.test_isInvalidDate();
        d.test_Date();
        d.test_equalDate();
        d.test_dayOfWeek();
        d.test_formatToString();

        t.test_isPoint();
        t.test_isVector();
        t.test_isRect();

        p.test_point_clone();
        p.test_point_move();
        p.test_point_inRect();

        v.test_vector_clone();
        v.test_vector_length();
        v.test_vector_setFrom();
        v.test_vector_add();
        v.test_vector_normalize();
        v.test_vector_inverse();
        v.test_vector_normalRight();
        v.test_vector_normalLeft();
        v.test_vector_moveParallels();

        r.test_Rect();
        r.test_rect_clone();
        r.test_rect_width_height();
        r.test_rect_center();
        r.test_rect_move();
        r.test_rect_setTopLeft();

        stsLib.system.test_consoleLogComment();

        c.check(true,   Array.isArray([]));
        c.check(false,  Array.isArray(123));
        c.check(false,  Array.isArray('abc'));
        c.check(false,  Array.isArray({}));

        //Array.prototype.everyの動作確認
        c.check(true, [1,1,1].every(
          function(element, index, array) {
            return (element === 1);
          }));
        c.check(false, [1,1,2].every(
          function(element, index, array) {
            return (element === 1);
          }));
        var testObj;
        testObj = {value: 1};
        c.check(true, [1,1,1].every(
          function(element, index, array) {
            return (element + this.value === 2);
          }, testObj)); //everyのthis指定
        c.check(false, [1,1,2].every(
          function(element, index, array) {
            return (element + this.value === 2);
          }, testObj)); //everyのthis指定

        //Array.prototype.someの動作確認
        c.check(true, [1,2,3].some(
          function(element, index, array) {
            return (element === 1);
          }));
        c.check(false, [2,2,3].some(
          function(element, index, array) {
            return (element === 1);
          }));
        testObj = {value: 1};
        c.check(true, [1,2,3].some(
          function(element, index, array) {
            return (element + this.value === 2);
          }, testObj)); //someのthis指定
        c.check(false, [2,2,3].some(
          function(element, index, array) {
            return (element + this.value === 2);
          }, testObj)); //someのthis指定

        //Array.prototype.forEach
        var result = '';
        [1, 2, 3].forEach(function(element, index, array) {
          result += element;
        });
        c.check('123', result);
        testObj = {value: 'A'};
        result = '';
        [1, 2, 3].forEach(function(element, index, array) {
          result += element.toString() + this.value;
        }, testObj);
        c.check('1A2A3A', result);

        stsLib.alert('finish stslib_core_test テスト終了');
        //日本語メッセージが表示されることで
        //エンコード確認も兼ねる

      };  //test_stslib_core

      //----------------------------------------
      //・イコール演算子の挙動調査
      //----------------------------------------
      _.test_equalOperator = function() {

        var value;
        value = true;
        c.check(true , value==true        ,'v01-01');
        //↓boolean型とstring型は比較一致不可能
        c.check(false, value=='true'      ,'v01-02');
        //↓『+''』を付属して文字列化すれば一致確認OK
        c.check(true , value+''=='true'   ,'v01-03');
        //↓文字列に『!!』を付属するとtrueが返される
        c.check(true , value==!!'true'    ,'v01-04');
        c.check(true , !!value==!!'true'  ,'v01-05');
        //↓boolean型側に『!!』を付属させてもNG
        c.check(false, !!value=='true'    ,'v01-06');
        c.check(true , !!value==true      ,'v01-06-02');

        c.check(false, value==false       ,'v01-07');
        c.check(false, value=='false'     ,'v01-08');
        c.check(false, value+''=='false'  ,'v01-09');
        //↓文字列に『!!』を付属するとtrueが返されるので
        //  判定はできない
        c.check(true , value==!!'false'   ,'v01-10');
        c.check(true , !!value==!!'false' ,'v01-11');
        c.check(false, !!value=='false'   ,'v01-12');
        c.check(false, !!value==false     ,'v01-13');

        value = false;
        c.check(false , value==true       ,'v02-01');
        c.check(false, value=='true'      ,'v02-02');
        c.check(false, value+''=='true'   ,'v02-03');
        c.check(false, value==!!'true'    ,'v02-04');
        c.check(false, !!value==!!'true'  ,'v02-05');
        c.check(false, !!value=='true'    ,'v02-06');
        c.check(false, !!value==true      ,'v02-06-02');

        c.check(true , value==false       ,'v02-07');
        //↓boolean型とstring型は比較一致不可能
        c.check(false, value=='false'     ,'v02-08');
        //↓『+''』を付属して文字列化すれば一致確認OK
        c.check(true , value+''=='false'  ,'v02-09');
        //↓文字列に『!!』を付属するとtrueが返されるので
        //  判定はできない
        c.check(false, value==!!'false'   ,'v02-10');
        c.check(false, !!value==!!'false' ,'v02-11');
        c.check(false, !!value=='false'   ,'v02-12');
        c.check(true , !!value==false     ,'v02-13');

        //というわけで
        //falseの場合は[!!値]では判定できないので
        //!!でキャストできるという噂は嘘

        var s;
        s = 'true';
        c.check(true , s=='true'          ,'V03-01');
        //↓boolean型とstring型は比較一致不可能
        c.check(false, s==true            ,'V03-01');
        //↓文字列に『!!』を付属するとtrueが返されるので
        //  合っているようにみえるが
        c.check(true , !!s==true          ,'V03-02');

        c.check(false, s==false           ,'V03-03');
        //↓文字列に『!!』を付属するとtrueが返されるので
        //  合っているようにみえるが
        c.check(false, !!s==false         ,'V03-04');

        s = 'false';
        c.check(false, s=='true'          ,'V04-01');
        c.check(false, s==true            ,'V04-01');
        //↓文字列に『!!』を付属するとtrueが返されるので
        //  falseの場合でもtrueと判定してしまう
        c.check(true , !!s==true          ,'V04-02');

        c.check(false, s==false           ,'V04-03');
        //↓文字列に『!!』を付属するとtrueが返されるので
        //  falseの場合でも一致しない
        c.check(false, !!s==false         ,'V04-04');

      };

    }()); //_.test

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

    //----------------------------------------
    //◆列挙型定義
    //----------------------------------------
    _.caseType = stsLib.enumType.EnumNameValue('sensitive', 'ignore');

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

  moduleExports(stsLib, 'stslib_core.js');

}()); //(function() {


