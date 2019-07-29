const path = require('path');
const utils = require('base-css-image-loader/src/utils');
const HtmlWebpackPlugin = require('html-webpack-plugin');
module.exports = function (webpackChain, vusionConfig) {
    if (vusionConfig.entry && vusionConfig.entry.pages) {
        const entry = {};
        if (vusionConfig.entry.pages === 'index') {
            entry.bundle = path.resolve(vusionConfig.srcPath, 'views/index.js');
        } else if (Array.isArray(vusionConfig.entry.pages)) {
            vusionConfig.entry.pages.forEach((page) => entry[page] = path.resolve(vusionConfig.srcPath, 'views', page, 'index.js'));
        }

        if (vusionConfig.entry.prepend && vusionConfig.entry.prepend.length)
            utils.prependToEntry(vusionConfig.entry.prepend, entry);
        if (vusionConfig.entry.append && vusionConfig.entry.append.length)
            utils.appendToEntry(vusionConfig.entry.append, entry);

        Object.keys(entry).forEach((key) => {
            webpackChain.entry(key).add(entry[key]).end();
            webpackChain.plugin('html-webpack-plugin')
                .use(HtmlWebpackPlugin, {
                    filename: key + '.html',
                    hash: true,
                    chunks: vusionConfig.entry.commons ? ['commons', key] : [key],
                    template: vusionConfig.entry.template || path.resolve(__dirname, 'template.html'),
                });
        });
    }
};
