data "aws_route53_zone" "domain" {
  name  = "${var.domain}."
}

# website dns entries

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
