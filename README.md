# jschr.io - a static website generator

The stack that powers my [personal website](http://jschr.io) and wrote about [in this post](https://hackernoon.com/building-a-static-website-generator-with-react-and-terraform-823be0b24b12).

Featuring

 * [React](https://facebook.github.io/react/)
 * [Glamor](https://github.com/threepointone/glamor/)
 * [Webpack 2](https://webpack.js.org/)
 * [Webpack Static Site Generator](https://github.com/markdalgleish/static-site-generator-webpack-plugin/)
 * [Terraform](https://www.terraform.io/)
 * [Lambda](https://aws.amazon.com/lambda/)
 * [S3](https://aws.amazon.com/s3/)
 * [CloudFront](https://aws.amazon.com/cloudfront/)

 ## How it works

A scheduled Lambda function fetches a summary of latest activity from Github, Twitter, Reddit and Medium. It then generates a new static website using this [webpack config](app/webpack.config.ts) and uploads the resulting build to S3.

Terraform is used to create the required resources in AWS after [setting a few environment variables](infrastructure/env-dev/vars.tfvars.sample), including Route53 entries for your domain and emails (via Mailgun).

## Quick start

Install terraform from the [downloads page](https://www.terraform.io/downloads.html)

```bash
open https://www.terraform.io/downloads.html
```

Clone the repository (without history)

```bash
git clone --depth=1 git@github.com:jschr/jschr.io.git example.com
```

Install app dependencies

```bash
yarn install
```

Set environment variables

```bash
cd instructure/env-dev
mv vars.tfvars.sample vars.tfvars # rename sample file
open vars.tfvars # set env vars
```

Development

```bash
mv .env.sample .env # rename sample file
open .env # set env vars for development

yarn start # starts webpack dev server
open localhost:8080
```

Deploy infrastructure

```bash
yarn run terraform-plan # review the infrastructure changes
yarn run deploy
```

Deploying will take a few minutes but you'll need to wait about 15-20 minutes before the CloudFront distribution is created. By then the Lambda function should have ran to generate the website.

## Manually triggering the Lambda
You can invoke the Lambda function by logging into the [aws console](http://console.aws.amazon.com) and heading over to the [Lambda management section](https://console.aws.amazon.com/lambda).

Then go to Functions -> website_generator -> Test.

If it ran successfully you will see the result of the CloudFront invalidation.

## Customizing

You can create your own [components](app/components) to customize the look and feel.

Modify the props passed to your components in [getProps](app/getProps.ts).

You can add more [data sources](app/sources) to make your site more dynamic.

Feel free to [create an issue](https://github.com/jschr/jschr.io/issues) with any questions about deploying your own version!

## What does it cost?

You are mosly paying for CloudFront invalidations which happens once every 15 minutes. The first 1000 invalidations are free, afterwhich it's $0.005 per invalidation path. With the default settings thats about 2,880 invaldations per month.

My bill is ~$10/mo USD.
