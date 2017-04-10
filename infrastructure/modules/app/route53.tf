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

# mailgun

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
