import * as path from 'path'
import * as webpack from 'webpack'
import * as mime from 'mime'
import * as AWS from 'aws-sdk'
import { promisify } from 'bluebird'
import MemoryFileSystem = require('memory-fs')
import * as zlib from 'zlib'

import createWebpackConfig from './webpack.config'

const s3 = new AWS.S3()
const cloudfront = new AWS.CloudFront()
const gzip = promisify(zlib.gzip)

interface File {
  name: string
  type: string
  contents: Buffer
}

export default function handler(event, context, callback) {
  run()
    .then((result) => callback(null, result))
    .catch((err) => callback(err))
}

async function run(): Promise<any> {
  // create webpack config from latest latest props
  const config = await createWebpackConfig()
  // compile with webpack
  const files = await compile(config)
  // upload files to s3
  await Promise.all(files.map(upload))
  // invalidate cache
  const invalidation = await invalidate()

  return invalidation
}

async function compile(config: webpack.Configuration): Promise<File[]> {
  const compiler = webpack(config)
  const fs = new MemoryFileSystem()

  compiler.outputFileSystem = fs

  const compile = promisify(compiler.run, { context: compiler })
  const stats = await compile()

  if (stats.hasErrors())
    throw new Error(`Compiler error: ${stats.toJson().errors[0]}`)

  // constructs the list of files that were created by the webpack compiler
  const files = fs.readdirSync(config.output.path).map((name) => ({
    name,
    type: mime.lookup(name),
    contents: fs.readFileSync(path.resolve(config.output.path, name))
  }))

  return files
}

async function upload(file: File): Promise<any> {
  const contents = await gzip(file.contents)
  // cache html for 2 minutes and other assets for 2 hours
  const expiresIn = file.type === 'text/html' ? 120 : 7200

  const params = {
    Bucket: process.env.S3_BUCKET,
    ACL: 'public-read',
    Key: file.name,
    ContentType: `${file.type};charset=utf-8`,
    ContentEncoding: 'gzip',
    CacheControl: `max-age=${expiresIn}`,
    Body: contents
  }

  return s3.putObject(params).promise()
}

async function invalidate(): Promise<any> {
  const params = {
    DistributionId: process.env.CF_DISTRIBUTION,
    InvalidationBatch: {
      CallerReference: `${+(new Date())}`,
      Paths: {
        Quantity: 1,
        Items: ['/*']
      }
    }
  }

  return cloudfront.createInvalidation(params).promise()
}
