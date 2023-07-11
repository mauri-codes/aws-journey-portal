import { IAMPolicy } from ".";
import {
    Policy,
    PolicyVersion,
    GetPolicyCommand,
    GetPolicyVersionCommand
} from "@aws-sdk/client-iam"
import { ManagedPolicyExpectations, PolicyConstructorParameters } from "../../types/IAM/Policy"
import { ResourceLoadedSuccessfully } from "../../errors"
import { TestResult } from "../../types/tests"
import { CatchTestError } from "../../tests"

export class CustomerManagedPolicy extends IAMPolicy {
    resourceName: string = CustomerManagedPolicy.name
    arn: string | undefined
    name: string | undefined
    path: string = "/"
    policyData: Policy | undefined
    policyDocument: PolicyVersion | undefined
    policyExpectations: ManagedPolicyExpectations | undefined
    policyDataResult: TestResult | undefined
    constructor({environment, policyExpectations, policyIdentifier}: PolicyConstructorParameters) {
        super(environment)
        const {policyArn, policyName, policyPath} = policyIdentifier
        this.policyExpectations = policyExpectations
        if (policyArn) {
            this.arn = policyArn
            this.name = policyArn.split("/").pop()
        }
        if (policyName) this.name = policyName
        if (policyPath) this.path = policyPath
        this.policyName = policyName
    }
    async getPolicy(): Promise<TestResult> {
        if (this.policyDataResult) return this.policyDataResult
        const params = {
            PolicyArn: await this.getArn()
        }
        const requestOutput = await this.client.send(new GetPolicyCommand(params))
        this.policyData = requestOutput.Policy
        if (this.policyExpectations?.PolicyDocumentStatements) {
            await this.getPolicyDocument(this.policyData?.DefaultVersionId || "v1")
        }
        this.policyDataResult = ResourceLoadedSuccessfully(this.resourceName, this.name || "policy")
        return this.policyDataResult
    }
    async getPolicyDocument(versionId: string) {
        if (this.policyDocument) return this.policyDocument
        const params = {
            PolicyArn: await this.getArn(),
            VersionId: versionId
        }
        const requestOutput = await this.client.send(new GetPolicyVersionCommand(params))
        this.policyDocument = requestOutput.PolicyVersion
        this.policyDoc = this.policyDocument?.Document
        return this.policyDocument
    }
    async getArn() {
        if (this.arn === undefined) {
            const account = await this.environment.getAccountNumber()            
            this.arn = `arn:aws:iam::${account}:policy${this.path}${this.name}`
        }
        return this.arn
    }
    @CatchTestError()
    async loadResource() {
        await this.getArn()        
        return await this.getPolicy()
    }
}
