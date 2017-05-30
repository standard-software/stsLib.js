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
Version:        2017/05/31
//----------------------------------------*/

//----------------------------------------
//■グローバル
//----------------------------------------

//----------------------------------------
//・alert
//----------------------------------------
//  ・ライブラリ内部で alert を使うので
//    alert がない環境(node.jsとか)での動作の時に
//    エラーにならないように定義する
//----------------------------------------
var alert = alert || function (message) {
  console.log(message);
};

//----------------------------------------
//・Array.isArray
//----------------------------------------
//  ・Array.isArray が存在しない環境(WSHなど)
//    のために実装
//  ・参考:書籍:JavaScriptパターン P51
//----------------------------------------
Array.isArray = Array.isArray || function (arg) {
  return Object.prototype.toString.call(arg) === '[object Array]';
};

//----------------------------------------
//■ライブラリ名前空間
//----------------------------------------
//  ・名前空間は同じ書き方で別ファイルで
//    定義し直しても別関数を定義していくことができる
//----------------------------------------
var stsLib = stsLib || {};
(function (stsLib, global) {
  'use strict';
  var _ = stsLib;

  //----------------------------------------
  //◆基本的な処理
  //----------------------------------------

    //----------------------------------------
    //・クラス継承関数
    //----------------------------------------
    _.inherits = function(childCtor, parentCtor) {
        // ES6
        if (Object.setPrototypeOf) {
            Object.setPrototypeOf(childCtor.prototype, parentCtor.prototype);
        }
        // ES5
        else if (Object.create) {
            childCtor.prototype = Object.create(parentCtor.prototype);
        }
        // legacy platform
        else {
            function tempCtor() {};
            tempCtor.prototype = parentCtor.prototype;
            childCtor.superClass_ = parentCtor.prototype;
            childCtor.prototype = new tempCtor();
            childCtor.prototype.constructor = childCtor;
        }
    };

  //----------------------------------------
  //◆デバッグ処理
  //----------------------------------------
  _.debug = stsLib.debug || {};
  (function () {
    var _ = stsLib.debug;

    //----------------------------------------
    //・assert関数
    //----------------------------------------
    //  ・  value が true でなければ
    //      例外を出力する関数
    //  ・  他言語でよく使う
    //----------------------------------------
    _.assert = function (value, message) {
      var t = stsLib.type;
      if (t.isNullOrUndefined(message)) {
        message = '';
      }
      if (!t.isBoolean(value)) {
        throw new Error('Error:' + message);
      }
      if (!value) {
        throw new Error('Error:' + message);
      }
    };

    //----------------------------------------
    //・check関数
    //----------------------------------------
    //  ・  2値が一致するかどうか確認する関数
    //----------------------------------------
    _.check = function (a, b, message) {
      if (a === b) {
        return true;
      }
      if (stsLib.type.isNullOrUndefined(message)) {
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

    _.test_check = function () {
      var d = stsLib.debug;
      d.check(true, '123' === '123');
      d.check(true, ' 123' == 123);
      d.check(false, ' 123' === 123);
    };

    //----------------------------------------
    //・checkExc(例外チェック)関数
    //----------------------------------------
    //  ・  関数と結果が、=か!=か例外発生かを
    //      判定することができる関数
    //----------------------------------------
    _.checkExc = function (result, func) {
      try {
        var args = [].slice.call(arguments,2);
        if (result !== func.apply(null, args)) {
          return 'NG';
        } else {
          return 'OK';
        }
      } catch(e) {
        return 'ER';
      }
    };

    _.test_checkExc = function () {
      var d = stsLib.debug;
      var testFunc1 = function (a, b) {
        return a / b;
      };
      var testFunc2 = function (a, b) {
        if (b === 0) {
          throw new Error('error');;
        }
        return a / b;
      };
      
      d.check('OK', _.checkExc(5, testFunc1, 5, 1));
      d.check('NG', _.checkExc(1, testFunc1, 5, 1));
      d.check('OK', _.checkExc(2.5, testFunc1, 5, 2));
      d.check('OK', _.checkExc(Infinity, testFunc1, 5, 0));
      d.check('OK', _.checkExc(5, testFunc2, 5, 1));
      d.check('NG', _.checkExc(1, testFunc2, 5, 1));
      d.check('OK', _.checkExc(2.5, testFunc2, 5, 2));
      d.check('ER', _.checkExc(Infinity, testFunc2, 5, 0));
    };

    _.benchMark = function (loopCount, func) {
      var startTime = new Date();

      var args = [].slice.call(arguments,2);

      for (var i = 0, max = loopCount - 1;
        i <= max - 1; i++) {
        func.apply(null, args);
      }

      var endTime = new Date();
      return endTime - startTime;
    }

  }());

  //----------------------------------------
  //◆条件判断
  //----------------------------------------

  //----------------------------------------
  //◆型 確認/変換 処理
  //----------------------------------------
  _.type = stsLib.type || {};
  (function () {
    var _ = stsLib.type;

    _.isUndefined = function (value) {
      return (typeof value === 'undefined');
    };

    _.isNull = function (value) {
      return (value === null);
    };

    _.isNullOrUndefined = function (value)
    {
      return (_.isNull(value)
        || _.isUndefined(value));
    };

    _.test_isNullOrUndefined = function () {
      var d = stsLib.debug;
      var a1;
      d.check(true,   _.isUndefined(a1));
      d.check(false,  _.isNull(a1));
      d.check(true,   _.isNullOrUndefined(a1));

      var a2 = null;
      d.check(false,  _.isUndefined(a2));
      d.check(true,   _.isNull(a2));
      d.check(true,   _.isNullOrUndefined(a2));

      var a3 = 10;
      d.check(false,  _.isUndefined(a3));
      d.check(false,  _.isNull(a3));
      d.check(false,  _.isNullOrUndefined(a3));
    };

    _.isBoolean = function (value) {
      return (typeof value === 'boolean');
    };

    _.test_isBoolean = function () {
      var d = stsLib.debug;
      d.check(true, _.isBoolean(true));
      d.check(true, _.isBoolean(false));
      d.check(false,_.isBoolean(undefined));
      d.check(false,_.isBoolean(null));
      d.check(false,_.isBoolean(''));
      d.check(false,_.isBoolean('true'));
      d.check(false,_.isBoolean('false'));
      d.check(false,_.isBoolean(123));
      d.check(false,_.isBoolean(0));
      d.check(false,_.isBoolean(-1));
    };

    _.isNumber = function (value) {
      return (typeof value === 'number');
    };

    _.test_isNumber = function () {
      var d = stsLib.debug;
      d.check(true, _.isNumber(123));
      d.check(true, _.isNumber(0));
      d.check(true, _.isNumber(-1));
      d.check(true ,_.isNumber(123.4));
      d.check(true, _.isNumber(123.0));
      d.check(false,_.isNumber(true));
      d.check(false,_.isNumber(false));
      d.check(false,_.isNumber(null));
      d.check(false,_.isNumber(undefined));
      d.check(false,_.isNumber(''));
      d.check(false,_.isNumber('ABC'));
      d.check(false,_.isNumber('ABC10'));
      d.check(false,_.isNumber('10ABC'));
      d.check(false,_.isNumber('0ABC'));
      d.check(false,_.isNumber('0'));
      d.check(false,_.isNumber('5'));
      d.check(false,_.isNumber('-5'));
      d.check(false,_.isNumber('100'));
      d.check(false,_.isNumber('-100'));
      d.check(false,_.isNumber([]));
      d.check(false,_.isNumber({}));
    };

    _.isInt = function (value) {
      if (!_.isNumber(value)) {
        return false;
      }
      return Math.round(value) === value;
    };

    _.test_isInt = function () {
      var d = stsLib.debug;
      d.check(true, _.isInt(123));
      d.check(true, _.isInt(0));
      d.check(true, _.isInt(-1));
      d.check(false,_.isInt(123.4));
      d.check(true, _.isInt(123.0));
        //.0の場合は整数か少数かは判断できない
      d.check(false,_.isInt(true));
      d.check(false,_.isInt(false));
      d.check(false,_.isInt(null));
      d.check(false,_.isInt(undefined));
      d.check(false,_.isInt(''));
      d.check(false,_.isInt('ABC'));
      d.check(false,_.isInt('0'));
      d.check(false,_.isInt('5'));
      d.check(false,_.isInt('-5'));
      d.check(false,_.isInt('100'));
      d.check(false,_.isInt('-100'));
      d.check(false,_.isInt([]));
      d.check(false,_.isInt({}));
    };

    _.isString = function (value) {
      return (typeof value === 'string');
    };

  }());

  //----------------------------------------
  //◆数値
  //----------------------------------------

  //----------------------------------------
  //◆角度
  //----------------------------------------
  _.angle = stsLib.angle || {};
  (function () {
    var _ = stsLib.angle;

    //----------------------------------------
    //・ラジアンと角度相互変換
    //----------------------------------------
    _.degreeToRadian = function (value) {
      return value * Math.PI / 180;
    };

    _.radianToDegree = function (value) {
      return value * 180 / Math.PI;
    };

    _.test_degreeToRadian = function () {
      var d = stsLib.debug;
      d.check(0, _.degreeToRadian(0));
      d.check(Math.PI / 6, _.degreeToRadian(30));
      d.check(0, _.radianToDegree(0));
      d.check(30, Math.round(_.radianToDegree(Math.PI / 6)));
    };

    //----------------------------------------
    //・絶対角度から相対角度を求める
    //----------------------------------------
    //  ・  base と target は角度の絶対座標で
    //      0度から360度とする。
    //      それ以上それ以下でも0-360に丸め込まれる
    //  ・  戻り値は -180～+180 になる
    //----------------------------------------
    _.angleRelative = function (base, target) {
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
    };

    _.test_angleRelative = function () {
      var d = stsLib.debug;
      d.check(10, _.angleRelative(5, 15));
      d.check(-10, _.angleRelative(15, 5));

      d.check(90, _.angleRelative(90, 180));
      d.check(180, _.angleRelative(90, 270));
      d.check(180, _.angleRelative(0, 180));

      d.check(-179, _.angleRelative(0, 181));
      d.check(179, _.angleRelative(181, 0));
      d.check(-179, _.angleRelative(179, 0));
    };
  }());

  //----------------------------------------
  //◆配列処理
  //----------------------------------------

  _.array = stsLib.array || {};
  (function () {
    var _ = stsLib.array;

    //----------------------------------------
    //・配列の値で比較する関数
    //----------------------------------------
    _.equal = function (value1, value2) {
      var d = stsLib.debug;
      d.assert(Array.isArray(value1));
      d.assert(Array.isArray(value2));

      return value1.toString() === value2.toString();
    };

    _.test_equal = function ()
    {
      var d = stsLib.debug;
      var a1 = [1, 2, 3];
      var a2 = [1, 2, 3];

      d.check(false, a1 == a2);
      d.check(false, a1 === a2);

      d.check(true, stsLib.array.equal(a1, a2));
    };

    //----------------------------------------
    //・配列の値で比較して出力するindexOf
    //----------------------------------------
    _.arrayIndexOfArray = function (arrayList, arrayValue)
    {
      var d = stsLib.debug;
      d.assert(Array.isArray(arrayList));
      d.assert(Array.isArray(arrayValue));

      for (var i = 0; i <= arrayList.length - 1; i++)
      {
        if (_.equal(arrayList[i], arrayValue))
        {
          return i;
        }
      }
      return -1;
    };

    _.test_arrayIndexOfArray = function ()
    {
      var d = stsLib.debug;
      var arrayList = [];
      arrayList.push([1,1,1]);
      arrayList.push([2,2,2]);
      arrayList.push([3,3,3]);

      var a1 = [1, 2, 3];
      d.check(-1, _.arrayIndexOfArray(arrayList, a1));

      a1 = [1, 1, 1];
      d.check(0, _.arrayIndexOfArray(arrayList, a1));
      a1 = [2, 2, 2];
      d.check(1, _.arrayIndexOfArray(arrayList, a1));
      a1 = [3, 3, 3];
      d.check(2, _.arrayIndexOfArray(arrayList, a1));
    };

    //----------------------------------------
    //◇配列文字列変換
    //----------------------------------------

    _.arrayToString = function (arrayValue, delimiter) {
      var undefined;
      if (arrayValue[0] === undefined) { return ''; }
      if (delimiter === undefined) {delimiter = ''; }
      var result = arrayValue[0];
      var i = 1;
      while(arrayValue[i] !== undefined) {
        result += delimiter + arrayValue[i];
        i++;
      }
      return result;
    };

    _.test_arrayToString = function (){
      var d = stsLib.debug;
      var array01 = new Array();
      array01[0] = 'abc';
      array01[1] = 'def';
      d.check('abc-def', _.arrayToString(array01, '-'));

      var array02 = new Array('123', '456');
      d.check('123_456', _.arrayToString(array02, '_'));
    };

    _.stringToArray = function (value, delimiter) {
      return value.split(delimiter);
    };

    _.test_stringToArray = function (){
      var d = stsLib.debug;
      var array03 = _.stringToArray('ABC/DEF', '/');
      d.check('ABC', array03[0]);
      d.check('DEF', array03[1]);
    };

  }());

  //----------------------------------------
  //◆文字列処理
  //----------------------------------------

  //文字列処理、名前空間
  _.string = stsLib.string || {};
  (function () {
    var _ = stsLib.string;

/*----------------------------------------
//・外部からの呼び出し時は
//  静的関数的な使い方と拡張メソッドのような使い方ができる

  var d = stsLib.debug;

  //・静的関数的な使い方
  //  先頭小文字の string を使う
  d.check(true, stsLib.string.isInclude('abc', 'a'));

  //・拡張メソッド的な使い方
  //  先頭大文字の String を使う
  var str1 = new stsLib.String('abc');
  d.check(true, str1.isInclude('a'));

  //・拡張メソッド的な使い方
  //  newしなくても使用できる
  var str2 = stsLib.String('abc');
  d.check(true, str2.isInclude('a'));

//・名前空間は何度宣言してもよいので、
//  別ファイルに同名の名前空間コードをコピペして
//  作成し、同じ書き方でメソッドを追加していくことができる

var stsLib = stsLib || {};

  stsLib.string = stsLib.string || {};

  stsLib.String = stsLib.String || function (value) {
    var self = function () {};
    self.prototype = stsLib.String.prototype;
    self.prototype.value = value;
    return new self;
  }

//----------------------------------------*/

    //----------------------------------------
    //◇条件判断
    //----------------------------------------

    //----------------------------------------
    //・NullかUndefinedか空文字('')ならTrueを返す
    //----------------------------------------
    _.isEmpty = function (str) {
      var t = stsLib.type;
      if (t.isNullOrUndefined(str) || str ===  '') {
        return true;
      } else {
        return false;
      }
    };

    //----------------------------------------
    //・値が空文字/null/Undefinedの場合だけ別の値を返す関数
    //----------------------------------------
    _.ifEmptyValue = function (str , emptyValue) {
      if (_.isEmpty(str)) {
        return emptyValue;
      } else {
        return str;
      }
    };

    //----------------------------------------
    //◇Include
    //----------------------------------------

    _.isInclude = function (str, search) {
      return (0 <= _.indexOfFirst(str, search));
    };

    _.test_isInclude = function () {
      var d = stsLib.debug;
      d.check(true, _.isInclude('abc', 'a'));
      d.check(true, _.isInclude('abc', 'b'));
      d.check(true, _.isInclude('abc', 'c'));
      d.check(false,_.isInclude('abc', 'd'));
      d.check(false,_.isInclude('abc', ''));
      d.check(false,_.isInclude('', 'a'));
    };

    _.includeCount = function (str, search) {
      //if (search === '') { return 0; }
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

    _.test_includeCount = function () {
      var d = stsLib.debug;
      d.check(3, _.includeCount('123123123', '1'),    'A');
      d.check(3, _.includeCount('123123123', '2'),    'B');
      d.check(3, _.includeCount('123123123', '3'),    'C');
      d.check(3, _.includeCount('123123123', '12'),   'D');
      d.check(2, _.includeCount('123123123', '31'),   'E');
      d.check(6, _.includeCount('AAAAAA', 'A'),       'F');
      d.check(3, _.includeCount('AAAAAA', 'AA'),      'G');
    };

    //----------------------------------------
    //◇indexOf 系
    //----------------------------------------

    _.indexOfFirst = function (str, search, startIndex) {
      var t = stsLib.type;
      if (search === '') { return -1; }
      if (t.isNullOrUndefined(startIndex)) {
        startIndex = 0;
      }
      return str.indexOf(search, startIndex);
    };

    _.test_indexOfFirst = function () {
      var d = stsLib.debug;
      d.check(-1, _.indexOfFirst('abc', 'd'));
      d.check( 0, _.indexOfFirst('abc', 'a'));
      d.check( 1, _.indexOfFirst('abc', 'b'));
      d.check( 2, _.indexOfFirst('abc', 'c'));
      d.check(-1, _.indexOfFirst('abc', ''));
      d.check( 0, _.indexOfFirst('abcabc', 'a'));
      d.check( 1, _.indexOfFirst('abcabc', 'b'));
      d.check( 2, _.indexOfFirst('abcabc', 'c'));

      d.check( 0, _.indexOfFirst('abcabc', 'a', 0));
      d.check( 3, _.indexOfFirst('abcabc', 'a', 1));
      d.check( 1, _.indexOfFirst('abcabc', 'b', 1));
      d.check( 4, _.indexOfFirst('abcabc', 'b', 2));
      d.check( 2, _.indexOfFirst('abcabc', 'c', 2));
      d.check( 5, _.indexOfFirst('abcabc', 'c', 3));
    };

    _.indexOfLast = function (str, search, startIndex) {
      if (search === '') { return -1; }
      if (stsLib.type.isNullOrUndefined(startIndex)) {
        startIndex = str.length - 1;
      }
      return str.lastIndexOf(search, startIndex);
    };

    _.test_indexOfLast = function () {
      var d = stsLib.debug;
      d.check(-1, _.indexOfLast('abc', 'd'));
      d.check( 0, _.indexOfLast('abc', 'a'));
      d.check( 1, _.indexOfLast('abc', 'b'));
      d.check( 2, _.indexOfLast('abc', 'c'));
      d.check(-1, _.indexOfLast('abc', ''));
      d.check( 3, _.indexOfLast('abcabc', 'a'));
      d.check( 4, _.indexOfLast('abcabc', 'b'));
      d.check( 5, _.indexOfLast('abcabc', 'c'));

      d.check( 3, _.indexOfLast('abcabc', 'a', 3));
      d.check( 0, _.indexOfLast('abcabc', 'a', 2));
      d.check( 4, _.indexOfLast('abcabc', 'b', 4));
      d.check( 1, _.indexOfLast('abcabc', 'b', 3));
      d.check( 5, _.indexOfLast('abcabc', 'c', 5));
      d.check( 2, _.indexOfLast('abcabc', 'c', 4));
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
    //----------------------------------------
    _.substrIndex = function (str, startIndex, endIndex) {
      var d = stsLib.debug;
      var t = stsLib.type;
      if (t.isNullOrUndefined(endIndex)) {
        endIndex = str.length - 1;
      }
      d.assert(t.isString(str));
      d.assert(t.isInt(startIndex));
      d.assert(t.isInt(endIndex));

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

    _.test_substrIndex = function () {
      var d = stsLib.debug;
      d.check('45',     _.substrIndex('012345', 4));
      d.check('2345',   _.substrIndex('012345', -4));
      d.check('1',      _.substrIndex('012345', 1, 1));
      d.check('1234',   _.substrIndex('012345', 1, 4));
      d.check('345',    _.substrIndex('012345', 3, 10));
      d.check('1234',   _.substrIndex('012345', 4, 1));
      d.check('345',    _.substrIndex('012345', 10, 3));

      d.check('5',      _.substrIndex('012345', -1, -1));
      d.check('2345',   _.substrIndex('012345', -1, -4));
      d.check('0123',   _.substrIndex('012345', -3, -10));
      d.check('2345',   _.substrIndex('012345', -4, -1));
      d.check('0123',   _.substrIndex('012345', -10, -3));

      d.check('0',      _.substrIndex('012345', 0, 0));
      d.check('5',      _.substrIndex('012345', 5, 5));
      d.check('45',     _.substrIndex('012345', -1, 4));
      d.check('45',     _.substrIndex('012345', 4, -1));
      d.check('12',   _.substrIndex('012345', -4, 1));
      d.check('12',   _.substrIndex('012345', 1, -4));
      d.check('0123',   _.substrIndex('012345', -10, 3));
      d.check('0123',   _.substrIndex('012345', 3, -10));
      d.check('345',   _.substrIndex('012345', 10, -3));
      d.check('345',   _.substrIndex('012345', -3, 10));
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
    //----------------------------------------
    _.substrLength = function (str, startIndex, length) {
      if (length === 0) { return ''; }
      if ((startIndex < (-1 * str.length))
      || ((str.length) < startIndex)) { return '';}
      if (startIndex < 0) {
        startIndex = str.length + startIndex;
      }

      if (stsLib.type.isNullOrUndefined(length)) {
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

    _.test_substrLength = function () {
      var d = stsLib.debug;
      d.check('45',   _.substrLength('012345', 4));
      d.check('2345', _.substrLength('012345', -4));
      d.check('23',   _.substrLength('012345', 2, 2));
      d.check('234',  _.substrLength('012345', 2, 3));
      d.check('345',  _.substrLength('012345', 3, 10));
      d.check('4',    _.substrLength('012345', 4, 1));
      d.check('',     _.substrLength('012345', 10, 3));

      d.check('5',    _.substrLength('012345', -1, -1));
      d.check('45',   _.substrLength('012345', -1, -2));
      d.check('0123', _.substrLength('012345', -3, -10));
      d.check('34',   _.substrLength('012345', -3, 2));
      d.check('2',    _.substrLength('012345', -4, -1));
      d.check('2',    _.substrLength('012345', -4, 1));
      d.check('12',   _.substrLength('012345', -4, -2));
      d.check('23',   _.substrLength('012345', -4, 2));
      d.check('',     _.substrLength('012345', -10, -3));

      d.check('',     _.substrLength('012345', 0, 0));
      d.check('',     _.substrLength('012345', 3, 0));
    };

    //----------------------------------------
    //◇Start
    //----------------------------------------

    //----------------------------------------
    //・先頭を切り取るメソッド
    //----------------------------------------
    _.start = function (str, length) {
      var d = stsLib.debug;
      var t = stsLib.type;
      d.assert(t.isString(str));
      d.assert(t.isInt(length));
      if (str === '') { return ''; }
      if (length <= 0) { return ''; }

      return _.substrLength(str, 0, length);
    };

    _.test_start = function () {
      var d = stsLib.debug;
      d.check('0123',   _.start('012345', 4));
      d.check('',       _.start('012345', 0));
      d.check('',       _.start('012345', -3));
      d.check('01',     _.start('012345', 2));
      d.check('012',    _.start('012345', 3));
      d.check('012345', _.start('012345', 6));
      d.check('012345', _.start('012345', 10));
    };

    _.startsWith = function (str, search) {
      if (search === '') { return false; }
      if (str === '') { return false; }
      if (str.length < search.length) { return false; }

      if (_.indexOfFirst(str, search) === 0) {
        return true;
      } else {
        return false;
      }
    };

    //----------------------------------------
    //・先頭の一致を調べる
    //----------------------------------------
    _.test_startsWith = function () {
      var d = stsLib.debug;
      d.check(true,  _.startsWith('12345', '1'), 'A');
      d.check(true,  _.startsWith('12345', '12'), 'B');
      d.check(true,  _.startsWith('12345', '123'), 'C');
      d.check(false, _.startsWith('12345', '23'), 'D');
      d.check(false, _.startsWith('', '34'), 'E');
      d.check(false, _.startsWith('12345', ''), 'F');
      d.check(false, _.startsWith('123', '1234'), 'G');
    };

    //----------------------------------------
    //・先頭に含む
    //----------------------------------------
    _.includeStart = function (str, search) {
      if (_.startsWith(str, search)) {
        return str;
      } else {
        return search + str;
      }
    };

    _.test_includeStart = function () {
      var d = stsLib.debug;
      d.check('12345',  _.includeStart('12345', '1'));
      d.check('12345',  _.includeStart('12345', '12'));
      d.check('12345',  _.includeStart('12345', '123'));
      d.check('2312345',_.includeStart('12345', '23'));
    };

    //----------------------------------------
    //・先頭から取り除く
    //----------------------------------------
    _.excludeStart = function (str, search) {
      if (_.startsWith(str, search)) {
        return _.substrIndex(str, search.length);
      } else {
        return str;
      }
    };

    _.test_excludeStart = function () {
      var d = stsLib.debug;
      d.check('2345', _.excludeStart('12345', '1'));
      d.check('345',  _.excludeStart('12345', '12'));
      d.check('45',   _.excludeStart('12345', '123'));
      d.check('12345',_.excludeStart('12345', '23'));
    };

    //----------------------------------------
    //◇End
    //----------------------------------------

    //----------------------------------------
    //・先頭を切り取るメソッド
    //----------------------------------------
    _.end = function (str, length) {
      if (str === '') { return ''; }
      if (length <= 0) { return ''; }
      return _.substrLength(str,
        Math.max(0, str.length - length));
    };

    _.test_end = function () {
      var d = stsLib.debug;
      d.check('2345',   _.end('012345', 4));
      d.check('',       _.end('012345', 0));
      d.check('',       _.end('012345', -3));
      d.check('45',     _.end('012345', 2));
      d.check('345',    _.end('012345', 3));
      d.check('012345', _.end('012345', 6));
      d.check('012345', _.end('012345', 10));
    };

    //----------------------------------------
    //・終端の一致を調べる
    //----------------------------------------
    _.endsWith = function (str, search) {
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

    _.test_endsWith = function () {
      var d = stsLib.debug;
      d.check(true,  _.endsWith('12345', '5'));
      d.check(true,  _.endsWith('12345', '45'));
      d.check(true,  _.endsWith('12345', '345'));
      d.check(false, _.endsWith('12345', '34'));
      d.check(false, _.endsWith('', '34'));
      d.check(false, _.endsWith('12345', ''));
      d.check(false, _.endsWith('123', '1234'));
    };

    //----------------------------------------
    //・終端に含む
    //----------------------------------------
    _.includeEnd = function (str, search) {
      if (_.endsWith(str, search)) {
        return str;
      } else {
        return str + search;
      }
    };

    _.test_includeEnd = function () {
      var d = stsLib.debug;
      d.check('12345',   _.includeEnd('12345', '5'));
      d.check('12345',   _.includeEnd('12345', '45'));
      d.check('12345',   _.includeEnd('12345', '345'));
      d.check('1234534', _.includeEnd('12345', '34'));
    };

    //----------------------------------------
    //・終端から取り除く
    //----------------------------------------
    _.excludeEnd = function (str, search) {
      if (_.endsWith(str, search)) {
        return _.substrIndex(str, 0,
          str.length - search.length - 1);
      } else {
        return str;
      }
    };

    _.test_excludeEnd = function () {
      var d = stsLib.debug;
      d.check('1234',  _.excludeEnd('12345', '5'));
      d.check('123',   _.excludeEnd('12345', '45'));
      d.check('12',    _.excludeEnd('12345', '345'));
      d.check('12345', _.excludeEnd('12345', '34'));
    };

    //----------------------------------------
    //◇両端 BothEnds
    //----------------------------------------
    _.bothEndsWith = function (str, search) {
      return _.startsWith(str, search) &&
        _.endsWith(str, search);
    };

    _.includeBothEnds = function (str, search) {
      return _.includeStart(
        _.includeEnd(str, search));
    };

    _.excludeBothEnds = function (str, search) {
      return _.excludeStart(
        _.excludeEnd(str, search));
    };

    //----------------------------------------
    //◇delimiter
    //----------------------------------------

    //----------------------------------------
    //・startFirstDelim
    //----------------------------------------
    _.startFirstDelim = function (str, delimiter) {
      var index = _.indexOfFirst(str, delimiter);
      if (index === -1) {
        return str;
      } else if (index === 0) {
        return '';
      } else {
        return _.substrIndex(str, 0, index - 1);
      }
    };

    _.test_startFirstDelim = function () {
      var d = stsLib.debug;
      d.check('123', _.startFirstDelim('123,456', ','));
      d.check('123', _.startFirstDelim('123,456,789', ','));
      d.check('123', _.startFirstDelim('123ttt456', 'ttt'));
      d.check('123', _.startFirstDelim('123ttt456', 'tt'));
      d.check('123', _.startFirstDelim('123ttt456', 't'));
      d.check('123ttt456', _.startFirstDelim('123ttt456', ','));
      d.check('123', _.startFirstDelim('123,', ','));
      d.check('', _.startFirstDelim(',123', ','));
      d.check('', _.startFirstDelim(',123,', ','));
    };

    //----------------------------------------
    //・startLastDelim
    //----------------------------------------
    _.startLastDelim = function (str, delimiter) {
      var index = _.indexOfLast(str, delimiter);
      if (index === -1) {
        return str;
      } else if (index === 0) {
        return '';
      } else {
        return _.substrIndex(str, 0, index -1);
      }
    };

    _.test_startLastDelim = function () {
      var d = stsLib.debug;
      d.check('123', _.startLastDelim('123,456', ','));
      d.check('123,456', _.startLastDelim('123,456,789', ','));
      d.check('123', _.startLastDelim('123ttt456', 'ttt'));
      d.check('123t', _.startLastDelim('123ttt456', 'tt'));
      d.check('123tt', _.startLastDelim('123ttt456', 't'));
      d.check('123ttt456', _.startLastDelim('123ttt456', ','));
      d.check('123', _.startLastDelim('123,', ','));
      d.check('', _.startLastDelim(',123', ','));
      d.check(',123', _.startLastDelim(',123,', ','));
    };

    //----------------------------------------
    //・endFirstDelim
    //----------------------------------------
    _.endFirstDelim = function (str, delimiter) {
      var index = _.indexOfFirst(str, delimiter);
      if (index === -1) {
        return str;
      } else if (index === str.length - 1) {
        return '';
      } else {
        return _.substrIndex(str, index + delimiter.length);
      }
    };

    _.test_endFirstDelim = function () {
      var d = stsLib.debug;
      d.check('456', _.endFirstDelim('123,456', ','));
      d.check('456,789', _.endFirstDelim('123,456,789', ','));
      d.check('456', _.endFirstDelim('123ttt456', 'ttt'));
      d.check('t456', _.endFirstDelim('123ttt456', 'tt'));
      d.check('tt456', _.endFirstDelim('123ttt456', 't'));
      d.check('123ttt456', _.endFirstDelim('123ttt456', ','));
      d.check('', _.endFirstDelim('123,', ','));
      d.check('123', _.endFirstDelim(',123', ','));
      d.check('123,', _.endFirstDelim(',123,', ','));
    };

    //----------------------------------------
    //・endLastDelim
    //----------------------------------------
    _.endLastDelim = function (str, delimiter) {
      var index = _.indexOfLast(str, delimiter);
      if (index === -1) {
        return str;
      } else if (index === str.length - delimiter.length) {
        return '';
      } else {
        return _.substrIndex(str, index + delimiter.length);
      }
    };

    _.test_endLastDelim = function () {
      var d = stsLib.debug;

      d.check('456', _.endLastDelim('123,456', ','));
      d.check('789', _.endLastDelim('123,456,789', ','));
      d.check('456', _.endLastDelim('123ttt456', 'ttt'));
      d.check('456', _.endLastDelim('123ttt456', 'tt'));
      d.check('456', _.endLastDelim('123ttt456', 't'));
      d.check('123ttt456', _.endLastDelim('123ttt456', ','));
      d.check('', _.endLastDelim('123,', ','));
      d.check('123', _.endLastDelim(',123', ','));
      d.check('', _.endLastDelim(',123,', ','));

      var Text = '<123>123<789> <123>456<789> <123>789<789>';
      d.check('', _.endLastDelim(Text, '<789>'));

    };

    //--------------------------------------
    //◇Trim
    //--------------------------------------
    _.trimStart = function (str, trimStrArray) {
      var result = str;
      do {
        str = result;
        for (var i = 0; i <= trimStrArray.length - 1; i++) {
          result = _.excludeStart(result, trimStrArray[i]);
        }
      } while (result !== str);
      return result;
    };

    _.test_trimStart = function () {
      var d = stsLib.debug;
      d.check('123 ',       _.trimStart('   123 ', [' ']));
      d.check('\t  123 ',   _.trimStart('   \t  123 ', [' ']));
      d.check('123 ',       _.trimStart('   \t  123 ', [' ', '\t']));
    };

    _.trimEnd = function (str, trimStrArray) {
      var result = str;
      do {
        str = result;
        for (var i = 0; i <= trimStrArray.length - 1; i++) {
          result = _.excludeEnd(result, trimStrArray[i]);
        }
      } while (result !== str);
      return result;
    };

    _.test_trimEnd = function () {
      var d = stsLib.debug;
      d.check(' 123',       _.trimEnd(' 123   ', [' ']));
      d.check(' 456  \t',   _.trimEnd(' 456  \t   ', [' ']));
      d.check(' 789',       _.trimEnd(' 789  \t   ', [' ', '\t']));
    };

    _.trimBothEnds = function (str, trimStrArray) {
      return _.trimStart(
        _.trimEnd(str, trimStrArray), trimStrArray);
    };

    _.trim = function (str) {
      return _.trimBothEnds(str, [' ', '\t', '\r', '\n']);
    };

    //--------------------------------------
    //◇Tag deleteFirst/Last
    //--------------------------------------

    _.deleteFirst = function (str, search) {
      if (_.indexOfFirst(str, search) === -1) {
        return str;
      } else {
        return _.startFirstDelim(str, search) +
          _.endFirstDelim(str, search);
      }
    };

    _.deleteLast = function (str, search) {
      if (_.indexOfLast(str, search) === -1) {
        return str;
      } else {
        return _.startLastDelim(str, search) +
          _.endLastDelim(str, search);
      }
    };

    _.test_deleteFirstLast = function () {
      var d = stsLib.debug;
      d.check('abcdefghi', _.deleteFirst(
        _.deleteLast('abc<def>ghi', '>'), '<'));
      d.check('abc><def><ghi', _.deleteFirst(
        _.deleteLast('a<bc><def><gh>i', '>'), '<'));
      d.check('abcdefghi', _.deleteFirst(
        _.deleteLast('abc>def<ghi', '>'), '<'));
      d.check('abc>def<ghi', _.deleteFirst(
        _.deleteLast('a<bc>def<gh>i', '>'), '<'));
    };

    //--------------------------------------
    //◇Tag deleteFirstTagInner/Outer
    //--------------------------------------
    _.deleteFirstTagInner = function (str, startTag, endTag) {
      var d = stsLib.debug;
      var t = stsLib.type;
      d.assert((!t.isNullOrUndefined(str)) );
      d.assert(!_.isEmpty(startTag));
      d.assert(!_.isEmpty(endTag));
      if (str === '') { return ''; }

      var indexStartTag = _.indexOfFirst(str, startTag);
      var indexEndTag = _.indexOfFirst(str, endTag);
      if ((indexStartTag !== -1)
      && (indexEndTag !== -1)
      && (indexStartTag < indexEndTag)) {
        str = _.startFirstDelim(str, startTag) + startTag +
          endTag + _.endFirstDelim(str, endTag);
      }
      return str;
    };

    _.test_deleteFirstTagInner = function () {
      var d = stsLib.debug;
      d.check('abc<>ghi', _.deleteFirstTagInner('abc<def>ghi', '<', '>'));
      d.check('abc<>ghi<jkl>mn', _.deleteFirstTagInner('abc<def>ghi<jkl>mn', '<', '>'));
    };

    _.deleteFirstTagOuter = function (str, startTag, endTag) {
      var d = stsLib.debug;
      var t = stsLib.type;
      d.assert((!t.isNullOrUndefined(str)) );
      d.assert(!_.isEmpty(startTag));
      d.assert(!_.isEmpty(endTag));
      if (str === '') { return ''; }

      var indexStartTag = str.indexOf(startTag);
      var indexEndTag = str.indexOf(endTag);
      if ((indexStartTag !== -1)
      && (indexEndTag !== -1)
      && (indexStartTag < indexEndTag)) {
        str = _.startFirstDelim(str, startTag) +
          _.endFirstDelim(str, endTag);
      }
      return str;
    };

    _.test_deleteFirstTagOuter = function () {
      var d = stsLib.debug;
      d.check('abcghi', _.deleteFirstTagOuter('abc<def>ghi', '<', '>'));
      d.check('abcghi<jkl>mn', _.deleteFirstTagOuter('abc<def>ghi<jkl>mn', '<', '>'));
    };

    //--------------------------------------
    //◇Tag deleteLastTagInner/Outer
    //--------------------------------------
    _.deleteLastTagInner = function (str, startTag, endTag) {
      var d = stsLib.debug;
      var t = stsLib.type;
      d.assert((!t.isNullOrUndefined(str)) );
      d.assert(!_.isEmpty(startTag));
      d.assert(!_.isEmpty(endTag));
      if (str === '') { return ''; }

      var indexStartTag = _.indexOfLast(str, startTag);
      var indexEndTag = _.indexOfLast(str, endTag);
      if ((indexStartTag !== -1)
      && (indexEndTag !== -1)
      && (indexStartTag < indexEndTag)) {
        str = _.startLastDelim(str, startTag) + startTag +
          endTag + _.endLastDelim(str, endTag);
      }
      return str;
    };

    _.test_deleteLastTagInner = function () {
      var d = stsLib.debug;
      d.check('abc<>ghi', _.deleteLastTagInner('abc<def>ghi', '<', '>'));
      d.check('abc<def>ghi<>mn', _.deleteLastTagInner('abc<def>ghi<jkl>mn', '<', '>'));
    };

    _.deleteLastTagOuter = function (str, startTag, endTag) {
      var d = stsLib.debug;
      var t = stsLib.type;
      d.assert((!t.isNullOrUndefined(str)) );
      d.assert(!_.isEmpty(startTag));
      d.assert(!_.isEmpty(endTag));
      if (str === '') { return ''; }

      var indexStartTag = _.indexOfLast(str, startTag);
      var indexEndTag = _.indexOfLast(str, endTag);
      if ((indexStartTag !== -1)
      && (indexEndTag !== -1)
      && (indexStartTag < indexEndTag)) {
        str = _.startLastDelim(str, startTag) +
          _.endLastDelim(str, endTag);
      }
      return str;
    };

    _.test_deleteLastTagOuter = function () {
      var d = stsLib.debug;
      d.check('abcghi', _.deleteLastTagOuter('abc<def>ghi', '<', '>'));
      d.check('abc<def>ghimn', _.deleteLastTagOuter('abc<def>ghi<jkl>mn', '<', '>'));
    };

    //--------------------------------------
    //◇deleteAllTagInner/TagOut
    //--------------------------------------
    _.deleteAllTag = function (str, startTag, endTag) {
      var result = str;
      do {
        str = result;
        result = _.deleteFirstTagOuter(str, startTag, endTag);
      } while (str !== result);
      return result;
    };

    _.test_deleteAllTag = function () {
      var d = stsLib.debug;
      d.check('abcghi', _.deleteAllTag('abc<def>ghi', '<', '>'));
      d.check('abcghimn', _.deleteAllTag('abc<def>ghi<jkl>mn', '<', '>'));
    };

    //--------------------------------------
    //◇Tag Inner/Outer
    //--------------------------------------

    //----------------------------------------
    //・最初の start,end の組み合わせのタグを含まない文字
    //----------------------------------------
    _.tagInnerFirst = function (str, startTag, endTag) {
      var d = stsLib.debug;
      var t = stsLib.type;
      d.assert((!t.isNullOrUndefined(str)) );
      d.assert(!_.isEmpty(startTag));
      d.assert(!_.isEmpty(endTag));
      if (str === '') { return ''; }

      var indexStartTag = _.indexOfFirst(str, startTag);
      var indexEndTag = _.indexOfFirst(str, endTag);
      if ((indexStartTag !== -1) && (indexEndTag !== -1)) {
        //startTag/endTagは存在する場合
        if (indexStartTag < indexEndTag) {
          return _.startFirstDelim(
            _.endFirstDelim(str, startTag), endTag);
        } else {
          //開始終了位置が逆の場合
          return '';
        }
      } else if (indexStartTag !== -1) {
        //startTagは存在する場合
        return _.endFirstDelim(str, startTag);
      } else if (indexEndTag !== -1) {
        //endTagは存在する場合
        return _.startFirstDelim(str, endTag);
      } else {
        //startTag/endTagどちらも存在しない場合
        return str;
      }
    };

    _.test_tagInnerFirst = function () {
      var d = stsLib.debug;
      d.check('456',  _.tagInnerFirst('000<123>456<789>000', '<123>', '<789>'), 'test01');
      d.check('456',  _.tagInnerFirst('<123>456<789>', '<123>', '<789>'), 'test02');
      d.check('456',  _.tagInnerFirst('000<123>456', '<123>', '<789>'), 'test03');
      d.check('456',  _.tagInnerFirst('456<789>000', '<123>', '<789>'), 'test04');
      d.check('456',  _.tagInnerFirst('456', '<123>', '<789>'), 'test05');
      d.check('',     _.tagInnerFirst('000<123><789>000', '<123>', '<789>'), 'test06');
      d.check('',  _.tagInnerFirst('000<123>456<789>000', '<789>', '<123>'), 'test07');

      var Text = '<123>123<789> <123>456<789> <123>789<789>';
      d.check('123',
        _.tagInnerFirst(Text, '<123>', '<789>'), 'test01');
      d.check('123<789> <123>456<789> <123>789<789>',
        _.tagInnerFirst(Text, '<123>', '<456>'), 'test02');
      d.check('<123>123',
        _.tagInnerFirst(Text, '<456>', '<789>'), 'test03');
      d.check('',
        _.tagInnerFirst(Text, '<456>', '<123>'), 'test04');
      d.check(' <123>456<789> <123>789<789>',
        _.tagInnerFirst(Text, '<789>', '<456>'), 'test05');
      d.check(Text,
        _.tagInnerFirst(Text, '<321>', '<456>'), 'test06');
    };

    //----------------------------------------
    //・最初の start,end の組み合わせのタグを含む文字
    //----------------------------------------
    _.tagOuterFirst = function (str, startTag, endTag) {
      var d = stsLib.debug;
      var t = stsLib.type;
      d.assert((!t.isNullOrUndefined(str)) );
      d.assert(!_.isEmpty(startTag));
      d.assert(!_.isEmpty(endTag));
      if (str === '') { return ''; }

      var indexStartTag = _.indexOfFirst(str, startTag);
      var indexEndTag = _.indexOfFirst(str, endTag);
      if ((indexStartTag !== -1) && (indexEndTag !== -1)) {
        //startTag/endTagは存在する場合
        if (indexStartTag < indexEndTag) {
          return _.startFirstDelim(
            startTag + _.endFirstDelim(str, startTag),
            endTag) + endTag;
        } else {
          //開始終了位置が逆の場合
          return '';
        }
      } else if (indexStartTag !== -1) {
        //startTagは存在する場合
        return startTag + _.endFirstDelim(str, startTag);
      } else if (indexEndTag !== -1) {
        //endTagは存在する場合
        return _.startFirstDelim(str, endTag) + endTag;
      } else {
        //startTag/endTagどちらも存在しない場合
        return str;
      }
    };

    _.test_tagOuterFirst = function () {
      var d = stsLib.debug;
      d.check('<123>456<789>',  _.tagOuterFirst(
        '000<123>456<789>000', '<123>', '<789>'), 'test01');
      d.check('<123>456<789>',  _.tagOuterFirst(
        '<123>456<789>', '<123>', '<789>'), 'test02');
      d.check('<123>456',       _.tagOuterFirst(
        '000<123>456', '<123>', '<789>'), 'test03');
      d.check('456<789>',       _.tagOuterFirst(
        '456<789>000', '<123>', '<789>'), 'test04');
      d.check('456',            _.tagOuterFirst(
        '456', '<123>', '<789>'), 'test05');
      d.check('<123><789>',     _.tagOuterFirst(
        '000<123><789>000', '<123>', '<789>'), 'test06');
      d.check('',  _.tagOuterFirst(
        '000<123>456<789>000', '<789>', '<123>'), 'test07');

      var Text = '<123>123<789> <123>456<789> <123>789<789>';
      d.check('<123>123<789>',
        _.tagOuterFirst(Text, '<123>', '<789>'), 'test01');
      d.check(Text,
        _.tagOuterFirst(Text, '<123>', '<456>'), 'test02');
      d.check('<123>123<789>',
        _.tagOuterFirst(Text, '<456>', '<789>'), 'test03');
      d.check('<123>',
        _.tagOuterFirst(Text, '<456>', '<123>'), 'test04');
      d.check('<789> <123>456<789> <123>789<789>',
        _.tagOuterFirst(Text, '<789>', '<456>'), 'test05');
      d.check(Text,
        _.tagOuterFirst(Text, '<321>', '<456>'), 'test06');
    };

    //----------------------------------------
    //・最後の start,end の組み合わせのタグを含まない文字
    //----------------------------------------
    _.tagInnerLast = function (str, startTag, endTag) {
      var d = stsLib.debug;
      var t = stsLib.type;
      d.assert((!t.isNullOrUndefined(str)) );
      d.assert(!_.isEmpty(startTag));
      d.assert(!_.isEmpty(endTag));
      if (str === '') { return ''; }

      var indexStartTag = _.indexOfLast(str, startTag);
      var indexEndTag = _.indexOfLast(str, endTag);
      if ((indexStartTag !== -1) && (indexEndTag !== -1)) {
        //startTag/endTagは存在する場合
        if (indexStartTag < indexEndTag) {
          return _.startLastDelim(
            _.endLastDelim(str, startTag), endTag);
        } else {
          //開始終了位置が逆の場合
          return '';
        }
      } else if (indexStartTag !== -1) {
        //startTagは存在する場合
        return _.endLastDelim(str, startTag);
      } else if (indexEndTag !== -1) {
        //endTagは存在する場合
        return _.startLastDelim(str, endTag);
      } else {
        //startTag/endTagどちらも存在しない場合
        return str;
      }
    };
    _.test_tagInnerLast = function () {
      var d = stsLib.debug;
      d.check('456',  _.tagInnerLast('000<123>456<789>000', '<123>', '<789>'), 'test01');
      d.check('456',  _.tagInnerLast('<123>456<789>', '<123>', '<789>'), 'test02');
      d.check('456',  _.tagInnerLast('000<123>456', '<123>', '<789>'), 'test03');
      d.check('456',  _.tagInnerLast('456<789>000', '<123>', '<789>'), 'test04');
      d.check('456',  _.tagInnerLast('456', '<123>', '<789>'), 'test05');
      d.check('',     _.tagInnerLast('000<123><789>000', '<123>', '<789>'), 'test06');
      d.check('',  _.tagInnerLast('000<123>456<789>000', '<789>', '<123>'), 'test07');

      var Text = '<123>123<789> <123>456<789> <123>789<789>';
      d.check('789',
        _.tagInnerLast(Text, '<123>', '<789>'), 'test01');
      d.check('789<789>',
        _.tagInnerLast(Text, '<123>', '<456>'), 'test02');
      d.check('<123>123<789> <123>456<789> <123>789',
        _.tagInnerLast(Text, '<456>', '<789>'), 'test03');
      d.check('<123>123<789> <123>456<789> ',
        _.tagInnerLast(Text, '<456>', '<123>'), 'test04');
      d.check('',
        _.tagInnerLast(Text, '<789>', '<456>'), 'test05');
      d.check(Text,
        _.tagInnerLast(Text, '<321>', '<456>'), 'test06');
    };

    //----------------------------------------
    //・最後の start,end の組み合わせのタグを含む文字
    //----------------------------------------
    _.tagOuterLast = function (str, startTag, endTag) {
      var d = stsLib.debug;
      var t = stsLib.type;
      d.assert((!t.isNullOrUndefined(str)) );
      d.assert(!_.isEmpty(startTag));
      d.assert(!_.isEmpty(endTag));
      if (str === '') { return ''; }

      var indexStartTag = _.indexOfLast(str, startTag);
      var indexEndTag = _.indexOfLast(str, endTag);
      if ((indexStartTag !== -1) && (indexEndTag !== -1)) {
        //startTag/endTagは存在する場合
        if (indexStartTag < indexEndTag) {
          return _.startLastDelim(
            startTag + _.endLastDelim(str, startTag),
            endTag) + endTag;
        } else {
          //開始終了位置が逆の場合
          return '';
        }
      } else if (indexStartTag !== -1) {
        //startTagは存在する場合
        return startTag + _.endLastDelim(str, startTag);
      } else if (indexEndTag !== -1) {
        //endTagは存在する場合
        return _.startLastDelim(str, endTag) + endTag;
      } else {
        //startTag/endTagどちらも存在しない場合
        return str;
      }
    };

    _.test_tagOuterLast = function () {
      var d = stsLib.debug;
      d.check('<123>456<789>',  _.tagOuterLast(
        '000<123>456<789>000', '<123>', '<789>'), 'test01');
      d.check('<123>456<789>',  _.tagOuterLast(
        '<123>456<789>', '<123>', '<789>'), 'test02');
      d.check('<123>456',       _.tagOuterLast(
        '000<123>456', '<123>', '<789>'), 'test03');
      d.check('456<789>',       _.tagOuterLast(
        '456<789>000', '<123>', '<789>'), 'test04');
      d.check('456',            _.tagOuterLast(
        '456', '<123>', '<789>'), 'test05');
      d.check('<123><789>',     _.tagOuterLast(
        '000<123><789>000', '<123>', '<789>'), 'test06');
      d.check('',  _.tagOuterLast(
        '000<123>456<789>000', '<789>', '<123>'), 'test07');

      var Text = '<123>123<789> <123>456<789> <123>789<789>';
      d.check('<123>789<789>',
        _.tagOuterLast(Text, '<123>', '<789>'), 'test01');
      d.check('<123>789<789>',
        _.tagOuterLast(Text, '<123>', '<456>'), 'test02');
      d.check(Text,
        _.tagOuterLast(Text, '<456>', '<789>'), 'test03');
      d.check('<123>123<789> <123>456<789> <123>',
        _.tagOuterLast(Text, '<456>', '<123>'), 'test04');
      d.check('<789>',
        _.tagOuterLast(Text, '<789>', '<456>'), 'test05');
      d.check(Text,
        _.tagOuterLast(Text, '<321>', '<456>'), 'test06');
    };

    //----------------------------------------
    //・タグで囲まれた文字を全て抽出する
    //----------------------------------------
    _.tagOuterAll = function (str, startTag, endTag) {
      var
        d = stsLib.debug,
        t = stsLib.type,
        indexStartTag,
        indexEndTag,
        result,
      varend;

      d.assert((!t.isNullOrUndefined(str)) );
      d.assert(!_.isEmpty(startTag));
      d.assert(!_.isEmpty(endTag));
      if (str === '') { return ''; }

      result = '';
      while (true) {
        indexStartTag = _.indexOfFirst(str, startTag);
        indexEndTag = _.indexOfFirst(str, endTag);
        if ((indexStartTag !== -1) && (indexEndTag !== -1)) {
          //startTag/endTagは存在する場合
          if (indexStartTag < indexEndTag) {
            result = result + _.startFirstDelim(
              startTag + _.endFirstDelim(str, startTag),
              endTag) + endTag;
          } else {
            //開始終了位置が逆の場合
            return '';
          }
          str = _.substrIndex(str, indexEndTag + endTag.length);
        } else if (indexStartTag !== -1) {
          //startTagのみ存在する場合
          return result + startTag + _.endFirstDelim(str, startTag);
        } else if (indexEndTag !== -1) {
          //endTagのみ存在する場合
          return result;
        } else {
          //startTag/endTagどちらも存在しない場合
          return result;
        }
      }
    };

    _.test_tagOuterAll = function () {
      var d = stsLib.debug;
      d.check('<def>', _.tagOuterAll('abc<def>ghi', '<', '>'));
      d.check('<def><jkl>', _.tagOuterAll('abc<def>ghi<jkl>mn', '<', '>'));
    };

    //----------------------------------------
    //◇置き換え
    //----------------------------------------

    //----------------------------------------
    //・replaceAll
    //----------------------------------------
    //  ・  文字列の繰り返し置換
    //----------------------------------------
    _.replaceAll = function (str, before, after) {
      return str.split(before).join(after);
    };

    _.test_replaceAll = function () {
      var d = stsLib.debug;
      d.check('AAABBBAAA', _.replaceAll('123BBB123', '123', 'AAA'));
      d.check('AAAABBBBBBBAAAA', 
        _.replaceAll('AAAAAAABBBBBBBAAAAAAA', 'AA', 'A'));
    };

  }());

  //----------------------------------------
  //◆文字列拡張メソッド
  //----------------------------------------
  //  ・拡張メソッドのように後方にメソッドを接続して
  //    動作させることができる
  //      var str = new stsLib.String('abc');
  //      str.isInclude('a');  //true
  //  ・new 無しでも動作するようにする仕組みも組み込んでいる
  //  ・stsLib.String の名前空間部分だけ記述が下記のように長い
  //----------------------------------------

  _.String = stsLib.String || function (value) {
    if (!(this instanceof stsLib.String)) {
      return new stsLib.String(value);
    }
    this.value = value;
  };
  (function () {
    var _ = stsLib.String;

    _.prototype.isEmpty = function () {
      return stsLib.string.isEmpty(this.value);
    };

    _.prototype.ifEmptyValue = function (emptyValue) {
      return stsLib.string.ifEmptyValue(this.value, emptyValue);
    };

    _.prototype.isInclude = function (search) {
      return stsLib.string.isInclude(this.value, search);
    };

    _.prototype.includeCount = function (search) {
      return stsLib.string.includeCount(this.value, search);
    };

    _.prototype.indexOfFirst = function (search, startIndex) {
      return stsLib.string.indexOfFirst(this.value, search, startIndex);
    };

    _.prototype.indexOfLast = function (search, startIndex) {
      return stsLib.string.indexOfLast(this.value, search, startIndex);
    };

    _.prototype.substrIndex = function (startIndex, endIndex) {
      return stsLib.string.substrIndex(this.value, startIndex, endIndex);
    };

    _.prototype.substrLength = function (startIndex, length) {
      return stsLib.string.substrLength(this.value, startIndex, length);
    };

    _.prototype.start = function (length) {
      return stsLib.string.start(this.value, length);
    };

    _.prototype.startsWith = function (search) {
      return stsLib.string.startsWith(this.value, search);
    };

    _.prototype.includeStart = function (search) {
      return stsLib.string.includeStart(this.value, search);
    };

    _.prototype.excludeStart = function (search) {
      return stsLib.string.excludeStart(this.value, search);
    };

    _.prototype.end = function (length) {
      return stsLib.string.end(this.value, length);
    };

    _.prototype.endsWith = function (search) {
      return stsLib.string.endsWith(this.value, search);
    };

    _.prototype.includeEnd = function (search) {
      return stsLib.string.includeEnd(this.value, search);
    };

    _.prototype.excludeEnd = function (search) {
      return stsLib.string.excludeEnd(this.value, search);
    };

    _.prototype.bothEndsWith = function (search) {
      return stsLib.string.bothEndsWith(this.value, search);
    };

    _.prototype.includeBothEnds = function (search) {
      return stsLib.string.includeBothEnds(this.value, search);
    };

    _.prototype.excludeBothEnds = function (search) {
      return stsLib.string.excludeBothEnds(this.value, search);
    };

    _.prototype.startFirstDelim = function (delimiter) {
      return stsLib.string.startFirstDelim(this.value, delimiter);
    };

    _.prototype.startLastDelim = function (delimiter) {
      return stsLib.string.startLastDelim(this.value, delimiter);
    };

    _.prototype.endFirstDelim = function (delimiter) {
      return stsLib.string.endFirstDelim(this.value, delimiter);
    };

    _.prototype.endLastDelim = function (delimiter) {
      return stsLib.string.endLastDelim(this.value, delimiter);
    };

    _.prototype.trimStart = function (trimStrArray) {
      return stsLib.string.trimStart(this.value, trimStrArray);
    };

    _.prototype.trimEnd = function (trimStrArray) {
      return stsLib.string.trimEnd(this.value, trimStrArray);
    };

    _.prototype.trimBothEnds = function (trimStrArray) {
      return stsLib.string.trimBothEnds(this.value, trimStrArray);
    };

    _.prototype.trim = function () {
      return stsLib.string.trim(this.value);
    };

    _.prototype.deleteFirst = function (search) {
      return stsLib.string.deleteFirst(this.value, search);
    };

    _.prototype.deleteLast = function (search) {
      return stsLib.string.deleteLast(this.value, search);
    };

    _.prototype.deleteFirstTagInner = function (startTag, endTag) {
      return stsLib.string.deleteFirstTagInner(this.value, startTag, endTag);
    };

    _.prototype.deleteFirstTagOuter = function (startTag, endTag) {
      return stsLib.string.deleteFirstTagOuter(this.value, startTag, endTag);
    };

    _.prototype.deleteLastTagInner = function (startTag, endTag) {
      return stsLib.string.deleteLastTagInner(this.value, startTag, endTag);
    };

    _.prototype.deleteLastTagOuter = function (startTag, endTag) {
      return stsLib.string.deleteLastTagOuter(this.value, startTag, endTag);
    };

    _.prototype.deleteAllTag = function (startTag, endTag) {
      return stsLib.string.deleteAllTag(this.value, startTag, endTag);
    };

    _.prototype.tagInnerFirst = function (startTag, endTag) {
      return stsLib.string.tagInnerFirst(this.value, startTag, endTag);
    };

    _.prototype.tagOuterFirst = function (startTag, endTag) {
      return stsLib.string.tagOuterFirst(this.value, startTag, endTag);
    };

    _.prototype.tagInnerLast = function (startTag, endTag) {
      return stsLib.string.tagInnerLast(this.value, startTag, endTag);
    };

    _.prototype.tagOuterLast = function (startTag, endTag) {
      return stsLib.string.tagOuterLast(this.value, startTag, endTag);
    };

    _.prototype.tagOuterAll = function (startTag, endTag) {
      return stsLib.string.tagOuterAll(this.value, startTag, endTag);
    };

    _.prototype.replaceAll = function (before, after) {
      return stsLib.string.replaceAll(this.value, before, after);
    };

    _.prototype.test = function () {
      var d = stsLib.debug;

      //拡張メソッド的な使い方
      var str1 = new stsLib.String('abc');
      d.check(true, str1.isInclude('a'));
      d.check(true, str1.isInclude('b'));
      d.check(true, str1.isInclude('c'));
      d.check(false,str1.isInclude('d'));

      //newしなくてもよい
      var str2 = stsLib.String('abc');
      d.check(true, str2.isInclude('a'));
      d.check(true, str2.isInclude('b'));
      d.check(true, str2.isInclude('c'));
      d.check(false,str2.isInclude('d'));
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

  _.StringEx = stsLib.StringEx || function (value) {
    if (!(this instanceof stsLib.StringEx)) {
      return new stsLib.StringEx(value);
    }
    _.String.call(this, value);
  };
  stsLib.inherits(_.StringEx, _.String);

  (function () {
    var _ = stsLib.StringEx;
  
    _.prototype.isNotInclude = function (search) {
      return !stsLib.string.isInclude(this.value, search);
    }
  
    _.prototype.test = function () {
      var d = stsLib.debug;
  
      //継承しているので継承元のメソッドが使える
      var str3 = new stsLib.StringEx('abc');
      d.check(false,str3.isNotInclude('a'));
      d.check(false,str3.isNotInclude('b'));
      d.check(false,str3.isNotInclude('c'));
      d.check(true, str3.isNotInclude('d'));
      d.check(true, str3.isInclude('a'));
      d.check(true, str3.isInclude('b'));
      d.check(true, str3.isInclude('c'));
      d.check(false,str3.isInclude('d'));
  
      //継承しても new しなくてもよい
      var str4 = new stsLib.StringEx('abc');
      d.check(false,str4.isNotInclude('a'));
      d.check(false,str4.isNotInclude('b'));
      d.check(false,str4.isNotInclude('c'));
      d.check(true, str4.isNotInclude('d'));
      d.check(true, str4.isInclude('a'));
      d.check(true, str4.isInclude('b'));
      d.check(true, str4.isInclude('c'));
      d.check(false,str4.isInclude('d'));

      var str5 = new stsLib.String('abc');
      //d.check(false,str5.isNotInclude('a'));
      //str5にはisNotIncludeメソッドはないために
      //これはエラーになる

      d.check(true,  str3 instanceof stsLib.String);
      d.check(true,  str3 instanceof stsLib.StringEx);
      d.check(false, str3.constructor === stsLib.String);
      d.check(true,  str3.constructor === stsLib.StringEx);

      d.check(true,  str4 instanceof stsLib.String);
      d.check(true,  str4 instanceof stsLib.StringEx);
      d.check(false, str4.constructor === stsLib.String);
      d.check(true,  str4.constructor === stsLib.StringEx);

      d.check(true,  str5 instanceof stsLib.String);
      d.check(false, str5 instanceof stsLib.StringEx);
      d.check(true,  str5.constructor === stsLib.String);
      d.check(false, str5.constructor === stsLib.StringEx);

    };
  
  }());

  //----------------------------------------
  //◆日付時刻処理
  //----------------------------------------
  _.datetime = stsLib.datetime || {};
  (function () {
    var _ = stsLib.datetime;

    //----------------------------------------
    //◆日付時刻処理
    //----------------------------------------
    //文字列を後方から文字数指定で取得する
    _.lastStringCount = function (value, count) {
      return value.substr(value.length - count, count);
    };

    _.format_yyyy_mm_dd = function (value, delimiter){
      var s = stsLib.string;
      return value.getFullYear() +
        delimiter +
        s.end('0' + (value.getMonth()+1), 2) +
        delimiter +
        s.end('0' + value.getDate(), 2);
    };

    _.format_hh_mm_dd = function (value, delimiter){
      var s = stsLib.string;
      return value.getHours() +
        delimiter +
        s.end('0' + value.getMinutes(), 2) +
        delimiter +
        s.end('0' + value.getSeconds(), 2);
    };

    //年齢
    _.getAgeYearMonthDay = function (todayDate, birthDate) {

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
    _.getAgeMonthDay = function (todayDate, birthDate) {

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

    _.getAgeDay = function (todayDate, birthDate) {

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

    _.dayCount = function (todayDate, birthDate) {
      var diff = todayDate - birthDate;
      diff = diff / ( 24 * 60 * 60 * 1000);
      return Math.floor(diff);
    };

    _.hoursCount = function (todayDate, birthDate) {
      var diff = todayDate - birthDate;
      diff = diff / ( 60 * 60 * 1000);
      return Math.floor(diff);
    };

    _.minutesCount = function (todayDate, birthDate) {
      var diff = todayDate - birthDate;
      diff = diff / ( 60 * 1000);
      return Math.floor(diff);
    };

    _.secondsCount = function (todayDate, birthDate) {
      var diff = todayDate - birthDate;
      diff = diff / (1000);
      return Math.floor(diff);
    };

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
    ------------  */
    _.getMonthEndDay = function (year, month) {
      var dt = new Date(year, month, 0);
      return dt.getDate();
    };

  }());

  //----------------------------------------
  //◆ファイルフォルダパス処理
  //----------------------------------------
  _.path = stsLib.path || {};
  (function () {
    var _ = stsLib.path;

    _.getFileName = function (fileName) {
      return fileName.substring(fileName.lastIndexOf('/')+1,fileName.length);
    };

    _.test_getFileName = function () {
      var d = stsLib.debug;
      d.check('a.txt', _.getFileName('file://test/test/a.txt'));
    };

    //----------------------------------------
    //・終端にパス区切りを追加する関数
    //----------------------------------------
    _.includeLastPathDelim = function (path) {
      var result = '';
      if (path != '') {
        result = stsLib.string.includeEnd(path, '\\');
      }
      return result;
    };

    //----------------------------------------
    //・ピリオドを含んだ拡張子を取得する
    //----------------------------------------
    _.getExtensionIncludePeriod = function (path) {
      var
        s = stsLib.string,
        result = '',
      varend;
      result = s.endLastDelim(path, '.');
      if (result == path) {
        result = '';
      } else {
        result = s.includeStart(result, '.');
      }
      return result;
    };

  }());

  //----------------------------------------
  //◆動作確認
  //----------------------------------------
  _.test = stsLib.test || {};
  (function () {
    var _ = stsLib.test;

    _.test_stslib_core = function () {

      stsLib.debug.test_check();
      var t = stsLib.type;

      t.test_isNullOrUndefined();
      t.test_isBoolean();
      t.test_isNumber();
      t.test_isInt();

      var s = stsLib.string;
      s.test_isInclude();
      s.test_includeCount();
      s.test_indexOfFirst();
      s.test_indexOfLast();
      s.test_substrIndex();
      s.test_substrLength();
      s.test_start();
      s.test_startsWith();
      s.test_includeStart();
      s.test_excludeStart();
      s.test_end();
      s.test_endsWith();
      s.test_includeEnd();
      s.test_excludeEnd();
      s.test_startFirstDelim();
      s.test_startLastDelim();
      s.test_endFirstDelim();
      s.test_endLastDelim();

      var str = new stsLib.String('abc');
      str.test();

      //WSH 非対応なので実行させない
      var strEx = new stsLib.StringEx('123');
      strEx.test();

      _.test_equalOperator();

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

      s.test_replaceAll();

      var a = stsLib.array;
      a.test_equal();
      a.test_arrayToString();
      a.test_stringToArray();

      a.test_equal();
      a.test_arrayIndexOfArray();

    //  test_TagDelete();
    //  test_deleteFirstTagInner();
    //  test_deleteFirstTagOuter();

      var angle = stsLib.angle;
      angle.test_angleRelative();
      angle.test_degreeToRadian();

      var path = stsLib.path;
      path.test_getFileName();

      var d = stsLib.debug;
      d.test_checkExc();

      alert('finish test テスト終了');
      //エンコード確認のため、日本語を含めている
      //Shift_JISのWSHからUTF-8の呼び出しが
      //正しく行えているかどうかを確認できる
    };

    //----------------------------------------
    //・イコール演算子の挙動調査
    //----------------------------------------
    _.test_equalOperator = function () {
      var d = stsLib.debug;
      var value;
      value = true;
      d.check(true , value==true        ,'v01-01');
      //↓boolean型とstring型は比較一致不可能
      d.check(false, value=='true'      ,'v01-02');
      //↓『+''』を付属して文字列化すれば一致確認OK
      d.check(true , value+''=='true'   ,'v01-03');
      //↓文字列に『!!』を付属するとtrueが返される
      d.check(true , value==!!'true'    ,'v01-04');
      d.check(true , !!value==!!'true'  ,'v01-05');
      //↓boolean型側に『!!』を付属させてもNG
      d.check(false, !!value=='true'    ,'v01-06');
      d.check(true , !!value==true      ,'v01-06-02');

      d.check(false, value==false       ,'v01-07');
      d.check(false, value=='false'     ,'v01-08');
      d.check(false, value+''=='false'  ,'v01-09');
      //↓文字列に『!!』を付属するとtrueが返されるので
      //  判定はできない
      d.check(true , value==!!'false'   ,'v01-10');
      d.check(true , !!value==!!'false' ,'v01-11');
      d.check(false, !!value=='false'   ,'v01-12');
      d.check(false, !!value==false     ,'v01-13');

      value = false;
      d.check(false , value==true       ,'v02-01');
      d.check(false, value=='true'      ,'v02-02');
      d.check(false, value+''=='true'   ,'v02-03');
      d.check(false, value==!!'true'    ,'v02-04');
      d.check(false, !!value==!!'true'  ,'v02-05');
      d.check(false, !!value=='true'    ,'v02-06');
      d.check(false, !!value==true      ,'v02-06-02');

      d.check(true , value==false       ,'v02-07');
      //↓boolean型とstring型は比較一致不可能
      d.check(false, value=='false'     ,'v02-08');
      //↓『+''』を付属して文字列化すれば一致確認OK
      d.check(true , value+''=='false'  ,'v02-09');
      //↓文字列に『!!』を付属するとtrueが返されるので
      //  判定はできない
      d.check(false, value==!!'false'   ,'v02-10');
      d.check(false, !!value==!!'false' ,'v02-11');
      d.check(false, !!value=='false'   ,'v02-12');
      d.check(true , !!value==false     ,'v02-13');

      //というわけで
      //falseの場合は[!!値]では判定できないので
      //!!でキャストできるという噂は嘘

      var s;
      s = 'true';
      d.check(true , s=='true'          ,'V03-01');
      //↓boolean型とstring型は比較一致不可能
      d.check(false, s==true            ,'V03-01');
      //↓文字列に『!!』を付属するとtrueが返されるので
      //  合っているようにみえるが
      d.check(true , !!s==true          ,'V03-02');

      d.check(false, s==false           ,'V03-03');
      //↓文字列に『!!』を付属するとtrueが返されるので
      //  合っているようにみえるが
      d.check(false, !!s==false         ,'V03-04');

      s = 'false';
      d.check(false, s=='true'          ,'V04-01');
      d.check(false, s==true            ,'V04-01');
      //↓文字列に『!!』を付属するとtrueが返されるので
      //  falseの場合でもtrueと判定してしまう
      d.check(true , !!s==true          ,'V04-02');

      d.check(false, s==false           ,'V04-03');
      //↓文字列に『!!』を付属するとtrueが返されるので
      //  falseの場合でも一致しない
      d.check(false, !!s==false         ,'V04-04');
    };

  }());

}(stsLib, this));

if (typeof module !== 'undefined') {
  module.exports = stsLib;
}

/*----------------------------------------
■履歴
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
    trimFirstStr
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
    tagInnerFirst/tagOuterFirst
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
・  assert 追加
・  arrayEqualArray/arrayIndexOfArray 追加
◇  ver 2017/04/18
・  startTagDelete/endTagDelete 追加
◇  ver 2017/04/19
・  deleteTagInnerText/deleteFirstTagOuter 追加
◇  ver 2017/04/20
・  stslib_win_wsh.js に shellFileOpen 移動
◇  ver 2017/04/22
・  degreeToRadian/radianToDegree 追加
・  angleRelative 追加
・  stslib_web.js に intervalLoop処理を追加
◇  ver 2017/04/25
・  名前空間を導入。関数群の名前がグローバル汚染を引き起こさないようにした。
・  全体的に名前空間に入るようにリファクタリング対応中
    isInclude/indexOfFirst/indexOfLast を追加
◇  ver 2017/04/26
・  Array.isArray を WSH 対応のために isArray で独自実装
・  stslib_win_wsh.js に string_LoadFromFile/getEncodingTypeName 追加
◇  ver 2017/04/27
・  インデントを2に変更
・  substrIndex/substrLength 追加
・  start/end 追加
◇  ver 2017/04/30
・  名前空間に移行するリファクタリング中
◇  ver 2017/05/13
・  名前空間のリファクタリング完了。
◇  ver 2017/05/21
・  string系のメソッドのstsLib.stringへの移行
◇  ver 2017/05/23
・  日付関係、ファイルパス関係を
    stsLibの名前空間に移動
・  replaceAllを修正
◇  ver 2017/05/24
・  tagOuterAll 追加
◇  ver 2017/05/25
・  stsLib.Stringの拡張メソッド形式の部分を
    stsLib.stringの全てのメソッドをから
    作成した。
◇  ver 2017/05/28
・  継承の仕組みを
      stsLib.StringEx.prototype = new stsLib.String();
      stsLib.StringEx.prototype.constructor = stsLib.StringEx;
    から
      inherits関数(Google Closure Library)に変更
    テストも追加した
・  benchMarkを追加
・  stslib_win_wsh.js メッセージ表示機能追加
◇  ver 2017/05/30
・  stsLib名前空間でstsLib自体を定義して
    グローバル変数を見に行かないようにした
・  .StringExを.Stringのvalueを呼び出すようにした
◇  ver 2017/05/31
・  benchMarkを修正
・  checkExcを追加
//----------------------------------------*/
