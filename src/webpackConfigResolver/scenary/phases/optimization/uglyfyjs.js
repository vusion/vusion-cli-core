const UglifyjsWebpackPlugin = require('uglifyjs-webpack-plugin');
module.exports = function (webpackChain, vusionConfig, webpackConfig) {
    if (vusionConfig.minifyJS === 'uglify-js' || vusionConfig.uglifyJS) {
        if (!webpackConfig.optimization)
            webpackConfig.optimization = { minimizer: [] };
        if (!webpackConfig.optimization.minimizer)
            webpackConfig.optimization.minimizer = [];
        webpackConfig.optimization.minimizer.push(new UglifyjsWebpackPlugin(Object.assign({
            parallel: true,
        }, vusionConfig.options.UglifyjsWebpackPlugin),));
    }
};
