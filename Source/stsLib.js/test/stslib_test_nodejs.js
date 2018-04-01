/*----------------------------------------
stsLib.js
Standard Software Library JavaScript
--------------------------------------
ModuleName:     Test Node.js Module
FileName:       stslib_test_nodejs.js
--------------------------------------
License:        MIT License
All Right Reserved:
    Name:       Standard Software
    URL:        https://www.facebook.com/stndardsoftware/
--------------------------------------
Version:        2018/02/28
//----------------------------------------*/

var alert = function(message) {
  console.log(message);
};

var stsLib = require('../stslib_node.js');
stsLib.test.test_stslib_core();
stsLib.system.test_stslib_console();

stsLib.node.test_readTopDirSync();
stsLib.node.test_readSubDirSync();
stsLib.node.test_readTopDir();
stsLib.node.test_readSubDir();

alert('finish stslib_test_nodejs.js テスト終了');

