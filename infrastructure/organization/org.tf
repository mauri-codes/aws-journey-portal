locals {
  organization_structure = {
    test_accounts = [
      "test_account_A"
    ]
    lab_accounts = [
      "lab_main_A",
      "lab_sec_A"
    ]
  }
}

module "organization" {
  source                 = "../modules/organization"
  root_organization_id   = data.aws_organizations_organization.org.roots[0].id
  organization_structure = local.organization_structure
  email_prefix           = data.aws_ssm_parameter.email_prefix.value
}
