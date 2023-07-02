import { EC2Client } from "@aws-sdk/client-ec2";
import { Resource, AWSEnvironment } from "../";
export abstract class EC2Resource extends Resource {
    client: EC2Client = new EC2Client({})
    constructor(environment: AWSEnvironment) {
        super(environment)
        this.loadClients(environment)
    }
    getSimpleFilter(Name:string, Values: string[]) {
        return {Name, Values}
    }
    loadClients (environment: AWSEnvironment) {
        this.client = environment.getAWSClient("ec2")
    }
}
