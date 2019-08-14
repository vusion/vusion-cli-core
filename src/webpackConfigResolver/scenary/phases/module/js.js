const path = require('path');
const __DEV__ = process.env.NODE_ENV === 'development';

module.exports = function (webpackChain, vusionConfig) {
    if (!__DEV__ || vusionConfig.babel) {
        // 存在 dynamic-import error
        // console.log('babel-loader online');
        webpackChain.module
            .rule('js')
            .test(/\.jsx?$/)
            .exclude
            .add((filepath) => {
                const babelIncludes = Array.isArray(vusionConfig.babelIncludes) ? vusionConfig.babelIncludes : [vusionConfig.babelIncludes];
                const reincludes = [
                    /\.(?:vue|vusion)[\\/].*\.js$/,
                    /\.es6\.js$/,
                ].concat(babelIncludes);

                const r = filepath.includes('node_modules') && !reincludes.some((reinclude) => {
                    if (typeof reinclude === 'string')
                        return filepath.includes(reinclude) || filepath.includes(reinclude.replace(/\//g, '\\'));
                    else if (reinclude instanceof RegExp)
                        return reinclude.test(filepath);
                    else if (typeof reinclude === 'function')
                        return reinclude(filepath);
                    else
                        return false;
                });

                return r;
            }).end()
            .use('babel') // no pre rule
            .loader('babel-loader').options({

                plugins: ['@babel/plugin-syntax-dynamic-import'],
            }).end();
    }
    if (vusionConfig.lint) {
        // 还没测试过
        webpackChain.module
            .rule('eslint')
            .test(/\.(js|vue)$/)
            .exclude
            .add((filepath) =>
            // Don't transpile node_modules
                /node_modules/.test(filepath))
            .use('eslint')
            .loader('eslint-loader')
            .options({
                eslintPath: path.resolve(process.cwd(), 'node_modules/eslint'),
                formatter: require('eslint-friendly-formatter'),
            });
    }
};
