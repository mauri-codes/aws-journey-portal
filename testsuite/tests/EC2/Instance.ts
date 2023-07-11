import { CatchTestError, Test } from "..";
import { TestResult } from "../../types/tests";
import { EC2Instance } from "../../resources/EC2/Instance";

interface EC2InstanceTestParams {
    ec2Instance: EC2Instance
}
export class EC2InstancePropertiesTest extends Test <EC2InstanceTestParams> {
    constructor (resources: EC2InstanceTestParams) {
        super(resources)
        this.resources = resources
    }
    @CatchTestError()
    async runTest(): Promise<TestResult> {
        let ec2Instance = this.resources.ec2Instance
        this.compareAttributes(ec2Instance.resourceName, ec2Instance.instanceExpectations.EC2Data || {}, ec2Instance.instanceData || {})
        return {
            success: true,
            testCode: EC2InstancePropertiesTest.name,
            message: `All attribures for ${ec2Instance.resourceName} ${ec2Instance.getIdentifierSummary()} match`
        }
    }
}
