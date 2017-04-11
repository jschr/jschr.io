# jschr.io - a static website generator

The stack that powers my powers my [personal website](http://jschr.io).

Featuring

 * [React](https://facebook.github.io/react/)
 * [Webpack 2](https://webpack.js.org/)
 * [Webpack Static Site Generator](https://github.com/markdalgleish/static-site-generator-webpack-plugin)
 * [Terraform](https://www.terraform.io/)
 * [Lambda](https://aws.amazon.com/lambda/)
 * [S3](https://aws.amazon.com/s3/)
 * [CloudFront](https://aws.amazon.com/cloudfront/)
 * [Mailgun](https://www.mailgun.com/)
 * [Google Analytics](https://www.google.com/analytics/)

 ## How it works

A scheduled Lambda function fetches a summary of my latest activity from Github, Twitter, and Medium. It then generates a new static website using a this [webpack config](app/webpack.config.ts) and uploads the resulting build to S3.

Terraform is used to declaratively define and deploy all the required infrastructure to AWS after [setting a few environment variables](infrastructure/env-dev/vars.tfvars.sample) -- including a CloudFront distribution for super fast page loads and Route53 entries for your domain and emails (via Mailgun).

## Quick start

Install terraform from the [downloads page](https://www.terraform.io/downloads.html)
```
open https://www.terraform.io/downloads.html
```

Clone the repository (without history)
```
git clone --depth=1 git@github.com:jschr/jschr.io.git example.com
```

Install NPM dependencies
```
cd example.com
yarn install
```

Set environment variables
```
cd instructure/env-dev
mv vars.tfvars.sample vars.tfvars # rename sample file
open vars.tfvars # set env vars
```

Development
```
mv .env.sample .env # rename sample file
open .env # set env vars for development

yarn start # starts webpack dev server
open localhost:8080
```

Deploy infrastructure
```
yarn run terraform-plan # review the infrastructure changes
yarn run deploy
```

Deploying will take a few minutes but you'll need to wait about 15-20 minutes before the CloudFront distribution is created. By then the Lambda function should have ran to generate the website.

## Manually triggering the Lambda
You can test the Lambda function by logging into the [aws console](http://console.aws.amazon.com) and heading over to the [Lambda management section](https://console.aws.amazon.com/lambda). Then go to Functions -> website_generator -> Test. If it ran successfully you will see the result of the CloudFront invalidation.


