const path = require('path')
const { AureliaPlugin } = require('aurelia-webpack-plugin')

module.exports = {
    mode: 'development',
    devtool: 'inline-source-map',
    entry: {
        main: 'aurelia-bootstrapper', 
        'lemming.worker': './src/lib/lemming.worker.ts' 
    },
    output: {
        filename: '[name].js',
        //chunkFilename: '[name].js',
        path: path.resolve(__dirname, "dist"),
        publicPath: '/dist/'
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                loader: 'ts-loader',
                exclude: /node_modules/
            },
            {
                test: /\.css$/i,
                loader: 'css-loader',
                issuer: /\.html?$/i
            },
            {
                test: /\.css$/i,
                loader: ['style-loader', 'css-loader'],
                issuer: /\.[tj]s$/i
            },
            {
                test: /\.html$/i,
                use: 'html-loader'
            }
        ]
    },
    resolve: {
        extensions: ['.ts', '.js'],
        modules: ['src', 'node_modules'].map(x => path.resolve(x))
    },
    plugins: [
        new AureliaPlugin()
    ]
}