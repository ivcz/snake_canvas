const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    entry: './src/index.ts',
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            },
        ],
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js']
    },
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'dist/build/'),
    },
    plugins: [
        new HtmlWebpackPlugin({
            title: 'snake',
            template: 'src/assets/index.html'
        })
    ],
    devServer: {
        port: 8888,
        hot: true,
        watchFiles: ['src/**/*.ts'],
        static: {
            directory: path.join(__dirname, 'dist'),
        }
    }
};

