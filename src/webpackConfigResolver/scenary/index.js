module.exports = function (chain, vusionConfig, webpackConfig) {
    const scenary = require(`../scenary/${vusionConfig.type}`);
    scenary(chain, vusionConfig, webpackConfig);
};
