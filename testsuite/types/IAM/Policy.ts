import { AWSEnvironment } from "../../resources"

export interface ManagedPolicyIdentifier {
    policyArn?: string
    policyName?: string
    policyPath?: string
}

export interface ManagedPolicyExpectations {
    PolicyData?: {
        PolicyId?: string
        Path?: string
        DefaultVersionId?: string
        AttachmentCount?: number
        Description?: string
    }
    PolicyDocumentStatements?: PolicyStatement[]
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
