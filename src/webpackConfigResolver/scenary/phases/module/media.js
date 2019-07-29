module.exports = function (webpackChain) {
    webpackChain.module.rule('media')
        .test(/\.(png|jpg|gif|svg|eot|ttf|woff|woff2)$/)
        .use('file-loader')
        .loader('file-loader')
        .options({ name: '[name].[hash:16].[ext]' });
};

