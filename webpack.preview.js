const path = require('path')
const HtmlPlugin = require('html-webpack-plugin')
const TerserPlugin = require('terser-webpack-plugin')

const config = {
    entry: {
        app: './src/App/index.jsx',
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        chunkFilename: '[name].[chunkhash].chunk.js',
        filename: '[name]-[chunkhash].js',
    },
    optimization: {
        minimize: true,
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
        minimizer: [
            new TerserPlugin({
                terserOptions: {
                    output: {
                        comments: false,
                    },
                },
            }),
        ],
    },
    plugins: [
        new HtmlPlugin({
            template: './src/App/index.html',
            minify: {
                removeComments: true,
                collapseWhitespace: true,
                conservativeCollapse: true,
            },
        }),
    ],
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                include: [path.resolve(__dirname, 'src')],
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env', '@babel/preset-react'],
                        plugins: [
                            ['@babel/plugin-proposal-decorators', { legacy: true }],
                            ['@babel/plugin-proposal-class-properties', { loose: true }],
                        ],
                    },
                },
            },
            {
                test: /\.html$/,
                include: [path.resolve(__dirname, 'src')],
                use: [
                    {
                        loader: 'html-loader',
                        options: {
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
    stats: 'errors-only'
}

module.exports = config
