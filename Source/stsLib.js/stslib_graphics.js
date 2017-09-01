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
Version:        2017/08/16
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
      //  ・Pointを継承しているかどうかで判断する
      //  ・isPointsは
      //    可変引数の全てが関数かどうかを確認する
      //----------------------------------------
      _.isPoint = function (point) {
        return (point instanceof p.Point);
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
        d.check(true,   _.isPoint(p.Point(1,2)));
        d.check(false,  _.isPoint({x:1, y:2}));
        d.check(true,   _.isPoints(p.Point(1,2),p.Point(3,4)));
        d.check(false,  _.isPoints(p.Point(1,2), {x:3, y:4}, {}));
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
        return (vector instanceof v.Vector);
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
          v.Vector(p.Point(0,0), p.Point(1,1))));
      };

      //----------------------------------------
      //◇isRect
      //----------------------------------------
      //  ・Rectから継承されているかどうかで判断する
      //  ・isRectsは
      //    可変引数の全てが関数かどうかを確認する
      //----------------------------------------
      _.isRect = function (rect) {
        return (rect instanceof r.Rect);
      };

      // _.isPoints = function (value) {
      //   return _.isTypeCheck(_.isPoint,
      //     a.expand2Dimension(a.fromArgs(arguments)));
      // };

      // _.isNotPoints = function (value) {
      //   return _.isTypeCheck(function (v) {
      //     return !(_.isPoint(v));
      //   }, a.expand2Dimension(a.fromArgs(arguments)));
      // };

      // _.test_isPoint = function () {
      //   d.check(true,   _.isPoint({x:1, y:2}));
      //   d.check(false,  _.isPoint({x:'1', y:2}));
      //   d.check(true,   _.isPoints({x:1, y:2}, {x:3, y:4}));
      //   d.check(false,  _.isPoints({x:1, y:2}, {x:3, y:4}, {}));
      // };

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
        d.assert(t.isNumbers(x,y));
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

        //----------------------------------------
        //◇範囲チェック
        //----------------------------------------
        //  ・parentRectも正規化される
        //----------------------------------------

        _.prototype.inRect = function (parentRect) {
          d.assert(t.isRect(parentRect));

          parentRect.normalize();
          return (
            n.inRange(this.x, parentRect.left, parentRect.right)
            && n.inRange(this.y, parentRect.top, parentRect.bottom)
          );
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
      _.Vector = function (point) {
        if (!(this instanceof stsLib.vector.Vector)) {
          return new stsLib.vector.Vector(arguments[0], arguments[1]);
        }
        d.assert(t.isPoint(arguments[0]));
        if (t.isNullOrUndefined(arguments[1])) {
          this.start = p.Point(0, 0);
          this.end = p.Point(point.x, point.y);
        } else {
          d.assert(t.isPoint(arguments[1]));
          this.start = p.Point(point.x, point.y);
          this.end = p.Point(arguments[1].x, arguments[1].y);
        }
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
          var v1 = v.Vector(p.Point(0,0), p.Point(1,1));
          d.check(Math.pow(2, 0.5), v1.length());
          var v2 = v.Vector(p.Point(0,0), p.Point(3,4));
          d.check(5, v2.length());

          var v1 = v.Vector(p.Point(1,1));
          d.check(Math.pow(2, 0.5), v1.length());
          var v2 = v.Vector(p.Point(3,4));
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
          var v1 = v.Vector(p.Point(1,1), p.Point(3,4));
          v1.setStart(p.Point(0,0));
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
          var v1 = v.Vector(p.Point(1,1), p.Point(3,4));
          var v2 = v.Vector(p.Point(2,2), p.Point(5,6));
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
          var v1 = v.Vector(p.Point(0,0), p.Point(3,4));
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
          var v1 = v.Vector(p.Point(0,0), p.Point(3,4));
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
        _.prototype.normalRight = function () {
          var xDiff = this.end.x - this.start.x;
          var yDiff = this.end.y - this.start.y;
          this.end.x = this.start.x + yDiff;
          this.end.y = this.start.y - xDiff;
          return this;
        };

        stsLib.vector.test_vector_normalRight = function () {
          var v1 = v.Vector(p.Point(0,0), p.Point(3,4));
          v1.normalRight();
          d.check(0, v1.start.x);
          d.check(0, v1.start.y);
          d.check(4, v1.end.x);
          d.check(-3, v1.end.y);
        };

        //----------------------------------------
        //・法線ベクトル
        //----------------------------------------
        //  ・左に90度傾いた方向のベクトルになる
        //----------------------------------------
        _.prototype.normalLeft = function () {
          var xDiff = this.end.x - this.start.x;
          var yDiff = this.end.y - this.start.y;
          this.end.x = this.start.x - yDiff;
          this.end.y = this.start.y + xDiff;
          return this;
        };

        stsLib.vector.test_vector_normalLeft = function () {
          var v1 = v.Vector(p.Point(0,0), p.Point(3,4));
          v1.normalLeft();
          d.check(0, v1.start.x);
          d.check(0, v1.start.y);
          d.check(-4, v1.end.x);
          d.check( 3, v1.end.y);
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
          this.normalRight().normalize(value);
          var newStart = stsLib.point.Point(this.end.x, this.end.y);
          this.setStart(endBuff);
          var newEnd = stsLib.point.Point(this.end.x, this.end.y);
          this.start = newStart;
          this.end = newEnd;
          return this;
        };

        stsLib.vector.test_vector_moveParallels = function () {
          var v1 = v.Vector(p.Point(1,1), p.Point(4,5));
          v1.moveParallel(5);
          d.check(5,  v1.start.x);
          d.check(-2, v1.start.y);
          d.check(8,  v1.end.x);
          d.check(2,  v1.end.y);
        };

      }());

    }()); //vector

    //----------------------------------------
    //◆Rect
    //----------------------------------------

    _.rect = stsLib.rect || {};
    (function () {
      var _ = stsLib.rect;

      //----------------------------------------
      //・Rectコンストラクタ
      //----------------------------------------
      _.Rect = function (point1, point2) {
        if (!(this instanceof stsLib.rect.Rect)) {
          return new stsLib.rect.Rect(point1, point2);
        }
        d.assert(t.isPoints(point1, point2));
        this.top    = Math.min(point1.y, point2.y);
        this.left   = Math.min(point1.x, point2.x);
        this.bottom = Math.max(point1.y, point2.y);
        this.right  = Math.max(point1.x, point2.x);
      };

      _.test_Rect = function () {
        var r1 = r.Rect(p.Point(2,2), p.Point(4,6));
        d.check(2,  r1.top);
        d.check(2,  r1.left);
        d.check(6,  r1.bottom);
        d.check(4,  r1.right);
      };

      (function () {
        var _ = stsLib.rect.Rect;

        //----------------------------------------
        //・正規化
        //----------------------------------------
        //  ・left < right と top < bottom を正しくする
        //----------------------------------------
        _.prototype.normalize = function () {
          var val;
          if (this.bottom < this.top) {
            val = this.top;
            this.top = this.bottom;
            this.bottom = this.top;
          }
          if (this.right < this.left) {
            val = this.left;
            this.left = this.right;
            this.right = this.left;
          }
          return this;
        };

        //----------------------------------------
        //◇幅/高さ
        //----------------------------------------
        _.prototype.width = function () {
          return Math.abs(this.right - this.left);
        };

        _.prototype.setWidth = function (value) {
          d.assert(t.isNumber(value));
          this.normalize();
          if (0 <= value) {
            this.right = this.left + value;
          } else {
            this.right = this.left;
            this.left = this.right + value;
          }
          d.assert(this.left <= this.right);
          return this;
        };

        _.prototype.height = function () {
          return Math.abs(this.bottom - this.top);
        };

        _.prototype.setHeight = function (value) {
          d.assert(t.isNumber(value));
          this.normalize();
          if (0 <= value) {
            this.bottom = this.top + value;
          } else {
            this.bottom = this.top;
            this.top = this.bottom + value;
          }
          d.assert(this.top <= this.bottom);
          return this;
        };

        stsLib.rect.test_rect_width_height = function () {
          var r1 = r.Rect(p.Point(2,2), p.Point(4,6));
          d.check(2,  r1.width());
          d.check(4,  r1.height());

          r1.setWidth(10);
          r1.setHeight(10);
          d.check(10,  r1.width());
          d.check(10,  r1.height());

          r1.setWidth(-5);
          r1.setHeight(-5);
          d.check(5,  r1.width());
          d.check(5,  r1.height());

          d.check(-3, r1.top);
          d.check(-3, r1.left);
          d.check(2, r1.bottom);
          d.check(2, r1.right);
        };

        //----------------------------------------
        //◇中心
        //----------------------------------------
        _.prototype.center = function () {
          return p.Point(
            (this.left + this.right) / 2, 
            (this.top + this.bottom) / 2);
        };

        stsLib.rect.test_rect_center = function () {
          var r1 = r.Rect(p.Point(2,2), p.Point(4,6));
          var p1 = r1.center();
          d.check(3,  p1.x);
          d.check(4, p1.y);
        };

        //----------------------------------------
        //◇移動
        //----------------------------------------

        //----------------------------------------
        //・setTopLeft
        //----------------------------------------
        _.prototype.move = function (moveX, moveY) {
          d.assert(t.isNumbers(moveX, moveY));
          this.top    += moveY;
          this.left   += moveX;
          this.bottom += moveY;
          this.right  += moveX;
          return this.normalize();
        };

        stsLib.rect.test_rect_move = function () {
          var r1 = r.Rect(p.Point(2,2), p.Point(4,6));
          r1.move(10, 10);
          d.check(12, r1.top);
          d.check(12, r1.left);
          d.check(16, r1.bottom);
          d.check(14, r1.right);
        };

        //----------------------------------------
        //・setTopLeft
        //----------------------------------------
        //  ・引数2つの場合はtop/left指定
        //    引数1つの場合は、topleft の Point 指定
        //----------------------------------------
        _.prototype.setTopLeft = function (topValue, leftValue) {
          if (arguments.length === 1) {
            d.assert(t.isPoint(topValue));
            leftValue = topValue.x;
            topValue = topValue.y;
          } else {
            d.assert(t.isNumbers(topValue, leftValue));
          }
          
          return this.normalize().move(
            leftValue - this.left,
            topValue - this.top
          );
        };

        stsLib.rect.test_rect_setTopLeft = function () {
          var r1 = r.Rect(p.Point(2,2), p.Point(4,6));
          r1.setTopLeft(10, 10);
          d.check(10, r1.top);
          d.check(10, r1.left);
          d.check(14, r1.bottom);
          d.check(12, r1.right);

          var r1 = r.Rect(p.Point(2,2), p.Point(4,6));
          r1.setTopLeft(p.Point(0,0));
          d.check(0, r1.top);
          d.check(0, r1.left);
          d.check(4, r1.bottom);
          d.check(2, r1.right);
        };

        //----------------------------------------
        //◇範囲チェック
        //----------------------------------------
        //  ・parentRectも正規化される
        //----------------------------------------
        _.prototype.inRect = function (parentRect) {
          d.assert(t.isRect(parentRect));

          parentRect.normalize();
          return (
            n.inRange(this.left, parentRect.left, parentRect.right)
            && n.inRange(this.right, parentRect.left, parentRect.right)
            && n.inRange(this.top, parentRect.top, parentRect.bottom)
            && n.inRange(this.bottom, parentRect.top, parentRect.bottom)
          );
        };


      }());

    }()); //rect


    //----------------------------------------
    //◆動作確認
    //----------------------------------------
    _.test = stsLib.test || {};
    (function () {
      var _ = stsLib.test;

      _.test_stslib_graphics = function () {

        t.test_isPoint();
        t.test_isVector();

        v.test_vector_length();
        v.test_vector_setStart();
        v.test_vector_add();
        v.test_vector_normalize();
        v.test_vector_inverse();
        v.test_vector_normalRight();
        v.test_vector_normalLeft();
        v.test_vector_moveParallels();

        r.test_Rect();
        r.test_rect_width_height();
        r.test_rect_center();
        r.test_rect_move();
        r.test_rect_setTopLeft();

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
    var p = stsLib.point;
    var v = stsLib.vector;
    var r = stsLib.rect;


  }(stsLib, this));   //stsLib

  if (typeof module === 'undefined') {
    requireList['stsLib'] = stsLib;
  } else {
    module.exports = stsLib;
  }

}());   //(function () {

