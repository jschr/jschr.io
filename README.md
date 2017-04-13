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

A scheduled Lambda function fetches a summary of my latest activity from Github, Twitter, and Medium. It then generates a new static website using this [webpack config](app/webpack.config.ts) and uploads the resulting build to S3.

Terraform is used to declaratively define and deploy all the required infrastructure to AWS after [setting a few environment variables](infrastructure/env-dev/vars.tfvars.sample) -- including a CloudFront distribution for super fast page loads and Route53 entries for your domain and emails (via Mailgun).

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
You can run the Lambda function by logging into the [aws console](http://console.aws.amazon.com) and heading over to the [Lambda management section](https://console.aws.amazon.com/lambda). Then go to Functions -> website_generator -> Test. If it ran successfully you will see the result of the CloudFront invalidation.


