locals {
    accounts = flatten([
        for org_key, org_unit in var.organization_structure : [
            for lab_account in org_unit: {
                organizational_unit = org_key
                account_name = lab_account
                account_email = "${var.email_prefix}+${upper(lab_account)}@gmail.com"
            }
        ]
    ])
    accounts_map = {for account in local.accounts: "${account.account_name}" => account}
}