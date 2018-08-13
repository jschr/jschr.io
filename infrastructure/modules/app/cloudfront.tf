resource "aws_cloudfront_distribution" "s3_distribution" {
  origin {
    domain_name = "${aws_s3_bucket.website.bucket_domain_name}"
    origin_id   = "websiteS3Origin"
  }

  # aliases = ["${var.domain}", "www.${var.domain}"]

  enabled             = true
  is_ipv6_enabled     = true
  default_root_object = "index.html"
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

    viewer_protocol_policy = "redirect-to-https"
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
    acm_certificate_arn            = "${var.ssl_certificate_arn}"
    ssl_support_method             = "sni-only"
    cloudfront_default_certificate = "true"
  }
}
