import { Tag } from ".."
import { AWSEnvironment } from "../../resources"
import { InlinePolicy } from "../../resources/IAM/InlinePolicy"
import { CustomerManagedPolicy } from "../../resources/IAM/Policy"
import { AWSManagedPolicyType } from "./AWSPolicy"

export interface RoleIdentifier {
    roleName?: string
    // search?: {
    //     tags?: Tag[]
    // }
}

export interface RoleExpectation {
    RoleData?: {
        Path?: string
        RoleId?: string
        Arn?: string
        CreateDate?: string
        Description?: string
        ServicePrincipal?: string
        MaxSessionDuration?: string
        Tags?: Tag
    }
    InlinePolicies?: InlinePolicy[]
    CustomerManagedPolicies?: CustomerManagedPolicy[]
    AWSManagedPolicies?: AWSManagedPolicyType[]
}

export interface RoleConstructorParameters {
    environment: AWSEnvironment
    roleExpectations: RoleExpectation,
    roleIdentifier: RoleIdentifier
}
