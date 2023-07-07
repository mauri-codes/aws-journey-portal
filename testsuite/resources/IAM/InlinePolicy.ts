import { IAMPolicy } from "."
import { TestError } from "../../errors"
import { CatchTestError, SuccessfulLoad } from "../../tests"
import { GetRolePolicyCommand, GetRolePolicyRequest } from "@aws-sdk/client-iam"
import { InlinePolicyConstructorParameters, PolicyExpectations } from "../../types/IAM/Policy"
import { NoPolicyNameForInlinePolicy, NoRoleNameForInlinePolicy } from "../../errors/IAM/InlinePolicy"


export class InlinePolicy extends IAMPolicy {
    resourceName: string = InlinePolicy.name
    policyExpectations: PolicyExpectations
    policyName: string | undefined
    roleName: string | undefined
    constructor({environment, policyExpectations, policyIdentifier}: InlinePolicyConstructorParameters) {
        super(environment)
        this.policyExpectations = policyExpectations
        this.roleName = policyIdentifier.roleName
        this.policyName = policyIdentifier.policyName
    }
    async getRolePolicy() {
        if (this.roleName === undefined) throw new TestError(NoRoleNameForInlinePolicy())
        if (this.policyName === undefined) throw new TestError(NoPolicyNameForInlinePolicy())
        const params: GetRolePolicyRequest = {
            RoleName: this.roleName,
            PolicyName: this.policyName
        }
        const requestOutput = await this.client.send(new GetRolePolicyCommand(params))
        this.policyDoc = requestOutput.PolicyDocument
    }
    @CatchTestError()
    async loadResource() {
        await this.getRolePolicy()
        return SuccessfulLoad(this.resourceName)
    }
}
