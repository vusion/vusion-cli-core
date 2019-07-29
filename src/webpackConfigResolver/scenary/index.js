module.exports = function (chain, vusionConfig, webpackConfig, env) {
    const scenary = require(`../scenary/${vusionConfig.type}`);
    scenary(chain, vusionConfig, webpackConfig);
};
