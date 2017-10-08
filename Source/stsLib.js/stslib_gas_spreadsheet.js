/*----------------------------------------
stsLib.js
Standard Software Library JavaScript
----------------------------------------
ModuleName:     Google Apps Script Spreadsheet Module
FileName:       stslib_gas_spreadsheet.js
----------------------------------------
License:        MIT License
All Right Reserved:
    Name:       Standard Software
    URL:        https://www.facebook.com/stndardsoftware/
--------------------------------------
Version:        2017/10/09
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
  var stsLib = require('stsLib')

  //----------------------------------------
  //■stsLib名前空間
  //----------------------------------------
  var stsLib = stsLib || {};
  (function (stsLib, global) {
    'use strict';
    var _ = stsLib;

    //----------------------------------------
    //■stsLib.web名前空間
    //----------------------------------------
    _.spreadsheet = stsLib.spreadsheet || {};
    (function () {
      var _ = stsLib.spreadsheet;

      //----------------------------------------
      //・シート名一覧
      //----------------------------------------
      //  ・getValueとgetFormulaでチェックする
      //----------------------------------------
      _.sheetNames = function() {
        var sheets = SpreadsheetApp.getActiveSpreadsheet().getSheets();
        var result = [];
        for(var i = 0, l = sheets.length; i < l; i += 1) {
          result.push(sheets[i].getName());
        }
        return result;
      }


      //----------------------------------------
      //・セルが空白かどうか調べる
      //----------------------------------------
      //  ・getValueとgetFormulaでチェックする
      //----------------------------------------
      _.cellIsEmpty = function(sheet, row, col) {
        var range = sheet.getRange(row, col);
          return ((range.getValue() === '')
          || (range.getFormula() === ''));
      }

      //----------------------------------------
      //◇データ最終行/列を求める
      //----------------------------------------
      //  ・col/rowは整数値で指定必須
      //  ・データがまったくない場合でも、最終行/列として 1 を返す
      //----------------------------------------

      _.dataLastRow = function(sheet, col) {
          c.assert(stsLib.type.isInt(col))
          var result = 1;
          for (var row = sheet.getDataRange().getLastRow(); 1 <= row; row -= 1) {
            if (_.cellIsEmpty(sheet, row, col)) {
              return row;
            }
          }
      	return 1;
      }

      _.dataLastCol = function(sheet, row) {
          c.assert(stsLib.type.isInt(row))
          var result = 1;
          for (var col = sheet.getDataRange().getLastColumn(); 1 <= col; col -= 1) {
            if (_.cellIsEmpty(sheet, row, col)) {
              return col;
            }
          }
      	return 1;
      }

    }());   //stsLib.gas

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

