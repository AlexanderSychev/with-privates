'use strict';

const webpack = require('webpack');
const path = require('path');

module.exports = {
    plugins: [
        new webpack.optimize.UglifyJsPlugin()
    ],
    entry: path.join(__dirname, 'src', 'showCase.tsx'),
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                loaders: [
                    {
                        loader: 'ts-loader',
                        options: {
                            configFile: path.join(__dirname, 'tsconfig.webpack.json'),
                        },
                    },
                ],
                exclude: [/node_modules/],
            },
        ],
    },
    resolve: {
        alias: {
            './withPrivates': path.join(__dirname, 'es6-module', 'withPrivates.js')
        },
        extensions: ['.tsx', '.ts', '.js'],
    },
    output: {
        filename: 'show-case.js',
        path: path.join(__dirname, 'test'),
    },
    externals: {
        'react': 'React',
        'react-dom': 'ReactDOM',
    }
};
