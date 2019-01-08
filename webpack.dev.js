const path = require('path')
const HtmlPlugin = require('html-webpack-plugin')
const webpack = require('webpack')

const ENV = {
    DEVELOPMENT: 'development',
}

const config = {
    entry: {
        app: './src/App/index.jsx',
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        chunkFilename: '[name].[chunkhash].chunk.js',
        filename: '[name].js',
    },
    optimization: {
        minimize: false,
        splitChunks: {
            cacheGroups: {
                default: false,
                commons: {
                    test: /node_modules/,
                    name: 'lib',
                    chunks: 'initial',
                    minSize: 1,
                },
            },
        },
    },
    devServer: {
        contentBase: path.resolve(__dirname, 'dist'),
        open: true,
        hot: true,
    },
    mode: ENV.DEVELOPMENT,
    plugins: [
        new HtmlPlugin({
            template: './src/App/index.html',
            minify: {
                removeComments: true,
                collapseWhitespace: true,
                conservativeCollapse: true,
            },
        }),
        new webpack.HotModuleReplacementPlugin(),
    ],
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                use: 'babel-loader',
            },
            {
                test: /\.html$/,
                exclude: /node_modules/,
                use: [
                    {
                        loader: 'html-loader',
                        options: {
                            attrs: false, // Don't require images
                            minimize: true,
                            removeComments: true,
                            collapseWhitespace: true,
                            conservativeCollapse: true,
                        },
                    },
                ],
            },
        ],
    },
    resolve: {
        extensions: ['.js', '.jsx'],
    },
}

module.exports = config
