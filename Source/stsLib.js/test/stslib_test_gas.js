/*----------------------------------------
stsLib.js
Standard Software Library JavaScript
--------------------------------------
ModuleName:     Test Google Apps Script Module
FileName:       stslib_test_gas.js
--------------------------------------
License:        MIT License
All Right Reserved:
    Name:       Standard Software
    URL:        https://www.facebook.com/stndardsoftware/
--------------------------------------
Version:        2018/02/28
//----------------------------------------*/

//・GAS上にライブラリとして
//  stslib_core.js と stslib_gas_spreadsheet.js を結合して
//  stslib_gas.js という名前のプロジェクトで配置、保存。
//・stslib_test_gas.js という名前のプロジェクトとして
//  このファイルを配置、保存。
//・stslib_gas.js を[リソース]-[ライブラリ]としてインポートする。
//  そのときに識別子を[stsLib_gas]としているので
//  stsLib_gas.requireが使用できる

function myFunction() {
  var stsLib = stsLib_gas.require('stslib_gas_spreadsheet.js');
  stsLib.compare.check('ab', stsLib.string.start('abc', 2));
  Logger.log('Test Finish');
}
