# jschr.io

[![Build Status](https://travis-ci.com/jschr/jschr.io.svg?branch=production)](https://travis-ci.com/jschr/jschr.io)

The static website generator that powers my [personal website](http://jschr.io) and wrote about [in this post](https://hackernoon.com/building-a-static-website-generator-with-react-and-terraform-823be0b24b12).

Built with

- [React](https://facebook.github.io/react/)
- [Glamor](https://github.com/threepointone/glamor/)
- [Webpack 2](https://webpack.js.org/)
- [Webpack Static Site Generator](https://github.com/markdalgleish/static-site-generator-webpack-plugin/)
- [Terraform](https://www.terraform.io/)
- [Lambda](https://aws.amazon.com/lambda/)
- [S3](https://aws.amazon.com/s3/)
- [CloudFront](https://aws.amazon.com/cloudfront/)

## How it works

A scheduled Lambda function fetches a summary of latest activity from Github, Twitter, Reddit and Medium. It then generates a new static website using this [webpack config](app/webpack.config.ts) and uploads the resulting build to S3. Terraform is used to create the required resources in AWS.
