resource "aws_cloudwatch_event_rule" "generate_website_event" {
  name                  = "generate_website_event"
  description           = "Fires every ${var.render_interval}"
  schedule_expression   = "rate(${var.render_interval})"
}

resource "aws_cloudwatch_event_target" "generate_website_event_target" {
  rule        = "${aws_cloudwatch_event_rule.generate_website_event.name}"
  target_id   = "generate_website"
  arn         = "${aws_lambda_function.website_generator.arn}"
}