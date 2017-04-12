variable "region"                       { }
variable "aws_access_key"               { }
variable "aws_secret_key"               { }
variable "domain"                       { }
variable "twitter_consumer_key"         { }
variable "twitter_consumer_secret"      { }
variable "twitter_access_token"         { }
variable "twitter_access_token_secret"  { }
variable "ga_tracking_id"               { }
variable "name"                         { }
variable "description"                  { }
variable "email"                        { }
variable "github_username"              { }
variable "twitter_username"             { }
variable "medium_username"              { }
variable "linkedin_username"            { }
variable "linkedin_position"            { }
variable "mailgun_api_key"              { }
variable "mailgun_smtp_password"        { }

provider "aws" {
  region        = "${var.region}"
  access_key    = "${var.aws_access_key}"
  secret_key    = "${var.aws_secret_key}"
}

provider "mailgun" {
  api_key   = "${var.mailgun_api_key}"
}

module "app" {
  source = "../modules/app"

  app_package                   = "../../build/app-package.zip"
  domain                        = "${var.domain}"
  twitter_consumer_key          = "${var.twitter_consumer_key}"
  twitter_consumer_secret       = "${var.twitter_consumer_secret}"
  twitter_access_token          = "${var.twitter_access_token}"
  twitter_access_token_secret   = "${var.twitter_access_token_secret}"
  ga_tracking_id                = "${var.ga_tracking_id}"
  name                          = "${var.name}"
  description                   = "${var.description}"
  email                         = "${var.email}"
  github_username               = "${var.github_username}"
  twitter_username              = "${var.twitter_username}"
  medium_username               = "${var.medium_username}"
  linkedin_username             = "${var.linkedin_username}"
  linkedin_position             = "${var.linkedin_position}"
  mailgun_smtp_password         = "${var.mailgun_smtp_password}"
}
