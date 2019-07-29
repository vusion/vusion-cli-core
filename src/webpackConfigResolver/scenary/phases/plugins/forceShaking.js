const ForceShakingPlugin = require('../../../../utils/vusion-tree-shaking');
module.exports = function (chain, vusionConfig, webpackConfig) {
    if (vusionConfig.forceShaking) {
        chain.plugin('force-shaking')
            .use(ForceShakingPlugin, [
                Object.assign({
                    shakingPath: vusionConfig.forceShaking,
                }, vusionConfig.options.ForceShakingPlugin),
            ]);
    }
};
