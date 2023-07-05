import { CatchTestError, Test } from "..";
import { SecurityGroup } from "../../resources/EC2/SecurityGroup";
import { TestResult } from "../../types/tests";

interface SecurityGroupTestParams {
    securityGroup: SecurityGroup
}

export class SecurityGroupPropertiesTest extends Test<SecurityGroupTestParams> {
    constructor(securityGroup: SecurityGroup) {
        super({ securityGroup })
    }
    @CatchTestError()
    async runTest(): Promise<TestResult> {
        let securityGroup = this.resources.securityGroup
        this.compareAttributes(securityGroup.resourceName, securityGroup.sgExpectations.SecurityGroupData, securityGroup.sgBaseData)

        let outbound = securityGroup.sgRules?.filter(rule => rule.IsEgress)
        let inbound = securityGroup.sgRules?.filter(rule => !rule.IsEgress)
        let outboundExp = securityGroup.sgExpectations.OutboundRules || []
        let inboundExp = securityGroup.sgExpectations.InboundRules || []
        this.compareArrayOfObjects(securityGroup.resourceName, inboundExp, inbound, "InboundRules")
        this.compareArrayOfObjects(securityGroup.resourceName, outboundExp, outbound, "OutboundRules")
        return {
            success: true,
            message: `All attributes for ${securityGroup.resourceName} match`
        }
    }
}
