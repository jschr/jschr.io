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