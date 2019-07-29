/**
     * modules
     * module: {
     *  rules: [
     *      {
     *          test: /\.vue[\\/]index\.js$/,
     *          use: [
                    'vue-loader',
                    'vue-multifile-loader'
                ],
     *      },
     *      {
     *          test: /\.vue$/,
     *          use: [
                    'vue-loader',
                ],
     *      },
     **/

const vuemultifilePath = require.resolve('vue-multifile-loader-v2');
const VueLoaderPlugin = require('vue-loader/lib/plugin');
module.exports = function (webpackChain) {
    webpackChain.module
        .rule('vue')
        .test(/\.vue$/)
    // .use('thread-loader')
    // .loader('thread-loader')
    // .end()
    // .use('cache-loader')
    // .loader('cache-loader')
    // .end()
        .use('vue-loader')
        .loader('vue-loader', [{
            compilerOptions: {
                preserveWhitespace: false,
            },
        }]);
    webpackChain.module
        .rule('vue-folder')
        .test(/\.vue[\\/]index\.js$/)
        // .use('thread-loader')
        // .loader('thread-loader')
        // .end()
        // .use('cache-loader')
        // .loader('cache-loader')
        // .end()
        .use('vue-loader')
        .loader('vue-loader')
        .end()
        .use('vue-multifile-loader')
        .loader(vuemultifilePath);

    webpackChain.plugin('vue-loader')
        .use(VueLoaderPlugin);
};
