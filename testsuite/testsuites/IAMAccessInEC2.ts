import { TestSuite } from ".";
import { AWSEnvironment } from "../resources";
import { EC2Instance } from "../resources/EC2/Instance";
import { InlinePolicy } from "../resources/IAM/InlinePolicy";
import { CustomerManagedPolicy } from "../resources/IAM/Policy";
import { Role } from "../resources/IAM/Role";
import { Bucket } from "../resources/S3/Bucket";
import { CatchTestError, Test } from "../tests";
import { EC2InstancePropertiesTest } from "../tests/EC2/Instance";
import { CheckPolicyStatements, EvaluatePolicyDocument } from "../tests/IAM/Policy";
import { CheckAWSManagedPoliciesInRoleTest } from "../tests/IAM/Role";
import { EC2InstanceExpectations, EC2InstanceIdentifier } from "../types/EC2/Instance";
import { InlinePolicyIdentifier, ManagedPolicyExpectations, ManagedPolicyIdentifier, PolicyExpectations } from "../types/IAM/Policy";
import { RoleExpectation, RoleIdentifier } from "../types/IAM/Role";
import { BucketIdentifier } from "../types/S3/Bucket";
import { TestResult } from "../types/tests";

interface IAMAccessInEC2Resources {
    ec2Instance: EC2Instance
    s3Bucket: Bucket
}
interface IAMAccessInEC2Data {
    instanceName?: string
    policyName?: string
    roleName?: string
    bucketName?: string
}
export class IAMAccessInEC2TestSuite extends TestSuite<IAMAccessInEC2Resources> {
    name: string = "Lab_IAMAccessInEC2"
    bucketName: string
    instanceName: string
    policyName: string
    roleName: string
    resources: IAMAccessInEC2Resources
    customerManagedPolicy: CustomerManagedPolicy
    revokePolicy: InlinePolicy
    instanceRole: Role
    constructor({environment, data}: {environment: AWSEnvironment, data?: IAMAccessInEC2Data}) {
        super({environment})
        const bucketName = this.bucketName = data?.bucketName || this.name
        this.policyName = data?.policyName || this.name
        this.roleName = data?.roleName || this.name
        this.instanceName = data?.instanceName || this.name 
        let bucketIdentifier: BucketIdentifier = { bucketName }
        this.customerManagedPolicy = this.buildCustomerPolicy(environment)
        this.revokePolicy = this.buildRevokePolicy(environment)
        this.instanceRole = this.buildInstanceRole(environment)
        this.resources = {
            ec2Instance: this.buildEC2Instance(environment),
            s3Bucket: new Bucket({ environment, bucketIdentifier })
        }
    }
    @CatchTestError()
    async run() {
        let loadingTests: TestResult[] = await this.loadResources()
        loadingTests = this.resources?.ec2Instance.flattenTestResults(loadingTests) || []
        loadingTests.forEach(test => test.type = "ResourceLoading")
        const ec2Instance = this.resources?.ec2Instance
        const policy = this.customerManagedPolicy
        const role = this.instanceRole
        let tests = [
            new EC2InstancePropertiesTest({ec2Instance}),
            new EvaluatePolicyDocument({policy}),
            new CheckPolicyStatements({policy: this.revokePolicy}),
            new CheckAWSManagedPoliciesInRoleTest({role})
        ]
        let testResponses = await this.runTests(tests)
        testResponses.forEach(test => test.type = "Tests")
        console.log(loadingTests.concat(testResponses));
        return {
            success: true,
            tests: loadingTests.concat(testResponses)
        }
    }
    buildCustomerPolicy (environment: AWSEnvironment) {
        const policyName = this.policyName
        let policyIdentifier: ManagedPolicyIdentifier = { policyName }
        let policyExpectations: ManagedPolicyExpectations = {
            PolicyDocumentStatements: [
                {
                    Effect: "Allow",
                    Action: "s3:ListBucket",
                    Resource: `arn:aws:s3:::${this.bucketName}`
                },
                {
                    Effect: "Allow",
                    Action: [
                        "s3:GetObject",
                        "s3:DeleteObject",
                        "s3:PutObject"
                    ],
                    Resource: `arn:aws:s3:::${this.bucketName}/*`
                },
                {
                    Effect: "Allow",
                    Action: "s3:ListAllMyBuckets",
                    Resource: "*"
                }
            ]
        }
        return new CustomerManagedPolicy({environment, policyExpectations, policyIdentifier})
    }
    buildRevokePolicy (environment: AWSEnvironment) {
        let revokePolicyExpectations: PolicyExpectations = {
            PolicyDocumentStatements: [{
                Effect: "Deny",
                Action: "*",
                Resource: "*"
            }
            ]
        }
        let revokePolicyIdentifier: InlinePolicyIdentifier = {
            policyName: "AWSRevokeOlderSessions"
        }
        return new InlinePolicy({
            environment,
            policyIdentifier: revokePolicyIdentifier,
            policyExpectations: revokePolicyExpectations
        })
    }
    buildInstanceRole (environment: AWSEnvironment) {
        const roleName = this.roleName
        let roleIdentifier: RoleIdentifier = { roleName }
        let roleExpectations: RoleExpectation = {
            CustomerManagedPolicies: [
                this.customerManagedPolicy
            ],
            AWSManagedPolicies: ["AmazonSSMManagedInstanceCore"],
            InlinePolicies: [
                this.revokePolicy
            ]
        }
        return new Role({environment, roleExpectations, roleIdentifier})
    }
    buildEC2Instance (environment: AWSEnvironment) {
        let instanceExpectations: EC2InstanceExpectations = {
            EC2Data: {
                InstanceType: "t2.micro"
            },
            Role: this.instanceRole
        }
        let instanceIdentifier: EC2InstanceIdentifier = {
            search: {
                name: this.instanceName
            }
        }
        return new EC2Instance({environment, instanceExpectations, instanceIdentifier})
    }
}
