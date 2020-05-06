const path = require('path');
const updateWebpackConfig = require('storybook-readme/vue/updateWebpackConfig');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const pxtoviewport = require('postcss-px-to-viewport');

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
        '@': path.resolve(__dirname, '../src'),
        '@apis': path.resolve(__dirname, '../src/request/axios'),
        '@wechatAdminComponents': path.resolve(__dirname, '../src/components/wechat-admin'),
        '@wechatAdminStatic': path.resolve(__dirname, '../static/wechat-admin'),
        '@plyjMallComponents': path.resolve(__dirname, '../src/components/plyj-mall'),
        '@plyjMallStatic': path.resolve(__dirname, '../static/plyj-mall')
    }
    for (let key in aliasConfig) {
        config.resolve.alias[key] = aliasConfig[key]
    }

    config.module.rules.push(
        {
            test: /\.js$/,
            loaders: [{
                loader: 'eslint-loader',
                options: {
                    emitError: true,
                    failOnError: true
                },
            }],
            include: path.resolve(__dirname, '../src')
        },
        {
            test: /\.less$/,
            use: [
                'style-loader',
                 'css-loader', 
                 {
                    loader: 'sass-loader',
                    options: {
                        prependData: `@import "@/components/pl-ui/assets/scss/config.scss";`
                    }
                 }
                ],
            include: path.resolve(__dirname, '../src'),
        },
        {
            test: /\.scss$/,
            use: [
                // 'vue-style-loader',
                'style-loader',
                {
                    loader: 'css-loader',
                    options: { 
                        modules: {
                            localIdentName: '[local]-[hash:base64:5]',
                        },
                        localsConvention: 'camelCase'
                    }
                },
                'sass-loader',
                {
                    loader: 'postcss-loader',
                    options: {
                        // ident: 'postcss',
                        plugins: loader => [
                            require('postcss-px-to-viewport')({
                                viewportWidth: 750,
                                unitPrecision: 6,
                                minPixelValue: 1,
                                viewportUnit: 'vw',
                                fontViewportUnit: 'vw',
                                mediaQuery: false,
                                selectorBlackList: ['html', 'body'],
                                exclude: /node_modules/
                            })
                        ]
                    }
                },
            ]
        }
    )

    // 插件
    config.plugins.push(
        // new BundleAnalyzerPlugin()
        // pxtoviewport({
        //     viewportWidth: 750,
        //     unitPrecision: 6,
        //     minPixelValue: 1,
        //     viewportUnit: 'vw',
        //     fontViewportUnit: 'vw',
        //     mediaQuery: false,
        //     selectorBlackList: ['html', 'body'],
        //     exclude: /node_modules/
        // })
    )

    return config;
};
