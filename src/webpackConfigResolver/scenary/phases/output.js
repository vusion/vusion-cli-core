const path = require('path');
module.exports = function (webpackChain) {
    webpackChain.output
        .path(path.join(process.cwd(), 'public'))
        .publicPath('')
        .filename('[name].js')
        .chunkFilename('chunk.[name].[chunkhash:16].js');
};
