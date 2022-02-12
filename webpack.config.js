const path = require("path");

const webpack = require("webpack");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const WebpackAssetsManifest = require("webpack-assets-manifest");
const LiveReloadPlugin = require("webpack-livereload-plugin");
const { VueLoaderPlugin } = require("vue-loader");

require("dotenv-defaults").config();
const env = process.env;

// let sslConfig = {};

// if (
//     env.LIVE_RELOAD &&
//     env.LR_PROTOCOL === 'https' &&
//     env.SSL_CERT &&
//     fs.existsSync(env.SSL_CERT) &&
//     env.SSL_KEY &&
//     fs.existsSync(env.SSL_KEY)
// ) {
//     sslConfig.cert = fs.readFileSync(env.SSL_CERT);
//     sslConfig.key = fs.readFileSync(env.SSL_KEY);
// }

module.exports = ({ dev = false }) => ({
    mode: dev ? "development" : "production",
    devtool: dev ? "source-map" : false,
    watchOptions: {
        ignored: /node_modules/,
    },
    entry: {
        "/app": ["./src/app.js", "./src/app.scss"],
    },
    output: {
        filename: dev ? "[name].js" : "[name].[fullhash:6].js",
        chunkFilename: dev ? "[name].js" : "[name].[fullhash:6].js",
        path: path.resolve(__dirname, "dist"),
        publicPath: "./dist/",
    },
    optimization: {
        minimize: !dev,
        // minimizer: [
        //     new OptimizeCSSAssetsPlugin({
        //         assetNameRegExp: /\.css$/g,
        //         cssProcessor: require('cssnano'),
        //         // cssProcessorPluginOptions: {
        //         //     preset: ['default', { discardComments: { removeAll: false } }],
        //         // },
        //         canPrint: true
        //     }),
        // ],
        runtimeChunk: { name: "/manifest" },
        splitChunks: { cacheGroups: {}, chunks: "initial", name: "/vendor" },
    },
    stats: {
        // Controls build output
        assets: true,
        assetsSort: "field", // id | name | size | chunks | failed | issuer | field | !field (reverse sort)
        builtAt: true,
        cached: false,
        cachedAssets: false,
        children: false,
        chunks: false,
        chunkGroups: false,
        chunkModules: false,
        chunkOrigins: false,
        chunksSort: "field", // see asset sort fields
        // context: "../src/",
        colors: true,
        depth: false,
        entrypoints: false,
        env: true,
        errors: true,
        errorDetails: true,
        hash: false,
        // maxModules: 15,
        modules: false,
        // modulesSort: "field",
        moduleTrace: false,
        // outputPath: true | false,
        // performance: true, // Show performance hint when file size exceeds `performance.maxAssetSize`
        // providedExports: false,
        publicPath: true,
        reasons: true,
        source: true,
        timings: false,
        usedExports: false,
        version: false,
        warnings: false,
    },
    module: {
        rules: [
            {
                test: /\.vue$/,
                loader: "vue-loader",
            },
            {
                // Sass
                test: /\.s?css$/,
                use: [
                    {
                        loader: MiniCssExtractPlugin.loader,
                        // options: {
                        //     sourceMap: true
                        // }
                    },
                    {
                        loader: "css-loader",
                        options: {
                            sourceMap: !!dev,
                            url: false,
                        },
                    },
                    {
                        loader: "sass-loader",
                    },
                ],
            },
            {
                test: /\.tsx?$/,
                use: [
                    {
                        loader: "babel-loader",
                    },
                    {
                        loader: "ts-loader",
                        options: {
                            appendTsSuffixTo: [/\.vue$/],
                        },
                    },
                ],
                exclude: /node_modules/,
            },
            {
                // Babel Transpiler
                test: /\.m?js$/,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader",
                },
            },
            {
                test: /\.(png|svg|jpe?g|gif)$/,
                use: [
                    {
                        loader: "file-loader",
                        options: {
                            esModule: false,
                        },
                    },
                ],
            },
        ],
    },
    resolve: {
        extensions: [".js", ".ts"],
        alias: {
            "~": path.resolve(__dirname, "src"),
            "~vue": path.resolve(__dirname, "src/vue"),
        },
    },
    plugins: [
        // TODO: Reimplement this when !dev, because exec is undefined
        // { // Flush the W3 Cache on rebuild
        // 	apply: (compiler) => {
        // 		compiler.hooks.afterEmit.tap('FlushCache', (compilation) => {
        // 			console.log('Flushing W3 Total Cache...');
        // 			exec('wp w3-total-cache flush all', (err, stdout, stderr) => {
        // 				if ( err ) { console.log(err) }
        // 				console.log(stdout);
        // 				if ( stderr ) { console.error(`stderr: ${stderr}`) };
        // 			});
        // 		});
        // 	}
        // },
        new webpack.DefinePlugin({
            PRODUCTION: dev ? "false" : "true",
            ...stringifyValues(env),
        }),
        new VueLoaderPlugin(),
        new CleanWebpackPlugin(),
        new MiniCssExtractPlugin({
            filename: dev ? "[name].css" : "[name].[fullhash:6].css",
        }),
        new WebpackAssetsManifest({}),
        new LiveReloadPlugin({
            useSourceHash: true,
            protocol: env.LR_PROTOCOL ? env.LR_PROTOCOL : "http",
            port: env.LR_PORT ? env.LR_PORT : 9000,
            ignore: ["manifest.json", "*.map"],
            // ...sslConfig
        }),
    ],
});

function stringifyValues(sourceObject) {
    let destObject = {};

    for (let key in sourceObject) {
        destObject[key] = JSON.stringify(sourceObject[key]);
    }

    return destObject;
}
