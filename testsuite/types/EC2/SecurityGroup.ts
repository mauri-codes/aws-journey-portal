import { Tag } from ".."
import { AWSEnvironment } from "../../resources"

export interface SecurityGroupRule {
    IpProtocol?: string
    FromPort?: string
    ToPort?: string
    CidrIpv4?: string
    CidrIpv6?: string
    // PrefixListId?: string
    // Description?: string
}
export interface SecurityGroupIdentifier {
    securityGroupId?: string
    search?: {
        vpcId?: string
        name?: string
        tags?: Tag[]
    }
}
export interface SecurityGroupExpectations {
    SecurityGroupData?: {
        Description?: string
        GroupName?: string
        VpcId?: string
        OwnerId?: string
    }
    InboundRules?: SecurityGroupRule[]
    OutboundRules?: SecurityGroupRule[]
}

export interface SecurityGroupConstructorParameters {
    environment: AWSEnvironment
    sgExpectations: SecurityGroupExpectations,
    sgIdentifier: SecurityGroupIdentifier
}
