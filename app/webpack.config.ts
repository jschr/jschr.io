import * as path from 'path'
import * as webpack from 'webpack'
import * as StaticSiteGeneratorPlugin from 'static-site-generator-webpack-plugin'

import getProps from './getProps'

export default async function createWebpackConfig(): Promise<webpack.Configuration> {
  const isProduction = process.env.NODE_ENV === 'production'

  const appProps = await getProps({
    name: process.env.NAME,
    description: process.env.DESCRIPTION,
    email: process.env.EMAIL,
    github: process.env.GITHUB_USERNAME,
    twitter: process.env.TWITTER_USERNAME,
    medium: process.env.MEDIUM_USERNAME,
    linkedIn: process.env.LINKEDIN_USERNAME,
    linkedInPosition: process.env.LINKEDIN_POSITION
  })

  return {
    devtool: 'source-map',

    entry: {
      main: path.resolve(__dirname, isProduction ? 'index.js' : 'index.ts')
    },

    output: {
      filename: `[name].js`,
      path: path.resolve(__dirname, 'build'),
      libraryTarget: 'umd'
    },

    resolve: {
      extensions: ['.ts', '.tsx', '.js']
    },

    module: {
      loaders: [
        // we need to run js through babel because uglify doesn't support all of es2015
        // https://github.com/terinjokes/gulp-uglify/issues/66
        {
          test: /\.tsx?$/,
          loaders: [
            'babel-loader?presets[]=es2015',
            'awesome-typescript-loader',
          ],
          exclude: /node_modules/
        },

        // still need babel loader for compiling js in lambda
        {
          test: /\.js?$/,
          loaders: [
            'babel-loader?presets[]=es2015',
          ],
          exclude: /node_modules/
        },

        {
          test: /\.(jpe?g|png|gif|svg)$/,
          loaders: [
            'url-loader?limit=10000',
          ],
          exclude: /node_modules/
        },

        {
          test: /\.(woff|woff2|ttf|eot)$/,
          loader: 'base64-font-loader'
        }
      ]
    },

    plugins: [
      new webpack.DefinePlugin({
        'process.env': {
          'NODE_ENV': JSON.stringify(process.env.NODE_ENV)
        }
      }),

      ...(isProduction
        ? [
          new webpack.optimize.UglifyJsPlugin({
            compress: {
              screw_ie8: true
            }
          })
        ]
        : [
          // no dev specific plugins
        ]
      ),

      new StaticSiteGeneratorPlugin({
        paths: ['/'],
        locals: {
          appProps,
          enableGoogleAnalytics: isProduction,
          trackingId: process.env.GA_TRACKING_ID,
          enableDevServer: !isProduction
        }
      })
    ]
  }
}