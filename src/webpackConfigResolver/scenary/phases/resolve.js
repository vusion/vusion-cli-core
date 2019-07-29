const path = require('path');
const moduleResolverFac = require('../module-resolver/index');

module.exports = function (webpackChain, vusionConfig, webpackConfig) {
    const resolveModules = moduleResolverFac(vusionConfig, webpackConfig);

    resolveModules.forEach((module) => {
        webpackChain.resolve.modules.add(module);
    });

    const resolveLoaderModules = moduleResolverFac({});
    resolveLoaderModules.forEach((module) => {
        webpackChain.resolveLoader.modules.add(module);
    });

    // alias
    webpackChain.resolve.alias
        .set('vue$', path.resolve(process.cwd(), 'node_modules/vue/dist/vue.esm.js'))
        .set('globalCSS', vusionConfig.globalCSSPath)
        .set('baseCSS', vusionConfig.baseCSSPath)
        .set('library$', vusionConfig.libraryPath)
        .set('@', vusionConfig.srcPath)
        .set('@@', vusionConfig.libraryPath)
        .set('~', process.cwd());
    const aliasPreset = webpackConfig.resolve && webpackConfig.resolve.alias;
    if (aliasPreset)
        Object.keys(aliasPreset).forEach((key) => {
            webpackChain.resolve.alias.set(key, aliasPreset[key]);
        });
};
