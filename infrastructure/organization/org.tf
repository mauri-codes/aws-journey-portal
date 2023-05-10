locals {
    org_units = {
        test_accounts = [
            "test_account_1",
            "test_account_2"
        ]
        lab_accounts = [
            "lab_A_main",
            "lab_A_sec"
        ]
    }
}

resource "aws_organizations_organizational_unit" "example" {
  name      = "example"
#   parent_id = aws_organizations_organization.example.roots[0].id
}
