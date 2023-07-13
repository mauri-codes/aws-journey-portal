module "evaluator_role" {
  source    = "../modules/role"
  role_name = "EvaluatorRole"
  service   = "lambda"
}

data "aws_s3_object" "deploy_object" {
  bucket = data.aws_ssm_parameter.infra_bucket.value
  key    = "lambda/api.zip"
}

resource "aws_lambda_function" "evaluator" {
  s3_bucket         = data.aws_ssm_parameter.infra_bucket.value
  s3_key            = "lambda/api.zip"
  function_name     = "Evaluator"
  role              = module.evaluator_role.role_arn
  handler           = "handler.handler"
  s3_object_version = data.aws_s3_object.deploy_object.version_id
  runtime           = "nodejs18.x"

  environment {
    variables = {
      foo = "bar"
    }
  }
}