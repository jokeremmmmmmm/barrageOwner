// html压缩
// js css分离
// var ExtractTextPlugin = require('extract-text-webpack-plugin');
var path = require('path')
var webpack = require('webpack')

module.exports = {
    entry: {
        main: './js/getBarrageOwner.js'
    },
    output: {
        path: path.join(__dirname, './dist'),
        filename: 'build.js',
    },
    module: {
        rules: [
            // js 文件
            {
                test: /\.js$/,
                loader: 'babel-loader',
                options: {
                    presets: ['es2015'],
                    plugins: ['transform-runtime']
                },
                exclude: /node_modules/
            }, {
                test: require.resolve('jquery'),
                use: [{
                    loader: 'expose-loader',
                    options: '$',
                }, ],
            }
        ]
    },

}