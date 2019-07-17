const createWebpackChain = require('./src/index.js');
const adapterOrigin = require('./src/adapterOrigin/index.js');
const { toString } = require('webpack-chain');
const fs = require('fs');
const path = require('path');
module.exports = {
    origin(env, vusionConfigPath, theme) {
        const {
            factory,
            vusionConfig,
            webpackConfig,
        } = createWebpackChain(env, vusionConfigPath, theme);
        const conf = adapterOrigin(factory, vusionConfig, webpackConfig);
        fs.writeFileSync(path.resolve(process.cwd(), 'webpack-vusion-cli-core.txt'), toString(conf));
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
