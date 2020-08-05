const path = require('path')
const webpack = require('webpack')
// const ExtractTextPlugin = require('extract-text-webpack-plugin')
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin')
const {VueLoaderPlugin} = require('vue-loader')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const StyleLintPlugin = require('stylelint-webpack-plugin');

const isProd = process.env.NODE_ENV === 'production';
module.exports = {
    mode: isProd
        ? 'production'
        : 'development',
    entry: isProd ? {
        critical: './src/assets/scss/critical.scss',
        main: './src/assets/scss/main.scss'
    } : {
        // critical: './src/assets/scss/critical.scss',
        // main: './src/assets/scss/main.s3css'
    },
    devtool: isProd
        ? false
        : '#cheap-module-source-map',
    output: {
        path: path.resolve(__dirname, '../dist'),
        publicPath: '/dist/',
        filename: '[name].[chunkhash].js'
    },
    resolve: {
        alias: {
            'public': path.resolve(__dirname, '../public')
        }
    },
    resolveLoader: {
        modules: ['node_modules', __dirname]
    },
    module: {
        noParse: /es6-promise\.js$/, // avoid webpack shimming process
        rules: [
            {
                test: /\.svg$/,
                loader: 'vue-svg-loader',
                options: {
                    svgo: {
                        plugins: [
                            { collapseGroups: false },
                            { removeEmptyContainers: false },
                            {cleanupIDs: false},
                            {removeViewBox: false},
                        ],
                    },
                },
            },
            {
                test: /\.css$/,
                use: [
                    'vue-style-loader',
                    'css-loader',

                ],
            },
            {
                enforce: 'pre',
                test: /\.vue$/,
                loader: 'eslint-loader',
                options: {
                    fix: true
                }
            },
            {
                test: /\.vue$/,
                loader: 'vue-loader',
                options: {
                    compilerOptions: {
                        preserveWhitespace: false
                    }
                }
            },

            {
                enforce: 'pre',
                test: /\.js$/,
                loader: 'eslint-loader',
                options: {
                    fix: true
                }
            },
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: 'babel-loader',
            },
            {
                test: /\.(png|jpg|gif)$/,
                loader: 'url-loader',
                options: {
                    limit: 10000,
                    name: '[name].[ext]?[hash]'
                }
            },
            {
                test: /\.scss$/,
                use: isProd
                    ?
                    [
                        MiniCssExtractPlugin.loader,
                        'css-loader',
                        {
                            loader: 'postcss-loader',
                            options: {
                                sourceMap: true,
                                config: {
                                    path: `./build/postcss.config.js`
                                }
                            }
                        },
                        'sass-loader'
                    ]
                    // ['vue-style-loader', 'css-loader', 'sass-loader']
                    // ExtractTextPlugin.extract({
                    //     use: [
                    //         {
                    //             loader: 'css-loader',
                    //             options: {minimize: true}
                    //         },
                    //         {
                    //             loader: 'sass-loader',
                    //             options: {minimize: true}
                    //         },
                    //         // 'sass-loader'
                    //     ],
                    //     fallback: 'vue-style-loader'
                    // })
                    : ['vue-style-loader', 'css-loader', 'sass-loader']
            },
            {
                test: /\.pug$/,
                loader: 'pug-plain-loader'
            },
            {
                test: /\.(frag|vert|glsl)$/,
                use: [
                    {
                        loader: 'glsl-shader-loader',
                        options: {}
                    }
                ]
            }
        ]
    },
    performance: {
        maxEntrypointSize: 300000,
        hints: isProd ? 'warning' : false
    },
    optimization: {
        minimizer: [
            new UglifyJsPlugin({
                cache: true,
                parallel: true,
                uglifyOptions: {
                    compress: false,
                    ecma: 6,
                    mangle: true
                },
                sourceMap: true
            }),
            new OptimizeCSSAssetsPlugin({})
        ]
    },
    plugins: isProd
        ? [
            new VueLoaderPlugin(),
            // new webpack.optimize.UglifyJsPlugin({
            //   compress: { warnings: false }
            // }),
            new webpack.optimize.ModuleConcatenationPlugin(),
            // new ExtractTextPlugin({
            //     filename: 'common.[chunkhash].css'
            // })
            new MiniCssExtractPlugin({
                // Options similar to the same options in webpackOptions.output
                // both options are optional
                filename: '[name].min.[chunkhash].css'
            })
        ]
        : [
            new VueLoaderPlugin(),
            new FriendlyErrorsPlugin(),
            new StyleLintPlugin({
                files: ['**/*.{vue,htm,html,sss,less,scss,sass}'],
                fix: true
            })
        ]
}