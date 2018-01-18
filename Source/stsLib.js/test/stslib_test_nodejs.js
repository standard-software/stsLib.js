var alert = function(message) {
  console.log(message);
};

var stsLib = require('../stslib_node.js');
stsLib.test.test_stslib_core();

stsLib.node.test_readTopDirSync();
stsLib.node.test_readSubDirSync();
stsLib.node.test_readTopDir();
stsLib.node.test_readSubDir();

alert('finish stslib_test_nodejs.js テスト終了');

