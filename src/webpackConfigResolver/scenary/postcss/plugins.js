const path = require('path');
const postcssImportResolver = require('postcss-import-resolver');
const postcssVusionExtendMark = require('./extend-mark');
const postcssVusionExtendMerge = require('./extend-merge');
const map_to_obj = ((aMap) => {
    const obj = {};
    aMap.forEach((v, k) => { obj[k] = v; });
    return obj;
});
module.exports = function (vusionConfig, webpackChain, resolveModules) {
    const postcssImportAlias = Object.assign({},
        map_to_obj(webpackChain.resolve.alias.store));
    delete postcssImportAlias.EXTENDS;
    const postcssExtendMark = postcssVusionExtendMark({
        resolve: postcssImportResolver({
            extensions: ['.js'],
            alias: Object.assign({}, postcssImportAlias),
            modules: Object.assign({}, resolveModules),
        }),
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
                if (asset.url[0] !== '.')
                    return asset.url;
                let rebasedUrl = path.normalize(path.relative(dir.to, asset.absolutePath));
                rebasedUrl = path.sep === '\\' ? rebasedUrl.replace(/\\/g, '/') : rebasedUrl;
                rebasedUrl = `${rebasedUrl}${asset.search}${asset.hash}`;

                if (asset.url.startsWith('..'))
                    return rebasedUrl;
                else
                    return './' + rebasedUrl;
            },
        }),
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
    ].concat(vusionConfig.postcss);
};
