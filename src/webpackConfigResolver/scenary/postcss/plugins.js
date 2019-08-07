const path = require('path');
const postcssImportResolver = require('postcss-import-resolver');
const postcssVusionExtendMark = require('./extend-mark');
const postcssVusionExtendMerge = require('./extend-merge');

const map_to_obj = ((aMap) => {
    const obj = {};
    aMap.forEach((v, k) => { obj[k] = v; });
    return obj;
});

// class PostcssVariablesPlugin {
//     constructor(options) {
//         this.cssVariables = {};
//     }
//     apply(compiler) {

//     }
// }
// PostcssVariablesPlugin.collector = function (root) {
//     Object.assign(this.cssVariables, root.variables);
// };

// module.exports.PostcssVariablesPlugin = PostcssVariablesPlugin;

module.exports = function (vusionConfig, webpackChain, resolveModules) {
    const postcssImportAlias = Object.assign({},
        map_to_obj(webpackChain.resolve.alias.store));
    delete postcssImportAlias.EXTENDS;
    const alias = Object.assign({}, postcssImportAlias);
    const aliasKeys = Object.keys(alias);
    const resolver = postcssImportResolver({
        extensions: ['.js'],
        alias: postcssImportAlias,
        modules: resolveModules,
    });
    const postcssExtendMark = postcssVusionExtendMark({
        resolve: resolver,
    });
    // Postcss plugins
    const resolveResult = postcssImportResolver({
        alias: postcssImportAlias,
        modules: resolveModules,
    });

    return [
        postcssExtendMark,
        require('postcss-import')({
            resolve: resolveResult,
            skipDuplicates: false,
            plugins: [postcssExtendMark],
        }),
        require('postcss-url')({
            // Rewrite https://github.com/postcss/postcss-url/blob/master/src/type/rebase.js
            // 只需将相对路径变基，其它让 Webpack 处理即可
            url(asset, dir) {
                if (asset.url[0] !== '.') {
                    if (asset.url[0] !== '/') {
                        // alia的书写必须把key最短的写在前面 !important
                        let l = aliasKeys.length;
                        let key = null;
                        while (l--) {
                            if (asset.url.startsWith(aliasKeys[l])) {
                                key = aliasKeys[l];
                                break;
                            }
                        }

                        //  const key = aliasKeys.find((key) => asset.url.startsWith(key));
                        if (key) {
                            const urlpath = path.join(alias[key], asset.url.substring(key.length, asset.url.length));
                            return urlpath;
                        }
                    }
                    return asset.url;
                }

                let rebasedUrl = path.normalize(path.relative(dir.to, asset.absolutePath));
                rebasedUrl = path.sep === '\\' ? rebasedUrl.replace(/\\/g, '/') : rebasedUrl;
                rebasedUrl = `${rebasedUrl}${asset.search}${asset.hash}`;

                if (asset.url.startsWith('..'))
                    return rebasedUrl;
                else
                    return './' + rebasedUrl;
            },
        }),
        // postcss.plugin('postcss-add-wave-to-asset', () => (styles) => {
        //     styles.walkDecls('icon-font', (declaration) => {
        //         if (/url\('?~/.test(declaration.value)) {
        //             const result = /url\('?~(.+)'\)/.exec(declaration.value);
        //             if (result) {
        //                 declaration.value = `url(${result[1]})`;
        //             }
        //             console.log(declaration.value);
        //         }
        //     });
        // }),
        // precss removed
        require('postcss-variables'),
        require('postcss-preset-env')({
            stage: 0,
            browsers: vusionConfig.browsers,
            features: {
                'image-set-function': false, // handle by css-sprite-loader
                'color-mod-function': true, // stage is -1, https://github.com/csstools/cssdb/blob/master/cssdb.json
            },
        }),
        // precss removed
        require('postcss-calc'),
        postcssVusionExtendMerge,
        // postcss.plugin('postcss-variables-collection', () => function (root) {
        //     root.variables
        // }),
    ].concat(vusionConfig.postcss);
};
