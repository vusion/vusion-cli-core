const createWebpackChain = require('./src/index.js');
const adapterOrigin = require('./src/adapterOrigin/index.js');
// const { toString } = require('webpack-chain');
// const fs = require('fs');
// const path = require('path');
const webpackConfigENVResolver = require('./src/webpackConfigResolver/env');
module.exports = {
    prepare(env, vusionConfig) {
        const webpackConfig = vusionConfig.webpack;

        const factory = function (chain) {
            // config run time env + scenary
            webpackConfigENVResolver(env)(chain, vusionConfig, webpackConfig);
        };

        const conf = adapterOrigin(factory, vusionConfig, webpackConfig);
        // fs.writeFileSync(path.resolve(process.cwd(), 'webpack-vusion-cli-core.txt'), toString(conf));
        return conf;
    },
    origin(env, vusionConfigPath, theme) {
        const {
            factory,
            vusionConfig,
            webpackConfig,
        } = createWebpackChain(env, vusionConfigPath, theme);
        const conf = adapterOrigin(factory, vusionConfig, webpackConfig);
        // fs.writeFileSync(path.resolve(process.cwd(), 'webpack-vusion-cli-core.txt'), toString(conf));
        return conf;
    },
    default(adapter, env, vusionConfigPath, theme) {
        const {
            factory,
            vusionConfig,
            webpackConfig,
        } = createWebpackChain(env, vusionConfigPath, theme);
        adapter(factory, vusionConfig, webpackConfig);
    },

};
