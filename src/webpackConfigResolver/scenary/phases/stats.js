module.exports = function (webpackChain) {
    webpackChain.stats({
        colors: true,
        modules: false,
        children: false,
        chunks: false,
        chunkModules: false,
    });
};
