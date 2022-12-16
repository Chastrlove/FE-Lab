const nodeExternals = require('webpack-node-externals');

import path from "path";
import webpack from "webpack";
const  EnvPathPlugin = require('./resolve/EnvPathPlugin');
import {createFsFromVolume, Volume} from 'memfs';



export default (fixture) => {
    const basePath = path.dirname(fixture)

    const config = {
        target: ["web"],
        mode: "production",
        entry: fixture,
        output: {
            path: path.resolve(basePath),
            filename: "bundle_output.js",
            // library: undefined,
            // libraryTarget: 'commonjs2',
        },
        externalsPresets: { node: true },
        externals: [nodeExternals({
            importType: "import"
        })],
        optimization: {
            minimize: true
        },

        resolve: {
            modules: ["node_modules"],
            extensions: [
                ".ts",
                ".tsx",
                ".js",
                ".jsx",
                ".pcss",
                ".less",
                ".css",
                ".svg",
                ".html",
                ".json",
                ".d.ts",
            ],
            // plugins:[new EnvPathPlugin({
            //     paths: [
            //         path.resolve(__dirname, 'test/fixtures/brand/js'),
            //         path.resolve(__dirname, 'test/fixtures/core/js')
            //     ]
            // })]
        },
        module: {
            rules: [
                {
                    test: /\.js$/,
                    exclude: /node_modules/,
                    use: {
                        loader: 'babel-loader',
                    },
                },
            ],
        },
    }
    const compiler = webpack(config);

    compiler.outputFileSystem = getMemoryFileSystem()

    return new Promise((resolve, reject) => {
        compiler.run((err, stats) => {
            if (err) reject(err);
            if (stats.hasErrors()) reject((stats.toJson().errors));

            resolve({stats,compiler});
        });
    });
};

function getMemoryFileSystem() {
    const fs = createFsFromVolume(new Volume());
    fs .join = path.join.bind(path);
    return fs;
}