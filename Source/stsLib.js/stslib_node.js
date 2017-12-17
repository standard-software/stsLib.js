/*----------------------------------------
stsLib.js
Standard Software Library JavaScript
----------------------------------------
ModuleName:     node.js Module
FileName:       stslib_node.js
----------------------------------------
License:        MIT License
All Right Reserved:
    Name:       Standard Software
    URL:        https://www.facebook.com/stndardsoftware/
--------------------------------------
Version:        2017/12/17
//----------------------------------------*/

//----------------------------------------
//・require関数
//----------------------------------------
//  ・  node.js には require は必ずあるので除外
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

  //外部から呼び出して使用する
  const fs = require('fs');

  //----------------------------------------
  //■stsLib名前空間
  //----------------------------------------
  var stsLib = stsLib || {};
  (function (stsLib, global) {
    'use strict';
    var _ = stsLib;

    //----------------------------------------
    //■stsLib.node名前空間
    //----------------------------------------
    _.node = stsLib.node || {};
    (function () {
      var _ = stsLib.node;

      //----------------------------------------
      //◇ファイル一覧
      //----------------------------------------

      //----------------------------------------
      //・トップフォルダのみのファイル列挙
      //----------------------------------------
      //  ・err時に処理を止めたい場合は
      //    errorFunc内で throw err; をするとよい
      //----------------------------------------
      _.searchFolder = function(folderPath, errorFunc, fileItemFunc, finishFunc) {
        c.assert(t.isString(folderPath));
        c.assert(t.isNullOrUndefined(errorFunc) || t.isFunction(errorFunc));
        c.assert(t.isNullOrUndefined(fileItemFunc) || t.isFunction(fileItemFunc));
        c.assert(t.isNullOrUndefined(finishFunc) || t.isFunction(finishFunc));
        fs.readdir(folderPath, function(err, files) {
          if (err) {
            if (errorFunc) {
              errorFunc(err);
            }
            return;
          }
          if (fileItemFunc) {
            files.forEach(function(fileName) {
              fileItemFunc(
                s.excludeEnd(folderPath, '\\') +
                '\\' +
                s.excludeStart(fileName, '\\')
              );
            });
          }
          if (finishFunc) {
            finishFunc(files);
          }
        });
      };

      _.test_searchFolder = function() {
        var folderPath = process.cwd();
        _.searchFolder(folderPath,
          function(err) {
            console.log('err:' + err)
          },
          function(filePath) {
            //console.log(filePath);
          }
        );

        _.searchFolder(folderPath,
          function(err) {
            console.log('err:' + err)
          },
          undefined,
          function(files) {
            c.check(true, a.isInclude(files,
              'stslib_test_nodejs.js'));
          }
        );
      };

      //----------------------------------------
      //・サブフォルダ含めたファイル列挙
      //----------------------------------------
      //  ・err時に処理を止めたい場合は
      //    errorFunc内で throw err; をするとよい
      //----------------------------------------
      _.searchSubFolder = function(folderPath, errorFunc, fileItemFunc, finishFunc) {
        c.assert(t.isString(folderPath));
        c.assert(t.isNullOrUndefined(errorFunc) || t.isFunction(errorFunc));
        c.assert(t.isNullOrUndefined(fileItemFunc) || t.isFunction(fileItemFunc));
        c.assert(t.isNullOrUndefined(finishFunc) || t.isFunction(finishFunc));
        const searchFolder = function(folderPath) {
          fs.readdir(folderPath, function(err, files) {
            if (err) {
              if (errorFunc) {
                errorFunc(err);
              }
              return;
            }
            if (fileItemFunc) {
              files.forEach(function(fileName) {
                const filePath =
                  s.excludeEnd(folderPath, '\\') +
                  '\\' +
                  s.excludeStart(fileName, '\\');
                if (fs.statSync(filePath).isDirectory()) {
                  //フォルダなら再帰呼び出し
                  searchFolder(filePath);
                } else {
                  fileItemFunc(filePath);
                }
              });
            }
            if (finishFunc) {
              finishFunc(files);
            }
            return;
          });
        };
        searchFolder(folderPath);
      };

      _.test_searchSubFolder = function() {
        var folderPath = process.cwd();
        _.searchSubFolder(folderPath,
          function(err) {
            console.log('err:' + err)
          },
          function(filePath) {
            // console.log(filePath);
          }
        );

        _.searchSubFolder(folderPath,
          function(err) {
            console.log('err:' + err)
          },
          undefined,
          function(files) {
            c.check(true, a.isInclude(files,
              'stslib_test_nodejs.js'));
          }
        );
      };

    }());   //stsLib.node

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

  if (typeof module === 'undefined') {
    requireList['stsLib'] = stsLib;
  } else {
    module.exports = stsLib;
  }

}());   //(function () {
