import * as path from 'path'
import * as webpack from 'webpack'
import * as StaticSiteGeneratorPlugin from 'static-site-generator-webpack-plugin'

import getProps from './getProps'

export default async function createWebpackConfig(): Promise<
  webpack.Configuration
> {
  const isProduction = process.env.NODE_ENV === 'production'

  // fetch the latest app props
  const appProps = await getProps()

  return {
    devtool: 'source-map',

    entry: {
      main: path.resolve(__dirname, isProduction ? 'index.js' : 'index.ts'),
    },

    output: {
      filename: `[name].js`,
      path: path.resolve(__dirname, 'build'),
      libraryTarget: 'umd',
      globalObject: 'this',
    },

    resolve: {
      extensions: ['.ts', '.tsx', '.js'],
    },

    optimization: {
      minimize: isProduction,
    },

    module: {
      rules: [
        {
          test: /\.tsx?$/,
          use: ['ts-loader'],
          exclude: /node_modules/,
        },

        {
          test: /\.(jpe?g|png|gif|svg)$/,
          use: ['url-loader?limit=10000'],
          exclude: /node_modules/,
        },

        {
          test: /\.(woff|woff2|ttf|eot)$/,
          loader: 'base64-inline-loader',
        },
      ],
    },

    plugins: [
      new webpack.DefinePlugin({
        'process.env': {
          NODE_ENV: JSON.stringify(process.env.NODE_ENV),
        },
      }),

      new StaticSiteGeneratorPlugin({
        paths: ['/'],
        locals: {
          appProps,
          enableDevServer: !isProduction,
          enableGoogleAnalytics: isProduction,
          trackingId: process.env.GA_TRACKING_ID,
        },
      }),
    ],
  }
}
