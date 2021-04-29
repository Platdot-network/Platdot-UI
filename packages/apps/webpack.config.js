
// Copyright 2017-2020 @polkadot/apps authors & contributors
// SPDX-License-Identifier: Apache-2.0

const fs = require('fs');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const AliosscdnWebpackPlugin = require('aliosscdn-webpack-plugin')
const path = require('path');
const { merge } = require('webpack-merge');
const baseConfig = require('./webpack.base.config');
const ENV = process.env.NODE_ENV || 'development';
const context = __dirname;
const hasPublic = fs.existsSync(path.join(context, 'public'));

const dotenv = require('dotenv')
dotenv.config()
const CLIENT = JSON.parse(process.env.CLIENT)

module.exports = merge(
  baseConfig(ENV, context),
  {
    devtool: process.env.BUILD_ANALYZE ? 'source-map' : false,
    plugins: [
      new HtmlWebpackPlugin({
        PAGE_TITLE: 'Platdot',
        meta: {'viewport': 'width=device-width,initial-scale=1,minimum-scale=1,maximum-scale=1,user-scalable=no,viewport-fit=cover'},
        inject: true,
        template: path.join(context, `${hasPublic ? 'public/' : ''}index.html`)
      }),
      new AliosscdnWebpackPlugin({
        https: true,
        directoryInOss: 'platdot/v1.1.6',
        filesPath: `${__dirname}/build`,
        region: CLIENT.region,
        accessKeyId: CLIENT.accessKeyId,
        accessKeySecret: CLIENT.accessKeySecret,
        bucket: CLIENT.bucket,
      })
    ]
  }
);
