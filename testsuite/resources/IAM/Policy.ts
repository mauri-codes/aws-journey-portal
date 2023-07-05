import { IAMResource } from ".";
import { AWSEnvironment } from "..";
import {
    Policy,
    PolicyVersion,
    GetPolicyCommand,
    GetPolicyVersionCommand
} from "@aws-sdk/client-iam";
import { CatchTestError, SuccessfulLoad } from "../../tests";
import { ManagedPolicyExpectation, PolicyIdentifier } from "../../types/IAM/Policy";

export class ManagedPolicy extends IAMResource {
    resourceName: string = ManagedPolicy.name
    arn: string | undefined
    name: string | undefined
    path: string = "/"
    policyData: Policy | undefined
    policyDocument: PolicyVersion | undefined
    policyExpectations: ManagedPolicyExpectation | undefined
    constructor(
        environment: AWSEnvironment,
        expectations: ManagedPolicyExpectation,
        identifier: PolicyIdentifier,
    ) {
        super(environment)
        const {policyArn, policyName, policyPath} = identifier
        this.policyExpectations = expectations
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