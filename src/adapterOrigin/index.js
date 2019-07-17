const Config = require('webpack-chain');
const {
    merge,
} = require('../utils');

module.exports = function (
    factory,
    vusionConfig,
    webpackConfigInVusionConfig,
) {
    const chain = new Config();
    factory(chain);
    const webpackConfig = chain.toConfig();
    merge(webpackConfig, webpackConfigInVusionConfig);

    return webpackConfig;
};
