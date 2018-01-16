//node.jsのコマンドは
//  >node stslib_test_nodejs.js
//このようにします。
//このファイルのディレクトリをカレントにして
//実行してください。

var alert = function(message) {
  console.log(message);
};

var stsLib = require('../stslib_node.js');
stsLib.test.test_stslib_core();

stsLib.node.test_readTopDirSync();
stsLib.node.test_readSubDirSync();
stsLib.node.test_readTopDir();
stsLib.node.test_readSubDir();
// stsLib.node.test_searchFolder();
// stsLib.node.test_searchSubFolder();
alert('finish stslib_test_nodejs.js テスト終了');

