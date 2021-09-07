const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const TsConfigPathsPlugin = require('tsconfig-paths-webpack-plugin');

module.exports = {
    entry: './src/index.ts',
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            },
            {
                test: /\.s[ac]ss$/i,
                use: ['style-loader', 'css-loader', 'sass-loader'],
            },
        ],
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js'],
        plugins: [new TsConfigPathsPlugin({})],
    },
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'dist/build/'),
    },
    plugins: [
        new HtmlWebpackPlugin({
            hash: true,
            title: 'snake',
            template: 'src/assets/index.html',
            path: path.resolve(__dirname, './dist')
        })
    ],
    devServer: {
        port: 8888,
        hot: true,
        watchFiles: ['src/**/*.ts', 'src/**/*.html'],
        static: {
            directory: path.join(__dirname, 'dist'),
        }
    }
};

