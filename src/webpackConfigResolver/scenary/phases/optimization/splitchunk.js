module.exports = function (webpackChain, vusionConfig) {
    if (vusionConfig.entry && vusionConfig.entry.commons) {
        // deprecated!
        // webpackConfig.plugin('webpack-common-chunk-plugin')
        //     .use(webpack.optimize.CommonsChunkPlugin, {
        //         name: 'commons',
        //         minChunks: 3,
        //     });

        // alternative https://github.com/webpack/webpack/issues/6357
        webpackChain.optimization
            .splitChunks({ cacheGroups: {
                commons: {
                    chunks: 'initial',
                    minChunks: 3,
                    name: 'commons',
                    enforce: true,
                },
            } });
    } else {
        webpackChain.optimization
            .splitChunks({
                cacheGroups: {
                    default: false,
                    vendors: false,
                },
            });
    }
};
