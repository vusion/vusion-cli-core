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
                    test: (m) => {
                        if (m.constructor.name === 'CssModule') {
                            const i = recursiveIssuer(m);
                            if (!p.find((o) => o === i)) {
                                console.log(i);
                                p.push(i);
                            }
                        }

                        return m.constructor.name === 'CssModule' && recursiveIssuer(m) === entry;
                    },

                    chunks: 'all',
                    enforce: true,
                };
        }
    }
};
