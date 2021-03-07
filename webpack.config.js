const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const Dotenv = require('dotenv-webpack');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');


//Mi objeto a exportar

module.exports = {
    //punto de entrada de mi aplicacion
    entry: './src/index.js',
    //Salida del resultado
    output : {
        //Obtenemos la raiz de mi aplicacion
        path: path.resolve(__dirname, 'dist'),
        //Nombre del archivo de salida
        filename: '[name].[contenthash].js',
        assetModuleFilename: 'assets/images/[hash][ext][query]'
    },
    //que extensiones vamos a trabajar en este proyecto
    resolve :{
        //aqui podemos manejar archivos .jsx,.svelte 
        //entre otros
        extensions :['.js'],
        alias:{
            '@utils': path.resolve(__dirname,'src/utils/'),
            '@templates': path.resolve(__dirname,'src/templates/'),
            '@styles': path.resolve(__dirname,'src/styles/'),
            '@images': path.resolve(__dirname,'src/assets/images/'),
        }
    },
    module: {
        rules: [
            {
                // Test declara que extensión de archivos aplicara el loader
                test: /\.m?js$/,
                // Exclude permite omitir archivos o carpetas especificas
                exclude: /node_modules/,
                // Use es un arreglo u objeto donde dices que loader aplicaras
                use: {
                    loader: "babel-loader"
                }            
            },
            {
                test: /\.css|.styl$/i,
                use: [ MiniCssExtractPlugin.loader, 'css-loader' ]
            },
            {
                test: /\.(woff|woff2)$/,
                use:{
                    loader: 'url-loader',
                    options:{
                        limit: 10000,
                        mimetype: "application/font-woff",
                        name: "[name].[contenthash].[ext]",
                        outputPath: "./assets/fonts",
                        publicPath: "../assets/fonts",
                        esModule: false,
                    }
                }
                //type: "asset/resource"
            },
            {
                test: /\.png/,
                type: "asset/resource"
            }

        ]
    },

    // SECCION DE PLUGINS
    plugins: [
        new HtmlWebpackPlugin({ // CONFIGURACIÓN DEL PLUGIN
            inject: true, // INYECTA EL BUNDLE AL TEMPLATE HTML
            template: './public/index.html', // LA RUTA AL TEMPLATE HTML
            filename: './index.html' // NOMBRE FINAL DEL ARCHIVO
        }),
        new MiniCssExtractPlugin({
            filename: 'assets/[name].[contenthash].css'
        }), // INSTANCIAMOS EL PLUGIN
        new CopyPlugin({ // CONFIGURACIÓN DEL COPY PLUGIN
            patterns: [
                {
                    from: path.resolve(__dirname , "src" , "assets/images"), // CARPETA A MOVER AL DIST
                    to: "assets/images" // RUTA FINAL DEL DIST
                }
            ]
        }),
        new Dotenv()
    ],
    optimization: {
        minimize: true,
        minimizer: [
          new CssMinimizerPlugin(),
          new TerserPlugin(),
          new CleanWebpackPlugin()
        ]
      }
}