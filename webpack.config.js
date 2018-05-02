const webpack = require("webpack");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = {
    output: {
        path: __dirname + '/dist',
        filename: 'index.js',
        libraryTarget: 'umd'
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /(node_modules)/,
                loader: "babel-loader",
                query: {
                    presets: ["env", "react", "stage-3"]
                }
            },
            {
                test: /\.css$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    "css-loader"
                ]
            }
        ]
    },
    plugins: [
        new MiniCssExtractPlugin({
            filename: "styles.css"
        })
    ],
    externals: {
        'react': 'react',
        'react-dom': 'react-dom',
        'react-resize-detector': 'react-resize-detector'
    }
};
