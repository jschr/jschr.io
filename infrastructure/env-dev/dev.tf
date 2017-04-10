variable "region"                       { }
variable "aws_access_key"               { }
variable "aws_secret_key"               { }
variable "app_package"                  { }
variable "domain"               { }
variable "twitter_consumer_key"         { }
variable "twitter_consumer_secret"      { }
variable "twitter_access_token"         { }
variable "twitter_access_token_secret"  { }

provider "aws" {
  region        = "${var.region}"
  access_key    = "${var.aws_access_key}"
  secret_key    = "${var.aws_secret_key}"
}

module "app" {
  source = "../modules/app"

  domain                        = "${var.domain}"
  app_package                   = "${var.app_package}"
  twitter_consumer_key          = "${var.twitter_consumer_key}"
  twitter_consumer_secret       = "${var.twitter_consumer_secret}"
  twitter_access_token          = "${var.twitter_access_token}"
  twitter_access_token_secret   = "${var.twitter_access_token_secret}"
}
