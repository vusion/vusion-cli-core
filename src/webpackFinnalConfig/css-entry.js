const __DEV__ = process.env.NODE_ENV === 'development';
function recursiveIssuer(m) {
    if (m.issuer) {
        return recursiveIssuer(m.issuer);
    } else if (m.name) {
        return m.name;
    } else {
        return false;
    }
}
const p = [];
module.exports = function (vusionConfig, webpackConfig) {
    if (!__DEV__ && vusionConfig.extractCSS === 'entry') {
        for (const entry in webpackConfig.entry) {
            webpackConfig.optimization
                .splitChunks
                .cacheGroups[`${entry}Styles`] = {
                    name: `${entry}Styles`, // 一定要加个后缀，不能跟入口重名了
                    test: (m) => m.constructor.name === 'CssModule' && recursiveIssuer(m) === entry,
                    chunks: 'all',
                    enforce: true,
                };
            // webpackConfig.optimization·
            //     .splitChunks
            //     .cacheGroups.commons = {
            //         test: /[\\/]node_modules[\\/]/,
            //         // cacheGroupKey here is `commons` as the key of the cacheGroup
            //         name(module, chunks, cacheGroupKey) {
            //             const moduleFileName = module.identifier().split('/').reduceRight((item) => item);
            //             const allChunksNames = chunks.map((item) => item.name).join('~');
            //             return `${cacheGroupKey}-${allChunksNames}-${moduleFileName}`;
            //         },
            //         chunks: 'all',
            //     };
            // webpackConfig.entry[entry] = [`${entry}Styles.css`, webpackConfig.entry[entry]];
        }
    }
};
