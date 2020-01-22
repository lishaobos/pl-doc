const path = require('path');
const updateWebpackConfig = require('storybook-readme/vue/updateWebpackConfig');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

module.exports = ({ config, mode }) => {
  updateWebpackConfig(config);

  if (mode === 'PRODUCTION') {
    config.externals = {
        'vue': 'Vue',
        'moment': 'moment',
        'axios': 'axios',
        'ali-oss': 'OSS',
        'compressorjs': 'Compressor',
        'element-ui': 'ELEMENT',
        'vue-clipboard2': 'VueClipboard'
    }
  }

  // 别名
  let aliasConfig = {
    '@apis': path.resolve(__dirname, '../src/request/axios'),
    '@wechatAdminComponents': path.resolve(__dirname, '../src/components/wechat-admin'),
    '@wechatAdminStatic': path.resolve(__dirname, '../static/wechat-admin'),
    '@plyjMallComponents': path.resolve(__dirname, '../src/components/plyj-mall'),
    '@plyjMallStatic': path.resolve(__dirname, '../static/plyj-mall')
  }
  for (let key in aliasConfig) {
    config.resolve.alias[key] = aliasConfig[key]
  }

  // 插件
  config.plugins.push(
    // new BundleAnalyzerPlugin()
  )

  config.module.rules.push(
    {
        test: /\.js$/,
        loaders: [ {
                loader: 'eslint-loader',
                options: {
                emitError: true,
                failOnError: true
                },
            }],
        include: path.resolve(__dirname, '../src')
    },
    {
        test: /\.scss$/,
        use: ['style-loader', 'css-loader', 'sass-loader'],
        include: path.resolve(__dirname, '../src'),
    }
  )

  // config.module.rules.push({
  //   test: /\.css$/,
  //   use: ['style-loader', 'css-loader'],
  // });

  //  config.module.rules.push({
  //   resourceQuery: /blockType=docs/,
  //   use: ['storybook-readme/docs-loader', 'html-loader', 'markdown-loader'],
  // });

  return config;
};
