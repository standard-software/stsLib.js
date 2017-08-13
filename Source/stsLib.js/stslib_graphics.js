/*----------------------------------------
stsLib.js
Standard Software Library JavaScript
----------------------------------------
ModuleName:     Graphics Module
FileName:       stslib_graphics.js
----------------------------------------
License:        MIT License
All Right Reserved:
    Name:       Standard Software
    URL:        https://www.facebook.com/stndardsoftware/
--------------------------------------
Version:        2017/08/13
//----------------------------------------*/

//----------------------------------------
//・require関数
//----------------------------------------
//  ・  require/moduleの無い環境に対応
//----------------------------------------
if (typeof module === 'undefined') {

  var requireList = requireList || {};
  var require = function (funcName) {
    for ( var item in requireList) {
      if (funcName === item) {
        if (requireList.hasOwnProperty(item)) {
          return requireList[item];
        }
      }
    }
    return undefined;
  };
}

//----------------------------------------
//■全体を囲う無名関数
//----------------------------------------
(function () {

  //----------------------------------------
  //・require実行
  //----------------------------------------
  if (typeof module === 'undefined') {
    var stsLib = require('stsLib')
  } else {
    var stsLib = require('./stsLib_core.js')
  }

  //----------------------------------------
  //■stsLib名前空間
  //----------------------------------------
  var stsLib = stsLib || {};
  (function (stsLib, global) {
    'use strict';
    var _ = stsLib;

    //----------------------------------------
    //◆型 確認/変換 処理
    //----------------------------------------
    _.type = stsLib.type || {};
    (function () {
      var _ = stsLib.type;

      //----------------------------------------
      //◇isPoint
      //----------------------------------------
      //  ・プロパティx / y が存在するかどうかで判定する
      //  ・isPointsは
      //    可変引数の全てが関数かどうかを確認する
      //----------------------------------------
      _.isPoint = function (point) {
        return ((('x' in point) && t.isNumber(point.x))
          && (('y' in point) && (t.isNumber(point.y))))
      };

      _.isPoints = function (value) {
        return _.isTypeCheck(_.isPoint,
          a.expand2Dimension(a.fromArgs(arguments)));
      };

      _.isNotPoints = function (value) {
        return _.isTypeCheck(function (v) {
          return !(_.isPoint(v));
        }, a.expand2Dimension(a.fromArgs(arguments)));
      };

      _.test_isPoint = function () {
        d.check(true,   _.isPoint({x:1, y:2}));
        d.check(false,  _.isPoint({x:'1', y:2}));
        d.check(true,   _.isPoints({x:1, y:2}, {x:3, y:4}));
        d.check(false,  _.isPoints({x:1, y:2}, {x:3, y:4}, {}));
      };

      //----------------------------------------
      //◇isVector
      //----------------------------------------
      //  ・プロパティ start / end が存在するかどうか
      //    それぞれが point かどうかで判断する
      //  ・isVectorsは
      //    可変引数の全てが関数かどうかを確認する
      //----------------------------------------
      _.isVector = function (vector) {
        return ((('start' in vector) && t.isPoint(vector.start))
          && (('end' in vector) && (t.isPoint(vector.end))))
      };

      _.isVectors = function (value) {
        return _.isTypeCheck(_.isVector,
          a.expand2Dimension(a.fromArgs(arguments)));
      };

      _.isNotVectors = function (value) {
        return _.isTypeCheck(function (v) {
          return !(_.isVector(v));
        }, a.expand2Dimension(a.fromArgs(arguments)));
      };

      _.test_isVector = function () {
        d.check(true, _.isVector(
          stsLib.vector.Vector({x:0, y:0}, {x:1, y:1})));
      };


    }());

    //----------------------------------------
    //◆Point
    //----------------------------------------

    _.point = stsLib.point || {};
    (function () {
      var _ = stsLib.point;

    //----------------------------------------
    //・Pointコンストラクタ
    //----------------------------------------
      _.Point = function (x, y) {
        if (!(this instanceof stsLib.point.Point)) {
          return new stsLib.point.Point(x, y);
        }
        this.x = x;
        this.y = y;
      };
      (function () {
        var _ = stsLib.point.Point;

        //----------------------------------------
        //・移動
        //----------------------------------------
        _.prototype.move = function (moveX, moveY) {
          this.x += moveX;
          this.y += moveY;
          return this;
        };
      }());

    }()); //point

    //----------------------------------------
    //◆Vector
    //----------------------------------------

    _.vector = stsLib.vector || {};
    (function () {
      var _ = stsLib.vector;

      //----------------------------------------
      //・Vectorコンストラクタ
      //----------------------------------------
      _.Vector = function (pointStart, pointEnd) {
        if (!(this instanceof stsLib.vector.Vector)) {
          return new stsLib.vector.Vector(pointStart, pointEnd);
        }
        d.assert(t.isPoints(pointStart, pointEnd));
        this.start = stsLib.point.Point(pointStart.x, pointStart.y);
        this.end = stsLib.point.Point(pointEnd.x, pointEnd.y);
      };
      (function () {
        var _ = stsLib.vector.Vector;

        //----------------------------------------
        //・Vector 長さ
        //----------------------------------------
        _.prototype.length = function () {
          var xDiff = this.end.x - this.start.x;
          var yDiff = this.end.y - this.start.y;
          return Math.pow(Math.pow(xDiff, 2) + Math.pow(yDiff, 2), 0.5);
        };

        stsLib.vector.test_vector_length = function () {
          var v1 = stsLib.vector.Vector({x:0, y:0}, {x:1, y:1});
          d.check(Math.pow(2, 0.5), v1.length());
          var v2 = stsLib.vector.Vector({x:0, y:0}, {x:3, y:4});
          d.check(5, v2.length());
        };

        //----------------------------------------
        //・開始位置移動
        //----------------------------------------
        //  ・vectorの原点が移動して、終点も移動する
        //    vectorの方向は変わらない
        //----------------------------------------
        _.prototype.setStart = function (point) {
          d.assert(t.isPoint(point));
          var xDiff = this.end.x - this.start.x;
          var yDiff = this.end.y - this.start.y;
          this.start.x = point.x;
          this.start.y = point.y; 
          this.end.x = this.start.x + xDiff;
          this.end.y = this.start.y + yDiff;
          return this;
        };

        stsLib.vector.test_vector_setStart = function () {
          var v1 = stsLib.vector.Vector({x:1, y:1}, {x:3, y:4});
          v1.setStart({x: 0, y:0});
          d.check(0, v1.start.x);
          d.check(0, v1.start.y);
          d.check(2, v1.end.x);
          d.check(3, v1.end.y);
        };

        //----------------------------------------
        //・Vector加算
        //----------------------------------------
        //  ・vectorの終点が加算された結果になる
        //----------------------------------------
        _.prototype.add = function (vector) {
          d.assert(t.isVector(vector));
          var xDiff = vector.end.x - vector.start.x;
          var yDiff = vector.end.y - vector.start.y;
          this.end.x = this.end.x + xDiff;
          this.end.y = this.end.y + yDiff;
          return this;
        };

        stsLib.vector.test_vector_add = function () {
          var v1 = stsLib.vector.Vector({x:1, y:1}, {x:3, y:4});
          var v2 = stsLib.vector.Vector({x:2, y:2}, {x:5, y:6});
          v1.add(v2);
          d.check(1, v1.start.x);
          d.check(1, v1.start.y);
          d.check(6, v1.end.x);
          d.check(8, v1.end.y);

          d.check(2, v2.start.x);
          d.check(2, v2.start.y);
          d.check(5, v2.end.x);
          d.check(6, v2.end.y); //v2には影響なし
        };

        //----------------------------------------
        //・Vector 正規化 (長さを設定する)
        //----------------------------------------
        _.prototype.normalize = function (len) {
          len = t.ifNullOrUndefinedValue(len, 1);
          var originalLength = this.length();
          if (originalLength === 0) {
            return this;
          }
          var xDiff = this.end.x - this.start.x;
          var yDiff = this.end.y - this.start.y;
          this.end.x = this.start.x + (xDiff * len / originalLength);
          this.end.y = this.start.y + (yDiff * len / originalLength);
          return this;
        };

        stsLib.vector.test_vector_normalize = function () {
          var v1 = stsLib.vector.Vector({x:0, y:0}, {x:3, y:4});
          v1.normalize(10);
          d.check(0, v1.start.x);
          d.check(0, v1.start.y);
          d.check(6, v1.end.x);
          d.check(8, v1.end.y);
        };


        //----------------------------------------
        //・逆ベクトル
        //----------------------------------------
        _.prototype.inverse = function () {
          var xBuff = this.start.x;
          var yBuff = this.start.y;
          this.start.x = this.end.x;
          this.start.y = this.end.y;
          this.end.x = xBuff;
          this.end.y = yBuff;
          return this;
        };

        stsLib.vector.test_vector_inverse = function () {
          var v1 = stsLib.vector.Vector({x:0, y:0}, {x:3, y:4});
          v1.inverse();
          d.check(3, v1.start.x);
          d.check(4, v1.start.y);
          d.check(0, v1.end.x);
          d.check(0, v1.end.y);
        };

        //----------------------------------------
        //・法線ベクトル
        //----------------------------------------
        //  ・右に90度傾いた方向のベクトルになる
        //----------------------------------------
        _.prototype.normal = function () {
          var xDiff = this.end.x - this.start.x;
          var yDiff = this.end.y - this.start.y;
          this.end.x = this.start.x + yDiff;
          this.end.y = this.start.y - xDiff;
          return this;
        };

        stsLib.vector.test_vector_normal = function () {
          var v1 = stsLib.vector.Vector({x:0, y:0}, {x:3, y:4});
          v1.normal();
          d.check(0, v1.start.x);
          d.check(0, v1.start.y);
          d.check(4, v1.end.x);
          d.check(-3, v1.end.y);
        };

        //----------------------------------------
        //・平行移動
        //----------------------------------------
        //  ・正の値なら法線ベクトル方向(右90度)に
        //    負の値なら逆法線ベクトル方向に移動
        //----------------------------------------
        _.prototype.moveParallel = function (value) {
          if (t.isNullOrUndefined(value) || (value === 0)) {
            return this;
          }
          var endBuff = stsLib.point.Point(this.end.x, this.end.y);
          this.normal().normalize(value);
          var newStart = stsLib.point.Point(this.end.x, this.end.y);
          this.setStart(endBuff);
          var newEnd = stsLib.point.Point(this.end.x, this.end.y);
          this.start = newStart;
          this.end = newEnd;
          return this;
        };

        stsLib.vector.test_vector_moveParallels = function () {
          var v1 = stsLib.vector.Vector({x:1, y:1}, {x:4, y:5});
          v1.moveParallel(5);
          d.check(5,  v1.start.x);
          d.check(-2, v1.start.y);
          d.check(8,  v1.end.x);
          d.check(2,  v1.end.y);
        };

      }());

    }()); //vector


    //----------------------------------------
    //◆動作確認
    //----------------------------------------
    _.test = stsLib.test || {};
    (function () {
      var _ = stsLib.test;

      _.test_stslib_graphics = function () {

        t.test_isPoint();
        t.test_isVector();

        var v = stsLib.vector;
        v.test_vector_length();
        v.test_vector_setStart();
        v.test_vector_add();
        v.test_vector_normalize();
        v.test_vector_inverse();
        v.test_vector_normal();
        v.test_vector_moveParallels();

        alert('finish stslib_graphics_test テスト終了');

      };  //test_stslib_core

    }()); //_.test

    //----------------------------------------
    //◆省略呼び出し
    //----------------------------------------
    var t = stsLib.type;
    var d = stsLib.debug;
    var c = stsLib.compare;
    var a = stsLib.array;
    var n = stsLib.number;
    var s = stsLib.string;

  }(stsLib, this));   //stsLib

  if (typeof module === 'undefined') {
    requireList['stsLib'] = stsLib;
  } else {
    module.exports = stsLib;
  }

}());   //(function () {

