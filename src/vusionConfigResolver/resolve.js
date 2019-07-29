const fs = require('fs');
const path = require('path');
const chalk = require('chalk');
const chokidar = require('chokidar');

const TYPES = ['library', 'app', 'html5', 'fullstack', 'vue-cli-plugin'];
const defaults = require('./defaults');

function getConfig(configPath, packagePath) {
    delete require.cache[configPath];
    delete require.cache[packagePath];
    if (fs.existsSync(configPath))
        return require(configPath);
    else if (fs.existsSync(packagePath)) {
        const packageVusion = require(packagePath).vusion;
        if (packageVusion)
            return packageVusion;
        else {
            console.error(chalk.bgRed(' ERROR '), `Cannot find vusion config! This is not a vusion project.
    processCwd: ${process.cwd()}
    configPath: ${configPath}
`);
            process.exit(1);
        }
    }
}

module.exports = function resolve(configPath = 'vusion.config.js', theme) {
    const config = defaults;

    const packagePath = config.packagePath = path.resolve(process.cwd(), 'package.json');
    configPath = config.configPath = path.resolve(process.cwd(), configPath);
    Object.assign(config, getConfig(configPath, packagePath));

    if (!TYPES.includes(config.type)) {
        console.error(chalk.bgRed(' ERROR '), 'Unknown project type!');
        process.exit(1);
    }

    config.srcPath = config.srcPath || './src';
    config.libraryPath = config.libraryPath || config.srcPath;
    if (config.type === 'library') {
        config.docs = config.docs || {};

        if (process.env.NODE_ENV === 'development') {
            // 更新 docs 对象
            chokidar.watch([configPath, packagePath]).on('change', (path) => {
                const newConfig = getConfig(configPath, packagePath);
                config.docs = newConfig.docs || {};
            });
        }
    }

    config.srcPath = path.resolve(process.cwd(), config.srcPath);
    config.libraryPath = path.resolve(process.cwd(), config.libraryPath);

    if (theme === 'src' || theme === 'default')
        theme = undefined;
    config.theme = theme;

    if (!config.globalCSSPath) {
        config.globalCSSPath = path.resolve(config.libraryPath, theme ? `../theme-${theme}/base/global.css` : './base/global.css');
        if (!fs.existsSync(config.globalCSSPath))
            config.globalCSSPath = path.resolve(config.srcPath, theme ? `../theme-${theme}/base/global.css` : './base/global.css');
        if (!fs.existsSync(config.globalCSSPath))
            config.globalCSSPath = path.resolve(require.resolve('@vusion/doc-loader'), 'node_modules/proto-ui.vusion/components/base/global.css');
    }
    if (!config.baseCSSPath) {
        config.baseCSSPath = path.resolve(config.libraryPath, './base/base.css');
        if (!fs.existsSync(config.baseCSSPath))
            config.baseCSSPath = path.resolve(config.srcPath, './base/base.css');
        if (!fs.existsSync(config.baseCSSPath))
            config.baseCSSPath = path.resolve(require.resolve('@vusion/doc-loader'), 'node_modules/proto-ui.vusion/components/base/base.css');
    }

    return {
        vusionConfig: config,
        webpackConfig: config.webpack,
    };
};
