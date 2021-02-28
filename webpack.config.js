const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');

module.exports = {
    mode: 'development',
    entry: {
        app:'./src/index.js',
        ui:'./src/synth-ui.js',
        core:'./src/synth-core.js',
        scales:'./src/synth-scales.js',
        control:'./src/synth-control.js'
    },
    plugins: [
        new HtmlWebpackPlugin({
            template:path.resolve(__dirname, "src/index.html")
        }),
        new CleanWebpackPlugin({})
    ],
    devtool: "inline-source-map",
    devServer: {
        contentBase: "/dist"
    },
    output: {
        filename: '[name].bundle.js',
        path: path.resolve(__dirname, "dist")
    },
    module: {
        rules: [
            {
                test: /\.css$/,
                use: [
                    "style-loader",
                    "css-loader"
                ]
            }

        ]
    }
}