//node.jsのコマンドは
//  >node stslib_test_nodejs.js
//このようにします。
//このファイルのディレクトリをカレントにして
//実行してください。

// var stsLib = require('../stsLib_core.js');
// stsLib.test.test_stslib_core();

var stsLib = require('../stsLib_node.js');
stsLib.test.test_stslib_core();

stsLib.node.test_searchFolder();
stsLib.node.test_searchSubFolder();
