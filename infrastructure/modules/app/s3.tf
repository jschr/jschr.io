data "aws_iam_policy_document" "website_bucket_policy" {
  # allows public reads from everyone to the s3 bucket
  statement {
    actions   = ["s3:GetObject"]
    resources = ["arn:aws:s3:::${var.domain}-website/*"]

    principals {
      type        = "*"
      identifiers = ["*"]
    }
  }
}

resource "aws_s3_bucket" "website" {
  bucket = "${var.domain}-website"
  acl    = "private"
  policy = "${data.aws_iam_policy_document.website_bucket_policy.json}"

  website {
    index_document = "index.html"
  }
}
