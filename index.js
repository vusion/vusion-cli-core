const createWebpackChain = require('./src/index.js');
const adapterOrigin = require('./src/adapterOrigin/index.js');
// const { toString } = require('webpack-chain');
// const fs = require('fs');
// const path = require('path');
const webpackConfigTypeResolver = require('./src/webpackConfigResolver/scenary/index');
// const heapdump = require('heapdump');
// print heap usage profile for chrome
// function watchHeap() {
//     if (!fs.existsSync(`${process.cwd()}/heap`)) {
//         fs.mkdirSync(`${process.cwd()}/heap`);
//     }
//     setInterval(() => {
//         heapdump.writeSnapshot(`${process.cwd()}/heap/` + Date.now() + '.heapsnapshot');
//     }, 5000);
// }
module.exports = {
    prepare(env, vusionConfig) {
        const webpackConfig = vusionConfig.webpack;

        const factory = function (chain) {
            // config run time env + scenary
            webpackConfigTypeResolver(chain, vusionConfig, webpackConfig);
        };

        const conf = adapterOrigin(factory, vusionConfig, webpackConfig);
        // fs.writeFileSync(path.resolve(process.cwd(), 'webpack-vusion-cli-core.txt'), toString(conf));
        // watchHeap();
        return conf;
    },
    origin(vusionConfigPath, theme) {
        const {
            factory,
            vusionConfig,
            webpackConfig,
            finnalConfig,
        } = createWebpackChain(vusionConfigPath, theme);
        const conf = adapterOrigin(factory, vusionConfig, webpackConfig, finnalConfig);
        // conf.optimization.moduleIds = 'hashed';
        // fs.writeFileSync(path.resolve(process.cwd(), 'vusion-config-core.txt'), vusionConfig);
        // fs.writeFileSync(path.resolve(process.cwd(), 'webpack-vusion-cli-core.txt'), toString(conf));
        return conf;
    },
    default(adapter, vusionConfigPath, theme) {
        const {

            factory,
            vusionConfig,
            webpackConfig,
        } = createWebpackChain(vusionConfigPath, theme);
        adapter(factory, vusionConfig, webpackConfig);
    },

};
