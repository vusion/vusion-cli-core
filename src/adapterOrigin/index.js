const Config = require('webpack-chain');
const {
    merge,
} = require('../utils');

module.exports = function (
    factory,
    vusionConfig,
    webpackConfigInVusionConfig,
    finnalConfig
) {
    const chain = new Config();
    factory(chain);
    const webpackConfig = chain.toConfig();
    merge(webpackConfig, webpackConfigInVusionConfig);
    if (finnalConfig)
        finnalConfig(webpackConfig);
    return webpackConfig;
};
