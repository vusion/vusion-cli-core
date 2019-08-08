const vusionConfigResolver = require('./vusionConfigResolver/resolve');
const webpackConfigSCENARYResolver = require('./webpackConfigResolver/scenary');
const webpackFinnalConfigure = require('./webpackFinnalConfig/index.js');
// const webpackConfigENVResolver = require('./webpackConfigResolver/env');
module.exports = function (vusionConfigPath, theme) {
    // resolve vusionConfig
    const {
        vusionConfig,
        webpackConfig,
    } = vusionConfigResolver(vusionConfigPath, theme);
    global.vusionConfig = vusionConfig;
    return {
        finnalConfig(webpackConfig) {
            webpackFinnalConfigure(vusionConfig, webpackConfig);
        },
        factory(chain) {
            // config run time env + scenary
            webpackConfigSCENARYResolver(chain, vusionConfig, webpackConfig);
        },
        vusionConfig, webpackConfig,
    };
};
