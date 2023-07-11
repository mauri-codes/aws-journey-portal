import { ErrorDescription } from "..";

export const AWSManagedPolicyNotPresentInRole: (roleName: string, AWSManagedPolicy: string) => ErrorDescription =
    (roleName, AWSManagedPolicy) => ({
        code: AWSManagedPolicyNotPresentInRole.name,
        message: `AWS Managed Policy ${AWSManagedPolicy} not present in role ${roleName}`
    })
