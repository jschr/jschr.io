variable "domain"                   { }
variable "region"                   { }
variable "aws_access_key"           { }
variable "aws_secret_key"           { }
variable "mailgun_api_key"          { }
variable "mailgun_smtp_password"    { }
variable "env_vars"                 { type = "map" }

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
  env_vars                      = "${var.env_vars}"
  mailgun_smtp_password         = "${var.mailgun_smtp_password}"
  render_interval               = 2 # minutes
}
