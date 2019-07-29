const webpack = require('webpack');
module.exports = function (webpackChain) {
    webpackChain.plugin('banner').use(webpack.BannerPlugin, [{
        banner: 'Packed by Vusion.',
        entryOnly: true,
        test: /\.js$/,
    }]);
};
