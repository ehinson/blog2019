const HtmlWebPackPlugin = require("html-webpack-plugin");
const webpack = require('webpack');
const path = require('path');

module.exports = {
    entry: './client/src/index.js',
    mode: "development",
    output: {
        path: path.resolve(__dirname, "dist/"),
        publicPath: "/dist/",
        filename: "bundle.js"
    },
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader",
                    options: {
                        presets: ["@babel/env", ]
                    },
                }
            },
            {
                test: /\.html$/,
                use: [
                    {
                        loader: "html-loader"
                    }
                ]
            },
            {
                test: /\.css$/,
                use: ["style-loader", "css-loader"]
            }
        ]
    },
    resolve: { 
        extensions: ["*", ".js", ".jsx"],
        alias: {
            'react-dom': '@hot-loader/react-dom'
          }
     },
    devServer: {
        contentBase: path.join(__dirname, "public/"),
        port: 3000,
        publicPath: "http://localhost:3000/dist/",
        hotOnly: true,
        compress: true,
        historyApiFallback: true,
        overlay: {
            warnings: true,
            errors: true
        },
        proxy: {
            '/api': {
              target: 'http://localhost:4000',
              pathRewrite: {'^/api' : ''}
            }
          }
    },
    plugins: [
        new webpack.HotModuleReplacementPlugin(),
        new webpack.ProgressPlugin(),
        new HtmlWebPackPlugin()
    ]
};