variable "domain"                       { }
variable "app_package"                  { }
variable "twitter_consumer_key"         { }
variable "twitter_consumer_secret"      { }
variable "twitter_access_token"         { }
variable "twitter_access_token_secret"  { }
variable "mailgun_dkim"                 { }

data "aws_iam_policy_document" "website_bucket_policy" {
  # allows public reads from everyone to the s3 bucket
  statement {
    actions     = ["s3:GetObject"]
    resources   = ["arn:aws:s3:::${var.domain}/*"]

    principals {
      type          = "*"
      identifiers   = ["*"]
    }
  }
}

resource "aws_s3_bucket" "website" {
  bucket  = "${var.domain}"
  acl     = "private"
  policy  = "${data.aws_iam_policy_document.website_bucket_policy.json}"

  website {
    index_document = "index.html"
  }
}

data "aws_iam_policy_document" "website_generator_trust_policy" {
  # gives permission to AWS to execute the lambda function
  statement {
    actions = ["sts:AssumeRole"]

    principals {
      type          = "Service"
      identifiers   = ["lambda.amazonaws.com"]
    }
  }
}

resource "aws_iam_role" "website_generator_role" {
  name                = "website_generator_role"
  assume_role_policy  = "${data.aws_iam_policy_document.website_generator_trust_policy.json}"
}

data "aws_iam_policy_document" "website_generator_policy" {
  # gives permission to the lambda function to access the s3 bucket
  statement {
    actions     = ["s3:*"]
    resources   = ["arn:aws:s3:::${var.domain}/*"]
  }

  # gives permission to the lambda function to invalidate the cloudfront distribution
  statement {
    actions     = ["cloudfront:CreateInvalidation"]
    resources   = ["*"]
  }
}

resource "aws_iam_role_policy" "website_generator_policy" {
  name    = "website_generator_policy"
  role    = "${aws_iam_role.website_generator_role.id}"
  policy  = "${data.aws_iam_policy_document.website_generator_policy.json}"
}

resource "aws_lambda_function" "website_generator" {
  filename          = "${var.app_package}"
  function_name     = "website_generator"
  runtime           = "nodejs6.10"
  role              = "${aws_iam_role.website_generator_role.arn}"
  handler           = "handler.default"
  timeout           = 60 # TODO: variable
  memory_size       = 512 # TODO: variable
  source_code_hash  = "${base64sha256(file("${var.app_package}"))}"

  environment {
    variables = {
      NODE_ENV                      = "production"
      S3_BUCKET                     = "${aws_s3_bucket.website.bucket}"
      CF_DISTRIBUTION               = "${aws_cloudfront_distribution.s3_distribution.id}"
      TWITTER_CONSUMER_KEY          = "${var.twitter_consumer_key}"
      TWITTER_CONSUMER_SECRET       = "${var.twitter_consumer_secret}"
      TWITTER_ACCESS_TOKEN          = "${var.twitter_access_token}"
      TWITTER_ACCESS_TOKEN_SECRET   = "${var.twitter_access_token_secret}"
    }
  }
}

resource "aws_cloudwatch_event_rule" "generate_website_event" {
  name                  = "generate_website_event"
  description           = "Fires every 15 minutes"
  schedule_expression   = "rate(15 minutes)"
}

resource "aws_cloudwatch_event_target" "generate_website_event_target" {
  rule        = "${aws_cloudwatch_event_rule.generate_website_event.name}"
  target_id   = "generate_website"
  arn         = "${aws_lambda_function.website_generator.arn}"
}

resource "aws_lambda_permission" "allow_generate_website_event" {
    statement_id    = "AllowExecutionFromCloudWatch"
    action          = "lambda:InvokeFunction"
    function_name   = "${aws_lambda_function.website_generator.function_name}"
    principal       = "events.amazonaws.com"
    source_arn      = "${aws_cloudwatch_event_rule.generate_website_event.arn}"
}

resource "aws_cloudfront_distribution" "s3_distribution" {
  origin {
    domain_name   = "${aws_s3_bucket.website.bucket_domain_name}"
    origin_id     = "websiteS3Origin"
  }

  aliases = ["${var.domain}", "www.${var.domain}"]

  enabled               = true
  is_ipv6_enabled       = true
  default_root_object   = "index.html"

  # use PriceClass_200 for edge locations outside of US, Canada and Europe
  price_class = "PriceClass_100"

  default_cache_behavior {
    allowed_methods  = ["DELETE", "GET", "HEAD", "OPTIONS", "PATCH", "POST", "PUT"]
    cached_methods   = ["GET", "HEAD"]
    target_origin_id = "websiteS3Origin"

    forwarded_values {
      query_string = false

      cookies {
        forward = "none"
      }
    }

    viewer_protocol_policy = "allow-all"
    min_ttl                = 0
    default_ttl            = 3600
    max_ttl                = 86400
  }

  restrictions {
    geo_restriction {
      restriction_type = "none"
    }
  }

  viewer_certificate {
    cloudfront_default_certificate = "true"
  }
}

data "aws_route53_zone" "domain" {
  name  = "${var.domain}."
}

resource "aws_route53_record" "apex" {
  zone_id   = "${data.aws_route53_zone.domain.zone_id}"
  name      = "${data.aws_route53_zone.domain.name}"
  type      = "A"

  alias {
    name                    = "${aws_cloudfront_distribution.s3_distribution.domain_name}"
    zone_id                 = "${aws_cloudfront_distribution.s3_distribution.hosted_zone_id}"
    evaluate_target_health  = false
  }
}

resource "aws_route53_record" "www" {
  zone_id   = "${data.aws_route53_zone.domain.zone_id}"
  name      = "www.${data.aws_route53_zone.domain.name}"
  type      = "A"

  alias {
    name                    = "${aws_cloudfront_distribution.s3_distribution.domain_name}"
    zone_id                 = "${aws_cloudfront_distribution.s3_distribution.hosted_zone_id}"
    evaluate_target_health  = false
  }
}

# this below section sets up the mailgun route 53 records to recieve email for your domain.
# you can forward the email to gmail (or another account) by adding a mailgun route
# see: https://documentation.mailgun.com/api-routes.html#routes

resource "aws_route53_record" "mailgun_spf" {
  zone_id   = "${data.aws_route53_zone.domain.zone_id}"
  name      = "${data.aws_route53_zone.domain.name}"
  type      = "TXT"
  ttl       = "300"
  records   = ["v=spf1 include:mailgun.org ~all"]
}

resource "aws_route53_record" "mailgun_dkim" {
  zone_id   = "${data.aws_route53_zone.domain.zone_id}"
  name      = "smtp._domainkey.${data.aws_route53_zone.domain.name}"
  type      = "TXT"
  ttl       = "300"
  records   = ["${var.mailgun_dkim}"]
}

resource "aws_route53_record" "mailgun_mx" {
  zone_id   = "${data.aws_route53_zone.domain.zone_id}"
  name      = "${data.aws_route53_zone.domain.name}"
  type      = "MX"
  ttl       = "300"
  records   = ["10 mxa.mailgun.org", "10 mxb.mailgun.org"]
}

resource "aws_route53_record" "mailgun_tracking" {
  zone_id   = "${data.aws_route53_zone.domain.zone_id}"
  name      = "email.${data.aws_route53_zone.domain.name}"
  type      = "CNAME"
  ttl       = "300"
  records   = ["mailgun.org"]
}
