const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');
module.exports = function (webpackChain, vusionConfig, webpackConfig) {
    if (vusionConfig.staticPath && webpackChain.output.get('path')) {
        const staticPaths = Array.isArray(vusionConfig.staticPath) ? vusionConfig.staticPath : [vusionConfig.staticPath];
        webpackChain.plugin('CopyWebpackPlugin')
            .use(CopyWebpackPlugin, [
                staticPaths.map((spath) => Object.assign({
                    from: path.resolve(process.cwd(), spath),
                    to: webpackChain.output.get('path'),
                    ignore: ['.*'],
                }, vusionConfig.options.CopyWebpackPlugin)),
            ]);
    }
};
