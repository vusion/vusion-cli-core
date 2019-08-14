const webpack = require('webpack');
const shell = require('shelljs');
const {
    resolve,
    entry,
    output,
    splitchunk,
    stats,
    css,
    js,
    media,
    vue,
    statics,
    devtool,
    banner,
    uglyfyjs,
    terser,
    forceShaking,
} = require('./phases');
// const fs = require('fs');
// const path = require('path');
// 不需要分 dev, build到两个文件，这个是全局设置的，单独用场景来区分感觉比较好
const __DEV__ = process.env.NODE_ENV === 'development';
module.exports = function (webpackChain, vusionConfig, webpackConfig) {
    webpackChain.entryPoints.clear();
    webpackChain.module.rules.clear();
    webpackChain.plugins.clear();
    if (__DEV__) {
        webpackChain.mode('development');
        webpackChain.performance.hints(false);
        devtool(webpackChain, vusionConfig, webpackConfig);
    }
    if (!__DEV__) {
        webpackChain.mode('production');
    }

    output(webpackChain, vusionConfig, webpackConfig);
    entry(webpackChain, vusionConfig, webpackConfig);
    resolve(webpackChain, vusionConfig, webpackConfig);

    stats(webpackChain, vusionConfig, webpackConfig);
    splitchunk(webpackChain, vusionConfig, webpackConfig);
    // module
    vue(webpackChain, vusionConfig, webpackConfig);
    css(webpackChain, vusionConfig, webpackConfig);
    media(webpackChain, vusionConfig, webpackConfig);
    js(webpackChain, vusionConfig, webpackConfig);

    statics(webpackChain, vusionConfig, webpackConfig);

    if (!__DEV__) {
        webpackChain.node
            .set('fs', 'empty')
            .set('child_process', 'empty');
        webpackChain.plugin('hash-module-ids').use(webpack.HashedModuleIdsPlugin);
        webpackChain.plugin('loader-options').use(webpack.LoaderOptionsPlugin, [{
            minimize: true,
        }]);
        banner(webpackChain, vusionConfig, webpackConfig);
        uglyfyjs(webpackChain, vusionConfig, webpackConfig);
        terser(webpackChain, vusionConfig, webpackConfig);
        if (vusionConfig.clean) {
            if (webpackChain.output.get('path') !== process.cwd())
                shell.rm('-rf', webpackChain.output.get('path'));
        }
        // webpackChain.optimization.moduleIds('hashed');
        forceShaking(webpackChain, vusionConfig, webpackConfig);
    }

    // webpackChain.plugin('print-webpack-config').use({ // anonymous plugin
    //     apply(compiler) {
    //         compiler.hooks.beforeRun.tapAsync('MyCustomBeforeRunPlugin', (compiler, callback) => {
    //         // debugger
    //             fs.writeFileSync(path.resolve(process.cwd(), 'webpack-vusion-cli-core.txt'), JSON.stringify(compiler.options));
    //             console.dir(compiler.options);
    //             callback();
    //         });
    //     },
    // });

    // console.log(webpackConfig);
    // console.log(webpackChain.toConfig());
    return webpackChain;
};
