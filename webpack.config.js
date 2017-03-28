var webpack = require('webpack');

module.exports = {
    entry: {
        "engine": "./src/engine.js",
        "engine.min": "./src/engine.js",
        "playground/playground": "./playground/main.js"
    },
    output: {
        path: __dirname,
        filename: "[name].js"
    },
    module: {
        loaders: [
            { test: /\.css$/, loader: "style!css" }
        ]
    },
    plugins: [
        new webpack.optimize.UglifyJsPlugin({
            include: /\.min\.js$/,
            minimize: true,
            compress: {
                warnings: false
            }
        })
    ]
};