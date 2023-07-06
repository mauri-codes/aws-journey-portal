import { TestSuite } from ".";
import { AWSEnvironment } from "../resources";
import { EC2Instance } from "../resources/EC2/Instance";
import { ManagedPolicy } from "../resources/IAM/Policy";
import { Role } from "../resources/IAM/Role";
import { EC2InstanceExpectations, EC2InstanceIdentifier } from "../types/EC2/Instance";
import { ManagedPolicyExpectations, ManagedPolicyIdentifier } from "../types/IAM/Policy";
import { RoleExpectation, RoleIdentifier } from "../types/IAM/Role";

interface IAMAccessInEC2Resources {
    ec2Instance: EC2Instance
    role: Role
    // S3Bucket: 
}
export class IAMAccessInEC2TestSuite extends TestSuite<{environment: AWSEnvironment}> {
    resources: IAMAccessInEC2Resources
    constructor(environment: AWSEnvironment) {
        super({environment})
        let instanceExpectations: EC2InstanceExpectations = {
            EC2Data: {
                Architecture: "t2.micro"
            }
        }
        let instanceIdentifier: EC2InstanceIdentifier = {
            search: {
                name: "LabInstance"
            }
        }
        let policyIdentifier: ManagedPolicyIdentifier = {
            policyName: "LabPolicy"
        }
        let policyExpectations: ManagedPolicyExpectations = {
            PolicyDocumentStatements: [
                {
                    Action: "",
                    Effect: "Allow",
                    Resource: "*"
                }
            ]
        }
        let roleIdentifier: RoleIdentifier = {
            roleName: "LabRole"
        }
        let roleExpectations: RoleExpectation = {
            ManagedPolicies: [
                new ManagedPolicy({environment, policyExpectations, policyIdentifier})
            ]
        }
        this.resources = {
            ec2Instance: new EC2Instance({environment, instanceExpectations, instanceIdentifier}),
            role: new Role({environment, roleExpectations, roleIdentifier})
        }
    }
    async run() {
        return {
            testSuiteCode: "",
            tests: []
        }
    }
}
