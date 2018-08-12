variable "domain" {}
variable "region" {}
variable "aws_access_key" {}
variable "aws_secret_key" {}
variable "twitter_consumer_key" {}
variable "twitter_consumer_secret" {}
variable "twitter_access_token" {}
variable "twitter_access_token_secret" {}
variable "ga_tracking_id" {}
variable "ssl_certificate_arn" {}

terraform {
  backend "s3" {}
}

provider "aws" {
  region     = "${var.region}"
  access_key = "${var.aws_access_key}"
  secret_key = "${var.aws_secret_key}"
}

module "app" {
  source = "../modules/app"

  app_package                 = "../../build/app-package.zip"
  node_env                    = "production"
  render_interval             = "45 minutes"
  domain                      = "${var.domain}"
  twitter_consumer_key        = "${var.twitter_consumer_key}"
  twitter_consumer_secret     = "${var.twitter_consumer_secret}"
  twitter_access_token        = "${var.twitter_access_token}"
  twitter_access_token_secret = "${var.twitter_access_token_secret}"
  ga_tracking_id              = "${var.ga_tracking_id}"
  ssl_certificate_arn         = "${var.ssl_certificate_arn}"
}
