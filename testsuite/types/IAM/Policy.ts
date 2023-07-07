import { AWSEnvironment } from "../../resources"

export interface InlinePolicyIdentifier {
    policyName?: string
    roleName?: string
}

export interface ManagedPolicyIdentifier {
    policyArn?: string
    policyName?: string
    policyPath?: string
}

export interface PolicyExpectations {
    PolicyDocumentStatements?: PolicyStatement[]
}

export interface ManagedPolicyExpectations extends PolicyExpectations {
    PolicyData?: {
        PolicyId?: string
        Path?: string
        DefaultVersionId?: string
        AttachmentCount?: number
        Description?: string
    }
}

export interface PolicyStatement {
    Sid?: string
    Effect: "Allow" | "Deny"
    Action: string | string[]
    Resource: string | string[]
}

export interface OnlyArrayPolicyStatement {
    Sid?: string
    Effect: "Allow" | "Deny"
    Action: string[]
    Resource: string[]
}

export interface AWSPolicyDocument {
    Version: string
    Statement: PolicyStatement[]
}

export interface PolicyConstructorParameters {
    environment: AWSEnvironment
    policyExpectations: ManagedPolicyExpectations,
    policyIdentifier: ManagedPolicyIdentifier
}
export interface InlinePolicyConstructorParameters {
    environment: AWSEnvironment
    policyExpectations: PolicyExpectations,
    policyIdentifier: InlinePolicyIdentifier
}
