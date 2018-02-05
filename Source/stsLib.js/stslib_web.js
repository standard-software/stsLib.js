/*----------------------------------------
stsLib.js
Standard Software Library JavaScript
----------------------------------------
ModuleName:     Web Module
FileName:       stslib_web.js
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
  var stsLib = require('./stslib_console.js')

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
      //console.log(message);
      alert(message);
    };

    //----------------------------------------
    //■stsLib.web名前空間
    //----------------------------------------
    _.web = stsLib.web || {};
    (function () {
      var _ = stsLib.web;

      //----------------------------------------
      //◆Cookie
      //----------------------------------------

      //----------------------------------------
      //・setCookie
      //----------------------------------------
      //  ・period はミリ秒で指定すること
      //----------------------------------------
      _.setCookie = function(name, value, period) {
        c.assert(t.isStrings(name, value));
        c.assert(t.isInt(period));
        var date = new Date();
        date.setTime(date.getTime() + period);
        document.cookie = name + '=' + encodeURIComponent(value)
          + ';expires=' + date.toUTCString();
      };

      _.getCookie = function(name) {
        if (document.cookie) {
          //cookieは[name=value; name=value; name=value; ]の形式
          var nameValues = document.cookie.split("; ");
          for (var i = 0, il = nameValues.length; i < il; i += 1) {
            var nameValue = nameValues[i].split("=");
            if (nameValue[0] === name) {
              return decodeURIComponent(nameValue[1]);
            }
          }
        }
        return '';
      };

      //----------------------------------------
      //◆localStorage / sessionStrage
      //----------------------------------------

      _.enableLocalStorage = function() {
        return (
          ('localStorage' in window)
          && (window.localStorage !== null)
        );
      };

      //localStorageは次のように使う
      //・保存
      //  localStorage.setItem(name, value);
      //  localStorage.name = value;
      //・取得 値がなければnullが戻る
      //  value = localStorage.getItem(name);
      //  value = localStorage.name;
      //・削除
      //  localStorage.removeItem(name);
      //・初期化
      //  localStorage.clear();

      _.enableSessionStorage = function() {
        return (
          ('sessionStorage' in window)
          && (window.sessionStorage !== null)
        );
      };

      //sessionStorageはlocalStorageとほぼ同じ使い方
      //localStrageは永続的にデータをローカル環境に保存し
      //sessionStorageは1セッション中
      //(つまりタブを開いている間)にデータをローカル環境に保存する

      //----------------------------------------
      //◆URLパラメータの受取
      //----------------------------------------
      _.getUrlParameter = function () {
        var result = {};
        var params=location.search.substring(1).split('&');
        for(var i = 0, l = params.length; i < l; i += 1) {
          var keyValue = params[i].split('=');
          result[keyValue[0]] = decodeURIComponent(keyValue[1]);
        }
        return result;
      };

      _.test_getUrlParameter = function () {
        //….html?a=1&b=2
        //というアドレスで受け取ると次のように動作する
        var arg = getUrlParameter();
        c.check("1", arg.a);
        c.check("2", arg.b);
      };

      //----------------------------------------
      //◆ループ制御
      //----------------------------------------

      //----------------------------------------
      //・遅延ループ
      //----------------------------------------

      //初回は即時実行
      _.intervalForTo1 = function (startIndex,endIndex, interval, func) {
        if (!(startIndex <= endIndex)) { return; }
        var i = startIndex;
        var loopFunc = function () {
          if ( func(i) === false) {
            //戻り値がfalseならループをbreakする
            return;
          }
          if (i < endIndex) {
            setTimeout(loopFunc, interval);
          }
          i++;
        }
        loopFunc();
      }

      //初回からinterval後の実行
      _.intervalForTo2 = function (startIndex,endIndex, interval, func) {
        if (!(startIndex <= endIndex)) { return; }
        var i = startIndex;
        var timer = setInterval(function(){
            if (func(i) === false) {
            clearInterval(timer);
            return;
          }
          if (endIndex <= i){
            clearInterval(timer);
            return;
          }
          i++;
        },interval);
      }

      //初回は即時実行
      _.intervalForTo3 = function (startIndex,endIndex, interval, func) {
        if (!(startIndex <= endIndex)) { return; }
        var i = startIndex;
          if (func(i) === false) {
          return;
        }
        var timer = setInterval(function(){
          if (endIndex <= i){
            clearInterval(timer);
            return;
          }
          i++;
            if (func(i) === false) {
            clearInterval(timer);
            return;
          }
        },interval);
      }

      _.intervalForTo = function (startIndex, endIndex,
        interval, func) {
        return _.intervalForTo1(startIndex, endIndex, interval, func);
        //return intervalForTo2(startIndex, endIndex, interval, func);
        //return intervalForTo3(startIndex, endIndex, interval, func);
      }

      _.test_intervalForTo = function (intervalForToFunc) {

        var test01 = '';
        intervalForToFunc(5, 10, 500, function(index) {

          test01 = test01 + index.toString();
          //5,6,7,8,9,10 とindexに入ってきてループする

          if (index === 10) {
            //動作確認
            c.check('5678910', test01);
          }
          if (index === 11) {
            c.assert('test01');
          }
        });

        var test02 = '';
        intervalForToFunc(5, 10, 500, function(index) {

          test02 = test02 + index.toString();
          if (index === 7) { return true; }
          test02 = test02 + index.toString();
          //7のときだけcontinueしている

          if (index === 10) {
            c.check('5566788991010', test02);
          }
          if (index === 11) {
            c.assert('test02');
          }
        });

        var test03 = '';
        intervalForToFunc(5, 10, 500, function(index) {

          test03 = test03 + index.toString();
          if (index === 8) {
            c.check('5566778', test03);
            return false;
          }
          test03 = test03 + index.toString();
          //8でbreakしている

          if (index === 9) {
            c.assert('test03');
          }
        });

        var test04 = '';
        intervalForToFunc(15, 15, 500, function(index) {
          test04 = test04 + index.toString();

          if (index === 15) {
            c.check('15', test04);
          }
          if (index === 16) {
            c.assert('test04');
          }
        });

        intervalForToFunc(20, 19, 500, function(index) {

          alert('test05');

          //呼び出されない
        });
      }

      _.test_intervalForToAll = function () {
        _.test_intervalForTo(_.intervalForTo1);
        _.test_intervalForTo(_.intervalForTo2);
        _.test_intervalForTo(_.intervalForTo3);
      }


      //初回は即時実行
      _.intervalForDownTo1 = function (startIndex,endIndex, interval, func) {
        if (!(endIndex <= startIndex)) { return; }
        var i = startIndex;
        var loopFunc = function () {
          if ( func(i) === false) {
            //戻り値がfalseならループをbreakする
            return;
          }
          if (endIndex < i) {
            setTimeout(loopFunc, interval);
          }
          i--;
        }
        loopFunc();
      }

      //初回からinterval後の実行
      _.intervalForDownTo2 = function (startIndex,endIndex, interval, func) {
        if (!(endIndex <= startIndex)) { return; }
        var i = startIndex;
        var timer = setInterval(function(){
            if (func(i) === false) {
            clearInterval(timer);
            return;
          }
          if (i <= endIndex){
            clearInterval(timer);
            return;
          }
          i--;
        },interval);
      }

      //初回は即時実行
      _.intervalForDownTo3 = function (startIndex,endIndex, interval, func) {
        if (!(endIndex <= startIndex)) { return; }
        var i = startIndex;
          if (func(i) === false) {
          return;
        }
        var timer = setInterval(function(){
          if (i <= endIndex){
            clearInterval(timer);
            return;
          }
          i--;
            if (func(i) === false) {
            clearInterval(timer);
            return;
          }
        },interval);
      }

      _.intervalForDonwTo = function (startIndex,endIndex, interval, func) {
        return _.intervalForDownTo1(startIndex, endIndex, interval, func);
        //return _.intervalForDownTo2(startIndex, endIndex, interval, func);
        //return _.intervalForDownTo3(startIndex, endIndex, interval, func);
      }

      _.test_intervalForDownTo = function (intervalForDownToFunc) {

        var test01 = '';
        intervalForDownToFunc(10, 5, 500, function(index) {

          test01 = test01 + index.toString();

          if (index === 5) {
            //動作確認
            c.check('1098765', test01);
          }
          if (index === 4) {
            c.assert('test01');
          }
        });

        var test02 = '';
        intervalForDownToFunc(10, 5, 500, function(index) {

          test02 = test02 + index.toString();
          if (index === 7) { return true; }
          test02 = test02 + index.toString();
          //7のときだけcontinueしている

          if (index === 5) {
            c.check('1010998876655', test02);
          }
          if (index === 4) {
            c.assert('test02');
          }
        });

        var test03 = '';
        intervalForDownToFunc(10, 5, 500, function(index) {

          test03 = test03 + index.toString();
          if (index === 8) {
            c.check('1010998', test03);
            return false;
          }
          test03 = test03 + index.toString();
          //8でbreakしている

          if (index === 7) {
            c.assert('test03');
          }
        });

        var test04 = '';
        intervalForDownToFunc(15, 15, 500, function(index) {

          test04 = test04 + index.toString();

          if (index === 15) {
            c.check('15', test04);
          }
          if (index === 16) {
            c.assert('test04');
          }
        });

        intervalForDownToFunc(20, 21, 500, function(index) {

          alert('test05');

          //呼び出されない
        });
      }

      _.test_intervalForDownToAll = function () {
        _.test_intervalForDownTo(_.intervalForDownTo1);
        _.test_intervalForDownTo(_.intervalForDownTo2);
        _.test_intervalForDownTo(_.intervalForDownTo3);
      }

      //----------------------------------------
      //◆動作確認
      //----------------------------------------
      _.test_stslib_web = function () {
        _.test_intervalForToAll();
        _.test_intervalForDownToAll();
        stsLib.alert('finish stslib_web_test テスト終了');
      }

    }());   //stsLib.web

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

  moduleExports(stsLib, 'stslib_web.js');

}()); //(function() {
