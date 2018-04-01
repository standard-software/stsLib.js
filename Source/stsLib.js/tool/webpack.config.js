var path = require('path');

module.exports = {
    entry : './entry_webpack.js',
    output : {
        filename    : 'build-webpack.js',
        path        : path.resolve(__dirname, '../build')
    }
};