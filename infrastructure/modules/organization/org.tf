resource "aws_organizations_organizational_unit" "org_unit" {
  for_each  = var.organization_structure
  name      = each.key
  parent_id = var.root_organization_id
}

resource "aws_organizations_account" "account" {
  for_each          = { for account in local.accounts : "${account.account_name}" => account }
  name              = each.key
  close_on_deletion = true
  email             = each.value.account_email
  parent_id         = aws_organizations_organizational_unit.org_unit[each.value.organizational_unit].id
}
