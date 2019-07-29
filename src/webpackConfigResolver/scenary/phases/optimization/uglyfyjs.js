const UglifyjsWebpackPlugin = require('uglifyjs-webpack-plugin');
module.exports = function (webpackChain, vusionConfig) {
    if (vusionConfig.minifyJS === 'uglify-js' || vusionConfig.uglifyJS) {
        webpackChain.optimization.minimizer([
            new UglifyjsWebpackPlugin(Object.assign({
                parallel: true,
            }, vusionConfig.options.UglifyjsWebpackPlugin)),
        ]);
    }
};