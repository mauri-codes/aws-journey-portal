data "template_file" "api_spec" {
  template = file("api.yaml")

  vars = {
    evaluator_arn = "${aws_lambda_function.evaluator.arn}"
    aws_region    = data.aws_region.current.name
  }
}

data "aws_ssm_parameter" "infra_bucket" {
  name = "/infra/bucket"
}

data "aws_region" "current" {}
