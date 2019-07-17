const vusionConfigResolver = require('./vusionConfigResolver/resolve');

const webpackConfigENVResolver = require('./webpackConfigResolver/env');
module.exports = function (env, vusionConfigPath, theme) {
    // resolve vusionConfig
    const {
        vusionConfig,
        webpackConfig,
    } = vusionConfigResolver(vusionConfigPath, theme);

    return {
        factory(chain) {
            // config run time env + scenary
            webpackConfigENVResolver(env)(chain, vusionConfig, webpackConfig);
        },
        vusionConfig, webpackConfig,
    };
};
