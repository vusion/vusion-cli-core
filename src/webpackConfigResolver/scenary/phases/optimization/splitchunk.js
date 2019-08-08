const __DEV__ = process.env.NODE_ENV === 'development';

module.exports = function (webpackChain, vusionConfig) {
    const splitChunksConfig = {};
    if (vusionConfig.entry && vusionConfig.entry.commons) {
        // deprecated!
        // webpackConfig.plugin('webpack-common-chunk-plugin')
        //     .use(webpack.optimize.CommonsChunkPlugin, {
        //         name: 'commons',
        //         minChunks: 3,
        //     });

        // alternative https://github.com/webpack/webpack/issues/6357
        splitChunksConfig.cacheGroups = {
            commons: {
                chunks: 'initial',
                minChunks: 3,
                name: 'commons',
                enforce: true,
            },
        };
    } else {
        splitChunksConfig.cacheGroups = {
            default: false,
            vendors: false,
        };
    }

    webpackChain.optimization
        .splitChunks(splitChunksConfig);
};
