import { ErrorDescription } from "..";

export const PolicyStatementNotFound: (policy: string, policyStatementString: string) => ErrorDescription =
    (policy, policyStatementString) => ({
        code: PolicyStatementNotFound.name,
        message: `${policy} does not contain statement ${policyStatementString}`
    })
export const PolicyEvaluationFailed: (policy: string, expectedAction: string) => ErrorDescription =
    (policy, expectedAction) => ({
        code: PolicyEvaluationFailed.name,
        message: `${expectedAction} fails when running against ${policy}`
    })
export const PolicyEvaluationSuccededError: (policy: string, expectedAction: string) => ErrorDescription =
    (policy, expectedAction) => ({
        code: PolicyEvaluationSuccededError.name,
        message: `${expectedAction} on succeded when running against ${policy}. It was expected to fail`
    })
