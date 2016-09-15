module.exports = {
    entry: {
        "engine": "./src/engine.js",
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
    }
};