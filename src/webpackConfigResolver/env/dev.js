const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const webpackConfigSCENARYResolver = require('../scenary');

module.exports = function (chain, vusionConfig, webpackConfig) {
    chain.entryPoints.clear();
    chain.module.rules.clear();
    chain.plugins.clear();
    webpackConfigSCENARYResolver(chain, vusionConfig, webpackConfig);
    chain.mode('development');
    chain.performance.hints(false);
    chain.devtool('eval-source-map');
    if (vusionConfig.staticPath) {
        const staticPaths = Array.isArray(vusionConfig.staticPath) ? vusionConfig.staticPath : [vusionConfig.staticPath];
        chain.plugin('CopyWebpackPlugin')
            .use(CopyWebpackPlugin, [
                staticPaths.map((spath) => Object.assign({
                    from: path.resolve(process.cwd(), spath),
                    to: chain.output.get('path'),
                    ignore: ['.*'],
                }, vusionConfig.options.CopyWebpackPlugin)),
            ]);
    }
    // chain.plugin('BundleAnalyzerPlugin')
    //     .use(BundleAnalyzerPlugin, [{
    //         analyzerPort: 10086,
    //     }]);
};
