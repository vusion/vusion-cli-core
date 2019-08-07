const UglifyjsWebpackPlugin = require('uglifyjs-webpack-plugin');
module.exports = function (webpackChain, vusionConfig) {
    if (vusionConfig.minifyJS === 'uglify-js' || vusionConfig.uglifyJS) {
        // webpackChain.merge({
        //     optimization: {
        //         minimizer: [
        //           // we specify a custom UglifyJsPlugin here to get source maps in production
        //           new UglifyjsWebpackPlugin({
        //             cache: true,
        //             parallel: true,
        //             uglifyOptions: {
        //               compress: false,
        //               ecma: 6,
        //               mangle: true
        //             },
        //             sourceMap: true
        //           })
        //         ]
        //       }
        // })
        // webpackChain.optimization.minimizers([
        //     new UglifyjsWebpackPlugin(Object.assign({
        //         parallel: true,
        //     }, vusionConfig.options.UglifyjsWebpackPlugin)),
        // ]);

        webpackChain.optimization.minimizer('uglify').use(UglifyjsWebpackPlugin, [
            Object.assign({
                parallel: true,
            }, vusionConfig.options.UglifyjsWebpackPlugin),
        ]);
    }
};
