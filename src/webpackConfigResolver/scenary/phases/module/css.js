const IconFontPlugin = require('icon-font-loader/src/Plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const TerserJSPlugin = require('terser-webpack-plugin');
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
        importLoaders: process.env.NODE_ENV === 'production' ? 6 : 4,
        // localIdentName: '[name]_[local]_[hash:base64:8]',
        // minimize: process.env.NODE_ENV === 'production' && !!(vusionConfig.uglifyJS || vusionConfig.minifyJS),
        sourceMap: vusionConfig.sourceMap,
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
             .options(cssModuleOptions)
             .end()
          .use('icon-font-loader')
              .loader('icon-font-loader')
              .end()
          .use('postcss-loader')
             .loader('postcss-loader')
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
            modules: {
                mode: 'local',
                getLocalIdent,
                localIdentName: '[name]_[local]_[hash:base64:8]',
            },
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
        // webpackChain.optimization.minimizer('terser').use(TerserJSPlugin, [{
        //     parallel: true,
        // }]);
        webpackChain.optimization.minimizer('optimize-css-assets').use(OptimizeCSSAssetsPlugin, [{}]);
    }

    webpackChain.module.rule('cssvariables').test(/\.css\?variables$/)
        .use('variable-bridge')
        .loader(postcssVariableBinderPath);
};
