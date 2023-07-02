import { Tag } from ".."

export interface EC2InstanceIdentifier {
    instanceId?: string
    search?: {
        vpcId?: string
        name?: string
        tags?: Tag[]
    }
}

export interface EC2InstanceExpectations {
    EC2Data?: {
        ImageId?: string
        InstanceId?: string
        InstanceType?: string
        KeyName?: string
        Monitoring?: {
            State: string
        }
        Placement?: {
            AvailabilityZone?: string,
            Tenancy?: string
        }
        PrivateDnsName?: string
        PrivateIpAddress?: string
        PublicDnsName?: string
        PublicIpAddress?: string
        SubnetId?: string
        VpcId?: string
        Architecture?: string
        // BlockDeviceMappings?: {
        //     DeviceName?: string
        //     Ebs?: {
        //         Status?: string
        //         VolumeId?: string
        //     }
        // }[]
        EbsOptimized?: string
        SourceDestCheck?: string
        // NetworkInterfaces?: {
        //     Association?: {
        //         IpOwnerId?: string
        //         PublicDnsName?: string
        //         PublicIp?: string
        //     }
        //     Attachment?: {
        //         AttachmentId?: string
        //         DeleteOnTermination?: boolean
        //         DeviceIndex?: number
        //         Status?: string
        //         NetworkCardIndex?: number
        //     }
        //     Description?: string
            
        // }[]
        RootDeviceName?: string
        RootDeviceType?: string
        Ipv6Address?: string
    }
    SecurityGroups?: {
        GroupName?: string
        GroupId?: string
    }[]
}