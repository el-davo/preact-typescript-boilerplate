import * as BabelPlugin from 'babel-webpack-plugin';
import {CleanWebpackPlugin} from 'clean-webpack-plugin';
import * as ExtractTextPlugin from 'extract-text-webpack-plugin';
import * as HtmlWebpackPlugin from 'html-webpack-plugin';
import * as CompressionPlugin from 'compression-webpack-plugin';
import * as merge from 'webpack-merge';
import {DefinePlugin, optimize} from 'webpack';
import * as Uglify from 'uglifyjs-webpack-plugin';
import {baseConfig} from './webpack.base';

module.exports = merge(baseConfig, {
    devtool: 'cheap-module-source-map',

    entry: [
        'babel-polyfill',
        './app/index'
    ],

    output: {
        publicPath: './',
        filename: 'bundle-[chunkhash].js'
    },

    module: {
        rules: [
            {
                test: /\.global\.css$/,
                loader: ExtractTextPlugin.extract({fallback: 'style-loader', use: 'css-loader'})
            },
            {
                test: /^((?!\.global).)*\.css$/,
                loader: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: 'css-loader?modules&importLoaders=1&localIdentName=[local]'
                })
            }
        ]
    },

    plugins: [
        new optimize.OccurrenceOrderPlugin(true),
        new CleanWebpackPlugin({}),
        new DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV)
        }),
        new BabelPlugin({
            test: /\.js$/,
            presets: ['es2015', 'stage-0'],
            sourceMaps: false,
            compact: false
        }),
        new optimize.ModuleConcatenationPlugin(),
        new Uglify({}),
        new ExtractTextPlugin({filename: 'style-[contenthash].css', allChunks: true}),
        new HtmlWebpackPlugin({template: 'index.ejs'}),
        new CompressionPlugin({
            algorithm: 'gzip',
            test: /\.js$|\.html$/,
            minRatio: 0.8
        })
    ]

});
