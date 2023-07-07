import { CustomerManagedPolicy } from "../../../resources/IAM/Policy";
import { CheckPolicyStatements } from "../../../tests/IAM/Policy";
import { 
    simpleStatementExpectation,
    noArrayStatementsExpectations,
    MultipleStatementsExpectation,
    MultipleStatementsExpectation2,
    BadMultipleStatementsExpectation,
    ActionMisspellStatementExpectation,
    testPolicyDocument,
    testPolicyData,
    environment
} from "./Policy.data";

const testPolicy = new CustomerManagedPolicy({environment, policyExpectations: {}, policyIdentifier: {}})
testPolicy.policyData = testPolicyData
testPolicy.policyDocument = testPolicyDocument
testPolicy.policyDoc = testPolicyDocument.Document
testPolicy.loadOutput = {
    success: true
}

describe("PolicyStatementsTest class", () => {
    describe("Given expectations with no array policy statements", () => {
        testPolicy.policyExpectations = noArrayStatementsExpectations
        test("Should pass compared to policy statements with arrays", async () => {
            let test = new CheckPolicyStatements({policy: testPolicy})
            expect((await test.run()).success).toBeTruthy()
        })
    })
    describe("Given expectations with arrays in policy statements", () => {
        test("Should pass with a single expectation statement that exists in the data object", async () => {
            testPolicy.policyExpectations = simpleStatementExpectation
            let test = new CheckPolicyStatements({policy: testPolicy})
            expect((await test.run()).success).toBeTruthy()
        })
        test("Should fail with an expectation statement that has a misspell", async () => {
            testPolicy.policyExpectations = ActionMisspellStatementExpectation
            let test = new CheckPolicyStatements({policy: testPolicy})
            expect((await test.run()).success).toBeFalsy()
        })
        test("Should pass with a single expectation statement that exists in the data object", async () => {
            testPolicy.policyExpectations = MultipleStatementsExpectation
            let test = new CheckPolicyStatements({policy: testPolicy})
            expect((await test.run()).success).toBeTruthy()
        })
        test("Should pass with a multiple expectation statements that exists in the data object, but not exactly", async () => {
            testPolicy.policyExpectations = MultipleStatementsExpectation2
            let test = new CheckPolicyStatements({policy: testPolicy})
            expect((await test.run()).success).toBeTruthy()
        })
        test("Should fail with a multiple expectation statements that don't match the data object", async () => {
            testPolicy.policyExpectations = BadMultipleStatementsExpectation
            let test = new CheckPolicyStatements({policy: testPolicy})
            expect((await test.run()).success).toBeFalsy()
        })
    })
})
