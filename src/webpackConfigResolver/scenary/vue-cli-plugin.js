const {
    resolve,
    entry,
    // output,
    css,
    js,
    media,
    vue,
} = require('./phases');
// const __DEV__ = process.env.NODE_ENV === 'development';

module.exports = function (webpackChain, vusionConfig, webpackConfig) {
    webpackChain.entryPoints.clear();
    webpackChain.module.rules.clear();
    webpackChain.plugins.clear();

    // output(webpackChain, vusionConfig, webpackConfig);
    webpackChain.output
        .filename('[name].js')
        .chunkFilename('chunk.[name].[chunkhash:16].js');
    entry(webpackChain, vusionConfig, webpackConfig);
    resolve(webpackChain, vusionConfig, webpackConfig);
    // module
    vue(webpackChain, vusionConfig, webpackConfig);
    css(webpackChain, vusionConfig, webpackConfig);
    media(webpackChain, vusionConfig, webpackConfig);
    js(webpackChain, vusionConfig, webpackConfig);
    // webpackChain.merge(webpackConfig);
    return webpackChain;
};
