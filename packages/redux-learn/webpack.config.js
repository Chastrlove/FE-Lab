const path = require('path');
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
    entry: "./index.tsx",
    devtool: "cheap-module-source-map",
    devServer:{
        contentBase:false,
        //我这里没有设置contentBase，个人研究contentBase必须指向存在的bundle.js文件所在目录，
        //因为这里是开发模式，所以dist目录并不存在，所以用false.
        host:'localhost',
        port:'8888',
        inline:true,//webpack官方推荐
        compress:true,//一切服务都启用gzip 压缩
        historyApiFallback:true,//找不到页面默认跳index.html
        hot:true,//启动热更新，必须搭配new webpack.HotModuleReplacementPlugin()插件
        open:true,
    },
    output: {
        filename: 'bundle.js',
        path: path.join(__dirname, 'dist' ),
        devtoolModuleFilenameTemplate: ((info) => path.resolve(info.absoluteResourcePath).replace(/\\/g, "/")),
    },
    resolve: {
        extensions: [".ts", ".tsx", ".js", ".pcss", ".less", ".css", ".svg", ".html"],
    },
    module: {
        rules: [
            {
                test: /ts|tsx|js/,
                loader: 'babel-loader'
            }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            inject: true,
            template: "index.html",
            filename: `index.html`,
        }),
        new webpack.HotModuleReplacementPlugin(),
    ]

}
