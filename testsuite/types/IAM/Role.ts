import { Tag } from ".."
import { ManagedPolicy } from "../../resources/IAM/Policy"

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
    InlinePolicies?: string[]
    ManagedPolicies?: ManagedPolicy[]
}

export interface RoleConstructorParameters {
    environment: AWSEnvironment
    roleExpectations: RoleExpectation,
    roleIdentifier: RoleIdentifier
}
