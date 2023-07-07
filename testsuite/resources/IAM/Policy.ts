import { IAMPolicy } from ".";
import {
    Policy,
    PolicyVersion,
    GetPolicyCommand,
    GetPolicyVersionCommand
} from "@aws-sdk/client-iam";
import { CatchTestError, SuccessfulLoad } from "../../tests";
import { ManagedPolicyExpectations, PolicyConstructorParameters } from "../../types/IAM/Policy";

export class ManagedPolicy extends IAMPolicy {
    resourceName: string = ManagedPolicy.name
    arn: string | undefined
    name: string | undefined
    path: string = "/"
    policyData: Policy | undefined
    policyDocument: PolicyVersion | undefined
    policyExpectations: ManagedPolicyExpectations | undefined
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
    }
    async getPolicy() {
        if (this.policyData) return this.policyData
        const params = {
            PolicyArn: await this.getArn()
        }
        const requestOutput = await this.client.send(new GetPolicyCommand(params))
        this.policyData = requestOutput.Policy
        return this.policyData
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
        const policyData = await this.getPolicy()
        if (this.policyExpectations?.PolicyDocumentStatements) {
            await this.getPolicyDocument(policyData?.DefaultVersionId || "v1")
        }
        
        return SuccessfulLoad(this.resourceName)
    }
}
