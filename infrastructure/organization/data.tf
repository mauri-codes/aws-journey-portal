data "aws_organizations_organization" "org" {}

data "aws_ssm_parameter" "email_prefix" {
  name = "/accounts/emailPrefix"
}
