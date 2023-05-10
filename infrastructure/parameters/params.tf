module "ssm_parameters" {
    source = "../modules/parameters"
    parameters = local.parameters
}