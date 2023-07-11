import {
    SimulateCustomPolicyCommand,
    SimulateCustomPolicyCommandInput,
    IAMClient
} from "@aws-sdk/client-iam";
import { TestError } from "../../errors";
import { Test, CatchTestError } from "..";
import { TestResult } from "../../types/tests";
import { IAMPolicy } from "../../resources/IAM";
import { Evaluator } from "../../common/Evaluator";
import { AWSPolicyDocument, OnlyArrayPolicyStatement, PolicyStatement } from "../../types/IAM/Policy";
import { PolicyEvaluationFailed, PolicyEvaluationSuccededError, PolicyStatementNotFound } from "../../errors/IAM/Policy";

interface PolicyStatementTestResources {
    policy: IAMPolicy
}

export abstract class PolicyStatementsTest extends Test<PolicyStatementTestResources> {
    policyDocumentEncoded: string
    policyDocument: AWSPolicyDocument | undefined
    onlyArrayPolicyStatement: OnlyArrayPolicyStatement[] | undefined
    expectationStatements: PolicyStatement[]
    onlyArrayExpectationStatements: OnlyArrayPolicyStatement[] | undefined
    constructor({policy}: PolicyStatementTestResources) {
        super({policy})
        this.resources = {policy}
        this.policyDocumentEncoded = policy.policyDoc || ""
        this.expectationStatements = policy.policyExpectations?.PolicyDocumentStatements || []
    }
    preProcessStatements() {
        this.onlyArrayExpectationStatements = this.expectationStatements.map(statement => ({
            ...statement,
            Action: this.returnArray(statement.Action),
            Resource: this.returnArray(statement.Resource)
        }))
        this.policyDocument = JSON.parse(decodeURIComponent(this.policyDocumentEncoded))
        this.onlyArrayPolicyStatement = (this.policyDocument?.Statement || []).map(statement =>({
            ...statement,
            Action: this.returnArray(statement.Action),
            Resource: this.returnArray(statement.Resource)
        }))
    }
    returnArray(strOrArray: string | string[]): string[] {
        if (typeof strOrArray === "string") strOrArray = [strOrArray]
        return strOrArray
    }
}

export class CheckPolicyStatements extends PolicyStatementsTest {

    constructor(testParameters: PolicyStatementTestResources) {
        super(testParameters)        
    }
    @CatchTestError()
    async runTest(): Promise<TestResult> {
        this.preProcessStatements()
        let response = Evaluator.evaluateArrayOfObjects(this.onlyArrayExpectationStatements || [], this.onlyArrayPolicyStatement || [])
        if (!response.success) {
            throw new TestError(PolicyStatementNotFound(this.resources.policy.resourceName, response.data?.object || ""))
        }
        return {
            success: true,
            testCode: CheckPolicyStatements.name,
            message: `All statements pass the evaluation for ${this.resources.policy.policyName}`
        }
    }
}

export class EvaluatePolicyDocument extends PolicyStatementsTest {
    constructor(resources: PolicyStatementTestResources) {
        super(resources)
        this.resources = resources
    }
    @CatchTestError()
    async runTest(): Promise<TestResult> {
        this.preProcessStatements()
        const iamClient: IAMClient = this.resources.policy.environment.getAWSClient("iam")

        const requests = (this.onlyArrayExpectationStatements ||[]).map(({Action, Resource, Effect}) => {
            let params: SimulateCustomPolicyCommandInput = {
                ActionNames: Action as string[],
                PolicyInputList: [decodeURIComponent(JSON.stringify(this.policyDocument))],
                ResourceArns: Resource as string[]
            }
            return iamClient.send(new SimulateCustomPolicyCommand(params))
        })
        const requestResponses = await Promise.all(requests)
        const mappedResponses = requestResponses.map(({EvaluationResults}) => {
            let mappedEvaluation:{[key: string]: string} = {}
            EvaluationResults?.forEach(({EvalActionName, EvalDecision}) => {
                mappedEvaluation[EvalActionName || ""] = EvalDecision || ""
            })
            return mappedEvaluation
        })
        ;(this.onlyArrayExpectationStatements || []).forEach(({Action, Effect}, index) => {
            let evaluationObj = mappedResponses[index]
            ;(Action as string[]).forEach((action) => {
                if (evaluationObj[action] === "allowed" && Effect === "Deny") throw new TestError(PolicyEvaluationSuccededError(this.resources.policy.policyName || this.resources.policy.resourceName , action))
                if (evaluationObj[action] !== "allowed" && Effect === "Allow") throw new TestError(PolicyEvaluationFailed(this.resources.policy.policyName || this.resources.policy.resourceName, action))
            })
        })
        return {
            success: true,
            testCode: EvaluatePolicyDocument.name,
            message: `All statements pass the evaluation for ${this.resources.policy.policyName}`
        }
    }
}
