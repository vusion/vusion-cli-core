const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
module.exports = function (chain) {
    chain.plugin('BundleAnalyzerPlugin')
        .use(BundleAnalyzerPlugin, [{
            analyzerPort: 10086,
        }]);
};
