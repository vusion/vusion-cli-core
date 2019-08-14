const IconFontPlugin = require('icon-font-loader/src/Plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CSSSpritePlugin = require('css-sprite-loader').Plugin;
// const TerserJSPlugin = require('terser-webpack-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const getLocalIdent = require('../../css-Ident');
const postcssPluginsFac = require('../../postcss/plugins');
const importGlobalLoaderPath = require.resolve('../../postcss/import-global-loader.js');
const postcssVariableBinderPath = require.resolve('../../postcss/variable-reader.js');
const moduleResolverFac = require('../../module-resolver/index');

const __DEV__ = process.env.NODE_ENV === 'development';

module.exports = function (webpackChain, vusionConfig, webpackConfig) {
    const resolveModules = moduleResolverFac(vusionConfig, webpackConfig);
    const postcssPlugins = postcssPluginsFac(vusionConfig, webpackChain, resolveModules);// , extraConfigs);
    const cssModuleOption = {
        // importLoaders: process.env.NODE_ENV === 'production' ? 6 : 4,
        // localIdentName: '[name]_[local]_[hash:base64:8]',
        minimize: vusionConfig.uglifyJS || vusionConfig.minifyJS,
        sourceMap: vusionConfig.sourceMap,
        // minimize: config.uglifyJS || config.minifyJS,
        // sourceMap: config.sourceMap,
    };
    /* eslint-disable */
    // url	{Boolean|Function}	true	Enable/Disable url() handling
    // import	{Boolean|Function}	true	Enable/Disable @import handling
    // modules	{Boolean|String|Object}	false	Enable/Disable CSS Modules and setup their options
    // sourceMap	{Boolean}	false	Enable/Disable Sourcemaps
    // importLoaders	{Number}	0	Number of loaders applied before CSS loader
    // localsConvention	{String}	asIs	Setup style of exported classnames
    // onlyLocals
    /* eslint-enable */
    function cssRuleChain(ruleChain, type, query, cssModuleOptions) {
        /* eslint-disable */

        const rules = ruleChain.oneOf(type)

        if(query)
            rules.resourceQuery(query);
        // rules.use('variables-loader')
        //     .loader(postcssVariableBinderPath)
        //     .end();

        rules.when( !__DEV__ && vusionConfig.extractCSS,
            config => { config.use('mini-css-extract').loader(MiniCssExtractPlugin.loader); },
            config => { config.use('vue-style-loader').loader('vue-style-loader'); }
            );


        rules.use('css-loader')
             .loader('css-loader')
             .options(cssModuleOptions);

        if(!__DEV__){
            rules.use('css-sprite-loader').loader('css-sprite-loader');
            rules.use('svg-classic-sprite-loader').loader('svg-classic-sprite-loader?filter=query');
        }
        rules.use('icon-font-loader')
              .loader('icon-font-loader')
              .end()
          .use('postcss-loader')
             .loader(require.resolve('postcss-loader'))
             .options({ plugins: () => postcssPlugins })
             .end()
          .use('import-global-loader')
             .loader(importGlobalLoaderPath)
             .options({
                 vusionConfig
             })
        /* eslint-enable */
    }

    const cssRoot = webpackChain.module.rule('css').test(/\.css$/);
    cssRoot.oneOf('variables')
        .resourceQuery(/variables/)
        .use('postcss-variables')
        .loader(postcssVariableBinderPath)
        .end()
        .use('postcss-loader')
        .loader('postcss-loader')
        .options({ plugins: () => postcssPlugins })
        .end();
    cssRuleChain(cssRoot, 'module', /module/,
        Object.assign({
            // css-loader 3.0 module config
            importLoaders: process.env.NODE_ENV === 'production' ? 6 : 4,
            localIdentName: '[name]_[local]_[hash:base64:8]',
            minimize: process.env.NODE_ENV === 'production' && !!(vusionConfig.uglifyJS || vusionConfig.minifyJS),
            modules: true,
            getLocalIdent,
            // modules: {
            //     mode: 'local',
            //     getLocalIdent,
            //     localIdentName: '[name]_[local]_[hash:base64:8]',
            // },
            // url: (item, resourcePath) => {
            //     if (item[0] !== '.')
            //         return false;
            //     return true;
            // },
        }, cssModuleOption));
    cssRuleChain(cssRoot, 'normal', '', cssModuleOption);

    const iconfontOptions = Object.assign({
        fontName: vusionConfig.name ? vusionConfig.name + '-icon' : 'vusion-icon',
        filename: '[name].[hash:16].[ext]',
        mergeDuplicates: process.env.NODE_ENV === 'production',
    }, vusionConfig.options.IconFontPlugin);
    webpackChain.plugin('icon-font-plugin')
        .use(IconFontPlugin, [iconfontOptions]);
    if (!__DEV__ && vusionConfig.extractCSS) {
        webpackChain.plugin('mini-css-extract')
            .use(MiniCssExtractPlugin, [{
                filename: '[name].css',
                chunkFilename: '[name].[chunkhash:16].css',
            }]);
        if (!webpackConfig.optimization)
            webpackConfig.optimization = { minimizer: [] };
        if (!webpackConfig.optimization.minimizer)
            webpackConfig.optimization.minimizer = [];
        webpackConfig.optimization.minimizer.push(new OptimizeCSSAssetsPlugin({
            assetNameRegExp: /\.css\.*(?!.*map)/g,
            cssProcessor: require('cssnano'),
            cssProcessorOptions: {
                discardComments: { removeAll: true },
                // 避免 cssnano 重新计算 z-index
                safe: true,
                // cssnano 集成了autoprefixer的功能
                // 会使用到autoprefixer进行无关前缀的清理
                // 关闭autoprefixer功能
                // 使用postcss的autoprefixer功能
                autoprefixer: false,
            },
            canPrint: true,
        }));
        // webpackChain.plugin('mini-css-extract-cleanup').use(
        //     class MiniCssExtractPluginCleanup {
        //         constructor(deleteWhere = /\.js(\.map)?$/) {
        //             this.shouldDelete = new RegExp(deleteWhere);
        //         }

        //         apply(compiler) {
        //             compiler.hooks.emit.tapAsync('MiniCssExtractPluginCleanup', (compilation, callback) => {
        //                 Object.keys(compilation.assets).forEach((asset) => {
        //                     if (this.shouldDelete.test(asset)) {
        //                         delete compilation.assets[asset];
        //                     }
        //                 });
        //                 callback();
        //             });
        //         }
        //     }
        // );
        // webpackChain.optimization.minimizer('terser').use(TerserJSPlugin, [{
        //     parallel: true,
        // }]);

        // webpackChain.optimization.minimizer('optimize-css-assets').use(OptimizeCSSAssetsPlugin, [{}]);
    }

    if (!__DEV__) {
        webpackChain.plugin('css-sprite-plugin').use(CSSSpritePlugin, [
            Object.assign({
                imageSetFallback: true,
                plugins: postcssPlugins,
            }, vusionConfig.options.CSSSpritePlugin),
        ]);
    }
};
