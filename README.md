# vusion-cli-core

## 配置
读取 vusion.config.js 配置

## 用法

### prepare

```javascript
require('vusion-cli-core').prepare('dev', vusionConfig);
```

### origin

```javascript
const __DEV__ = process.env.NODE_ENV === 'development';
const webpackConfig = require('vusion-cli-core').origin(__DEV__ ? 'dev' : 'build', vusionConfigPath, theme);

const compiler = webpack(webpackConfig);
```

### default

```javascript
const adapter = (factory, vusionConfig, webpackConfigInVusionConfig) => {
    factory(chain) // vusion webpack config inject function
    /* other operations */

};
require('vusion-cli-core').default(adapter, 'build', vusionConfigPath, theme);
```