const TerserJSPlugin = require('terser-webpack-plugin');
module.exports = function (webpackChain, vusionConfig, webpackConfig) {
    if (vusionConfig.minifyJS === 'terser-js') {
        if (!webpackConfig.optimization)
            webpackConfig.optimization = { minimizer: [] };
        if (!webpackConfig.optimization.minimizer)
            webpackConfig.optimization.minimizer = [];
        webpackConfig.optimization.minimizer.push(new TerserJSPlugin({
            test: /\.js(\?.*)?$/i,
            parallel: true,
        }));
    }
};
