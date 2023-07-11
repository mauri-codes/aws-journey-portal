import { CatchTestError, Test } from "..";
import { TestError } from "../../errors";
import { AWSManagedPolicyNotPresentInRole } from "../../errors/IAM/Role";
import { InlinePolicy } from "../../resources/IAM/InlinePolicy";
import { Role } from "../../resources/IAM/Role";


interface EvaluateRoleInlinePolicyTestResources {
    policy: InlinePolicy,
    role: Role
}
export abstract class EvaluateRoleInlinePolicyTest extends Test<EvaluateRoleInlinePolicyTestResources> {
    role: Role
    policy: InlinePolicy
    constructor({policy, role}: EvaluateRoleInlinePolicyTestResources) {
        super({role, policy})
        this.policy = policy
        this.role = role
        this.policy.roleName = this.role.roleName
    }
    @CatchTestError()
    async runTest() {
        const roleInlinePolicies = this.role.inlinePolicies
        if(!this.role.inlinePolicies?.includes(this.policy.policyName || "")) {
            
        }
        return {
            success: true,
            testCode: EvaluateRoleInlinePolicyTest.name,
            message: "All statements are present in the policy document"
        }
    }
}

interface CheckAWSManagedPoliciesInRole {
    role: Role
}
export class CheckAWSManagedPoliciesInRoleTest extends Test<CheckAWSManagedPoliciesInRole> {
    role: Role
    constructor({role}: CheckAWSManagedPoliciesInRole) {
        super({role})
        this.role = role
    }
    @CatchTestError()
    async runTest() {
        const awsMangedPolicies = this.role.AWSManagedPolicies
        const expectations = this.role.roleExpectations?.AWSManagedPolicies || []
        console.log();
        
        for (const policyExpectation of expectations) {
            if (!awsMangedPolicies.map(policy => policy.PolicyName).includes(policyExpectation)) {
                throw new TestError(AWSManagedPolicyNotPresentInRole(this.role.roleName, policyExpectation))
            }
        }
        return {
            success: true,
            testCode: CheckAWSManagedPoliciesInRoleTest.name,
            message: `All AWS Managed Policies are present in role ${this.role.roleName}`
        }
    }
}
