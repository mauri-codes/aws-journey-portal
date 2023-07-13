resource "aws_api_gateway_rest_api" "journey_portal_api" {
  name        = "JourneyPortal"
  description = "Journey Portal App API"
  body        = data.template_file.api_spec.rendered

  endpoint_configuration {
    types = ["REGIONAL"]
  }
}
resource "aws_api_gateway_deployment" "journey_portal_deployment" {
  rest_api_id = aws_api_gateway_rest_api.journey_portal_api.id

  triggers = {
    redeployment = sha1(jsonencode(aws_api_gateway_rest_api.journey_portal_api.body))
  }

  lifecycle {
    create_before_destroy = true
  }
}

resource "aws_api_gateway_stage" "journey_portal_stage" {
  deployment_id = aws_api_gateway_deployment.journey_portal_deployment.id
  rest_api_id   = aws_api_gateway_rest_api.journey_portal_api.id
  stage_name    = "prod"
}

resource "aws_lambda_permission" "apigw" {
  statement_id  = "AllowAPIGatewayInvoke"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.evaluator.function_name
  principal     = "apigateway.amazonaws.com"

  source_arn = "${aws_api_gateway_rest_api.journey_portal_api.execution_arn}/*/*"
}
