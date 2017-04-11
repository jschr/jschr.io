resource "mailgun_domain" "domain" {
  name            = "${var.domain}"
  spam_action     = "disabled"
  smtp_password   = "${var.mailgun_smtp_password}"
}

# mailgun dns entries

# terraform currently doesn't support computing a count value from a dynamic variable so
# we are hardcoding it to the known number of records
# https://github.com/hashicorp/terraform/issues/10857

resource "aws_route53_record" "mailgun_sending_1" {
  zone_id   = "${data.aws_route53_zone.domain.zone_id}"
  ttl       = "300"
  name      = "${mailgun_domain.domain.sending_records.0.name}"
  type      = "${mailgun_domain.domain.sending_records.0.record_type}"
  records   = ["${mailgun_domain.domain.sending_records.0.value}"]
}

resource "aws_route53_record" "mailgun_sending_2" {
  zone_id   = "${data.aws_route53_zone.domain.zone_id}"
  ttl       = "300"
  name      = "${mailgun_domain.domain.sending_records.1.name}"
  type      = "${mailgun_domain.domain.sending_records.1.record_type}"
  records   = ["${mailgun_domain.domain.sending_records.1.value}"]
}

resource "aws_route53_record" "mailgun_sending_3" {
  zone_id   = "${data.aws_route53_zone.domain.zone_id}"
  ttl       = "300"
  name      = "${mailgun_domain.domain.sending_records.2.name}"
  type      = "${mailgun_domain.domain.sending_records.2.record_type}"
  records   = ["${mailgun_domain.domain.sending_records.2.value}"]
}

resource "aws_route53_record" "mailgun_receiving_1" {
  zone_id   = "${data.aws_route53_zone.domain.zone_id}"
  ttl       = "300"
  name      = "${data.aws_route53_zone.domain.name}"
  type      = "${mailgun_domain.domain.receiving_records.0.record_type}"
  records   = ["${mailgun_domain.domain.receiving_records.0.priority} ${mailgun_domain.domain.receiving_records.0.value}"]
}

resource "aws_route53_record" "mailgun_receiving_2" {
  zone_id   = "${data.aws_route53_zone.domain.zone_id}"
  ttl       = "300"
  name      = "${data.aws_route53_zone.domain.name}"
  type      = "${mailgun_domain.domain.receiving_records.1.record_type}"
  records   = ["${mailgun_domain.domain.receiving_records.1.priority} ${mailgun_domain.domain.receiving_records.1.value}"]
}

# ideally we could define the records with count

# resource "aws_route53_record" "mailgun_sending" {
#   count     = "${length(mailgun_domain.domain.sending_records)}"
#   zone_id   = "${data.aws_route53_zone.domain.zone_id}"
#   ttl       = "300"
#   name      = "${element(mailgun_domain.domain.sending_records.*.name, count.index)}"
#   type      = "${element(mailgun_domain.domain.sending_records.*.record_type, count.index)}"
#   records   = ["${element(mailgun_domain.domain.sending_records.*.value, count.index)}"]
# }

# resource "aws_route53_record" "mailgun_receiving" {
#   count     = "${length(mailgun_domain.domain.receiving_records)}"
#   zone_id   = "${data.aws_route53_zone.domain.zone_id}"
#   ttl       = "300"
#   name      = "${data.aws_route53_zone.domain.name}"
#   type      = "${element(mailgun_domain.domain.receiving_records.*.record_type, count.index)}"
#   records   = ["${element(mailgun_domain.domain.receiving_records.*.priority, count.index)} ${element(mailgun_domain.domain.receiving_records.*.value, count.index)}"]
# }
